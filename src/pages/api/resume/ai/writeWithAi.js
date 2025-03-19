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

  let { actionType, project, text } = req.body;
  console.log("Incoming Request:", req.body);

  let userPrompt = "";
  let temperature = 0.6; // Default temperature

  // ✅ Switch-case for dynamic prompts and temperature
  switch (actionType) {
    case "formal":
      userPrompt = `Convert the following project description into a formal, professional tone suitable for a resume. Keep it concise, result-oriented, and highlight achievements. Avoid generic phrases.

Project Title: ${project.title}
Organization: ${project.organization}
Tech Stack: ${project.technologies.join(", ")}
Start Date: ${project.startDate}
End Date: ${project.endDate}

Current Description: ${text}

Return only the revised description.`;
      temperature = 0.4; // Lower for precision
      break;

    case "casual":
      userPrompt = `Rewrite the following project description in a more casual and approachable tone, as if explaining in an interview or informal setting. Keep it engaging and simple.

Project Title: ${project.title}
Organization: ${project.organization}
Tech Stack: ${project.technologies.join(", ")}
Start Date: ${project.startDate}
End Date: ${project.endDate}

Current Description: ${text}

Return only the rewritten description.`;
      temperature = 0.8; // More creative and conversational
      break;

    case "shorten":
      userPrompt = `Make the following project description shorter and more concise, focusing only on the most important achievements and technologies used. Keep it under 3 lines, suitable for a professional resume.

Project Title: ${project.title}
Organization: ${project.organization}
Tech Stack: ${project.technologies.join(", ")}
Start Date: ${project.startDate}
End Date: ${project.endDate}

Current Description: ${text}

Return only the shortened version.`;
      temperature = 0.3; // Very focused
      break;

    case "details":
      userPrompt = `Expand on the following project description by adding more specific details, such as technologies used, features developed, and measurable outcomes. Make it impactful and professional.

Project Title: ${project.title}
Organization: ${project.organization}
Tech Stack: ${project.technologies.join(", ")}
Start Date: ${project.startDate}
End Date: ${project.endDate}

Current Description: ${text}

Return only the improved description.`;
      temperature = 0.5; // Balanced
      break;

    case "rewrite":
    default:
      userPrompt = `Rewrite the following project description to make it more impactful, result-oriented, and suitable for a professional resume. Focus on achievements, technologies used, and outcomes. Keep it 3-4 lines max.

Project Title: ${project.title}
Organization: ${project.organization}
Tech Stack: ${project.technologies.join(", ")}
Start Date: ${project.startDate}
End Date: ${project.endDate}

Current Description: ${text}

Return only the revised description.`;
      temperature = 0.6; // Moderate creativity
      break;
  }

  try {
    // ✅ Call OpenAI with dynamic temperature
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional resume writer assistant." },
        { role: "user", content: userPrompt },
      ],
      temperature: temperature, // 🎯 Dynamic temperature
      max_tokens: 300,
    });

    console.log("AI Response:", response);

    // ✅ Extract and return result
    const generatedDescription = response.choices[0].message.content.trim();

    const tokenUsage = {
      input_tokens: response.usage.prompt_tokens,
      output_tokens: response.usage.completion_tokens,
      total_tokens: response.usage.total_tokens,
    };

    res.status(200).json({ description: generatedDescription, tokenUsage });
  } catch (error) {
    console.error("Error generating AI content:", error);
    res.status(500).json({ message: "Error generating description", error: error.message });
  }
});
