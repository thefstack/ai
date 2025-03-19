"use client"
import { useState, memo } from "react"
import { useCertifications } from "@/context/resume/certifications-context"
import "@/css/resume/certification.css"

import GuidanceModal from "./modals/GuidanceModal"
import { guidanceData } from "@/utils/guidance-data"
import apiClient from "@/lib/apiClient"
import { useParams } from "next/navigation"
import { useAnalysis } from "@/context/resume/analysis-context"

function Certification() {
  const {
    certifications,
    addCertification,
    updateCertification,
    deleteCertification,
    toggleCertification,
    updateField,
  } = useCertifications()
  const [showGuidance, setShowGuidance] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { id: resumeId } = useParams(); // ✅ Extract resumeId from UR
  const {saveAnalysis}=useAnalysis();

  console.log("Certification Section: ", certifications)

  // Add new certification entry
  const handleAddCertification = () => {
    addCertification()
  }

  // Delete certification entry
  const handleDeleteCertification = (id) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      deleteCertification(id)
    }
  }

  // Toggle certification panel
  const handleToggleCertification = (id) => {
    toggleCertification(id)
  }

  // Handle input changes
  const handleInputChange = (id, field, value) => {
    updateField(id, field, value)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const response = await apiClient.post(`/api/resume/certifications`,{certifications,resumeId})

      
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to save personal information"
        );
      }
      saveAnalysis(resumeId)
    } catch (error) {
      console.error("Save error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="certification-container">
      <div className="section-header">
        <div className="title-wrapper">
          <h2>Certifications</h2>
          {/* <button className="edit-button">
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
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button> */}
        </div>
        <button className="view-guidance-button-cert" onClick={() => setShowGuidance(true)}>
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

      {certifications.length === 0 && (
        <div className="empty-state">
          <p>No certifications added yet. Click the button below to add your first certification.</p>
        </div>
      )}

      {certifications.map((certification) => (
        <div key={certification.id} className="certification-item">
          <div className="certification-header">
            <span>
              {certification.name || certification.organization
                ? `${certification.name} - ${certification.organization}`
                : `Add Certifications`}
            </span>
            <div className="certification-actions">
              {/* <button className="action-button">
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
              </button> */}
              <button className="action-button" onClick={() => handleDeleteCertification(certification.id)}>
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
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
              <button className="action-button" onClick={() => handleToggleCertification(certification.id)}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transform: certification.isOpen ? "rotate(180deg)" : "none" }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {certification.isOpen && (
            <div className="certification-form">
              <div className="form-group">
                <label>Certification Name *</label>
                <input
                  type="text"
                  value={certification.name}
                  onChange={(e) => handleInputChange(certification.id, "name", e.target.value)}
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>

              <div className="form-group">
                <label>Issuing Organization *</label>
                <input
                  type="text"
                  value={certification.organization}
                  onChange={(e) => handleInputChange(certification.id, "organization", e.target.value)}
                  placeholder="e.g., Amazon Web Services"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Issue Date</label>
                  <input
                    type="date"
                    value={certification.issueDate ? certification.issueDate.split("T")[0] : ""}
                    onChange={(e) => handleInputChange(certification.id, "issueDate", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={certification.expiryDate ? certification.expiryDate.split("T")[0] : ""}
                    onChange={(e) => handleInputChange(certification.id, "expiryDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Credential ID</label>
                <input
                  type="text"
                  value={certification.credentialId}
                  onChange={(e) => handleInputChange(certification.id, "credentialId", e.target.value)}
                  placeholder="Enter credential ID"
                />
              </div>

              <div className="form-group">
                <label>Credential URL</label>
                <input
                  type="url"
                  value={certification.credentialUrl}
                  onChange={(e) => handleInputChange(certification.id, "credentialUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={certification.description}
                  onChange={(e) => handleInputChange(certification.id, "description", e.target.value)}
                  placeholder="Add any additional details about the certification..."
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="add-certification-btn-cont">
        <button className="add-certification-button" onClick={handleAddCertification}>
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Certification
        </button>
      </div>

      <button className="section-save-button" onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Certifications"}
      </button>

      {showGuidance && (
        <GuidanceModal
          title="Certifications"
          onClose={() => setShowGuidance(false)}
          guidanceData={guidanceData.certifications}
        />
      )}
    </div>
  )
}

export default memo(Certification)

