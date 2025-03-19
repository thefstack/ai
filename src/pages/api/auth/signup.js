import conn from "@/lib/conn";
import Token from "@/model/token";
import User from "@/model/user";
import { generateToken } from "@/utils/jwt";

export default async function handler(req, res) {
  await conn();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method NOT Allowed" });
  }

  try {
    // Destructure req.body
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    // Check if all required fields are present
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: "All required fields must be filled." });
    }

    // Check if user already exists
    const isUser = await User.findOne({ email });
    if (isUser) {
      const error = new Error("Duplicate key error");
      error.code = 11000;
      throw error;
    }

    // Create new user
    const createUser = new User({
      email,
      password,
      firstName,
      lastName,
      phoneNumber, // Ensure phone number is saved
      loginType:"credential-based"
    });

    // Save the new user
    await createUser.save();

    // Calculate the token expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Add 7 days to the current date

    //Generating a JWT token
    const token = generateToken({
      id: createUser._id,
      email: createUser.email,
      role: createUser.role, // Include role in the token payload
      expiresAt: '7d', // Set the expiration time
    });

    // Save the token in the database
    await Token.create({
      userId: createUser._id,
      token: token,
      expiresAt: expiresAt, // Set the calculated expiration date
  });

    return res.status(200).json({ success: true, message: "Success Signup", token, user: {
        id: createUser._id,
        email: createUser.email,
        firstName: createUser.firstName,
        lastName: createUser.lastName,
        phoneNumber: createUser.phoneNumber,
        role: createUser.role, // Include role in response
      }, });
    
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "User Already Exist" });
    }
    console.log(error)
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
