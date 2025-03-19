"use client"
import { usePersonalInfo } from "@/context/personal-info-context"
import { useState } from "react"
import GuidanceModal from "./modals/GuidanceModal"
import { guidanceData } from "@/utils/guidance-data"

export default function PersonalDetails() {
  const { personalInfo, updatePersonalInfo } = usePersonalInfo()
  const [showGuidance, setShowGuidance] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    updatePersonalInfo(name, value)
  }

  return (
    <div className="resume-form">
      <div className="main-header">
        <div className="header-content">
          <h1>Personal Details</h1>
        </div>
        <button className="view-guidance-button-personal" onClick={() => setShowGuidance(true)}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View Guidance
        </button>
      </div>

      <form>
        {/* Form fields remain the same, just using the new context */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={personalInfo.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
            />
          </div>
          {/* ... rest of the form fields ... */}
        </div>
      </form>

      {showGuidance && (
        <GuidanceModal
          title="Personal Details"
          onClose={() => setShowGuidance(false)}
          guidanceData={guidanceData.personalInfo}
        />
      )}
    </div>
  )
}

