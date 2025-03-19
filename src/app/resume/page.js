"use client"
import ResumeList from "@/components/resume/resume-list"
import { ResumeProvider } from "@/context/ResumeContext"

export default function ResumePage() {
  return <ResumeProvider><ResumeList /></ResumeProvider>
}

