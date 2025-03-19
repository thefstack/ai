"use client"

import React, { useState } from "react";
import { Search, Filter, Plus, Trash2, Edit, ArrowUpDown, X, Loader } from "lucide-react";
import styles from "@/css/ResumeDashboard.module.css";
import Resume from '@/components/ResumeSelection';
import ResumeList from "@/components/resume/resume-list";
// Sample Data for Randomization
const resumeData = [
  { title: "Frontend Developer", score: 30, created: "Jan 15, 2024", modified: "Feb 10, 2025", jobTitle: "Software Engineer", source: "LinkedIn" },
  { title: "Data Scientist", score: 62, created: "Feb 20, 2023", modified: "Mar 5, 2025", jobTitle: "Data Analyst", source: "Indeed" },
  { title: "Backend Developer", score: 85, created: "Mar 12, 2022", modified: "Apr 22, 2025", jobTitle: "Software Developer", source: "Scratch" },
  { title: "UX Designer", score: 38, created: "Apr 8, 2024", modified: "May 15, 2025", jobTitle: "UI/UX Designer", source: "Referral" },
  { title: "Marketing Specialist", score: 22, created: "May 25, 2023", modified: "Jun 18, 2025", jobTitle: "Digital Marketer", source: "Company Portal" },
  { title: "DevOps Engineer", score: 88, created: "Jun 30, 2022", modified: "Jul 20, 2025", jobTitle: "System Admin", source: "LinkedIn" },
  { title: "Full Stack Developer", score: 51, created: "Jul 14, 2023", modified: "Aug 9, 2025", jobTitle: "Software Engineer", source: "Upwork" },
  { title: "Machine Learning Engineer", score: 81, created: "Aug 22, 2023", modified: "Sep 5, 2025", jobTitle: "AI Specialist", source: "Referral" },
  { title: "Product Manager", score: 36, created: "Sep 19, 2022", modified: "Oct 11, 2025", jobTitle: "Product Owner", source: "Glassdoor" },
  { title: "Cybersecurity Analyst", score: 61, created: "Oct 28, 2023", modified: "Nov 19, 2025", jobTitle: "Security Engineer", source: "Company Portal" },
  { title: "Cloud Architect", score: 84, created: "Nov 10, 2022", modified: "Dec 1, 2025", jobTitle: "Cloud Engineer", source: "LinkedIn" },
  { title: "AI Researcher", score: 99, created: "Dec 5, 2023", modified: "Jan 10, 2026", jobTitle: "AI Engineer", source: "Referral" },
  { title: "Game Developer", score: 80, created: "Jan 3, 2024", modified: "Feb 15, 2026", jobTitle: "Unity Developer", source: "Scratch" },
  { title: "Business Analyst", score: 54, created: "Feb 9, 2022", modified: "Mar 2, 2026", jobTitle: "Strategy Consultant", source: "Glassdoor" },
  { title: "Network Engineer", score: 46, created: "Mar 18, 2023", modified: "Apr 8, 2026", jobTitle: "IT Support", source: "Indeed" },
];


const ResumeDashboard = () => {

  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [filterSource, setFilterSource] = useState(""); // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Sidebar filter state
  const [isLoading, setIsLoading] = useState(false); // Loading animation

  // Filter Logic (Matches Search & Source Filter)
  const filteredResumes = resumeData.filter((resume) => {
    return (
      (resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterSource === "" || resume.source === filterSource)
    );
  });

  // Handles search with a delay to show animation
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simulate search delay
  };

  return (
  <>
    <ResumeList/>
  </>
        
  );

};

export default ResumeDashboard;
