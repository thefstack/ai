"use client";
import apiClient from "@/lib/apiClient";
import { getAuthToken } from "@/utils/getAuthToken";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// Mock data for preview
const mockResumes = [
  {
    _id: "1",
    jobTitle: "Senior Frontend Developer",
    personalInfo: {
      headline: "Experienced Frontend Developer",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    },
    analysisScore: 85,
    source: "LinkedIn",
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-02-20").toISOString(),
  },
  {
    _id: "2",
    jobTitle: "Full Stack Developer",
    personalInfo: {
      headline: "Full Stack JavaScript Expert",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
    },
    analysisScore: 92,
    source: "Indeed",
    createdAt: new Date("2024-02-01").toISOString(),
    updatedAt: new Date("2024-02-25").toISOString(),
  },
  {
    _id: "3",
    jobTitle: "React Developer",
    personalInfo: {
      headline: "React & Next.js Specialist",
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike@example.com",
    },
    analysisScore: 78,
    source: "Scratch",
    createdAt: new Date("2024-02-10").toISOString(),
    updatedAt: new Date("2024-02-28").toISOString(),
  },
  {
    _id: "4",
    jobTitle: "UI/UX Developer",
    personalInfo: {
      headline: "Creative UI Developer",
      firstName: "Sarah",
      lastName: "Williams",
      email: "sarah@example.com",
    },
    analysisScore: 88,
    source: "Referral",
    createdAt: new Date("2024-02-15").toISOString(),
    updatedAt: new Date("2024-02-27").toISOString(),
  },
  {
    _id: "5",
    jobTitle: "Backend Developer",
    personalInfo: {
      headline: "Node.js Backend Expert",
      firstName: "David",
      lastName: "Brown",
      email: "david@example.com",
    },
    analysisScore: 95,
    source: "Company Portal",
    createdAt: new Date("2024-02-20").toISOString(),
    updatedAt: new Date("2024-02-28").toISOString(),
  },
];

const ResumesContext = createContext();

export function ResumesProvider({ children }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router=useRouter();

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
  
      console.log("🔄 Fetching resumes using Axios...");
  
      const response = await apiClient.get("/api/resume"); // Axios auto-parses JSON
      console.log("✅ API Response:", response);
  
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch resumes");
      }
  
      setResumes(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching resumes:", err);
      setError(err.message || "Failed to fetch resumes");
    }
  }, []);
  

  const createResume = async (resumeData) => {
    try {
      setLoading(true);
      setError(null);

      // In preview mode, simulate creating a resume
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newResume = {
          _id: String(Date.now()),
          ...resumeData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          analysisScore: Math.floor(Math.random() * 100),
        };
        setResumes((prev) => [newResume, ...prev]);
        return newResume;
      }

      const response = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create resume");
      }

      setResumes((prev) => [data.newResume, ...prev]);
      return data.newResume;
    } catch (err) {
      console.error("Error creating resume:", {
        message: err.message,
        stack: err.stack,
        cause: err.cause,
      });
      setError(err.message || "Failed to create resume");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id) => {
    try {

      const response = await apiClient.delete(`/api/resume/${id}`)
      console.log(response);

      if (response.data.success) {
        setResumes((prev) => prev.filter((resume) => resume._id !== id));
        
      }
      else{
        throw new Error(response.data.message || "Failed to delete resume");
      }
    } catch (err) {
      console.log(err)
      console.error("Error deleting resume:", {
        message: err.message,
      });
      setError(err.message || "Failed to delete resume");
      throw err;
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <ResumesContext.Provider
      value={{
        resumes,
        loading,
        error,
        setLoading,
        setError,
        fetchResumes,
        createResume,
        deleteResume,
      }}
    >
      {children}
    </ResumesContext.Provider>
  );
}

export function useResumes() {
  const context = useContext(ResumesContext);
  if (!context) {
    throw new Error("useResumes must be used within a ResumesProvider");
  }
  return context;
}
