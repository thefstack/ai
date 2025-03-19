import conn from "@/lib/conn";
import Otp from "@/model/otp";
import bcrypt from "bcryptjs"; // Import bcryptjs

export default async function handler(req, res) {
  await conn();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
  try {
    const { email, otp } = req.body;

    // Find the OTP in the database
    const otpRecord = await Otp.findOne({ email });
    console.log(otpRecord)

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Check if OTP is expired (valid for 10 minutes)
    const now = new Date();
    const otpAge = (now - otpRecord.createdAt) / 1000 / 60; // in minutes
    if (otpAge > 10) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Compare the provided OTP with the hashed OTP
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    console.log(isMatch)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Set isVerified to true
    otpRecord.isVerified = true;
    await otpRecord.save();

    // OTP is valid
    return res.status(200).json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
