"use client"
import { useState, useRef, useEffect } from "react"
import { useCustomSections } from "@/context/resume/custom-sections-context"
import "@/css/resume/new-section.css"
import { useParams } from "next/navigation"
import apiClient from "@/lib/apiClient"

export default function NewSection({ sectionId }) {
  const { sections, updateSection, deleteSection, addBullet, updateBullet, deleteBullet, setSections } = useCustomSections()

  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const modalRef = useRef(null)

  const { id: resumeId } = useParams(); // ✅ Extract resumeId from URL

  // Find the current section
  const section = sections.find((s) => s.id === sectionId) || {
    title: "New Section",
    description: "",
    bullets: [],
  }

  // Handle click outside to close modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowDeleteModal(false)
      }
    }

    if (showDeleteModal) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDeleteModal])

  // Handle escape key to close modal
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        setShowDeleteModal(false)
      }
    }

    if (showDeleteModal) {
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [showDeleteModal])

  const handleTitleChange = (e) => {
    updateSection(sectionId, { title: e.target.value })
  }

  const handleDescriptionChange = (e) => {
    updateSection(sectionId, { description: e.target.value })
  }

  const handleAddBullet = () => {
    addBullet(sectionId)
  }

  const handleBulletChange = (bulletId, text) => {
    updateBullet(sectionId, bulletId, text)
  }

  const handleDeleteBullet = (bulletId) => {
    deleteBullet(sectionId, bulletId)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      console.log("Before Saving section", section)
      const response = await apiClient.post("api/resume/custom-sections", {
        resumeId, 
        section,
      });
      console.log(response)
      setSections(response.data.CustomSections)
    } catch (error) {
      console.error("Error saving section:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteSection = async() => {
    try {
      setIsSaving(true);
      const response = await apiClient.delete("api/resume/custom-sections", {
        data: { resumeId, sectionId },
      });
      console.log(response);
      deleteSection(sectionId);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting section:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="new-section">
      <div className="section-header">
        <input
          type="text"
          className="section-title-input"
          value={section.title}
          onChange={handleTitleChange}
          placeholder="Section Title"
        />
        <div className="section-actions">
          <button className="delete-section-btn" onClick={() => setShowDeleteModal(true)}>
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
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Delete Section
          </button>
        </div>
      </div>

      <div className="section-description">
        <textarea
          className="description-textarea"
          value={section.description}
          onChange={handleDescriptionChange}
          placeholder="Section description (optional)"
          rows={3}
        />
      </div>

      <div className="section-bullets">
        <div className="bullets-header">
          <h3>Bullet Points</h3>
          <button className="add-bullet-btn" onClick={handleAddBullet}>
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
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Add Bullet Point
          </button>
        </div>

        <ul className="bullets-list">
          {section.bullets.map((bullet) => (
            <li key={bullet.id} className="bullet-item">
              <div className="bullet-content">
                <span className="bullet-marker">•</span>
                <textarea
                  className="bullet-textarea"
                  value={bullet.text}
                  onChange={(e) => handleBulletChange(bullet.id, e.target.value)}
                  placeholder="Enter bullet point text"
                  rows={2}
                />
              </div>
              <button className="delete-bullet-btn" onClick={() => handleDeleteBullet(bullet.id)}>
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </button>
            </li>
          ))}
          {section.bullets.length === 0 && (
            <li className="no-bullets">No bullet points yet. Click "Add Bullet Point" to add one.</li>
          )}
        </ul>
      </div>

      <div className="section-footer">
        <button className="save-section-btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Section"}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-container" ref={modalRef}>
            <div className="delete-modal-header">
              <h3>Delete Confirmation</h3>
              <button className="close-button" onClick={() => setShowDeleteModal(false)}>
                <svg
                  width="24"
                  height="24"
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
            <div className="delete-modal-content">
              <div className="warning-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <p>
                Are you sure you want to delete <strong>{section.title || "this section"}</strong>?
                <br />
                This action cannot be undone.
              </p>
            </div>
            <div className="delete-modal-actions">
              <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="delete-button" onClick={handleDeleteSection}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

