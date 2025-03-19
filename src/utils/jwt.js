// utils/jwt.js
import jwt from 'jsonwebtoken';

// Secret for JWT (this should be stored in environment variables)
const SECRET_KEY = process.env.JWT_SECRET;

// Generate JWT token
export const generateToken = (user,expiresAt) => {

  const options=expiresAt ? {expiresIn:expiresAt}:{}
  return jwt.sign(
    {
      id: user.id,  // Include user ID in the token payload
      email: user.email,
      role:user.role
    },
    SECRET_KEY,  // Token expires in 1 hour
    options
  );
};

// Verify JWT token
export const verifyToken = async(token) => {
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    return decodedToken;
  } catch (error) {
    return null;
  }
};
