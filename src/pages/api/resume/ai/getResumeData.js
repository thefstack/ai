/**
 * we are using response api here
 */

import OpenAI from "openai";
import { authMiddleware } from "@/lib/authMiddleware";
import User from "@/model/user";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API,
});

export default authMiddleware(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const userId = req.user.id || req.user.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const {fileId}=req.body;

  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: "overview of my file",
      tools: [
        {
          type: "file_search",
        }
      ]
    });

    console.log(response);
    return res.json(response);
  } catch (error) {
    console.error("Error while analyzing:", error);
    res
      .status(500)
      .json({ message: "Error generating description", error: error.message });
  }
});
