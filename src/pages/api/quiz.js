import { authMiddleware } from "@/lib/authMiddleware";
import conn from "@/lib/conn";
import Quiz from "@/model/quiz"
import OpenAI from "openai";

export default authMiddleware(async function handler(req,res){
    await conn();
    const {method}=req;

    switch(method){

        // when clicked on new quiz then this should be called.
        case "POST":{
            try{
                const {userId,title,contents,category,subCategory,tokenUsageInGeneratingQuestions,selectedDifficulty}=req.body;
                console.log(tokenUsageInGeneratingQuestions)
                const createQuiz=new Quiz({
                    userId,
                    title,
                    contents,
                    category,
                    subCategory,
                    tokenUsageInGeneratingQuestions,
                    selectedDifficulty
                })


                await createQuiz.save();

                // send the response with new quiz id
                return res.status(200).json({success:true,message:"Quiz Successfully Created",quizId:createQuiz.id});

            }catch(error){
                console.log(error);
                return res.status(500).json({success:false,message:"Internal Server Error"})
            }
        }

        // when click on any quiz component then this should be called to get quiz Data
        case "GET":{
            // if we want to each quizData in details
            const {action}=req.query;
            if(action==='getQuizData'){
                try{
                    const _id=req.query.quizId;

                    const getQuizData=await Quiz.findOne({_id});

                    if(!getQuizData){
                        return res.status(400).json({success:false,message:"Quiz NOT Found"})
                    }

                    return res.status(200).json({success:true, quizData:getQuizData});
    
    
                }catch(error){
                    console.log(error)
                    return res.status(500).json({success:false,message:"Internal Server Error"});
                }
            }else if(action==='getQuizList'){ 
                // if we want to get list of quiz data such as title and quiz id only
                try{ 
                    const userId=req.query.userId;
                    const getQuizList=await Quiz.find({userId:userId}).select('title category _id isAttempted score createdAt').sort({updatedAt:-1}).exec();
    
                    if(getQuizList.length<=0){
                        return res.status(200).json({success:false,message:"No quiz list found"})
                    }
    
                    return res.status(200).json({success:true,quizLists:getQuizList});
    
    
                }catch(error){
                    console.log(error)
                    return res.status(500).json({success:false,message:"Internal Server Error"});
                }
            }else if(action==='getQuizRank'){ 
                // if we want to get score Data such 
                try { 
                    const { chatId, title, category } = req.query;
                    const attempts = await Quiz.find({ title, category }).sort({ score: -1 }).select('_id score');

                    // Find the score of the student with the given chatId
const chatIdAttempt = attempts.find((attempt) => attempt._id.toString() === chatId);


if (!chatIdAttempt) {
  return res.status(404).json({ success: false, message: "Chat ID not found" });
}
const chatIdScore = chatIdAttempt.score; // Assign score of the student to be used in previousScore

                    let rank = 1;
                    let previousScore = attempts[0].score;
                    let rankMap = new Map();
                    let lowerScoreCountMap = 0

                    attempts.forEach((attempt, index) => {
                        if (attempt.score !== previousScore) {
                            rank = index + 1; // Update rank to current position + 1 if score changes
                          }

                          if(attempt.score<=chatIdScore && attempt._id !=chatId){
                            lowerScoreCountMap++;
                          }

                        rankMap.set(attempt._id.toString(), rank); // Save rank for each attempt by its ID
                        previousScore = attempt.score;
                    });
                    // Iterate over attempts to assign ranks, handling ties
                    const quizRank = rankMap.get(chatId);
                    const totalAttempts = attempts.length;
                    

                
                    return res.status(200).json({ success: true, quizRank:quizRank, totalStudents:totalAttempts,lowerScoreCount:lowerScoreCountMap });
                
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ success: false, message: "Internal Server Error" });
                }
                
            }
            else{
                return res.status(400).json({success:false,message:"Wrong query performed"})
            }
        }

        case 'PUT':{
            try{
                const {quizId,userAnswer,score,review,tokenUsageInGeneratingReview}=req.body;
                console.log(tokenUsageInGeneratingReview)

                const updateQuiz= await Quiz.findByIdAndUpdate(
                    quizId,
                    {
                        userAnswer,
                        isAttempted:true,
                        score,
                        review,
                        tokenUsageInGeneratingReview
                    },
                    {new: true} // this will return updated docs
                );
                console.log(updateQuiz)

                if(!updateQuiz){
                    return res.status(404).json({success:false,message:"Quiz not found"})
                }

                return res.status(200).json({success:true,message:"content added successfully"})
            }catch(error){
                console.log(error)
                return res.status(500).json({success:false,message:"Internal Server Error"})
            }
        }


        // Delete a quiz (only if the user is the owner)
        case "DELETE": {
            try {
                const { quizId } = req.query;

                // Verify ownership of the quiz
                const quiz = await Quiz.findById(quizId);

                const userId=req.user.id || req.user.userId;

                if (!quiz) {
                    return res.status(404).json({ success: false, message: "Quiz not found" });
                }


                if (quiz.userId.toString() !== userId) {
                    return res.status(403).json({ success: false, message: "Unauthorized to delete this quiz" });
                }
                
                const openai = new OpenAI({
                    apiKey:process.env.NEXT_PUBLIC_GEMINI_API
                });
                if(quiz.personalContent){
                const deleteThread=await openai.beta.threads.del(quiz.threadId);
                if(!deleteThread.deleted){
                    return res.status(500).json({ success: false, message: "Failed to delete thread"})
                  }
                }

                // Delete the quiz
                await quiz.deleteOne();

                return res.status(200).json({ success: true, message: "Quiz deleted successfully" });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        }





        default:
            return res.status(405).json({ success: false, message: "Method not allowed" });
    }
})