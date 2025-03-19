"use client"
import { createContext, useContext, useState } from "react"

const ResumeContext = createContext()

export function ResumeProvider({ children, initialData = null }) {
  // Personal Information
  const [personalInfo, setPersonalInfo] = useState(
    initialData?.personalInfo || {
      firstName: "", // User's first name
      lastName: "", // User's last name
      headline: "", // Professional headline or title
      email: "", // Contact email address
      phone: "", // Contact phone number
      address: "", // Street address
      city: "", // City of residence
      state: "", // State/province
      country: "", // Country of residence
      pin: "", // ZIP/Postal code
      linkedin: "", // LinkedIn profile URL
      github: "", // GitHub profile URL
    },
  )

  // Job Related Information
  const [jobInfo, setJobInfo] = useState(
    initialData?.jobInfo || {
      jobTitle: "", // Target job title
      jobDescription: "", // Job description or requirements
      targetCompany: "", // Target company (if applicable)
      jobLocation: "", // Preferred job location
      employmentType: "", // Full-time, part-time, contract, etc.
    },
  )

  // Work Experience Section
  const [workExperience, setWorkExperience] = useState(initialData?.workExperience || [])

  // Education Section
  const [education, setEducation] = useState(initialData?.education || [])

  // Certifications Section - Add this
  const [certifications, setCertifications] = useState(initialData?.certifications || [])

  // Update Skills Section with more detailed structure
  const [skills, setSkills] = useState(
    initialData?.skills || {
      categories: [], // Skill categories
      skills: [], // Individual skills
      proficiencyLevels: {}, // Skill proficiency levels
      endorsements: {}, // Skill endorsements
      lastUsed: {}, // When skills were last used
    },
  )

  // Projects Section
  const [projects, setProjects] = useState(initialData?.projects || [])

  // Resume Customization
  const [customization, setCustomization] = useState(
    initialData?.customization || {
      template: "modern", // Selected resume template
      fontSize: "medium", // Font size preference
      fontFamily: "default", // Font family selection
      spacing: "normal", // Layout spacing
      color: "blue", // Color theme
    },
  )

  // Resume Metadata
  const [metadata, setMetadata] = useState(
    initialData?.metadata || {
      id: "", // Unique resume ID
      title: "", // Resume title
      createdAt: new Date().toISOString(), // Creation date
      lastModified: new Date().toISOString(), // Last modified date
      version: 1, // Version number
      isPublic: false, // Public/private status
    },
  )

  // Analysis and Scores
  const [analysis, setAnalysis] = useState(
    initialData?.analysis || {
      overallScore: 0, // Overall resume score
      sectionScores: {
        // Individual section scores
        personal: 0,
        experience: 0,
        education: 0,
        skills: 0,
        projects: 0,
      },
      suggestions: [], // Improvement suggestions
      keywords: [], // Matched keywords
      missingKeywords: [], // Missing important keywords
    },
  )

  // Error Handling
  const [error, setError] = useState(null)

  // Update Functions
  const updatePersonalInfo = (field, value) => {
    try {
      setError(null)
      setPersonalInfo((prev) => ({
        ...prev,
        [field]: value,
      }))
    } catch (err) {
      setError("Failed to update personal information")
      console.error("Personal info update error:", err)
    }
  }

  const updateJobInfo = (field, value) => {
    try {
      setError(null)
      setJobInfo((prev) => ({
        ...prev,
        [field]: value,
      }))
    } catch (err) {
      setError("Failed to update job information")
      console.error("Job info update error:", err)
    }
  }

  const updateWorkExperience = (experiences) => {
    try {
      setError(null)
      setWorkExperience(experiences)
    } catch (err) {
      setError("Failed to update work experience")
      console.error("Work experience update error:", err)
    }
  }

  const updateEducation = (educationData) => {
    try {
      setError(null)
      setEducation(educationData)
    } catch (err) {
      setError("Failed to update education")
      console.error("Education update error:", err)
    }
  }

  // Add this function for certifications
  const updateCertifications = (certificationsData) => {
    try {
      setError(null)
      setCertifications(certificationsData)
    } catch (err) {
      setError("Failed to update certifications")
      console.error("Certifications update error:", err)
    }
  }

  // Update Skills
  const updateSkills = (newSkills) => {
    try {
      setError(null)
      setSkills(newSkills)
    } catch (err) {
      setError("Failed to update skills")
      console.error("Skills update error:", err)
    }
  }

  // Update specific skill field
  const updateSkillField = (field, value) => {
    try {
      setError(null)
      setSkills((prev) => ({
        ...prev,
        [field]: value,
      }))
    } catch (err) {
      setError(`Failed to update skill field: ${field}`)
      console.error("Skill field update error:", err)
    }
  }

  const updateCustomization = (field, value) => {
    try {
      setError(null)
      setCustomization((prev) => ({
        ...prev,
        [field]: value,
      }))
    } catch (err) {
      setError("Failed to update customization")
      console.error("Customization update error:", err)
    }
  }

  const updateMetadata = (field, value) => {
    try {
      setError(null)
      setMetadata((prev) => ({
        ...prev,
        [field]: value,
        lastModified: new Date().toISOString(),
      }))
    } catch (err) {
      setError("Failed to update metadata")
      console.error("Metadata update error:", err)
    }
  }

  // Update Resume Data
  const updateResumeData = (field, value) => {
    try {
      setError(null)
      switch (field) {
        case "jobTitle":
        case "jobDescription":
        case "targetCompany":
        case "jobLocation":
        case "employmentType":
          updateJobInfo(field, value)
          break
        default:
          console.warn(`Unhandled field update: ${field}`)
      }
    } catch (err) {
      setError(`Failed to update ${field}`)
      console.error(`Update error for ${field}:`, err)
    }
  }

  const updateProjects = (projectsData) => {
    try {
      setError(null)
      setProjects(projectsData)
    } catch (err) {
      setError("Failed to update projects")
      console.error("Projects update error:", err)
    }
  }

  return (
    <ResumeContext.Provider
      value={{
        personalInfo,
        jobInfo,
        workExperience,
        education,
        certifications, // Add this
        skills,
        projects,
        customization,
        metadata,
        analysis,
        error,
        updatePersonalInfo,
        updateJobInfo,
        updateWorkExperience,
        updateEducation,
        updateCertifications, // Add this
        updateSkills,
        updateProjects,
        updateCustomization,
        updateMetadata,
        updateResumeData,
        updateSkillField,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider")
  }
  return context
}

