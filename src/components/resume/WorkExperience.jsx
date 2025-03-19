"use client"
import { useState, memo, useCallback, useEffect } from "react"
import { useWorkExperience } from "@/context/resume/work-experience-context"
import "@/css/resume/work-experience.css"
import GuidanceModal from "./modals/GuidanceModal"
import { guidanceData } from "@/utils/guidance-data"
import apiClient from "@/lib/apiClient"
import { useParams } from "next/navigation"
import AIWritingWorkExpModal from "./modals/AIWritingWorkExpModal"
import { useAnalysis } from "@/context/resume/analysis-context"
import Error from "../Error"

const WorkExperienceItem = memo(
  ({
    experience,
    onDelete,
    onToggle,
    onInputChange,
    onToggleCurrentRole,
    onAIWriting,
    errors,
    setFieldTouched,
    touched,
  }) => {
    // Check if any field in this experience has been touched
    const hasAnyFieldTouched =
      touched[experience.id] && Object.values(touched[experience.id]).some((value) => value === true)

    // Only show errors in the header if any field has been touched
    const showHeaderErrors = hasAnyFieldTouched && Object.keys(errors[experience.id] || {}).length > 0

    return (
      <div className="experience-item">
        <div className={`experience-header ${showHeaderErrors ? "has-errors" : ""}`}>
          <span>
            {experience.company || experience.title
              ? `${experience.company} - ${experience.title}`
              : `Add Experience`}
            {showHeaderErrors && (
              <span className="error-indicator" title="This experience has validation errors">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="error-icon"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </span>
            )}
          </span>
          <div className="experience-actions">
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
            <button className="action-button" onClick={() => onDelete(experience.id)}>
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
            <button className="action-button" onClick={() => onToggle(experience.id)}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: experience.isOpen ? "rotate(180deg)" : "none" }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
        {experience.isOpen && (
          <div className="experience-form">
            <div className="form-row">
              <div className="form-group">
                <label>Job Title *</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    value={experience.title}
                    onChange={(e) => onInputChange(experience.id, "title", e.target.value)}
                    onBlur={() => setFieldTouched(experience.id, "title")}
                    placeholder="Enter job title"
                    className={errors[experience.id]?.title && touched[experience.id]?.title ? "input-error" : ""}
                  />
                </div>
                {errors[experience.id]?.title && touched[experience.id]?.title && (
                  <div className="field-error-message">{errors[experience.id].title}</div>
                )}
              </div>
              <div className="form-group">
                <label>Company *</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    value={experience.company}
                    onChange={(e) => onInputChange(experience.id, "company", e.target.value)}
                    onBlur={() => setFieldTouched(experience.id, "company")}
                    placeholder="Enter company name"
                    className={errors[experience.id]?.company && touched[experience.id]?.company ? "input-error" : ""}
                  />
                </div>
                {errors[experience.id]?.company && touched[experience.id]?.company && (
                  <div className="field-error-message">{errors[experience.id].company}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  value={experience.location}
                  onChange={(e) => onInputChange(experience.id, "location", e.target.value)}
                  placeholder="Enter job location"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <div className="input-with-icon">
                  <input
                    type="date"
                    value={experience.startDate ? experience.startDate.split("T")[0] : ""}
                    onChange={(e) => onInputChange(experience.id, "startDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>End Date</label>
                <div className="input-with-icon">
                  <input
                    type="date"
                    value={experience.endDate ? experience.endDate.split("T")[0] : ""}
                    onChange={(e) => onInputChange(experience.id, "endDate", e.target.value)}
                    disabled={experience.isCurrentRole}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  checked={experience.isCurrentRole}
                  onChange={() => onToggleCurrentRole(experience.id)}
                />
                I currently work here
              </div>
            </div>

            <div className="form-group-project">
              <div className="editor-toolbar">
                <button className="ai-button" onClick={() => onAIWriting(experience.id)}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Write with AI
                </button>
              </div>
              <textarea
                rows="4"
                value={experience.description}
                onChange={(e) => onInputChange(experience.id, "description", e.target.value)}
                placeholder="Describe your role and responsibilities..."
              />
            </div>
          </div>
        )}
      </div>
    )
  },
)
WorkExperienceItem.displayName = "WorkExperienceItem"

function WorkExperience() {
  const {
    workExperience,
    addExperience,
    updateExperience,
    deleteExperience,
    toggleExperience,
    toggleCurrentRole,
    updateField,
  } = useWorkExperience()
  const [showGuidance, setShowGuidance] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { id: resumeId } = useParams()
  const { saveAnalysis } = useAnalysis()
  const [globalError, setGlobalError] = useState("")

  // Validation state
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  // AI Writing Modal state
  const [showAIWriting, setShowAIWriting] = useState(false)
  const [activeExperienceId, setActiveExperienceId] = useState(null)

  // Initialize errors and touched state when workExperience changes
  useEffect(() => {
    const newErrors = {}
    const newTouched = {}

    workExperience.forEach((exp) => {
      newErrors[exp.id] = validateExperience(exp)
      newTouched[exp.id] = newTouched[exp.id] || { title: false, company: false }
    })

    setErrors(newErrors)
    setTouched((prevTouched) => ({
      ...prevTouched,
      ...newTouched,
    }))
  }, [workExperience])

  // Validation function for a single experience
  const validateExperience = (experience) => {
    const errors = {}

    // Validate title
    if (!experience.title) {
      errors.title = "Job title is required"
    } else if (/[^a-zA-Z0-9\s\-.,&()']/.test(experience.title)) {
      errors.title = "Job title contains invalid characters"
    }

    // Validate company
    if (!experience.company) {
      errors.company = "Company name is required"
    } else if (/[^a-zA-Z0-9\s\-.,&()']/.test(experience.company)) {
      errors.company = "Company name contains invalid characters"
    }

    return errors
  }

  // Set a field as touched
  const setFieldTouched = (experienceId, field) => {
    setTouched((prev) => ({
      ...prev,
      [experienceId]: {
        ...prev[experienceId],
        [field]: true,
      },
    }))
  }

  // Check if the form has any errors
  const hasErrors = () => {
    return Object.values(errors).some((expErrors) => Object.keys(expErrors).length > 0)
  }

  // Mark all fields as touched
  const touchAllFields = () => {
    const allTouched = {}
    workExperience.forEach((exp) => {
      allTouched[exp.id] = {
        title: true,
        company: true,
      }
    })
    setTouched(allTouched)
  }

  const handleDeleteExperience = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete this experience?")) {
        deleteExperience(id)

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
    [deleteExperience],
  )

  const handleToggleExperience = useCallback(
    (id) => {
      toggleExperience(id)
    },
    [toggleExperience],
  )

  const handleInputChange = useCallback(
    (id, field, value) => {
      updateField(id, field, value)

      // Update validation for this field
      if (field === "title" || field === "company") {
        setErrors((prev) => {
          const updatedExp = { ...workExperience.find((exp) => exp.id === id), [field]: value }
          const expErrors = validateExperience(updatedExp)
          return {
            ...prev,
            [id]: expErrors,
          }
        })
      }
    },
    [updateField, workExperience],
  )

  const handleToggleCurrentRole = useCallback(
    (id) => {
      toggleCurrentRole(id)
    },
    [toggleCurrentRole],
  )

  const handleAIWriting = useCallback((experienceId) => {
    setActiveExperienceId(experienceId)
    setShowAIWriting(true)
  }, [])

  const handleSaveAIWriting = useCallback(
    (text) => {
      updateField(activeExperienceId, "description", text)
      setShowAIWriting(false)
      setActiveExperienceId(null)
    },
    [activeExperienceId, updateField],
  )

  const handleSave = async () => {
    // Set form as submitted to show all errors
    setFormSubmitted(true)

    // Validate all experiences, even if they're not open
    const allErrors = {}
    let hasValidationErrors = false

    workExperience.forEach((exp) => {
      const expErrors = validateExperience(exp)
      if (Object.keys(expErrors).length > 0) {
        hasValidationErrors = true
        allErrors[exp.id] = expErrors
      }
    })

    setErrors(allErrors)

    // Mark all fields as touched when saving
    touchAllFields()

    // If there are validation errors, show error and open experiences with errors
    if (hasValidationErrors) {
      setGlobalError("Please fix the validation errors before saving")

      // Open experiences with errors if they're closed
      workExperience.forEach((exp) => {
        if (allErrors[exp.id] && !exp.isOpen) {
          toggleExperience(exp.id)
        }
      })

      return
    }

    if (!resumeId) {
      setGlobalError("Resume ID is missing")
      return
    }

    try {
      setIsSaving(true)
      const response = await apiClient.post(`/api/resume/work-experience`, { workExperience, resumeId })

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save work experience")
      }
      saveAnalysis(resumeId)
      setGlobalError("")
      setFormSubmitted(false) // Reset form submitted state after successful save
    } catch (error) {
      console.error("Save error:", error)
      setGlobalError(error.message || "Failed to save work experience")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="work-experience-container">
      <Error message={globalError} />

      <div className="section-header">
        <div className="title-wrapper">
          <h2>Work Experience</h2>
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
        <button className="view-guidance-button-work" onClick={() => setShowGuidance(true)}>
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

      {workExperience.length === 0 && (
        <div className="empty-state">
          <p>No work experience added yet. Click the button below to add your first experience.</p>
        </div>
      )}

      {workExperience.map((experience) => (
        <WorkExperienceItem
          key={experience.id}
          experience={experience}
          onDelete={handleDeleteExperience}
          onToggle={handleToggleExperience}
          onInputChange={handleInputChange}
          onToggleCurrentRole={handleToggleCurrentRole}
          onAIWriting={handleAIWriting}
          errors={errors}
          touched={formSubmitted ? { [experience.id]: { title: true, company: true } } : touched}
          setFieldTouched={setFieldTouched}
        />
      ))}

      <div className="add-education-btn-cont">
        <button className="add-experience-button" onClick={addExperience}>
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
          Add Experience
        </button>
      </div>

      <button className="section-save-button" onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Work Experience"}
      </button>

      {showGuidance && (
        <GuidanceModal
          title="Work Experience"
          onClose={() => setShowGuidance(false)}
          guidanceData={guidanceData.workExperience}
        />
      )}

      {showAIWriting && activeExperienceId && (
        <AIWritingWorkExpModal
          onClose={() => {
            setShowAIWriting(false)
            setActiveExperienceId(null)
          }}
          initialText={workExperience.find((e) => e.id === activeExperienceId)?.description || ""}
          onSave={handleSaveAIWriting}
          workExp={workExperience.find((e) => e.id === activeExperienceId)}
        />
      )}
    </div>
  )
}

export default memo(WorkExperience)

