"use client"
/*
  Flow
  loadFormDatabase ? render the component : push back to dashboard 
*/

import { useEffect, useState } from "react"
import { useResumeSync } from "@/context/resume/resume-sync"
import { useResumes } from "@/context/resume/resumes-context"
import { useCustomSections } from "@/context/resume/custom-sections-context"
import "@/css/resume/resume-builder.css"
import WorkExperience from "./WorkExperience"
import Education from "./Education"
import Skills from "./Skills"
import Projects from "./Projects"
import Certification from "./Certification"
import NewSection from "./NewSection"
import GuidanceModal from "./modals/GuidanceModal"
import { guidanceData } from "@/utils/guidance-data"
import ScoreCards from "./ScoreCards"
import PersonalInfo from "./personal-info"
import { useRouter } from "next/navigation"

export default function ResumeBuilder({ resumeId, onBack }) {
  const { loadFromDatabase } = useResumeSync()
  const { loading: resumeLoading, error: resumeError } = useResumes()
  const { sections, addSection } = useCustomSections()
  const [activeSection, setActiveSection] = useState("personal")
  const [activeSectionId, setActiveSectionId] = useState(null)
  const [showGuidance, setShowGuidance] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadResume = async () => {
      if (resumeId) {
        try {
          await loadFromDatabase(resumeId)
          setLoading(false)
        } catch (error) {
          console.error("Error loading resume:", error)
          router.push("/dashboard/resumedashboard")
        }
      }
    }
    loadResume()
  }, [resumeId])

  // Effect to handle section deletion
  useEffect(() => {
    // If the active section is deleted, switch to personal
    if (activeSection === "custom" && activeSectionId) {
      const sectionExists = sections.some((section) => section.id === activeSectionId)
      if (!sectionExists) {
        setActiveSection("personal")
        setActiveSectionId(null)
      }
    }
  }, [sections, activeSection, activeSectionId])

  const handleAddNewSection = () => {
    const newSection = addSection()
    setActiveSection("custom")
    setActiveSectionId(newSection.id)
  }

  const handleCustomSectionClick = (sectionId) => {
    setActiveSection("custom")
    setActiveSectionId(sectionId)
  }

  if (resumeLoading || loading) {
    return (
      <div className="resume-loading">
        <div className="loading-spinner"></div>
        <p>Loading resume...</p>
      </div>
    )
  }

  if (resumeError) {
    return (
      <div className="resume-error">
        <p>Error: {resumeError}</p>
        <button onClick={onBack} className="back-button">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="resume-builder-wrapper">
      {/* Left Sidebar */}
      <div className="resume-builder-sidebar">
        <nav className="sidebar-nav">
          <button
            className="back-button"
            onClick={(e) => {
              e.preventDefault()
              router.back()
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to List
          </button>
          <div className="nav-section">
            <span className="nav-section-title">Resume Sections</span>
            <button
              className={`nav-item ${activeSection === "personal" ? "active" : ""}`}
              onClick={() => {
                setActiveSection("personal")
                setActiveSectionId(null)
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Personal Details
            </button>
            <button
              className={`nav-item ${activeSection === "experience" ? "active" : ""}`}
              onClick={() => {
                setActiveSection("experience")
                setActiveSectionId(null)
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Work Experience
            </button>
            <button
              className={`nav-item ${activeSection === "education" ? "active" : ""}`}
              onClick={() => {
                setActiveSection("education")
                setActiveSectionId(null)
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
              Education
            </button>
            <button
              className={`nav-item ${activeSection === "certifications" ? "active" : ""}`}
              onClick={() => {
                setActiveSection("certifications")
                setActiveSectionId(null)
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
                <path d="M12 3v4"></path>
                <path d="M8 17h8"></path>
                <path d="M12 17v4"></path>
              </svg>
              Certifications
            </button>
            <button
              className={`nav-item ${activeSection === "skills" ? "active" : ""}`}
              onClick={() => {
                setActiveSection("skills")
                setActiveSectionId(null)
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="6" y1="3" x2="6" y2="15"></line>
                <circle cx="18" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <path d="M18 9a9 9 0 0 1-9 9"></path>
              </svg>
              Skills
            </button>
            <button
              className={`nav-item ${activeSection === "projects" ? "active" : ""}`}
              onClick={() => {
                setActiveSection("projects")
                setActiveSectionId(null)
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              Projects
            </button>

            {/* Custom Sections */}
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === "custom" && activeSectionId === section.id ? "active" : ""}`}
                onClick={() => handleCustomSectionClick(section.id)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                {section.title}
              </button>
            ))}

            {/* Add New Section Button */}
            <button className="nav-item add-section-button" onClick={handleAddNewSection}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Add New Section
            </button>

            {/* View Resume Button */}
            <button
              className="nav-item add-section-button"
              onClick={(e) => {
                e.preventDefault()
                router.push(`/dashboard/resumedashboard/preview/${resumeId}`)
              }}
              style={{
                backgroundColor: "#007cb5",
                color: "white",
                border: "none",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 15px",
                margin: "10px 0",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(1 97 142)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007cb5")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              View Resume
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="resume-builder-main">
        <ScoreCards />

        <div className="section-content">
          {activeSection === "personal" ? (
            <div className="section-wrapper">
              <PersonalInfo />
            </div>
          ) : activeSection === "experience" ? (
            <div className="section-wrapper">
              <WorkExperience />
            </div>
          ) : activeSection === "education" ? (
            <div className="section-wrapper">
              <Education />
            </div>
          ) : activeSection === "certifications" ? (
            <div className="section-wrapper">
              <Certification />
            </div>
          ) : activeSection === "skills" ? (
            <div className="section-wrapper">
              <Skills />
            </div>
          ) : activeSection === "projects" ? (
            <div className="section-wrapper">
              <Projects />
            </div>
          ) : activeSection === "custom" && activeSectionId ? (
            <div className="section-wrapper">
              <NewSection sectionId={activeSectionId} />
            </div>
          ) : null}
        </div>

        {showGuidance && (
          <GuidanceModal
            title="Personal Details"
            onClose={() => setShowGuidance(false)}
            guidanceData={guidanceData.personalInfo}
          />
        )}
      </main>
    </div>
  )
}

