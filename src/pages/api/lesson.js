import { authMiddleware } from "@/lib/authMiddleware";
import conn from "@/lib/conn";
import Lesson from "@/model/lesson"

export default authMiddleware(async function handler(req,res){
    await conn();
    const {method}=req;


    switch(method){
        

        // when clicked on new quiz then this should be called.
        case "POST":{
            try{
                const {userId,title,category,subCategory,days,studyTime,difficulty,lessonPlan,tokenUsage}=req.body;
                const createLesson=new Lesson({
                    userId,title,category,subCategory,days,studyTime,difficulty,lessonPlan,tokenUsage
                })

                await createLesson.save();


                // send the response with new lesson id
                return res.status(200).json({success:true,message:"Lesson Successfully Created",lessonId:createLesson.id});

            }catch(error){
                console.log(error);
                return res.status(500).json({success:false,message:"Internal Server Error"})
            }
        }

        // when click on any quiz component then this should be called to get quiz Data
        case "GET":{
            // if we want to each quizData in details
            const {action}=req.query;
            if(action==='getLessonData'){
                try{
                    // console.log("thi is get Lesson")
                    const _id=req.query.lessonId;
                    // console.log(_id)
                    const getLessonData=await Lesson.findOne({_id});


                    if(!getLessonData){
                        return res.status(400).json({success:false,message:"Lesson NOT Found"})
                    }

                    return res.status(200).json({success:true, LessonData:getLessonData});
    
    
                }catch(error){
                    console.log(error)
                    return res.status(500).json({success:false,message:"Internal Server Error"});
                }
            }else if(action==='getLessonList'){ 
                // if we want to get list of quiz data such as title and quiz id only
                try{ 
                    const userId=req.query.userId;
                    const getLessonList=await Lesson.find({userId:userId}).select('title _id category title category').sort({updatedAt:-1}).exec();
                    if(getLessonList.length<=0){
                        return res.status(200).json({success:false,message:"No Lesson list found"})
                    }
    
                    return res.status(200).json({success:true,lessonLists:getLessonList});
    
    
                }catch(error){
                    console.log(error)
                    return res.status(500).json({success:false,message:"Internal Server Error"});
                }
            }
            else{
                return res.status(400).json({success:false,message:"Wrong query performed"})
            }
        }

        case 'PUT':{
            try{
                const {lessonId,userAnswer,score,review}=req.body;

                const updateLesson= await Quiz.findByIdAndUpdate(
                    lessonId,
                    {
                        userAnswer,
                        isAttempted:true,
                        score,
                        review
                    },
                    {new: true} // this will return updated docs
                );

                if(!updateQuiz){
                    return res.status(404).json({success:false,message:"Quiz not found"})
                }

                return res.status(200).json({success:true,message:"content added successfully"})
            }catch(error){
                console.log(error)
                return res.status(500).json({success:false,message:"Internal Server Error"})
            }
        }

        case 'PATCH': {
            const {action}=req.query;
            if(action=="saveModuleOnly"){
                try {
                    const { lessonId, day, module,tokenUsage } = req.body;
            
                    // Find the lesson and update the module for the specified day

                    const updatedLesson = await Lesson.findOneAndUpdate(
                        { _id: lessonId, "lessonPlan.dayByDayPlan.day": day },  // Match the lesson and the specific day
                        {
                            $set: {
                                "lessonPlan.dayByDayPlan.$.module": module,  // Update the module for the matched day
                                "lessonPlan.dayByDayPlan.$.tokenUsage":tokenUsage
                            }
                        },
                        { new: true }  // Return the updated document
                    );
                    if (!updatedLesson) {
                        return res.status(404).json({ success: false, message: "Lesson or Day not found" });
                    }
            
                    return res.status(200).json({ success: true, message: "Module updated successfully", lesson: updatedLesson });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ success: false, message: "Internal Server Error" });
                }
            }else if(action=="markAsCompleteOnly"){
                try {
                    const { lessonId, dayPlanId } = req.body;
            
                    // Find the lesson and update the icCompleted for the specified dayPlanId
                    const updatedLesson = await Lesson.findOneAndUpdate(
                        { _id: lessonId, "lessonPlan.dayByDayPlan._id": dayPlanId },  // Match the lesson and the specific day _id
                        {
                            $set: {
                                "lessonPlan.dayByDayPlan.$.isCompleted": true  // Update the isCompleted for the matched _id
                            }
                        },
                        { new: true }  // Return the updated document
                    );
            
                    if (!updatedLesson) {
                        return res.status(404).json({ success: false, message: "Lesson or Day not found" });
                    }
            
                    return res.status(200).json({ success: true, message: "Module updated successfully", lesson: updatedLesson });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ success: false, message: "Internal Server Error" });
                }
            }else{
                console.log("Error in Patch")
                return res.status(405).json({ success: false, message: "Action not allowed" });
            }
        }


        // Delete a lesson (only if the user is the owner)
        case "DELETE": {
            try {
                const { lessonId } = req.query;

                // Verify ownership of the lesson
                const lesson = await Lesson.findById(lessonId);

                const userId=req.user.id || req.user.userId;

                if (!lesson) {
                    return res.status(404).json({ success: false, message: "Lesson not found" });
                }

                // Check if the authenticated user is the owner
                if (lesson.userId.toString() !== userId) {
                    return res.status(403).json({ success: false, message: "Unauthorized to delete this lesson" });
                }

                // Delete the lesson
                await lesson.deleteOne();

                return res.status(200).json({ success: true, message: "Lesson deleted successfully" });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        }

        
        

        default:
            return res.status(405).json({ success: false, message: "Method not allowed" });
    }
})