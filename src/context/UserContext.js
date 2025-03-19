"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { getAuthToken } from "@/utils/getAuthToken";

// Create the UserContext
const UserContext = createContext();

// Custom hook for consuming the context
export const useUser = () => useContext(UserContext);

// UserProvider component to wrap around the app
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Holds user info like role, subscription plan, etc.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data (e.g., role, subscription plan)
  const fetchUserData = async () => {
    try {
      console.log("calling user")
      setLoading(true);
      const token = await getAuthToken(); // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const response = await axios.get("/api/user",{
        headers: {
          Authorization: `Bearer ${token}`
      }
      }); // Your backend endpoint to fetch user data
      // console.log(response.data)
      setUserData(response.data);
    } catch (err) {
      console.log(err)
      setError(err.message || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  // Call fetchUserData on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, loading, error, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
