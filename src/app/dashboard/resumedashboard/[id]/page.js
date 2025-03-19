"use client"; // Ensures this is a client component

import {  useParams } from "next/navigation";

import ResumeBuilder from "@/components/resume/ResumeBuilder";


export default function ResumePage() {
  const { id } = useParams(); // Get the resume ID from the URL


  return (
    <ResumeBuilder resumeId={id}/>
  );
}
