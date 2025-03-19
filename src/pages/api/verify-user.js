import conn from "@/lib/conn";
import Token from "@/model/token";
import User from "@/model/user";
import { generateToken, verifyToken } from "@/utils/jwt";
import bcrypt from "bcryptjs";


// pages/api/generateChat.js

import { authMiddleware } from "@/lib/authMiddleware";


export default authMiddleware(async function handler(req , res) {
    res.status(200).json({success:true, message:"verified"})
  }
)

// export default async function handler(req, res) {
//   await conn();

//   if(req.method!=='GET'){
//     return res.status(405).json({success:false,message:"Method not allowed"})
//   }
//   try {
//     const authHeader = req.headers.authorization;
//   const token = authHeader ? authHeader.split(" ")[1] : null;
//     // find user by their id

//     if(!token){
//         return res.status(400).json({ success: false, message: "Token is required" });
//       }

// //     const foundToken = await Token.findOne({ token, isRevoked: false });

// //   if (!foundToken) {
// //     return res.status(400).json({ success: false, message: "Token is invalid or has been revoked" });
// //   }

//   const verifiedToken = await verifyToken(token);
//     if (!verifiedToken) {
//         return res.status(400).json({ success: false, message: "Token is invalid or has been revoked" });
//     }
//     const getUser=await User.findById(verifiedToken.id)
//     if(verifiedToken.role===getUser.role){
//         return res.status(200).json({success:true, message:"verified user and role"})
//     }else{
//         //Generating a JWT token
//         const newToken = generateToken({
//         id: getUser._id,
//         email: getUser.email,
//         role: getUser.role, // Include role in the token payload
//         expiresAt: '7d', // Set the expiration time
//       });
      
//      // Calculate the new expiration date
//      const newExpiresAt = new Date();
//      newExpiresAt.setDate(newExpiresAt.getDate() + 7); // Add 7 days

//      // Update the existing token in the database
//      const updatedToken = await Token.findOneAndUpdate(
//        { token: token }, // Match the old token
//        { token: newToken, expiresAt: newExpiresAt, isRevoked: false }, // Update details
//        { new: true } // Return the updated document
//      );

//         return res.status(200).json({success:false, verifiedToken,getUser})
//     }
   
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// }
