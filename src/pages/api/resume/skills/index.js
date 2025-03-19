import conn from "@/lib/conn";
import Resume from "@/model/Resume";
import { authMiddleware } from "@/lib/authMiddleware";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  await conn(); // Ensure MongoDB connection

  try {
    const { resumeId, skills } = req.body; // ✅ Use req.body
    console.log(skills)

    if (!resumeId) {
      console.log("❌ Resume ID is required");
      return res.status(400).json({ success: false, message: "Resume ID is required" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      console.log("❌ Resume not found");
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    resume.skills = skills;
    await resume.save();

    console.log("✅ Skills saved successfully");
    return res.status(200).json({ success: true, data: resume.skills });
  } catch (error) {
    console.error("❌ Error saving skills:", error);
    return res.status(500).json({ success: false, message: "Failed to save skills" });
  }
}

// 🚀 Apply authentication middleware
export default authMiddleware(handler);
