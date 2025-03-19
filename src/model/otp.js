import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 1800 }, // OTP expires in 30 minutes
  isVerified: { type: Boolean, default: false } // New field to track verification status
});

const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema);

export default Otp;
