import { Configuration, OpenAIApi } from "openai";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API,
});

// Function to create a resume based on uploaded resume and job description
export async function createResumeFromUpload(fileId, jobDescription) {
  const assistantId = await createAssistantForResume();
  if (assistantId == null) {
    return null;
  }
  const thread = await openai.beta.threads.create();
  // Build the `attachments` array with all file IDs
  const attachments = [{
    file_id:fileId,
    tools: [{ type: "file_search" }],
  }];

  // Create a new conversation
  const mess = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: `Analyze the following resume that is being sent as file and job description, then create a new resume tailored to the job description. Job Description:\n${jobDescription}`,
    attachments, // Reference the uploaded file
  });

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistantId,
  });

  if (run.status === "completed") {
    const tokenUsage = {
      prompt_tokens: run.usage.prompt_tokens,
      completion_tokens: run.usage.completion_tokens,
      total_tokens: run.usage.total_tokens,
      prompt_token_details: run.usage.prompt_token_details,
    };

    const messages = await openai.beta.threads.messages.list(run.thread_id);
    console.log("message : ",messages)

    let latestMessage = messages.body.data[0].content[0].text.value; // Get the latest message

    console.log(latestMessage);
    console.log("tokenUsage :",tokenUsage)

    // Extract Markdown content using regex
    const markdownRegex = /(```markdown|```)([\s\S]*?)(```)/g;
    const markdownMatch = markdownRegex.exec(latestMessage);
    let markdownContent = '';
    if (markdownMatch && markdownMatch[2]) {
      markdownContent = markdownMatch[2].trim();
    }

    return markdownContent;
  }
}

// Function to create a resume based on user-provided information
export async function createResumeFromInfo(userInfo,jobDescription) {
  try {
    console.log(userInfo)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional resume creator specializing in ATS-optimized and industry-specific resumes. 
          
          Objective
Create a professionally formatted resume based on the provided user input. The output should only contain the resume content, without any additional explanations, notes, or introductory text.

Resume Creation Workflow: CUE (Collect, Understand, Execute)
Collect: Gather essential details:

Career goals (e.g., "What type of role are you applying for?")
Key skills, certifications, and tools
Work experience, internships, academic projects, and volunteering
Achievements and accomplishments (quantifiable where possible)
Education details (degree, university, GPA, year of graduation)
Target job descriptions or industry preferences (if provided)
Understand: Process the input:

Highlight transferable skills for students with limited experience
Emphasize relevant accomplishments based on job requirements
Identify missing details that could strengthen the resume
Execute: Generate a structured, ATS-friendly resume:

Use bold headings for sections like Education, Skills, Experience
List responsibilities, skills, and achievements in bullet points
Ensure clear formatting with proper spacing for readability
Do not include any section titled "References"
Strictly return only the resume content with no extra commentary
Formatting & Output Rules
Do not include any additional text before or after the resume.
Do not explain, introduce, or summarize the resume.
Output must be in a structured Markdown format, making it easy for further formatting and use.
Strictly exclude any section mentioning "References."
Resume should contain only the specified details
do not add any empty section such as dont add experience if not provided ,.. etc`,
        },
        {
          role: "user",
          content: `Here is the user's information formatted as JSON:

          \`\`\`json
          ${JSON.stringify(userInfo)}
          \`\`\`

          and Job Description: ${jobDescription}

          Based on this information, generate a professional, ATS-friendly resume.`,
        },
      ],
      max_tokens: 1500,
    });
    let latestMessage = response.choices[0].message.content.trim(); // Get the latest message
    // ✅ Check if choices exist before accessing them
    if (response.choices && response.choices.length > 0) {
       // Extract Markdown content using regex
    const markdownRegex = /(```markdown|```)([\s\S]*?)(```)/g;
    const markdownMatch = markdownRegex.exec(latestMessage);
    let markdownContent = '';
    if (markdownMatch && markdownMatch[2]) {
      markdownContent = markdownMatch[2].trim();
    }

    return markdownContent;
    } else {
      console.error("OpenAI API response structure unexpected:", response);
      throw new Error("Unexpected API response structure. No choices found.");
    }
  } catch (error) {
    console.error("Error generating resume:", error);
    return `Error: ${error.message}`;
  }
}

async function createAssistantForResume() {
  console.log("finding assistant for Resume...");
  try {
    const assistantList = await openai.beta.assistants.list();
    // Filter for the assistant with the matching name
    const assistant = assistantList.data.find(
      (assistant) => assistant.name === "Ivy_Ai_Tutor_file_Assistant_Resume1"
    );
    if (!assistant) {
      console.log("assistant not found");
      console.log("creating assistant...");
      const myAssistant = await openai.beta.assistants.create({
        instructions: `Objective
Create a professionally formatted resume based on the provided user input. The output should only contain the resume content, without any additional explanations, notes, or introductory text.

Resume Creation Workflow: CUE (Collect, Understand, Execute)
Collect: Gather essential details:

Career goals (e.g., "What type of role are you applying for?")
Key skills, certifications, and tools
Work experience, internships, academic projects, and volunteering
Achievements and accomplishments (quantifiable where possible)
Education details (degree, university, GPA, year of graduation)
Target job descriptions or industry preferences (if provided)
Understand: Process the input:

Highlight transferable skills for students with limited experience
Emphasize relevant accomplishments based on job requirements
Identify missing details that could strengthen the resume
Execute: Generate a structured, ATS-friendly resume:

Use bold headings for sections like Education, Skills, Experience
List responsibilities, skills, and achievements in bullet points
Ensure clear formatting with proper spacing for readability
Do not include any section titled "References"
Strictly return only the resume content with no extra commentary
Formatting & Output Rules
Do not include any additional text before or after the resume.
Do not explain, introduce, or summarize the resume.
Output must be in a structured Markdown format, making it easy for further formatting and use.
Strictly exclude any section mentioning "References."`,
        model: "gpt-4o-mini",
        name: "Ivy_Ai_Tutor_file_Assistant_Resume1",
        tools: [{ type: "file_search" }],
        temperature: 0.3,
      });
      console.log("Newly created: ", myAssistant);
      return myAssistant.id;
    } else {
      console.log("assistant found");
      console.log(assistant);
      return assistant.id;
    }
  } catch (error) {
    console.log("creating assistant Error");
    console.log(error);
    return null;
  }
}
