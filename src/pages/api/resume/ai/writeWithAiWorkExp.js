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

  let { actionType, workExp, text } = req.body;
  console.log("Incoming WorkExp Request:", req.body);

  let userPrompt = "";
  let temperature = 0.4; // Default to balanced professional tone

  // ✅ Switch-case for specific prompts based on actionType
  switch (actionType) {
    case "formal":
      userPrompt = `Rewrite the following work experience description in a formal, professional tone suitable for a resume.
Focus on achievements, responsibilities, and technologies used. 
Use concise bullet points. Avoid generic phrases.
Return only the improved bullet point description, nothing else.

Current Description: ${text}`;
      temperature = 0.3; // Professional and precise
      break;

      case "casual":
        userPrompt = `Rewrite the following work experience description in a simple, easy-to-understand language but still professional and suitable for a resume.
      Avoid conversational phrases like 'So', 'I', 'We', or storytelling style.
      Keep it in clear bullet points, focusing on responsibilities, achievements, and technologies used.
      Return only the bullet points, nothing else.
      
      Current Description: ${text}`;
        temperature = 0.5; // Balanced casual but professional
        break;

    case "shorten":
      userPrompt = `Make the following work experience description shorter and more concise, focusing on the key achievements and responsibilities.
Limit to 3-4 bullet points.
Return only the shortened bullet point version, nothing else.

Current Description: ${text}`;
      temperature = 0.3; // Precise and brief
      break;

    case "details":
      userPrompt = `Expand on the following work experience description by adding specific details such as technologies used, achievements, and measurable outcomes.
Use clear and impactful bullet points.
Return only the detailed bullet point description, nothing else.

Current Description: ${text}`;
      temperature = 0.5; // Balanced for adding detail
      break;

    case "rewrite":
    default:
      userPrompt = `Rewrite the following work experience description to make it more impactful, result-oriented, and suitable for a professional resume.
Focus on achievements, technologies used, and outcomes.
Use bullet points. Return only the improved bullet point description, nothing else.

Current Description: ${text}`;
      temperature = 0.4; // Balanced
      break;
  }

  try {
    // ✅ Call OpenAI with dynamic temperature and instruction
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert resume writer assisting in improving work experience descriptions." },
        { role: "user", content: userPrompt },
      ],
      temperature: temperature,
      max_tokens: 400,
    });

    console.log("AI Response:", response);

    // ✅ Extract and return only description
    const generatedDescription = response.choices[0].message.content.trim();

    const tokenUsage = {
      input_tokens: response.usage?.prompt_tokens || 0,
      output_tokens: response.usage?.completion_tokens || 0,
      total_tokens: response.usage?.total_tokens || 0,
    };

    res.status(200).json({ description: generatedDescription, tokenUsage });
  } catch (error) {
    console.error("Error generating AI content:", error);
    res.status(500).json({ message: "Error generating description", error: error.message });
  }
});
