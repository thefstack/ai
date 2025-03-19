"use client"
import { useState, memo, useCallback, useEffect } from "react"
import { useProjects } from "@/context/resume/projects-context"
import "@/css/resume/projects.css"
import GuidanceModal from "./modals/GuidanceModal"
import AIWritingModal from "./modals/AIWritingModal"
import { guidanceData } from "@/utils/guidance-data"
import { useParams } from "next/navigation"
import apiClient from "@/lib/apiClient"
import { useAnalysis } from "@/context/resume/analysis-context"
import Error from "../Error"

const ProjectItem = memo(
  ({
    project,
    onDelete,
    onToggle,
    onInputChange,
    onToggleCurrentProject,
    onAIWriting,
    onDescriptionChange,
    onAddTech,
    onRemoveTech,
    errors,
    touched,
    onBlur,
    formSubmitted,
  }) => {
    const [newTech, setNewTech] = useState("")

    const handleAddTech = (e) => {
      e.preventDefault()
      if (newTech.trim()) {
        onAddTech(project.id, newTech.trim())
        setNewTech("")
      }
    }

    // Check if field has error and should show it
    const hasFieldError = (field) => {
      return errors?.[project.id]?.[field] && (touched?.[project.id]?.[field] || formSubmitted)
    }

    return (
      <div className="project-item">
        <div className="project-header">
          <span>{project.title || `Add Projects`}</span>
          <div className="project-actions">
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
            <button className="action-button" onClick={() => onDelete(project.id)}>
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
            <button className="action-button" onClick={() => onToggle(project.id)}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: project.isOpen ? "rotate(180deg)" : "none" }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {project.isOpen && (
          <div className="project-form">
            {/* Project form fields */}
            <div className="form-group">
              <label>
                Project Title *
              </label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => onInputChange(project.id, "title", e.target.value)}
                onBlur={() => onBlur(project.id, "title")}
                placeholder="Enter project title"
                className={hasFieldError("title") ? "input-error" : ""}
              />
              {hasFieldError("title") && <div className="field-error-message">{errors[project.id].title}</div>}
            </div>

            <div className="form-group">
              <label>Project URL</label>
              <input
                type="url"
                value={project.url}
                onChange={(e) => onInputChange(project.id, "url", e.target.value)}
                placeholder="Enter project URL"
              />
            </div>

            <div className="form-group">
              <label>Organization</label>
              <input
                type="text"
                value={project.organization}
                onChange={(e) => onInputChange(project.id, "organization", e.target.value)}
                placeholder="Enter organization name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={project.city}
                  onChange={(e) => onInputChange(project.id, "city", e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={project.country}
                  onChange={(e) => onInputChange(project.id, "country", e.target.value)}
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={project.startDate ? project.startDate.split("T")[0] : ""}
                  onChange={(e) => onInputChange(project.id, "startDate", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={project.endDate ? project.endDate.split("T")[0] : ""}
                  onChange={(e) => onInputChange(project.id, "endDate", e.target.value)}
                  disabled={project.isCurrentProject}
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  checked={project.isCurrentProject}
                  onChange={() => onToggleCurrentProject(project.id)}
                />
                I am currently working on this project
              </div>
            </div>

            {/* Tech Stack Section */}
            <div className="form-group">
              <label>Tech Stack *</label>
              <div className="tech-stack-container">
                <div className="tech-stack-input-group">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add technology"
                    className="tech-input"
                  />
                  <button className="add-tech-button" onClick={handleAddTech}>
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
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="tech-tags">
                    {project.technologies.map((tech, index) => (
                      <div key={index} className="tech-tag">
                        <span>{tech}</span>
                        <button className="remove-tech-button" onClick={() => onRemoveTech(project.id, index)}>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="editor-toolbar">
              <label>
                Description *
              </label>
                <button className="ai-button" onClick={() => onAIWriting(project.id)}>
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
              style={{marginTop:10}}
                rows="4"
                value={project.description}
                onChange={(e) => onDescriptionChange(project.id, e.target.value)}
                onBlur={() => onBlur(project.id, "description")}
                placeholder="Write about your project..."
                className={hasFieldError("description") ? "input-error" : ""}
              />
              {hasFieldError("description") && (
                <div className="field-error-message">{errors[project.id].description}</div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  },
)
ProjectItem.displayName = "ProjectItem"

function Projects() {
  const {
    projects,
    updateProjects,
    addProject,
    deleteProject: deleteProjectContext,
    toggleProject: toggleProjectContext,
    updateField,
    toggleCurrentProject,
    updateDescription,
    addTechnology,
    removeTechnology,
  } = useProjects()
  const [showGuidance, setShowGuidance] = useState(false)
  const [showAIWriting, setShowAIWriting] = useState(false)
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const { id: resumeId } = useParams()
  const { saveAnalysis } = useAnalysis()

  // Validation states
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [globalError, setGlobalError] = useState(null)

  // Initialize errors and touched state when projects change
  useEffect(() => {
    const newErrors = {}
    const newTouched = {}

    projects.forEach((project) => {
      if (!newErrors[project.id]) {
        newErrors[project.id] = {}
      }
      if (!newTouched[project.id]) {
        newTouched[project.id] = {}
      }
    })

    setErrors(newErrors)
    setTouched(newTouched)
  }, [projects.length])

  // Validate a single project
  const validateProject = (project) => {
    const projectErrors = {}

    // Validate title
    if (!project.title || project.title.trim() === "") {
      projectErrors.title = "Project title is required"
    }

    // Validate description
    if (!project.description || project.description.trim() === "") {
      projectErrors.description = "Project description is required"
    }

    return projectErrors
  }

  // Validate all projects
  const validateAllProjects = () => {
    const newErrors = {}
    let hasErrors = false

    projects.forEach((project) => {
      const projectErrors = validateProject(project)
      if (Object.keys(projectErrors).length > 0) {
        hasErrors = true
        newErrors[project.id] = projectErrors
      }
    })

    setErrors(newErrors)
    return !hasErrors
  }

  // Handle field blur (mark as touched)
  const handleBlur = (projectId, field) => {
    setTouched((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: true,
      },
    }))

    // Validate the field on blur
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      const projectErrors = validateProject(project)
      setErrors((prev) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          [field]: projectErrors[field] || null,
        },
      }))
    }
  }

  const handleAIWriting = useCallback((projectId) => {
    setActiveProjectId(projectId)
    setShowAIWriting(true)
  }, [])

  const handleSaveAIWriting = useCallback(
    (text) => {
      updateDescription(activeProjectId, text)
      setShowAIWriting(false)
      setActiveProjectId(null)

      // Validate after AI writing
      const project = projects.find((p) => p.id === activeProjectId)
      if (project) {
        const projectErrors = validateProject({ ...project, description: text })
        setErrors((prev) => ({
          ...prev,
          [activeProjectId]: {
            ...prev[activeProjectId],
            description: projectErrors.description || null,
          },
        }))
      }
    },
    [activeProjectId, updateDescription, projects],
  )

  const handleDeleteProject = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete this project?")) {
        deleteProjectContext(id)

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
    [deleteProjectContext],
  )

  const handleToggleProject = useCallback(
    (id) => {
      toggleProjectContext(id)
    },
    [toggleProjectContext],
  )

  const handleInputChange = useCallback(
    (id, field, value) => {
      updateField(id, field, value)

      // Validate on change if the field has been touched
      if (touched[id]?.[field]) {
        const project = projects.find((p) => p.id === id)
        if (project) {
          const updatedProject = { ...project, [field]: value }
          const projectErrors = validateProject(updatedProject)
          setErrors((prev) => ({
            ...prev,
            [id]: {
              ...prev[id],
              [field]: projectErrors[field] || null,
            },
          }))
        }
      }
    },
    [updateField, touched, projects],
  )

  const handleToggleCurrentProject = useCallback(
    (id) => {
      toggleCurrentProject(id)
    },
    [toggleCurrentProject],
  )

  const handleAddTech = useCallback(
    (id, tech) => {
      addTechnology(id, tech)
    },
    [addTechnology],
  )

  const handleRemoveTech = useCallback(
    (id, index) => {
      removeTechnology(id, index)
    },
    [removeTechnology],
  )

  const handleSave = async () => {
    // Mark form as submitted to show all errors
    setFormSubmitted(true)

    // Validate all projects
    const isValid = validateAllProjects()

    if (!isValid) {
      setGlobalError("Please fix the validation errors before saving")

      // Open all projects with errors
      projects.forEach((project) => {
        if (errors[project.id] && Object.keys(errors[project.id]).length > 0 && !project.isOpen) {
          toggleProjectContext(project.id)
        }
      })

      return
    }

    try {
      setIsSaving(true)
      setGlobalError(null)

      const response = await apiClient.post(`/api/resume/projects`, { projects, resumeId })

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save project information")
      }

      // Reset form submitted state after successful save
      setFormSubmitted(false)
      saveAnalysis(resumeId)
    } catch (error) {
      console.error("Save error:", error)
      setGlobalError("Failed to save projects. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="projects-container">
      {/* Header section */}
      <div className="section-header">
        <div className="title-wrapper">
          <h2>Projects</h2>
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
        <button className="view-guidance-button-project" onClick={() => setShowGuidance(true)}>
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

      {/* Global error message */}
      {globalError && <Error message={globalError} />}

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="empty-state">
          <p>No projects added yet. Click the button below to add your first project.</p>
        </div>
      )}

      {/* Project list */}
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          onDelete={handleDeleteProject}
          onToggle={handleToggleProject}
          onInputChange={handleInputChange}
          onToggleCurrentProject={handleToggleCurrentProject}
          onAIWriting={handleAIWriting}
          onDescriptionChange={updateDescription}
          onAddTech={handleAddTech}
          onRemoveTech={handleRemoveTech}
          errors={errors}
          touched={touched}
          onBlur={handleBlur}
          formSubmitted={formSubmitted}
        />
      ))}

      {/* Add project button */}
      <div className="add-project-btn-cont">
        <button className="add-project-button" onClick={addProject}>
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
          Add Project
        </button>
      </div>

      <button className="section-save-button" onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Projects"}
      </button>

      {/* Modals */}
      {showGuidance && (
        <GuidanceModal title="Projects" onClose={() => setShowGuidance(false)} guidanceData={guidanceData.projects} />
      )}

      {showAIWriting && activeProjectId && (
        <AIWritingModal
          onClose={() => {
            setShowAIWriting(false)
            setActiveProjectId(null)
          }}
          initialText={projects.find((p) => p.id === activeProjectId)?.description || ""}
          onSave={handleSaveAIWriting}
          project={projects.find((p) => p.id === activeProjectId)}
        />
      )}
    </div>
  )
}

export default memo(Projects)

