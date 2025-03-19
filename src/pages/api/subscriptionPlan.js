import { authMiddleware } from "@/lib/authMiddleware";
import conn from "@/lib/conn";
import User from "@/model/user";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API,
});

export default authMiddleware(async function handler(req, res) {
  await conn();
  const { method } = req;
  // console.log(req.body)
  const userId = req.user.id || req.user.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  switch (method) {
    // when click on any chat component then this should be called to get chat Data
    case "GET": {
      // if we want to each chatData in details
      const { action, type } = req.query;

      if (action === "checkLimit" && type) {
        const user = await User.findById(userId);
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        try {
          // Check feature usage limits
          if (!(await user.canUseFeature(`${type}`))) {
            return res.status(400).json({
              success: false,
              message: `User has reached the daily limit for ${type}`,
              limit:user.usageLimits
            });
          }else{
            return res.status(200).json({success:true, message:`user can use ${type} feature`, limit:user.usageLimits})
          }
        } catch (error) {
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

    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
});
