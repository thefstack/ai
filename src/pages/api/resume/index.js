import { authMiddleware } from "@/lib/authMiddleware";
import conn from "@/lib/conn";
import Resume from "@/model/Resume";
import User from "@/model/user";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API
});

export default authMiddleware(async function handler(req, res) {
  await conn(); // Connect to MongoDB
  const { method } = req;

  // Get authenticated user ID
  const userId = req.user?.id || req.user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  switch (method) {
    /**
     * ✅ GET: Fetch all resumes for the authenticated user
     * @route GET /api/resume
     */
    case "GET":
      try {
        console.log(userId);
        const user = await User.find({ userId });
        if(!user){
          return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const resumes = await Resume.find({
          userId
        }).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: resumes });
      } catch (error) {
        console.error("❌ Error fetching resumes:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch resumes",
          error: error.message,
        });
      }

    /**
     * ✅ POST: Create a new resume
     * @route POST /api/resume
     */
    case "POST":
      try {
        const data = req.body;
        const {jobTitle, jobDescription, source, customization}=data;
        // Create new resume with authenticated user ID
        const keywords=await extractKeywordsFromJd(jobDescription,jobTitle);
        if(!keywords){
          return res.status(400).json({success:false, message:"check your job title or job description"});
        }
        const newData={
          jobTitle,
          jobDescription,
          source,
          keywords,
          customization
        }


        const newResume = await Resume.create({ ...newData, userId });
        console.log(newResume)

        return res.status(201).json({ success: true, id:newResume.id });
      } catch (error) {
        console.error("❌ Error creating resume:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to create resume",
          error: error.message,
        });
      }

    /**
     * ✅ OPTIONS: Handle CORS Preflight
     */
    case "OPTIONS":
      res.setHeader("Allow", "GET, POST");
      return res.status(204).end();

    /**
     * ❌ Invalid Method Handling
     */
    default:
      return res
        .status(405)
        .json({ success: false, message: "Method Not Allowed" });
  }
});



async function extractKeywordsFromJd(jobDescription,jobRole) {
  try {
    console.log("Job Description Received:", jobDescription); // Debugging

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that extracts **only** key skills, technologies, and qualifications from job descriptions.

### Task:
Analyze a job description and return a **structured JSON output** with at least **5-10 keywords**.

### Rules:
1. Extract **only** meaningful keywords related to the job role, skills, technologies, and qualifications.
2. Ignore common words like "we are looking for," "responsibilities include," etc.
4. Return the response in **pure JSON format** (No Markdown, No explanations).

### Example Output:
{
  "keywords": ["React.js", "Node.js", "MongoDB", "RESTful APIs", "AWS", "Agile development"]
}`,
        },
        {
          role: "user",
          content: `Extract keywords from this job description:

          **Job Role:**
${jobRole}

**Job Description:**
${jobDescription}

Return ONLY a JSON object with extracted keywords. Do **not** include explanations, formatting, or Markdown (e.g., no \`\`\`json).`,
        },
      ],
      max_tokens: 500,
    });

    // Log the raw response to debug
    let extractedKeywords = response.choices[0]?.message?.content.trim();
    console.log("Raw OpenAI Response:", extractedKeywords);

    // Remove triple backticks if present
    extractedKeywords = extractedKeywords.replace(/^```json\n?|```$/g, "");

    // Parse the JSON
    const parsedKeywords = JSON.parse(extractedKeywords);

    return parsedKeywords.keywords || []; // Return the keywords array
  } catch (error) {
    console.error("Error extracting keywords:", error);
    return { error: error.message };
  }
}

