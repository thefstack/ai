import conn from "@/lib/conn";
import Resume from "@/model/Resume";
import { authMiddleware } from "@/lib/authMiddleware";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  await conn(); // Ensure MongoDB connection

  try {
    const { resumeId, projects } = req.body; // ✅ Use req.body

    console.log(projects)

    if (!resumeId) {
      console.log("❌ Resume ID is required");
      return res.status(400).json({ success: false, message: "Resume ID is required" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      console.log("❌ Resume not found");
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    resume.projects = projects;
    await resume.save();

    console.log("✅ Projects saved successfully");
    return res.status(200).json({ success: true, data: resume.projects });
  } catch (error) {
    console.error("❌ Error saving projects:", error);
    return res.status(500).json({ success: false, message: "Failed to save projects" });
  }
}

// 🚀 Apply authentication middleware
export default authMiddleware(handler);
