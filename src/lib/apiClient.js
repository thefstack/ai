import { getAuthToken } from "@/utils/getAuthToken";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000/api", // Use environment variable
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach Bearer token for authentication
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken(); // Replace with actual token retrieval function
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
