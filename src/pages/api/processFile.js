import formidable from "formidable-serverless";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import Tesseract from "tesseract.js"; // OCR library for extracting text from images

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const form = new formidable.IncomingForm({
        maxFileSize: 1 * 1024 * 1024, // 1 MB limit
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Error parsing the file:", err);
            return res.status(500).json({ error: "Error processing file" });
        }

        const uploadedFile = files.file;
        const fileType = uploadedFile.type;

        try {
            let content = "";

            // Handle different file types
            if (fileType === "application/pdf") {
                const pdfBuffer = fs.readFileSync(uploadedFile.path);
                const pdfData = await pdfParse(pdfBuffer);

                 // Check if PDF has readable text
                 if (pdfData.text.trim()) {
                    content = pdfData.text;
                } else {
                    console.warn("PDF contains no text layer. Applying OCR...");

                    // Apply OCR to extract text from PDF images
                    const images = await extractImagesFromPDF(uploadedFile.path);
                    const ocrResults = await Promise.all(
                        images.map((imagePath) => Tesseract.recognize(imagePath, "eng"))
                    );
                    content = ocrResults.map((result) => result.data.text.trim()).join("\n");

                    if (!content.trim()) {
                        return res.status(400).json({
                            error: "Unable to extract text from the PDF. Please upload a readable or searchable PDF.",
                        });
                    }
                }
            }
            else if (
                fileType === "application/msword" ||
                fileType ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                const docBuffer = fs.readFileSync(uploadedFile.path);
                const { value } = await mammoth.extractRawText({ buffer: docBuffer });
                content = value;
            } else if (fileType === "text/plain") {
                content = fs.readFileSync(uploadedFile.path, "utf-8");
            } else if (fileType === "image/jpeg") {
                // Process JPEG images using OCR
                const ocrResult = await Tesseract.recognize(uploadedFile.path, "eng");
                content = ocrResult.data.text.trim();

                if (!content) {
                    return res.status(400).json({
                        error: "Unable to extract text from the image. Please upload a readable image.",
                    });
                }
            } else {
                return res.status(400).json({ error: "Unsupported file type" });
            }

            // Generate assistant response based on extracted content
            const assistantResponse = await generateQuestionsFromContent(content);

            return res.status(200).json({
                response: assistantResponse,
            });
        } catch (error) {
            console.error("Error processing file:", error);
            return res.status(500).json({ error: "Error processing the file" });
        }
    });
}

// Function to generate questions from content
async function generateQuestionsFromContent(content) {
    const trimmedContent = content.slice(0, 1000);
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
              You are a learning assistant for Ivy Pro School, designed to help users analyze and understand the content of documents. 
              Analyze the provided document, summarize the key points, and generate 5 questions the user might want to ask about the document.
              Ensure your questions encourage the user to explore topics further or clarify unclear sections.
              If the document is complex, break it into understandable parts, and guide the user through each section with relevant questions.
              Use a friendly and professional tone.`,
          },
          {
            role: "user",
            content: `Please analyze the following document content: "${trimmedContent}"`,
          },
        ],
        temperature: 0.7,
      }),
    });
  
    if (!response.ok) {
        console.log(response)
      throw new Error("Failed to generate questions from the document content.");
    }
    console.log(response);
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
