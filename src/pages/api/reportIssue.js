import conn from "@/lib/conn";
import ReportIssue from "@/model/reportIssuesSchema.js"; // Import the schema


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Set the limit as needed (e.g., 1mb)
    },
  },
};

// Handler for POST request to save form data
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Connect to MongoDB
      await conn();

      // Destructure the data from the request body
      const { issue, category, screenshot, name } = req.body;
      
      // Validate image (Base64 string should start with data:image/)
      if (screenshot && !screenshot.startsWith("data:image/")) {
        return res.status(400).json({ error: "Invalid image format." });
      }

      // Create a new document using the schema
      const newReport = new ReportIssue({
        issue,
        category,
        screenshot,
        name,
      });

      // Save the document in the database
      await newReport.save();

      // Send a success response
      res.status(201).json({ message: "Issue reported successfully. Thanks for your Feedback!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong, please try again." });
    }
  } else {
    // If it's not a POST request, return a method not allowed response
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
