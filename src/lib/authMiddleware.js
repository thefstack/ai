// middleware/authMiddleware.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import jwt from "jsonwebtoken";
import User from "@/model/user";

export const authMiddleware = (handler) => async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log("Token in middleware: ",authHeader)
  const token = authHeader ? authHeader.split(" ")[1] : null;


  if (!token) {
    return res.status(401).json({ success: false, message: "Invalid Token", redirectTo: "/signin" });
  }

  try {
    // Attempt to verify as JWT
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      // const user=await User.findById(verified.id);
      // console.log("verified user")
      // if(user.role!==verified.role){
      //   return res.status(401).json({ success: false, message: "Login Expired. Please log in again.", redirectTo: "/signin", });
      // }
      req.user = verified;
      return handler(req, res);
    }
  } catch (jwtError) {
    console.log("JWT verification failed:", jwtError.message);
    // If JWT verification fails, fall back to NextAuth session check
    try {
      const session = await getServerSession(req, res, authOptions);
      if (session && session.accessToken === token) {
        req.user = { id: session.user.id };
        return handler(req, res);
      }
    } catch (sessionError) {
      console.error("Session retrieval failed:", sessionError);
    }
  }

  return res.status(401).json({ success: false, message: "Access Denied From Server" });
};
