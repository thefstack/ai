import { authMiddleware } from "@/lib/authMiddleware";
import OpenAI from "openai";
import Assistant from "@/model/assistant";
import Chat from "@/model/chat";
import conn from "@/lib/conn";
import User from "@/model/user";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API,
});
console.log("generate chat with file api is called");
export default authMiddleware(async function handler(req, res) {
  await conn();
  const { method } = req;

  if (method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
  const { action, chatId } = req.query;
  if (action !== "chatWithFile") {
    return res.status(400).json({ success: false, message: "Invalid action" });
  }

  const userId = req.user.id || req.user.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check feature usage limits
  if (!(await user.canUseFeature("chat"))) {
    return res
      .status(400)
      .json({
        success: false,
        message: "User has reached the daily limit for chat",
      });
  }

  try {
    const { message, tutorType } = req.body;
    const chat = await Chat.findById(chatId);
    const assistant = await Assistant.findById(chat.fileId);
    // Create a new conversation
    const mess = await openai.beta.threads.messages.create(chat.threadId, {
      role: "user",
      content: `Your Persona: ${tutorType}.
            Now answer my question using the personality traits of the given persona.
            ${message}`,
      attachments: [
        {
          file_id: assistant.fileId,
          tools: [{ type: "code_interpreter" }],
        },
      ], // Reference the uploaded file
    });
    const run = await openai.beta.threads.runs.create(chat.threadId, {
      assistant_id: chat.assistantId,
      stream: true,
    });
    console.log("waiting for response...");

    // Set headers for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    console.log("Streaming response...");

    try {
      // Stream OpenAI response to the client
      for await (const chunk of run) {
        if (chunk.event == "thread.message.delta") {
          const data = JSON.stringify(chunk.data.delta.content[0].text);
          res.write(`data: ${data}\n\n`); // Stream each chunk
        }

        if (chunk.event == "thread.message.completed") {
          const finalResponse = chunk.data.content[0].text;
          const data = JSON.stringify({ finalResponse });
          res.write(`data: ${data}\n\n`); // Stream each chunk
        }
        if (chunk.event == "thread.run.completed") {
          const usage = chunk.data.usage;
          const data = JSON.stringify({ usage });
          res.write(`data: ${data}\n\n`); // Stream each chunk
        }
        // console.log(data)
        res.flush();
      }
    } catch (streamError) {
      console.error("Error streaming response:", streamError);
      res.write(
        `data: ${JSON.stringify({ error: "Error during streaming" })}\n\n`
      );
    } finally {
      res.end();
    }

    // Decrement the feature usage
    await user.useFeature("chat");
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
});
