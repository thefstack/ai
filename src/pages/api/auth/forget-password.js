import conn from "@/lib/conn";
import User from "@/model/user";
import { generateToken } from "@/utils/jwt";
import sendMail from "@/utils/mail"

export default async function handler(req, res) {
  await conn();

  if(req.method!=='POST'){
    return res.status(405).json({success:false,message:"Method not allowed"})
  }
  try {
    const { email } = req.body;

    // find user by their id
    const getUser = await User.findOne({ email });

    // if user is not found with email
    if (!getUser) {
      return res.status(400).json({ success: false, message: "Email is not registered" });
    }

    // if( getUser.loginType!=='credential-based'){
    //   return res.status(400).json({ success: false, message: "Invalid Credential" });
    // }

    //Generating a JWT token
    const resetToken = generateToken({
      email: email,
    },"15m");
    
    const resetLink=`${process.env.NEXT_PUBLIC_URL}/reset-password?token=${resetToken}`
    const subject = "Forget Password - Ivy AI Tutor";
    const html = `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #555; font-size: 16px;">We received a request to reset your password. Click the button below to proceed:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; font-size: 18px; font-weight: bold; 
                    border: none; border-radius: 8px; background: #4CAF50; color: white; text-decoration: none; margin: 20px 0;">
         Click here to Reset Password
        </a>
        <p style="margin-top: 20px; color: #777; font-size: 14px;">This link is valid for 15 minutes.</p>
        <p style="color: #777; font-size: 14px;">If you did not request this, please ignore this email.</p>
      </div>
    `;
    const mailRes=await sendMail(email,subject,html);
    if(mailRes){
        return res.status(200).json({ success: true, message: "Password reset link send to mail" });
    }else{
        return res.status(400).json({success:false,message:"failed to send link please check your mail id"});
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
