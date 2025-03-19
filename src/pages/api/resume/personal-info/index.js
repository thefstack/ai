import { authMiddleware } from "@/lib/authMiddleware"
import conn from "@/lib/conn"
import Resume from "@/model/Resume"

export default authMiddleware(async function handler(req, res) {
  await conn() // Connect to MongoDB
  const { method } = req
  const userId = req.user?.id || req.user?.userId // Get authenticated user

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" })
  }

  switch (method) {
    /**
     * ✅ PATCH: Update Personal Info in Resume
     * @route PATCH /api/resume/personalData
     */
    case "PATCH":
      try {
        const { resumeId, personalInfo } = req.body


        if (!resumeId) {
          return res.status(400).json({ success: false, message: "Resume ID is required" })
        }

        const resume = await Resume.findOne({ _id: resumeId, userId })
        if (!resume) {
          return res.status(404).json({ success: false, message: "Resume not found" })
        }

        // Update personal info fields
        resume.personalInfo = { ...resume.personalInfo, ...personalInfo }
        await resume.save()

        return res.status(200).json({ success: true, message: "Personal information updated successfully", data: resume.personalInfo })
      } catch (error) {
        console.error("❌ Error updating personal info:", error)
        return res.status(500).json({ success: false, message: "Failed to update personal info", error: error.message })
      }

    /**
     * ❌ Invalid Method Handling
     */
    default:
      return res.status(405).json({ success: false, message: "Method Not Allowed" })
  }
})
