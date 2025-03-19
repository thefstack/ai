"use client"
import { useState, memo, useCallback, useEffect } from "react"
import { useSkills } from "@/context/resume/skills-context"
import "@/css/resume/skills.css"
import GuidanceModal from "./modals/GuidanceModal"
import AddCategoryModal from "./modals/AddCategoryModal"
import AddSkillModal from "./modals/AddSkillModal"
import { guidanceData } from "@/utils/guidance-data"
import apiClient from "@/lib/apiClient"
import { useParams } from "next/navigation"
import { useAnalysis } from "@/context/resume/analysis-context"

const SkillsInput = memo(({ label, value, onClick, onEdit, placeholder }) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <div className="input-wrapper">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          readOnly
          onClick={onClick}
          className={`${label.toLowerCase()}-input`}
        />
        <div className="input-actions">
          <button className="action-button" onClick={onEdit}>
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
          </button>
          <button className="action-button" onClick={onClick}>
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
          </button>
        </div>
      </div>
    </div>
  )
})
SkillsInput.displayName = "SkillsInput"

function Skills() {
  const { skills, updateCategories, updateSkills, updateCategorySkillsMap, updateUncategorizedSkills } = useSkills()

  const [showGuidance, setShowGuidance] = useState(false)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showAddSkillModal, setShowAddSkillModal] = useState(false)
  const [isEditingCategories, setIsEditingCategories] = useState(false)
  const [isEditingSkills, setIsEditingSkills] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const {saveAnalysis}=useAnalysis()
  const { id: resumeId } = useParams()

  // Initialize state if needed
  useEffect(() => {
    if (!skills.categorySkillsMap) {
      updateCategorySkillsMap({})
    }
    if (!skills.uncategorizedSkills) {
      updateUncategorizedSkills([])
    }
  }, [skills, updateCategorySkillsMap, updateUncategorizedSkills])

  const handleAddCategory = useCallback(
    (categoryOrCategories) => {
      console.log("🟢 Before Update - Categories:", skills.categories)
      updateCategories(
        Array.isArray(categoryOrCategories) ? categoryOrCategories : [...skills.categories, categoryOrCategories],
      )
      console.log(
        "🔵 After Update - Categories:",
        Array.isArray(categoryOrCategories) ? categoryOrCategories : [...skills.categories, categoryOrCategories],
      )
    },
    [skills.categories, updateCategories],
  )
  useEffect(() => {
    console.log("🟢 Skills complete data:", skills )

  },[skills, updateCategories, updateSkills, updateCategorySkillsMap, updateUncategorizedSkills])

  const handleSelectCategory = (category) => {
    setSelectedCategory(category)
    setShowAddSkillModal(true)
  }

  const handleAddSkill = useCallback(
    (skillOrSkills) => {
      if (selectedCategory) {
        // Add skills to the selected category
        const updatedMap = { ...skills.categorySkillsMap }

        if (Array.isArray(skillOrSkills)) {
          updatedMap[selectedCategory] = skillOrSkills
        } else {
          if (!updatedMap[selectedCategory]) {
            updatedMap[selectedCategory] = []
          }

          if (!updatedMap[selectedCategory].includes(skillOrSkills)) {
            updatedMap[selectedCategory] = [...updatedMap[selectedCategory], skillOrSkills]
          }
        }

        updateCategorySkillsMap(updatedMap)
        console.log("Updated category skills map:", updatedMap)
      } else {
        // Add to uncategorized skills
        let updatedUncategorizedSkills

        if (Array.isArray(skillOrSkills)) {
          updatedUncategorizedSkills = skillOrSkills
        } else {
          updatedUncategorizedSkills = [...(skills.uncategorizedSkills || [])]
          if (!updatedUncategorizedSkills.includes(skillOrSkills)) {
            updatedUncategorizedSkills.push(skillOrSkills)
          }
        }

        updateUncategorizedSkills(updatedUncategorizedSkills)
        console.log("Updated uncategorized skills:", updatedUncategorizedSkills)
      }
    },
    [
      selectedCategory,
      skills.categorySkillsMap,
      skills.uncategorizedSkills,
      updateCategorySkillsMap,
      updateUncategorizedSkills,
    ],
  )

  const handleEditCategories = useCallback(() => {
    setIsEditingCategories(true)
    setShowAddCategoryModal(true)
  }, [])

  const handleEditSkills = useCallback(() => {
    setIsEditingSkills(true)
    setSelectedCategory(null) // Edit all uncategorized skills
    setShowAddSkillModal(true)
  }, [])

  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Log the complete skills data structure
      console.log("Saving skills data:", skills)

      const response = await apiClient.post(`/api/resume/skills`, {
        skills,
        resumeId,
      })

      saveAnalysis(resumeId);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save skills information")
      }
    } catch (error) {
      console.error("Save error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Format the display of skills for a category
  const getCategorySkillsDisplay = (category) => {
    if (!skills.categorySkillsMap?.[category] || skills.categorySkillsMap[category].length === 0) {
      return "No skills added"
    }
    return skills.categorySkillsMap[category].join(" | ")
  }

  return (
    <div className="skills-container">
      <div className="skills-header">
        <div className="title-wrapper">
          <h2>Skills</h2>
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
        <button className="view-guidance-button-skill" onClick={() => setShowGuidance(true)}>
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

      <div className="skills-form">
        <SkillsInput
          label="Category"
          value={skills.categories?.join(" | ") || ""}
          onClick={() => {
            setIsEditingCategories(false)
            setShowAddCategoryModal(true)
          }}
          onEdit={handleEditCategories}
          placeholder="Add Category"
        />

        {/* Display categories and their skills */}
        {skills.categories?.length > 0 && (
          <div className="categories-skills-section">
            <h3>Category Skills</h3>
            {skills.categories.map((category, index) => (
              <div key={index} className="category-skills-item">
                <div className="category-name">{category}</div>
                <div className="category-skills">
                  <div className="skills-display">{getCategorySkillsDisplay(category)}</div>
                  <button className="add-skills-button" onClick={() => handleSelectCategory(category)}>
                    Add Skills
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Uncategorized Skills */}
        <div className="uncategorized-skills-section">
          <h3>Other Skills</h3>
          <SkillsInput
            label="Skill"
            value={skills.uncategorizedSkills?.join(" | ") || ""}
            onClick={() => {
              setIsEditingSkills(false)
              setSelectedCategory(null)
              setShowAddSkillModal(true)
            }}
            onEdit={handleEditSkills}
            placeholder="Add Skill"
          />
        </div>
      </div>

      <button className="section-save-button" onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Skills"}
      </button>

      {showGuidance && (
        <GuidanceModal title="Skills" onClose={() => setShowGuidance(false)} guidanceData={guidanceData.skills} />
      )}

      {showAddCategoryModal && (
        <AddCategoryModal
          onClose={() => {
            setShowAddCategoryModal(false)
            setIsEditingCategories(false)
          }}
          onAdd={handleAddCategory}
          existingCategories={skills.categories || []}
          isEditing={isEditingCategories}
        />
      )}

      {showAddSkillModal && (
        <AddSkillModal
          onClose={() => {
            setShowAddSkillModal(false)
            setIsEditingSkills(false)
            setSelectedCategory(null)
          }}
          onAdd={handleAddSkill}
          existingSkills={
            selectedCategory ? skills.categorySkillsMap?.[selectedCategory] || [] : skills.uncategorizedSkills || []
          }
          isEditing={isEditingSkills}
          categoryName={selectedCategory}
        />
      )}
    </div>
  )
}

export default memo(Skills)

