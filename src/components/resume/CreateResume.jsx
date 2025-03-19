"use client"
import { useState } from "react"
import StartOptions from "./StartOptions"
import JobTitleStep from "./JobTitleStep"
import JobDescriptionStep from "./JobDescriptionStep"
import ResumeBuilder from "./ResumeBuilder"
import UploadedResume from "./UploadedResume"
import { ResumeProviders } from "@/context/resume/resume-providers" // Updated import path

export default function CreateResume() {
  const [currentStep, setCurrentStep] = useState("start")
  const [flow, setFlow] = useState(null)

  const handleNext = (step) => {
    try {
      console.log("step:", currentStep)
      switch (currentStep) {
        case "start":
          setFlow(step)
          if (step === "create") {
            setCurrentStep("jobTitle")
          } else if (step === "upload") {
            setCurrentStep("uploadedResume")
          } else {
            console.log("Unknown flow selected")
          }
          break
        case "jobTitle":
          setCurrentStep("jobDescription")
          break
        case "jobDescription":
          setCurrentStep("builder")
          break
        default:
          break
      }
    } catch (err) {
      console.error("Navigation error:", err)
    }
  }

  const handleBack = () => {
    try {
      switch (currentStep) {
        case "jobTitle":
          setCurrentStep("start")
          break
        case "jobDescription":
          setCurrentStep("jobTitle")
          break
        case "builder":
          setCurrentStep("jobDescription")
          break
        case "uploadedResume":
          setCurrentStep("start")
          break
        default:
          break
      }
    } catch (err) {
      console.error("Navigation error:", err)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case "start":
        return <StartOptions onNext={handleNext} />
      case "jobTitle":
        return <JobTitleStep onNext={() => handleNext()} onBack={handleBack} />
      case "jobDescription":
        return <JobDescriptionStep onNext={() => handleNext()} onBack={handleBack} />
      case "builder":
        return <ResumeBuilder onBack={handleBack} />
      case "uploadedResume":
        return <UploadedResume onBack={handleBack}  onNext={() => handleNext()} />
      default:
        return null
    }
  }

  return <ResumeProviders>{renderStep()}</ResumeProviders>
}