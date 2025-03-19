import { authMiddleware } from "@/lib/authMiddleware";
import conn from "@/lib/conn";
import Resume from "@/model/Resume";

export default authMiddleware(async function handler(req, res) {
  await conn(); // Connect to database
  const { method } = req;
  const { id } = req.query; // Get resume ID from URL
  const userId = req.user?.id || req.user?.userId; // Extract user ID from token

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  switch (method) {
    /**
     * ✅ GET: Fetch a single resume by ID
     * @route GET /api/resume/[id]
     */
    case "GET":
      try {
        const resume = await Resume.findOne({ _id: id, userId });

        if (!resume) {
          return res.status(404).json({ success: false, message: "Resume not found" });
        }

        return res.status(200).json({ success: true, data: resume });
      } catch (error) {
        console.error("❌ Error fetching resume:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch resume",
          error: error.message,
        });
      }


      /**
     * ✅ PATCH: Update Personal Info in Resume
     * @route PATCH /api/resume/personalData
     */
    case "PATCH":
      try {
        const { personalInfo } = req.body
        console.log(personalInfo)

        const resume = await Resume.findOne({ _id: id, userId })
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
     * ✅ DELETE: Remove a resume by ID
     * @route DELETE /api/resume/[id]
     */
    case "DELETE":
      try {
        const resume = await Resume.findOneAndDelete({ _id: id, userId });

        if (!resume) {
          return res.status(404).json({ success: false, message: "Resume not found" });
        }

        return res.status(200).json({ success: true, message: "Resume deleted successfully" });
      } catch (error) {
        console.error("❌ Error deleting resume:", error);
        return res.status(500).json({ success: false, message: "Failed to delete resume", error: error.message });
      }


    /**
     * ❌ Invalid Method Handling
     */
    default:
      return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
});
