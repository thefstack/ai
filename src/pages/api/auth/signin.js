import conn from "@/lib/conn";
import Token from "@/model/token";
import User from "@/model/user";
import { generateToken } from "@/utils/jwt";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await conn();

  if(req.method!=='POST'){
    return res.status(405).json({success:false,message:"Method not allowed"})
  }
  try {
    const { email, password } = req.body;
    // find user by their id

    if(!email || password=="" || password==null || !password){
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const getUser = await User.findOne({ email });

    // if user is not found with email
    if (!getUser) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    if( getUser.loginType!=='credential-based'){
      return res.status(400).json({ success: false, message: "Invalid Credential" });
    }

    
    const isPasswordMatch = await bcrypt.compare(password, getUser.password);

    // if password does not match then
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    // Calculate the token expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Add 7 days to the current date

    //Generating a JWT token
    const token = generateToken({
      id: getUser._id,
      email: getUser.email,
      role: getUser.role, // Include role in the token payload
      expiresAt: '7d', // Set the expiration time
    });

    // Save the token in the database
    await Token.create({
      userId: getUser._id,
      token: token,
      expiresAt: expiresAt, // Set the calculated expiration date
  });

    return res.status(200).json({ success: true, message: "Success Signin", token: token, user: {
        id: getUser._id,
        email: getUser.email,
        firstName: getUser.firstName,
        lastName: getUser.lastName,
        role: getUser.role, // Send role to the frontend
      }, });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
