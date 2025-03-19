"use client"
import { useState } from "react"
import "@/css/resume/ai-writing-modal.css"
import axios from "axios"
import apiClient from "@/lib/apiClient"

export default function AIWritingModal({ onClose, initialText, onSave,project }) {
  const [text, setText] = useState(initialText)
  const [activeAction, setActiveAction] = useState("") // Track active button
  const [loading, setLoading] = useState(false) // Track loading state

  // Function to call API based on action type
  const handleAction = async (action) => {
    try {
      setLoading(true) // Start loading
      setActiveAction(action) // Set active button

      // API request payload
      const payload = {
        actionType: action, // e.g., 'shorten', 'formal'
        project,
        text
      }

      // API call
      const response = await apiClient.post("/api/resume/ai/writeWithAi", payload)
      const { description } = response.data

      // Set AI-generated text in textarea
      setText(description)
    } catch (error) {
      console.error("Error generating description:", error)
      alert("Failed to generate description. Please try again.")
    } finally {
      setLoading(false) // Stop loading
    }
  }

  return (
    <div className="modal-overlay">
      <div className="ai-writing-modal">
        <div className="modal-header">
          <h2>Let's make some edit</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="edit-actions">
          <div className="action-row">
            {["casual", "formal", "short", "detailed", "rewritten"].map((action) => (
              <button
                key={action}
                onClick={() => handleAction(action)}
                className={`action-button-ai ${activeAction === action ? "active" : ""}`}
                disabled={loading} // Disable button while loading
              >
                {loading && activeAction === action ? "Loading..." : `Make it ${action}`}
              </button>
            ))}
          </div>
        </div>

        <div className="review-section">
          <h3>Review and Edit</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Enter your text here..."
          />
        </div>

        <div className="save-button-wrapper">
          <button className="save-button" onClick={() => onSave(text)}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
