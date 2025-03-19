"use client"
import { useCallback, useMemo, useState } from "react"
import "@/css/resume/add-skill-modal.css"
import { useResumes } from "@/context/resume/resumes-context"
import { useParams } from "next/navigation"

export default function AddSkillModal({ onClose, onAdd, existingSkills = [], isEditing = false, categoryName = null }) {
  const [selectedSkills, setSelectedSkills] = useState(existingSkills)
  const [newSkill, setNewSkill] = useState("")

  const {resumes}=useResumes();
    const {id}=useParams()
  
    // Memoize the current resume to avoid unnecessary re-renders
      const findCurrentResume = useCallback((resumesList, resumeId) => {
        return resumesList?.find((resume) => resume._id === resumeId) || null
      }, [])
  
        // Memoize the current resume
        const memoizedCurrentResume = useMemo(() => {
          return findCurrentResume(resumes, id)
        }, [resumes, id, findCurrentResume])
  
    console.log("keywords in category :",memoizedCurrentResume)
    const suggestions = memoizedCurrentResume.keywords;

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newSkill.trim()) {
      handleAddSkill(newSkill.trim())
      setNewSkill("")
    }
  }

  const handleAddSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill]
      setSelectedSkills(newSkills)
      onAdd(newSkills)
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    const newSkills = selectedSkills.filter((skill) => skill !== skillToRemove)
    setSelectedSkills(newSkills)
    onAdd(newSkills)
  }

  const handleSuggestionClick = (suggestion) => {
    if (selectedSkills.includes(suggestion)) {
      handleRemoveSkill(suggestion)
    } else {
      handleAddSkill(suggestion)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="add-skill-modal">
        <div className="modal-header">
          <h2>
            {isEditing ? "Edit Skills" : "Add Skills"}
            {categoryName && <span className="category-label"> for {categoryName}</span>}
          </h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="form-content">
          <p className="required-text">*Indicates required</p>

          <form onSubmit={handleSubmit} className="form-group">
            <label htmlFor="skill">
              Skill<span className="required">*</span>
            </label>
            <div className="input-with-button">
              <input
                type="text"
                id="skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter skill"
              />
              <button type="submit" className="add-button-skill" disabled={!newSkill.trim()}>
                Add
              </button>
            </div>
          </form>

          {selectedSkills.length > 0 && (
            <div className="selected-skills">
              <p>Selected Skills:</p>
              <div className="skills-list">
                {selectedSkills.map((skill, index) => (
                  <div key={index} className="skill-chip">
                    {skill}
                    <button className="remove-button" onClick={() => handleRemoveSkill(skill)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="suggestions-section">
            <p>Suggested Skills</p>
            <div className="suggestions-list">
              {suggestions.map((suggestion, index) => {
                const isSelected = selectedSkills.includes(suggestion)
                return (
                  <button
                    key={index}
                    type="button"
                    className={`suggestion-chip ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

