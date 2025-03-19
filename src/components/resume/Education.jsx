"use client"
import { useState, memo, useCallback, useEffect } from "react"
import { useEducation } from "@/context/resume/education-context"
import "@/css/resume/education.css"
import GuidanceModal from "./modals/GuidanceModal"
import { guidanceData } from "@/utils/guidance-data"
import { useParams } from "next/navigation"
import apiClient from "@/lib/apiClient"
import { useAnalysis } from "@/context/resume/analysis-context"
import Error from "../Error"

// Validation function for education fields
const validateEducation = (education) => {
  const errors = {}

  // Validate institute name
  if (!education.institute || education.institute.trim() === "") {
    errors.institute = "Institute name is required"
  }

  // Validate degree
  if (!education.degree || education.degree.trim() === "") {
    errors.degree = "Degree is required"
  }

  // Validate field of study
  if (!education.field || education.field.trim() === "") {
    errors.field = "Field of study is required"
  }

  return errors
}

const EducationItem = memo(
  ({
    education,
    onDelete,
    onToggle,
    onInputChange,
    onToggleCurrentlyStudying,
    errors = {},
    touched = {},
    onBlur,
    formSubmitted,
  }) => {
    // Check if any field has been touched or if form was submitted
    const showErrors = formSubmitted || Object.keys(touched).some((key) => touched[key])

    // Check if there are any errors
    const hasErrors = Object.keys(errors).length > 0

    return (
      <div className={`education-item ${hasErrors ? "has-errors" : ""}`}>
        <div className={`education-header ${hasErrors ? "error-header" : ""}`}>
          <span>
            {education.institute || education.degree
              ? `${education.institute} - ${education.degree}`
              : `Add Education`}
          </span>
          <div className="education-actions">
            {hasErrors && (
              <div style={{marginTop:9}} className="error-indicator" title="This education entry has errors">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f94449"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            )}
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
            <button className="action-button" onClick={() => onDelete(education.id)}>
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
            <button className="action-button" onClick={() => onToggle(education.id)}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: education.isOpen ? "rotate(180deg)" : "none" }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {education.isOpen && (
          <div className="education-form">
            <div className="form-group">
              <label>Institute Name *</label>
              <input
                type="text"
                value={education.institute}
                onChange={(e) => onInputChange(education.id, "institute", e.target.value)}
                onBlur={() => onBlur(education.id, "institute")}
                placeholder="Enter your institute name"
                className={errors.institute && (touched.institute || formSubmitted) ? "input-error" : ""}
              />
              {errors.institute && (touched.institute || formSubmitted) && (
                <div className="field-error-message">{errors.institute}</div>
              )}
            </div>

            <div className="form-group">
              <label>Degree *</label>
              <input
                type="text"
                value={education.degree}
                onChange={(e) => onInputChange(education.id, "degree", e.target.value)}
                onBlur={() => onBlur(education.id, "degree")}
                placeholder="Enter your degree"
                className={errors.degree && (touched.degree || formSubmitted) ? "input-error" : ""}
              />
              {errors.degree && (touched.degree || formSubmitted) && (
                <div className="field-error-message">{errors.degree}</div>
              )}
            </div>

            <div className="form-group">
              <label>Field of Study *</label>
              <input
                type="text"
                value={education.field}
                onChange={(e) => onInputChange(education.id, "field", e.target.value)}
                onBlur={() => onBlur(education.id, "field")}
                placeholder="Enter your field of study"
                className={errors.field && (touched.field || formSubmitted) ? "input-error" : ""}
              />
              {errors.field && (touched.field || formSubmitted) && (
                <div className="field-error-message">{errors.field}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={education.startDate ? education.startDate.split("T")[0] : ""}
                  onChange={(e) => onInputChange(education.id, "startDate", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={education.endDate ? education.endDate.split("T")[0] : ""}
                  onChange={(e) => onInputChange(education.id, "endDate", e.target.value)}
                  disabled={education.isCurrentlyStudying}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  checked={education.isCurrentlyStudying}
                  onChange={() => onToggleCurrentlyStudying(education.id)}
                />
                I am currently studying here
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={education.location}
                onChange={(e) => onInputChange(education.id, "location", e.target.value)}
                placeholder="Enter institute location"
              />
            </div>

            <div className="form-group">
              <label>CGPA</label>
              <input
                type="text"
                value={education.cgpa}
                onChange={(e) => onInputChange(education.id, "cgpa", e.target.value)}
                placeholder="Enter your CGPA"
              />
            </div>
          </div>
        )}
      </div>
    )
  },
)
EducationItem.displayName = "EducationItem"

function Education() {
  const {
    education,
    addEducation,
    updateEducation,
    deleteEducation,
    toggleEducation,
    toggleCurrentlyStudying,
    updateField,
  } = useEducation()
  const [showGuidance, setShowGuidance] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { id: resumeId } = useParams()
  const { saveAnalysis } = useAnalysis()
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [globalError, setGlobalError] = useState("")

  // Validate all education entries
  const validateAllEducation = useCallback(() => {
    const newErrors = {}
    let isValid = true

    education.forEach((edu) => {
      const eduErrors = validateEducation(edu)
      if (Object.keys(eduErrors).length > 0) {
        newErrors[edu.id] = eduErrors
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [education])

  // Handle field blur
  const handleBlur = useCallback((id, field) => {
    setTouched((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: true,
      },
    }))
  }, [])

  // Mark all fields as touched
  const touchAllFields = useCallback(() => {
    const newTouched = {}
    education.forEach((edu) => {
      newTouched[edu.id] = {
        institute: true,
        degree: true,
        field: true,
      }
    })
    setTouched(newTouched)
  }, [education])

  // Update errors when education changes
  useEffect(() => {
    validateAllEducation()
  }, [education, validateAllEducation])

  // Memoize handlers
  const handleDeleteEducation = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete this education entry?")) {
        deleteEducation(id)
        // Clean up errors and touched state
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[id]
          return newErrors
        })
        setTouched((prev) => {
          const newTouched = { ...prev }
          delete newTouched[id]
          return newTouched
        })
      }
    },
    [deleteEducation],
  )

  const handleToggleEducation = useCallback(
    (id) => {
      toggleEducation(id)
    },
    [toggleEducation],
  )

  const handleInputChange = useCallback(
    (id, field, value) => {
      updateField(id, field, value)

      // Clear error for this field if it exists
      setErrors((prev) => {
        if (prev[id] && prev[id][field]) {
          const newErrors = { ...prev }
          const fieldErrors = { ...newErrors[id] }
          delete fieldErrors[field]

          if (Object.keys(fieldErrors).length === 0) {
            delete newErrors[id]
          } else {
            newErrors[id] = fieldErrors
          }

          return newErrors
        }
        return prev
      })
    },
    [updateField],
  )

  const handleToggleCurrentlyStudying = useCallback(
    (id) => {
      toggleCurrentlyStudying(id)
    },
    [toggleCurrentlyStudying],
  )

  const handleSave = async () => {
    setFormSubmitted(true)
    setGlobalError("")

    // Validate all education entries
    const isValid = validateAllEducation()

    if (!isValid) {
      // Open all education entries with errors
      education.forEach((edu) => {
        if (errors[edu.id] && !edu.isOpen) {
          toggleEducation(edu.id)
        }
      })

      setGlobalError("Please fix the validation errors before saving")
      return
    }

    try {
      setIsSaving(true)
      const response = await apiClient.post(`/api/resume/education`, { education, resumeId })

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save education information")
      }

      saveAnalysis(resumeId)
      setFormSubmitted(false)
    } catch (error) {
      console.error("Save error:", error)
      setGlobalError("Failed to save education information. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="education-container">
      {globalError && <Error message={globalError} />}

      <div className="section-header">
        <div className="title-wrapper">
          <h2>Education</h2>
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
        <button className="view-guidance-button-edu" onClick={() => setShowGuidance(true)}>
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

      {education.length === 0 && (
        <div className="empty-state">
          <p>No education added yet. Click the button below to add your first education entry.</p>
        </div>
      )}

      {education.map((edu) => (
        <EducationItem
          key={edu.id}
          education={edu}
          onDelete={handleDeleteEducation}
          onToggle={handleToggleEducation}
          onInputChange={handleInputChange}
          onToggleCurrentlyStudying={handleToggleCurrentlyStudying}
          errors={errors[edu.id] || {}}
          touched={touched[edu.id] || {}}
          onBlur={handleBlur}
          formSubmitted={formSubmitted}
        />
      ))}

      <div className="add-education-btn-cont">
        <button className="add-education-button" onClick={addEducation}>
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
          Add Education
        </button>
      </div>

      <button className="section-save-button" onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Education"}
      </button>

      {showGuidance && (
        <GuidanceModal title="Education" onClose={() => setShowGuidance(false)} guidanceData={guidanceData.education} />
      )}
    </div>
  )
}

export default memo(Education)

