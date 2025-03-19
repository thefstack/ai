import { authMiddleware } from "@/lib/authMiddleware";
import conn from "@/lib/conn";
import Assistant from "@/model/assistant";
import OpenAI from "openai";
import Quiz from "@/model/quiz";
import User from "@/model/user";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API,
});

export default authMiddleware(async function handler(req, res) {
  await conn();
  const { method } = req;
  const userId = req.user.id || req.user.userId;
  // console.log(req.body)
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  switch (method) {
    // when click on any chat component then this should be called to get chat Data
    case "GET": {
      // if we want to each chatData in details
      const { action } = req.query;
      if (action === "createQuizQuestions") {
        try {
          const user = await User.findById(userId);
          if (!user) {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }

          // Check feature usage limits
          if (!(await user.canUseFeature("quiz"))) {
            return res.status(400).json({
              success: false,
              message: "User has reached the daily limit for quiz",
            });
          }

          const { fileId } = req.query;

          const fileIdArray = fileId.split(","); // Split the comma-separated string into an array
          console.log("File IDs:", fileIdArray);

          console.log("checking file in db...");
          const assistantDbs = await Assistant.find({
            _id: { $in: fileIdArray },
          });

          if (!assistantDbs || assistantDbs.length !== fileIdArray.length) {
            return res.status(404).json({
              success: false,
              message: "Database Error: Some File not found in database",
            });
          }
          console.log("Assistant records found in DB:", assistantDbs);

          const assistantId = await createAssistant();
          const thread = await openai.beta.threads.create();

          // Build the `attachments` array with all file IDs
          const attachments = assistantDbs.map((db) => ({
            file_id: db.fileId,
            tools: [{ type: "file_search" }],
          }));

          // Create a new conversation
          const mess = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: `Based on the content of the attached files, generate exactly 10 multiple-choice questions. Ensure that:

1. Each question has:
   - One correct answer and three plausible distractors.
   - Distractors should be logical and challenge the learner but should not mislead.

2. Questions must be strictly based on the content of the file and assess:
   - Conceptual understanding (e.g., key terms, principles, definitions).
   - Application-based scenarios or examples described in the file.

3. Avoid requiring charts, images, or diagrams. Instead, use descriptive scenarios where necessary.

4. The correct answer should be randomly placed among options A, B, C, or D to avoid predictability.

### Output Format:
Provide the output as JSON in the following structure:

{
  "questions": [
    {
      "text": "Question text here",
      "options": [
        { "label": "A", "text": "Option 1 text", "isCorrect": true },
        { "label": "B", "text": "Option 2 text", "isCorrect": false },
        { "label": "C", "text": "Option 3 text", "isCorrect": false },
        { "label": "D", "text": "Option 4 text", "isCorrect": false }
      ]
    }
  ],
  "title": "Title for the quiz",
  "category": ["Subtopic1", "Subtopic2"]
}

### Additional Requirements:
- Generate 10 questions—no more, no less.
- Ensure clarity and relevance of questions to the file content.
- Avoid ambiguous or overly complex wording.

`,

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
            const messages = await openai.beta.threads.messages.list(
              run.thread_id
            );

            let latestMessage = messages.body.data[0].content[0].text.value; // Get the latest message
            console.log("latest message: ", latestMessage);

            if (!latestMessage.includes("{")) {
              const result = latestMessage.split(".")[0] + ".";
              throw new Error(result);
            }
            // Regular expression to match JSON enclosed in ```json ... ```
            const jsonMatch = latestMessage.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
              console.log("Json Match Worked.....");
              latestMessage = jsonMatch[0];
            }

            const sanitizedMessage = latestMessage
              .replace(/```json|```/g, "")
              .trim();

            const jsonMessage = JSON.parse(sanitizedMessage); // convert to json object

            if (jsonMessage.isError) {
              console.log("There seems to be some Error :", jsonMessage);
              console.log(tokenUsage);
              return res.status(400).json({
                success: false,
                message: jsonMessage.reason,
                jsonMessage,
              });
            }

            console.log("Your Json Output", jsonMessage);
            console.log(tokenUsage);

            const transformedQuizData = jsonMessage.questions.map(
              (question) => {
                // Filter options to only include text and label
                // console.log(question)
                const filteredOptions = question.options.map((option) => ({
                  text: option.text || "",
                  label: option.label,
                }));

                // Find the correct answer (text of the option where isCorrect is true)
                // console.log(question)
                const correctAnswer = question.options.find(
                  (option) => option.isCorrect
                );
                // console.log(correctAnswer)

                return {
                  question: question.text || "no Question text",
                  options: filteredOptions,
                  answer: correctAnswer.text || "",
                };
              }
            );

            const newQuiz = new Quiz({
              userId: userId,
              title: jsonMessage.title,
              category: jsonMessage.category[0],
              subCategory: jsonMessage.category,
              contents: transformedQuizData,
              tokenUsageInGeneratingQuestions: tokenUsage,
              personalContent: true,
              fileId: fileIdArray,
              assistantId: assistantId,
              threadId: thread.id,
            });

            await newQuiz.save();

            // Decrement the feature usage
            await user.useFeature("quiz");

            res.status(200).json({ success: true, quizId: newQuiz.id });
          }
        } catch (error) {
          console.log("Throw error :", error.message);
          return res.status(500).json({
            success: false,
            message: error ? `${error}` : "error generating quiz",
            error,
          });
        }
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Wrong query performed" });
      }
    }

    case "POST": {
      const { action } = req.query;
      if (action != "getQuizSummary") {
        return res
          .status(400)
          .json({ success: false, message: "method not allowed" });
      }
      try {
        const { quizId } = req.query;
        const { question, userAnswers } = req.body;
        console.log("quizId:", quizId);
        const quiz = await Quiz.findOne({ _id: quizId });
        if (!quiz) {
          return res.status(400).json({
            success: false,
            message: "client side error please refresh the page",
          });
        }

        if (userId != quiz.userId) {
          return res
            .status(404)
            .json({ success: false, message: "Unauthorized" });
        }
        const file = await Assistant.findOne({ _id: quiz.fileId });
        if (!file) {
          return res
            .status(400)
            .json({ success: false, message: "File not found" });
        }

        // Create a new conversation
        const mess = await openai.beta.threads.messages.create(quiz.threadId, {
          role: "user",
          content: `student have completed the quiz with multiple-choice questions. Below are the quiz questions and their answers, along with their responses.
student answer: ${userAnswers}.

Instructions:
Evaluate students performance by comparing their answers to the correct answers for the quiz.

Highlight the following:

  at first Summarize students overall understanding and proficiency in the quiz topic dont use any heading for this only.

  then provide

- **Strengths**: 
  .Identify key areas where the student performed well, emphasizing their grasp of the concepts and any correct answers. 
  .Provide positive reinforcement for their strong performance.

- **Weaknesses**:
  .Provide a general overview of areas where the student struggled or made errors. 
  .Instead of going question by question, identify common patterns or topics where their understanding needs improvement.
  . Provide a brief explanation of why these areas are challenging and how the correct concepts work.

- **Suggestions for Improvement**:
  Offer actionable strategies and recommendations for the student to improve in the weak areas identified. This could include:
    - Revisiting specific concepts or topics.
    - Engaging in targeted practice on certain question types.
    - Addressing common misconceptions.

Avoid question-by-question analysis. Focus on general themes in performance and maintain a clear, encouraging, and motivational tone to inspire improvement.
use bullet points where needed.
use boldness whenever required to highlight some context and for heading
 use words as if you are talking to that student.
`,
          attachments: [
            {
              file_id: file.fileId,
              tools: [{ type: "file_search" }],
            },
          ], // Reference the uploaded file
        });

        const run = await openai.beta.threads.runs.createAndPoll(
          quiz.threadId,
          {
            assistant_id: quiz.assistantId,
          }
        );

        if (run.status === "completed") {
          const tokenUsage = {
            prompt_tokens: run.usage.prompt_tokens,
            completion_tokens: run.usage.completion_tokens,
            total_tokens: run.usage.total_tokens,
            prompt_token_details: run.usage.prompt_token_details,
          };
          const messages = await openai.beta.threads.messages.list(
            run.thread_id
          );

          const latestMessage = messages.body.data[0].content[0].text.value; // Get the latest message
          const sanitizedMessage = latestMessage.trim();
          console.log(sanitizedMessage);

          return res
            .status(200)
            .json({ generatedText: sanitizedMessage, tokenUsage });
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error Generating Quiz Summary",
          error,
        });
      }
    }

    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
});

async function createAssistant() {
  console.log("finding assistant...");
  try {
    const assistantList = await openai.beta.assistants.list();
    // Filter for the assistant with the matching name
    const assistant = assistantList.data.find(
      (assistant) => assistant.name === "Ivy_Ai_Tutor_file_Quiz"
    );
    if (!assistant) {
      console.log("assistant not found");
      console.log("creating assistant...");
      const myAssistant = await openai.beta.assistants.create({
        instructions: `You are a knowledgeable and friendly AI tutor designed by Ivy Professional School, dedicated to helping students understand complex subjects in data science, data engineering, gen AI, data analytics, software development, and related subjects.`,
        model: "gpt-4o-mini",
        name: "Ivy_Ai_Tutor_file_Quiz",
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
