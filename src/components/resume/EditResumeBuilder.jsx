"use client"
import { useState, useEffect } from "react"
import "@/css/resume/resume-builder.css"
import WorkExperience from "./WorkExperience"
import Education from "./Education"
import Skills from "./Skills"
import Projects from "./Projects"
import Certification from "./Certification"
import GuidanceModal from "./modals/GuidanceModal"
import { guidanceData } from "@/utils/guidance-data"
import ScoreCards from "./ScoreCards"
import PersonalInfo from "./personal-info"
import { ResumeProviders } from "@/context/resume/resume-providers"
import { useResumeSync } from "@/context/resume/resume-sync"

function EditResumeContent({ resumeData, onBack }) {
  const [activeSection, setActiveSection] = useState("personal")
  const [showGuidance, setShowGuidance] = useState(false)
  const { loadFromDatabase, saveToDatabase } = useResumeSync()
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    if (resumeData?._id) {
      loadFromDatabase(resumeData._id)
    }
  }, [resumeData, loadFromDatabase])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveError(null)
      await saveToDatabase()
      // Show success message
    } catch (error) {
      setSaveError("Failed to save resume. Please try again.")
      console.error("Save error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="resume-builder-wrapper">
      {/* Left Sidebar */}
      <div className="resume-builder-sidebar">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="sidebar-header">
              <button className="back-button" onClick={onBack}>
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
            </div>
            <span className="nav-section-title">Resume Sections</span>
            <button
              className={`nav-item ${activeSection === "personal" ? "active" : ""}`}
              onClick={() => setActiveSection("personal")}
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
            {/* Other navigation buttons remain the same */}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="resume-builder-main">
        <div className="resume-builder-header">
          <button className="save-button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Resume"}
          </button>
          {saveError && <div className="save-error">{saveError}</div>}
        </div>

        <ScoreCards />
        {activeSection === "personal" ? (
          <PersonalInfo />
        ) : activeSection === "experience" ? (
          <WorkExperience />
        ) : activeSection === "education" ? (
          <Education />
        ) : activeSection === "certifications" ? (
          <Certification />
        ) : activeSection === "skills" ? (
          <Skills />
        ) : activeSection === "projects" ? (
          <Projects />
        ) : null}

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

export default function EditResumeBuilder({ resumeData, onBack }) {
  return (
    <ResumeProviders initialData={resumeData}>
      <EditResumeContent resumeData={resumeData} onBack={onBack} />
    </ResumeProviders>
  )
}

