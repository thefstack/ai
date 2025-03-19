"use client"
import { useCallback, useMemo, useState } from "react"
import "@/css/resume/add-category-modal.css"
import { useResumes } from "@/context/resume/resumes-context";
import { useParams } from "next/navigation";


export default function AddCategoryModal({ onClose, onAdd, existingCategories = [], isEditing = false }) {
  const [selectedCategories, setSelectedCategories] = useState(existingCategories)
  const [newCategory, setNewCategory] = useState("");
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
    if (newCategory.trim()) {
      handleAddCategory(newCategory.trim())
    }
    setNewCategory("")
  }

  const handleAddCategory = (category) => {
    if (!selectedCategories.includes(category)) {
      const newCategories = [...selectedCategories, category]
      setSelectedCategories(newCategories)
      onAdd(newCategories)
    }
  }

  const handleRemoveCategory = (categoryToRemove) => {
    const newCategories = selectedCategories.filter((cat) => cat !== categoryToRemove)
    setSelectedCategories(newCategories)
    onAdd(newCategories)
  }

  const handleSuggestionClick = (suggestion) => {
    if (selectedCategories.includes(suggestion)) {
      handleRemoveCategory(suggestion)
    } else {
      handleAddCategory(suggestion)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="add-category-modal">
        <div className="modal-header-category">
          <h2>{isEditing ? "Edit Categories" : "Add Category"}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="form-content">
          <p className="required-text">*Indicates required</p>

          <form onSubmit={handleSubmit} className="form-group">
            <label htmlFor="category">
              Category<span className="required">*</span>
            </label>
            <div className="input-with-button">
              <input
                type="text"
                id="category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category"
              />
              <button type="submit" className="add-button-category" disabled={!newCategory.trim()}>
                Add
              </button>
            </div>
          </form>

          {selectedCategories.length > 0 && (
            <div className="selected-categories">
              <p>Selected Categories:</p>
              <div className="categories-list">
                {selectedCategories.map((category, index) => (
                  <div key={index} className="category-chip">
                    {category}
                    <button className="remove-button" onClick={() => handleRemoveCategory(category)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="suggestions-section">
            <p>Suggested based on your profile</p>
            <div className="suggestions-list">
              {suggestions.map((suggestion, index) => {
                const isSelected = selectedCategories.includes(suggestion)
                return (
                  <button
                    key={index}
                    type="button"
                    className={`suggestion-chip-category ${isSelected ? "selected" : ""}`}
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

