import { createResumeFromUpload } from '@/services/resumeService';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import pdfParse from "pdf-parse";
import OpenAI from "openai";

export const config = {
    api: {
        bodyParser: false,
    },
};

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API
});

const parseForm = (req) => {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { fields, files } = await parseForm(req);
            const { jobDescription } = fields;
            const file = files.userResume;


            if(!file || !jobDescription[0]){
              return res.status(400).json({success:false, message:"file and job description is required."})
            }

            if (!file) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }


            const pdfBuffer = await fs.promises.readFile(file[0].filepath);
            

            // Parse the PDF
                    const pdfData = await pdfParse(pdfBuffer);
                    // console.log(pdfData)
                    if (!pdfData.text.trim()) {
                      return res.status(400).json({ success: false, message: "Unable to upload this PDF file. Please upload a readable or searchable PDF." });
                    }
                    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 4 MB
                    if (file.size > MAX_FILE_SIZE) {
                      return res.status(400).json({
                        success: false,
                        message: "File size exceeds the 15 MB limit. Please upload a smaller file.",
                      });
                    }
                   
//  console.log("extension",  file[0].originalFilename)
//                     console.log("extension",  file[0].originalFilename.slice(file[0].originalFilename.lastIndexOf('.')).toLowerCase())
            // Validate file type
                    const allowedExtensions = ['.txt', '.pdf'];
                    const fileExtension = file[0].originalFilename.slice(file[0].originalFilename.lastIndexOf('.')).toLowerCase();
            
                    if (!allowedExtensions.includes(fileExtension)) {
                      return res.status(400).json({
                        success: false,
                        message: `Invalid file type. Allowed file types are: ${allowedExtensions.join(', ')}`,
                      });
                    }

            
                    // Append the correct extension if missing
                    const tempFilePath = file[0].filepath + fileExtension;
                    fs.renameSync(file[0].filepath, tempFilePath); // Rename the temporary file to include the extension
            
                    console.log("Updated File Path:", tempFilePath);
            
                    // Here you would send the file to OpenAI
                    const openaiResponse = await uploadFileToOpenAI(tempFilePath, file.originalFilename);

            const markdownContent = await createResumeFromUpload(openaiResponse.id, jobDescription);

             await openai.files.del(openaiResponse.id);
             console.log("File Deleted from openai")

            res.status(200).json({ success: true, markdown: markdownContent });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success:false, message: error.message });
        }
    } else {
        res.status(405).json({ success:false, message: 'Method not allowed' });
    }
}

async function uploadFileToOpenAI(filePath, fileName) {
  console.log("Uploading file to OpenAI...");
  try {
    const response = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "assistants"
    });
    console.log("successfully uploaded to OpenAi...")
    return response;
  } catch (error) {
    throw new Error(`Error uploading file to OpenAI: ${error.message}`);
  }

}
