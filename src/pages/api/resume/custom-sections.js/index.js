import conn from "@/lib/conn";
import Resume from "@/model/Resume";
import { authMiddleware } from "@/lib/authMiddleware";

async function handler(req, res) {
  await conn(); // Ensure MongoDB connection

  try {
    const { resumeId, sectionId, section } = req.body;

    if (!resumeId) {
      console.log("❌ Resume ID is required");
      return res.status(400).json({ success: false, message: "Resume ID is required" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      console.log("❌ Resume not found");
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    if (req.method === "POST") {
      console.log("Saving section:", section);
      console.log(resume.customSections)
      const existingSectionIndex = resume.customSections.findIndex((s) => s.id == section.id);
      
      if (existingSectionIndex !== -1) {
        // Update existing section
        resume.customSections[existingSectionIndex] = {
          ...resume.customSections[existingSectionIndex],
          ...section,
        };
      } else {
        // Add new section
        resume.customSections.push(section);
      }
      
      await resume.save();
      console.log("✅ Custom section saved successfully");
      return res.status(200).json({ success: true, CustomSections:resume.customSections });
    }

    if (req.method === "DELETE") {
      console.log("Deleting section with ID:", sectionId);
      
      resume.customSections = resume.customSections.filter((s) => s.id != sectionId);
      await resume.save();
      
      console.log("✅ Custom section deleted successfully");
      return res.status(200).json({ success: true, message: "Section deleted successfully", data: resume.customSections });
    }
    
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  } catch (error) {
    console.error("❌ Error processing custom section request:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// 🚀 Apply authentication middleware
export default authMiddleware(handler);
