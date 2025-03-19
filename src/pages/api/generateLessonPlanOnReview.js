import { authMiddleware } from "@/lib/authMiddleware";
import Quiz from "@/model/quiz"
import Lesson from "@/model/lesson"
import OpenAI from "openai";
import User from "@/model/user";

export default authMiddleware(async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const userId=req.user.id || req.user.userId;
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
  
    const { quizId } = req.body;
    try{
        console.log("Quiz ID:",quizId)
        const quiz=await Quiz.findOne({_id:quizId})

        if(!quiz){
            return res.status(400).json({success:false, message:"Quiz not found"})
        }
        if(quiz.personalContent){
            // if it is personal content
            const data=await generateLessonPlanWithFile(quiz);
            if(data.success===-1){
                return res.status(500).json({success:false, message:"Internal Server Error"})
            }
            if (data.success===0){
                return res.status(400).json({success:"Error generating Lesson plan"})
            }

            let title = quiz.title.replace("quiz", "").trim();
            title = quiz.title.replace("Quiz", "").trim();

            //saving response
            const lesson= new Lesson({
                userId,
                title,
                category:quiz.category,
                subCategory:quiz.subCategory,
                days:data.lessonPlan.noOfDays,
                studyTime:data.lessonPlan.timeDuration,
                difficulty:data.lessonPlan.difficultyLevel,
                lessonPlan:data.lessonPlan.lessonPlan,
                tokenUsage:data.tokenUsage,
                personalContent:true
            })
            await lesson.save();
            // Decrement the feature usage
            await user.useFeature("lesson");

            return res.status(200).json({success:true, lessonId:lesson.id})
        }else{
            // if it is not personal content
            const data=await generateLessonPlan(quiz.review);
            if(data.success===-1){
                return res.status(500).json({success:false, message:data.error})
            }
            if (data.success===0){
                return res.status(400).json({success:false, message:data.error})
            }

            // saving response
            const lesson= new Lesson({
                userId,
                title:quiz.title,
                category:quiz.category,
                subCategory:quiz.subCategory,
                days:data.lessonPlan.noOfDays,
                studyTime:data.lessonPlan.timeDuration,
                difficulty:data.lessonPlan.difficultyLevel,
                lessonPlan:data.lessonPlan.lessonPlan,
                tokenUsage:data.tokenUsage
            })
            await lesson.save();
           // Decrement the feature usage
           await user.useFeature("lesson");
            return res.status(200).json({success:true, lessonId:lesson.id})
        }
    }catch(error){
        console.log(error)
        return res.status(400).json({success:false, message:"error",})
    }
    
  }
  )

  const generateLessonPlanWithFile=async(quiz)=>{
    
    try {
        console.log("generating lesson plan from file content ....")

        const openai = new OpenAI({
            apiKey:process.env.NEXT_PUBLIC_GEMINI_API
        });

        // Create a new conversation
        const mess=await openai.beta.threads.messages.create(quiz.threadId,{
            role: "user",
            content:`You have generated the quiz Review 
            now Create a **personalized lesson plan** to help me improve in the weak points:

  ### Instructions:
  1. Use the feedback report to:
     - Identify weaknesses or gaps in understanding.
     - Prioritize subtopics where improvement is most needed.
     - Suggest activities or examples to address common mistakes.

  2. Provide a "courseOverview" that:
     - Summarizes the learning goals based on the feedback report.
     - Explains how the lesson plan will help improve performance on similar quizzes.

  3. Provide a "dayByDayPlan" that:
     - Breaks learning into **7 days or fewer** based on the topic complexity.
     - Assigns a **main topic** for each day and lists **key concepts to be covered** (comma-separated).
     - Includes **engaging activities** such as short exercises, reflective tasks, or quizzes to reinforce understanding.

  4. If performance metrics (e.g., accuracy, mistakes) are available in the feedback report:
     - Incorporate them to tailor the difficulty level of the plan (e.g., foundational vs. advanced).

  5. Format the output strictly as a JSON object:
  {
    noOfDays: ,// no of days in integer for example: 3 or 4 or 5 or 7 but not more
    timeDuration: "" ,// time duration for each day. for example '1 Hr/Day' or "2 Hr/Day
    difficultyLevel: "" // difficulty level of the lesson plan for example easy, medium, hard from the feedback report content
    lessonPlan:{
    "courseOverview": "string",
    "dayByDayPlan": [
      {
            "day": 1,
            "topic": //string,
            "keyConceptsToBeCovered": //string, separated by commas,
            "activity": //optional activity for reflection, assessment, or deeper exploration
        },
      ...
    ]
  }
  }

  Do not provide any text, explanations, or formatting outside the specified JSON format.
            `,
          });

          const run = await openai.beta.threads.runs.createAndPoll(quiz.threadId, {
            assistant_id: quiz.assistantId
          });


          if (run.status === "completed") {
            const tokenUsage={
              prompt_tokens:run.usage.prompt_tokens,
              completion_tokens:run.usage.completion_tokens,
              total_tokens:run.usage.total_tokens,
              prompt_token_details:run.usage.prompt_token_details
            }
            const messages = await openai.beta.threads.messages.list(run.thread_id);

            const latestMessage = messages.body.data[0].content[0].text.value; // Get the latest message
            const sanitizedMessage = latestMessage.replace(/```json|```/g, '').trim();

            const jsonMessage=JSON.parse(sanitizedMessage); // convert to json object


            return {lessonPlan:jsonMessage,tokenUsage,success:1}
        } else {
            return {success:0}
        }
    } catch (error) {
        console.error('Error:', error);
        return {success:-1,error:error}
    }
  
  }


  const generateLessonPlan=async(review)=>{
    try {
        console.log("generating lesson plan ....")
        const response = await fetch(`${process.env.AI}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: ` Based on the feedback report generated from my quiz performance:
  --${review}--

  Create a **personalized lesson plan** to help me improve in the weak points:

  ### Instructions:
  1. Use the feedback report to:
     - Identify weaknesses or gaps in understanding.
     - Prioritize subtopics where improvement is most needed.
     - Suggest activities or examples to address common mistakes.

  2. Provide a "courseOverview" that:
     - Summarizes the learning goals based on the feedback report.
     - Explains how the lesson plan will help improve performance on similar quizzes.

  3. Provide a "dayByDayPlan" that:
     - Breaks learning into **3 days or fewer** based on the topic complexity.
     - Assigns a **main topic** for each day and lists **key concepts to be covered** (comma-separated).
     - Includes **engaging activities** such as short exercises, reflective tasks, or quizzes to reinforce understanding.

  4. If performance metrics (e.g., accuracy, mistakes) are available in the feedback report:
     - Incorporate them to tailor the difficulty level of the plan (e.g., foundational vs. advanced).

  5. Format the output strictly as a JSON object:
  {
    noOfDays: ,// no of days in integer for example 3 or 4 or 5 or 7 but not more
    timeDuration: "" ,// time duration for each day. for example '1 Hr/Day' or "2 Hr/Day
    difficultyLevel: "" // difficulty level of the lesson plan for example easy, medium, hard from the feedback report content
    lessonPlan:{
    "courseOverview": "string",
    "dayByDayPlan": [
      {
            "day": 1,
            "topic": //string,
            "keyConceptsToBeCovered": //string, separated by commas,
            "activity": //optional activity for reflection, assessment, or deeper exploration
        },
      ...
    ]
  }
  }

  Do not provide any text, explanations, or formatting outside the specified JSON format.`
                    }
                ],
                max_tokens: 1500,
                temperature: 0.4,
            })
        });
  
        const data = await response.json();
        console.log("waiting for response from openAI")
  
        if (response.ok) {
            const tokenUsage={
                prompt_tokens:data.usage.prompt_tokens,
                completion_tokens:data.usage.completion_tokens,
                total_tokens:data.usage.total_tokens
              }
            // Process the response and format the lesson plan
            let lessonPlanString = data.choices[0].message.content.trim();
  
            // Remove unnecessary backticks or markdown-like code blocks from the response
            lessonPlanString = lessonPlanString.replace(/```json/g, "").replace(/```/g, "");
            const lessonPlan = JSON.parse(lessonPlanString);
            console.log(lessonPlan)
  
            return {lessonPlan,tokenUsage,success:1}
        } else {
            return {success:0}
        }
    } catch (error) {
        console.error('Error:', error);
        return {success:-1,error:error}
    }
  }