// utils/getAuthToken.js
import { getSession } from "next-auth/react";

export const getAuthToken = async () => {
  const session = await getSession();

  if (session && session.accessToken) {
    return session.accessToken; // Google access token or JWT token
  }

  const token = localStorage.getItem("authToken");
  return token || null; // Return JWT from localStorage if available
};
