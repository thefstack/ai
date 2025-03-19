import { authMiddleware } from "@/lib/authMiddleware";
import conn from "@/lib/conn";
import Skillup from "@/model/skillup";
import Lesson from "@/model/lesson"

export default authMiddleware(async function handler(req, res) {
  await conn();
  const { method } = req;
  const userId=req.user.id || req.user.userId;

 switch(method){
  case "POST":{
    const { action, skillupId } = req.body;
  if (action === "createLesson") {
    try {

      const skillups = await Skillup.findById(skillupId);

      if (!skillups) {
        return res 
          .status(204)
          .json({ success: false, message: "Skillup NOT Found" });
      }

      const {title,category,subCategory,days,studyTime,difficulty,dayByDayPlan,summary}=skillups

      const createLesson= new Lesson({
        userId,title,category,subCategory,days,studyTime,difficulty,lessonPlan:{courseOverView:summary,dayByDayPlan}
      })

      await createLesson.save();

      return res.status(200).json({ success: true, message:"Lesson Successfully Created", lessonId:createLesson.id });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Wrong query performed" });
  }
  }
  break;
  case "GET":{
    // if we want to each quizData in details
  const { action } = req.query;
  if (action === "getSkillupList") {
    try {
      const skillups = await Skillup.find();

      if (!skillups) {
        return res 
          .status(204)
          .json({ success: false, message: "Skillup NOT Found" });
      }

      return res.status(200).json({ success: true, skillupList:skillups });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Wrong query performed" });
  }
  }break;
  default :{
      return res.status(405).json({ success: false, message: "Method not allowed" });
  }
 }

  
});
