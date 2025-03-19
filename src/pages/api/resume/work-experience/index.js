import Resume from "@/model/Resume";
import { authMiddleware } from "@/lib/authMiddleware";
import conn from "@/lib/conn";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  await conn();

  try {
    const { resumeId, workExperience } = req.body;

    console.log("Received Work Experience:", workExperience);

    if (!resumeId) {
      console.log("❌ Resume ID is required");
      return res.status(400).json({ success: false, message: "Resume ID is required" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      console.log("❌ Resume not found");
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    // Override the entire workExperience field
    resume.experience = workExperience;

    await resume.save();

    console.log("✅ Work experience overridden successfully");
    return res.status(200).json({ success: true, data: resume.experience });
  } catch (error) {
    console.error("❌ Error overriding work experience:", error);
    return res.status(500).json({ success: false, message: "Failed to override work experience" });
  }
}

// 🚀 Apply authentication middleware
export default authMiddleware(handler);
