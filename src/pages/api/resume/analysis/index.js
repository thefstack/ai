import conn from "@/lib/conn"
import Resume from "@/model/Resume"
import { authMiddleware } from "@/lib/authMiddleware"

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" })
  }

  try {
    await conn() // Ensure MongoDB connection
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error)
    return res.status(500).json({ success: false, message: "Database connection failed" })
  }

  try {
    const { resumeId, analysisData } = req.body
    console.log("📩 Received Data:", { resumeId, analysisData })

    // Validate input
    if (!resumeId || typeof analysisData !== "object") {
      console.log("❌ Invalid input data")
      return res.status(400).json({ success: false, message: "Invalid request data" })
    }

    // Find resume
    const resume = await Resume.findById(resumeId)
    if (!resume) {
      console.log(`❌ Resume not found for ID: ${resumeId}`)
      return res.status(404).json({ success: false, message: "Resume not found" })
    }

    // Update analysis field
    resume.analysis = analysisData
    await resume.save()

    console.log("✅ Analysis updated successfully:", resume.analysis)
    return res.status(200).json({ success: true, data: resume.analysis })
  } catch (error) {
    console.error("❌ Error updating analysis:", error)
    return res.status(500).json({ success: false, message: "Failed to update analysis" })
  }
}

// Apply authentication middleware
export default authMiddleware(handler)
