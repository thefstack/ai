import conn from "@/lib/conn";
import User from "@/model/user";
import sendMail from "@/utils/mail";
import Otp from "@/model/otp"; // Import the OTP model
import bcrypt from "bcryptjs"; // Import bcryptjs

export default async function handler(req, res) {
  await conn();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
  try {
    const { email } = req.body;

    console.log(req.body);
    // find user by their id
    const getUser = await User.findOne({ email });
    // if user is not found with email
    console.log(getUser);

    if (getUser) {
      if (getUser.loginType !== 'credential-based') {
        return res.status(400).json({ success: false, message: "email is already registered using google" });
      }

      return res.status(400).json({ success: false, message: "Email is already registered" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Hash the OTP
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    // Save or update hashed OTP in the database
    await Otp.findOneAndUpdate(
      { email },
      { otp: hashedOtp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Email content
    const subject = "Email Verification Code - Ivy AI Tutor";
    const html = `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 400px; margin: auto;">
      <h2 style="color: #333;">Email Verification Code</h2>
      <p style="color: #555; font-size: 16px;">Use the code below to verify your email:</p>
      <div id="otp-code" style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; 
                  border: 2px solid #4CAF50; border-radius: 8px; background: #fff; color: #333; margin: 20px 0; cursor: pointer;"
           onclick="navigator.clipboard.writeText('${otp}').then(() => alert('OTP copied to clipboard!'))">
        ${otp}
      </div>
      <p style="margin-top: 20px; color: #777; font-size: 14px;">This code is valid for 10 minutes.</p>
      <p style="color: #777; font-size: 14px;">If you did not request this, please ignore this email.</p>
    </div>
  `;

    // Send OTP email
    const mailRes = await sendMail(email, subject, html);
    if (mailRes) {
      return res.status(200).json({ success: true, message: "OTP sent successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Failed to send OTP. Please check your email." });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
