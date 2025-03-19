"use client"
import { useState } from "react"
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

export default function EditResumeBuilder({ resumeData, onBack }) {
  return (
    <ResumeProviders initialData={resumeData}>
      <EditResumeContent onBack={onBack} />
    </ResumeProviders>
  )
}

function EditResumeContent({ onBack }) {
  const [activeSection, setActiveSection] = useState("personal")
  const [showGuidance, setShowGuidance] = useState(false)

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
            <button
              className={`nav-item ${activeSection === "experience" ? "active" : ""}`}
              onClick={() => setActiveSection("experience")}
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
              onClick={() => setActiveSection("education")}
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
              onClick={() => setActiveSection("certifications")}
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
              onClick={() => setActiveSection("skills")}
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
              onClick={() => setActiveSection("projects")}
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
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="resume-builder-main">
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

