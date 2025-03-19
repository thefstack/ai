import { authMiddleware } from "@/lib/authMiddleware";
import User from "@/model/user";
import Assistant from "@/model/assistant"
import Lesson from "@/model/lesson"
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API
});


export default authMiddleware(async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const userId = req.user.id || req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  
    // Check feature usage limits
    if (!(await user.canUseFeature("lesson"))) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User has reached the daily limit for lesson",
        });
    }
  

  
    const { fileIds, selectedDays, selectedTime, selectedDifficulty } = req.body;
    if(!fileIds){
        return res.status(400).json({ success: false, message: "Files not found" });
    }

    const assistantDbs = await Assistant.find({ _id: { $in: fileIds } });
          if (!assistantDbs || assistantDbs.length !== fileIds.length) {
            return res.status(404).json({ success: false, message: "Database Error: Some File not found in database" });
          }
          console.log("Assistant records found in DB:", assistantDbs);
    
          try {
            const assistantId = await createAssistantForLessonWithFile();
            if (assistantId == null) {
              return res.status(404).json({ success: false, message: "OpenAi Error: Cannot find Assistant" })
            }
      
            const thread = await openai.beta.threads.create();
      
             // Build the `attachments` array with all file IDs
            const attachments = assistantDbs.map((db) => ({
              file_id: db.fileId,
              tools: [{ type: "file_search" }],
            }));
  
  
             // Create a new conversation
          const mess = await openai.beta.threads.messages.create(thread.id, {
              role: "user",
              content: ` Duration: ${selectedDays} days,
               Study Time: ${selectedTime},
               Difficulty Level: ${selectedDifficulty}`,
              attachments,// Reference the uploaded file
            });
    
            const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
              assistant_id: assistantId
            });
    
    
            if (run.status === "completed") {
              const tokenUsage = {
                prompt_tokens: run.usage.prompt_tokens,
                completion_tokens: run.usage.completion_tokens,
                total_tokens: run.usage.total_tokens,
                prompt_token_details: run.usage.prompt_token_details
              }
              const messages = await openai.beta.threads.messages.list(run.thread_id);
    
              let latestMessage = messages.body.data[0].content[0].text.value; // Get the latest message
    
              if (!latestMessage.includes('{')) {
                const result = latestMessage.split(".")[0] + ".";
                throw new Error(result)
              }
              console.log(latestMessage)
              // Regular expression to match JSON enclosed in ```json ... ```
              const jsonMatch = latestMessage.match(/```json\s*([\s\S]*?)\s*```/);
              if (jsonMatch) {
                console.log("Json Match Worked.....")
                latestMessage = jsonMatch[0];
              }
    
              const sanitizedMessage = latestMessage.replace(/```json|```/g, '').trim();
            //   console.log(sanitizedMessage)
              const jsonMessage = JSON.parse(sanitizedMessage); // convert to json object
    
              if (jsonMessage.isError) {
                console.log("There seems to be some Error :", jsonMessage);
                return res.status(400).json({ success: false, message: jsonMessage.reason, jsonMessage })
              }
    
              // save lesson plan to DB
              const lessonPlan={
                courseOverview:jsonMessage.courseOverview,
                dayByDayPlan:jsonMessage.dayByDayPlan
              }
             const lesson= new Lesson({
                userId,
                title:jsonMessage.courseTitle,
                category: jsonMessage.tool,
                subCategory:jsonMessage.topics,
                days:selectedDays,
                studyTime:selectedTime,
                difficulty:selectedDifficulty,
                lessonPlan:lessonPlan,
                personalContent:true,
             })
             await lesson.save();
            // Decrement the feature usage
            await user.useFeature("lesson");
            console.log("successfull creating lesson...")
    
    
            return res.status(200).json({ success: true, lessonId: lesson.id});
            }  
  
          } catch (error) {
            res.status(400).json({ success: false, message: error ? `${error}` : "error creating Lesson", error })
          }
  }
  )




  async function createAssistantForLessonWithFile() {
    console.log("finding assistant for Chat...")
    try {
      const assistantList = await openai.beta.assistants.list();
      // Filter for the assistant with the matching name
      const assistant = assistantList.data.find((assistant) => assistant.name === "Ivy_Ai_Tutor_file_Assistant_LessonWithFile");
      if (!assistant) {
        console.log("assistant not found")
        console.log("creating assistant...")
        const myAssistant = await openai.beta.assistants.create({
          instructions:
          `You are an AI tutor that generates structured lesson plans based on attached course materials. The user will provide file IDs, and your task is to extract relevant details from the files to generate a comprehensive lesson plan.

          Guidelines for Lesson Plan Creation:
          Extract Course Details
          
          Analyze the provided files to determine the most appropriate:
          Course Title: A clear and concise name reflecting the content.
          Tool/Technology: The primary tool, programming language, or framework being taught.
          Topics Covered: A list of key subjects addressed in the course material.
          Course Overview
          
          Provide a summary explaining the course’s purpose and intended audience (e.g., beginners, intermediates).
          Outline key learning objectives, emphasizing practical, beginner-friendly outcomes.
          Optionally, suggest advanced topics or projects for learners seeking deeper knowledge.
          
          Day-by-Day Lesson Structure
          
          Each day should have:
          A "topic" covering a specific subject.
          "keyConceptsToBeCovered" as a comma-separated string of key ideas.
          
          Easy: Simplify explanations, focus on foundational concepts, and avoid technical jargon.
          Medium: Include hands-on exercises and practical applications of concepts.
          Hard: Incorporate advanced techniques, challenges, and optional deep-dive explorations.
          Output Format
          The response must be structured as a JSON object without additional explanations or formatting:
          {
              "courseTitle": "string",
              "tool": "string",
              "topics": ["string", "string", ...],
              "courseOverview": "string",
              "dayByDayPlan": [
                  {
                      "day": 1,
                      "topic": "string",
                      "keyConceptsToBeCovered": "string, separated by commas"
                  },
                  ...
              ]
          }
          Ensure logical topic progression, clarity, and alignment with the specified difficulty level. Avoid extraneous details outside the JSON format.`,
          model: "gpt-4o-mini",
          name: "Ivy_Ai_Tutor_file_Assistant_LessonWithFile",
          tools: [{ type: "file_search" }],
          temperature: 0.3
        });
        console.log("Newly created: ", myAssistant)
        return myAssistant.id;
      } else {
        console.log("assistant found")
        console.log(assistant)
        return assistant.id;
      }
    } catch (error) {
      console.log("creating assistant Error")
      console.log(error)
      return null;
    }
  
  }
  