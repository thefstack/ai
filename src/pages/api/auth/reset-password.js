import conn from "@/lib/conn";
import User from "@/model/user";
import { verifyToken } from "@/utils/jwt";
import sendMail from "@/utils/mail"

export default async function handler(req, res) {
  await conn();

  if(req.method!=='POST'){
    return res.status(405).json({success:false,message:"Method not allowed"})
  }
  try {
    const { token,password } = req.body;
    // verify token and decode email;
    const decoded=await verifyToken(token);
    const email=decoded.email;

    // double check whether email is registered
    const user= await User.findOne({email});
    if(!user){
        return res.status(400).json({success:false,message:"Invalid URL"})
    }

    if( user.loginType!=='credential-based'){
      return res.status(400).json({ success: false, message: "Invalid Credential" });
    }
    
    // password will be hashed automatically whenever save method is called 
    user.password=password;
    await user.save();

    return res.status(200).json({success:true,message:"Password Reset Successfull"})
    
  } catch (error) {
    return res.status(400).json({ success: false, message: "Link Expired" });
  }
}
