// pages/api/assistant.js

import { authMiddleware } from "@/lib/authMiddleware";
import OpenAI from "openai";
// import Assistant from "@/model/assistant"
import { IncomingForm } from 'formidable';
import fs from 'fs'; // <-- Import fs module
import Assistant from "@/model/assistant"
import Chat from "@/model/chat"
import conn from "@/lib/conn";
import { z } from "zod"
import pdfParse from "pdf-parse";
import User from "@/model/user";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API
});

// Disable bodyParser for file upload
export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

console.log("assistant")

export default authMiddleware(async function handler(req, res) {
  await conn();
  const { action } = req.query;
  const userId = req.user.id || req.user.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  switch (action) {
    case "uploadFile": {
      if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
      }
      try {
        const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

  // Check feature usage limits
  if (!(await user.canUseFeature("fileUpload"))) {
    return res
      .status(400)
      .json({
        success: false,
        message: "User has reached the monthly limit for File upload",
      });
  }

        const { files } = await parseForm(req); // Await the form parsing

        const file = files.file?.[0]; // Assuming the file is sent under the 'file' key

        if (!file) {
          console.error("No file found in upload");
          return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        // Read the file buffer
        const pdfBuffer = await fs.promises.readFile(file.filepath); // Assuming 'filepath' is where the file is saved

        // Parse the PDF
        const pdfData = await pdfParse(pdfBuffer);
        if (!pdfData.text.trim()) {
          return res.status(400).json({ success: false, message: "Unable to upload this PDF file. Please upload a readable or searchable PDF." });
        }
        const MAX_FILE_SIZE = 15 * 1024 * 1024; // 4 MB
        if (file.size > MAX_FILE_SIZE) {
          return res.status(400).json({
            success: false,
            message: "File size exceeds the 15 MB limit. Please upload a smaller file.",
          });
        }

        // Validate file type
        const allowedExtensions = ['.txt', '.pdf', '.docx', '.html', '.json', '.css', '.js', '.mjs', ".md"];
        const fileExtension = file.originalFilename.slice(file.originalFilename.lastIndexOf('.')).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          return res.status(400).json({
            success: false,
            message: `Invalid file type. Allowed file types are: ${allowedExtensions.join(', ')}`,
          });
        }

        // Append the correct extension if missing
        const tempFilePath = file.filepath + fileExtension;
        fs.renameSync(file.filepath, tempFilePath); // Rename the temporary file to include the extension

        console.log("Updated File Path:", tempFilePath);

        // Here you would send the file to OpenAI
        const openaiResponse = await uploadFileToOpenAI(tempFilePath, file.originalFilename);

        //saveAssistant
        const saveAssistant = new Assistant({
          fileId: openaiResponse.id,
          name: file.originalFilename,
          userId,
          size: openaiResponse.bytes
        });

        await saveAssistant.save();
        // Decrement the feature usage
    await user.useFeature("fileUpload");

        res.status(200).json({ success: true, message: "successfully uploaded" });
      } catch (error) {
        console.error("Error processing file:", error);
        res.status(400).json({ success: false, message: "Failed to process file", error });
      }
      break;
    }


    case "getUploadedFile": {
      try {
        if (req.method !== 'GET') {
          return res.status(405).json({ success: false, message: 'Method not allowed' });
        }
        const assistant = await Assistant.find({ userId }).sort({ createdAt: -1 }).exec();
        res.status(200).json({ success: true, assistantList: assistant });
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, error })
      }
      break;
    }

    case "deleteFile": {        // need to imporove the file deletion  
      if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
      }
      const { fileId } = req.query;
      // Validate fileId

      if (!fileId) {
        return res.status(400).json({ success: false, message: "File ID is required" });
      }

      try {

        const deleteFromDb = await Assistant.findOne({ fileId });
        if (userId !== deleteFromDb.userId) {
          return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        if (!deleteFromDb) {
          return res.status(404).json({ success: false, message: "File not found in database" });
        }

        const response = await openai.files.del(fileId);
        if (!response || !response.deleted) {
          return res.status(500).json({ success: false, message: "Failed to delete file from OpenAI" });
        }
        // Remove the file from the database
        await Assistant.deleteOne({ fileId });

        res.status(200).json({ success: true, message: `file deleted with ${fileId}` });
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, error })
      }
      break;
    }

    case "createChat": {
      if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
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

      const { fileId } = req.query; // here fileId is the assistant-> _id
      console.log(fileId)

      const fileIdArray = fileId.split(','); // Split the comma-separated string into an array
      console.log("File IDs:", fileIdArray);

      console.log("checking assistant in db...")
      const assistantDbs = await Assistant.find({ _id: { $in: fileIdArray } });
      if (!assistantDbs || assistantDbs.length !== fileIdArray.length) {
        return res.status(404).json({ success: false, message: "Database Error: Some File not found in database" });
      }
      console.log("Assistant records found in DB:", assistantDbs);

      const assistantId = await createAssistantForChat();
      if (assistantId == null) {
        return res.status(404).json({ success: false, message: "OpenAi Error: Cannot find Assistant" })
      }

      const thread = await openai.beta.threads.create();

       // Build the `attachments` array with all file IDs
      const attachments = assistantDbs.map((db) => ({
        file_id: db.fileId,
        tools: [{ type: "file_search" }],
      }));

      console.log("assistant in db found")
      try {
        console.log("creating chat...")

        const createChat = new Chat({
          userId,
          title: assistantDbs[0].name,
          fileId: fileIdArray,
          assistantId: assistantId,
          name: assistantDbs[0].name,
          personalContent: true,
          threadId: thread.id
        });


        // Create a new conversation
        const mess = await openai.beta.threads.messages.create(thread.id, {
          role: "user",
          content: `Based on file content, greet the learner as Ivy Pro AI Tutor, explain your purpose, and suggest two engaging and relevant questions to help the learner explore the document further. 
            note that the questions must be within the file content provided to you
            format output as json only:
            {
              greeting:"", //string for greeting and explaining your purpose
              summary:"", //string for summarizing the content of the file
              questions:["text","text"] // 2 questions
            }

            `,
          attachments,// Reference the uploaded file
        });

        const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
          assistant_id: assistantId
        });


        if (run.status === "completed") {
          const tokenUsage = {
            prompt_tokens: run.usage.prompt_tokens,
            completion_tokens: run.usage.completion_tokens,
            total_tokens: run.usage.total_tokens,
            prompt_token_details: run.usage.prompt_token_details
          }
          const messages = await openai.beta.threads.messages.list(run.thread_id);

          let latestMessage = messages.body.data[0].content[0].text.value; // Get the latest message

          if (!latestMessage.includes('{')) {
            const result = latestMessage.split(".")[0] + ".";
            throw new Error(result)
          }
          console.log(latestMessage)
          // Regular expression to match JSON enclosed in ```json ... ```
          const jsonMatch = latestMessage.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            console.log("Json Match Worked.....")
            latestMessage = jsonMatch[0];
          }

          const sanitizedMessage = latestMessage.replace(/```json|```/g, '').trim();
          console.log(sanitizedMessage)
          const jsonMessage = JSON.parse(sanitizedMessage); // convert to json object

          if (jsonMessage.isError) {
            console.log("There seems to be some Error :", jsonMessage);
            return res.status(400).json({ success: false, message: jsonMessage.reason, jsonMessage })
          }

          // save questions to DB
          createChat.questions = jsonMessage
          createChat.questionTokenUsage = tokenUsage;

        }


        await createChat.save();
        // Decrement the feature usage
        await user.useFeature("chat");
        console.log("successfull creating chat...")


        return res.status(200).json({ success: true, chatId: createChat.id });
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error ? `${error}` : "error creating chat", error })
      }
      break;
    }


    case "fetchQuestions": {
      if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
      }
      console.log("fetch Question.....")
      const { chatId } = req.query;
      try {
        const chat = await Chat.findById(chatId);
        if (chat.questions) {
          console.log("question already stored in DB");
          return res.status(200).json({ success: true, message: "Question Already Generated", chatData: chat });
        }
        const file = await Assistant.findById(chat.fileId);
        const assistantId = await createAssistantForQuestion();

        // Create a new conversation
        const mess = await openai.beta.threads.messages.create(chat.threadId, {
          role: "user",
          content: ` Based on file content, greet the learner as Ivy Pro AI Tutor, explain your purpose, and suggest two engaging and relevant questions to help the learner explore the document further. 
            format output as json only:
            {
              greeting:"", //string for greeting and explaining your purpose
              summary:"", //string for summarizing the content of the file
              questions:["text","text"] // using file content 2 questions
            }
            `,
          attachments: [
            {
              file_id: file.fileId,
              tools: [{ type: "file_search" }]
            }
          ], // Reference the uploaded file
        });

        const run = await openai.beta.threads.runs.createAndPoll(chat.threadId, {
          assistant_id: assistantId
        });


        if (run.status === "completed") {
          const tokenUsage = {
            prompt_tokens: run.usage.prompt_tokens,
            completion_tokens: run.usage.completion_tokens,
            total_tokens: run.usage.total_tokens,
            prompt_token_details: run.usage.prompt_token_details
          }
          const messages = await openai.beta.threads.messages.list(run.thread_id);

          let latestMessage = messages.body.data[0].content[0].text.value; // Get the latest message

          if (!latestMessage.includes('{')) {
            const result = latestMessage.split(".")[0] + ".";
            throw new Error(result)
          }

          console.log(latestMessage)
          // Regular expression to match JSON enclosed in ```json ... ```
          const jsonMatch = latestMessage.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            console.log("Json Match Worked.....")
            latestMessage = jsonMatch[0];
          }

          const sanitizedMessage = latestMessage.replace(/```json|```/g, '').trim();
          console.log(sanitizedMessage)
          const jsonMessage = JSON.parse(sanitizedMessage); // convert to json object

          if (jsonMessage.isError) {
            console.log("There seems to be some Error :", jsonMessage);
            return res.status(400).json({ success: false, message: jsonMessage.reason, jsonMessage })
          }

          // save questions to DB
          chat.questions = jsonMessage
          chat.questionTokenUsage = tokenUsage;
          await chat.save();


        }
        return res.status(200).json({ success: true, chatData: chat });
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error ? `${error}` : "error creating chat", error })
      }
      break;
    }


    default: {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }
  }

}

)

async function uploadFileToOpenAI(filePath, fileName) {
  console.log("Uploading file to OpenAI...");
  try {
    const response = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "assistants"
    });
    console.log("successfully uploaded to OpenAi...")
    return response;
  } catch (error) {
    throw new Error(`Error uploading file to OpenAI: ${error.message}`);
  }

}


async function createAssistantForChat() {
  console.log("finding assistant for Chat...")
  try {
    const assistantList = await openai.beta.assistants.list();
    // Filter for the assistant with the matching name
    const assistant = assistantList.data.find((assistant) => assistant.name === "Ivy_Ai_Tutor_file_Assistant_Chat");
    if (!assistant) {
      console.log("assistant not found")
      console.log("creating assistant...")
      const myAssistant = await openai.beta.assistants.create({
        instructions:
          `You are a knowledgeable and friendly AI tutor, created by Ivy Professional School, designed to help learners master topics in data science, data engineering, generative AI, data analytics, software development, and related fields.

Persona-Driven Behavior:
Adjust your tone and approach based on the persona selected by the user:  
- Be approachable and encouraging (e.g., like a coach or mentor).  
- Provide insightful and professional responses (e.g., like an expert).  
- Add humor or inspiration when appropriate, based on the selected persona.

Response Framework: LAERA
Follow this structured framework to craft your responses, but do not label the steps explicitly in your response:  
1. Listen: Acknowledge the learner’s query and clarify their context or prior knowledge. For example, ask if they are familiar with Python before introducing code examples.  
2. Answer: Provide a clear, structured explanation tailored to the learner’s level and persona.  
3. Example: Use relatable examples, visuals, or code snippets if appropriate, but offer non-code explanations for learners unfamiliar with programming.  
4. Reinforce: Suggest a practice problem, quiz, or DIY task that matches the learner’s current skill level. Provide hints or step-by-step guidance if needed.  
5. Advise: End with actionable next steps, tips, or bonus insights to deepen understanding or apply the knowledge.

Formatting Rules:
- Use bold subheadings to organize your response.  
- Use hyphens for points, leaving a blank line between each point for clarity.  
- Avoid numbering, asterisks, or other special characters.

Ultimate Goal:
Ensure all responses are engaging, accessible, and actionable. Focus on practical applications, relatable explanations, and real-world relevance. Adapt exercises and examples to the learner’s current knowledge, ensuring content is inclusive, accurate, and up-to-date.`,
        model: "gpt-4o-mini",
        name: "Ivy_Ai_Tutor_file_Assistant_Chat",
        tools: [{ type: "file_search" }],
        temperature: 0.3
      });
      console.log("Newly created: ", myAssistant)
      return myAssistant.id;
    } else {
      console.log("assistant found")
      console.log(assistant)
      return assistant.id;
    }
  } catch (error) {
    console.log("creating assistant Error")
    console.log(error)
    return null;
  }

}


async function createAssistantForQuestion() {
  console.log("finding assistant for Question...")
  try {
    const assistantList = await openai.beta.assistants.list();
    // Filter for the assistant with the matching name
    const assistant = assistantList.data.find((assistant) => assistant.name === "Ivy_Ai_Tutor_file_Assistant_Question_Generator");
    if (!assistant) {
      console.log("assistant not found")
      console.log("creating assistant...");

      const myAssistant = await openai.beta.assistants.create({
        instructions:
          `You are a knowledgeable and friendly AI tutor designed by Ivy Professional School, dedicated to helping students understand complex subjects in data science, data engineering, gen AI, data analytics, software development, and related subjects. You are patient, clear, and provide detailed explanations. You use engaging language and relatable examples to make learning enjoyable. You also offer practice problems and supplementary resources to ensure the student grasps the concepts. 
      `,
        model: "gpt-4o-mini",
        name: "Ivy_Ai_Tutor_file_Assistant_Question_Generator",
        tools: [{ type: "file_search" }],
        temperature: 0.3,
      });
      console.log("Newly created: ", myAssistant)
      return myAssistant.id;
    } else {
      console.log("assistant found")
      console.log(assistant)
      return assistant.id;
    }
  } catch (error) {
    console.log("creating assistant Error")
    console.log(error)
    return null;
  }

}