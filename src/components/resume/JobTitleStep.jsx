"use client"
import { useJobInfo } from "@/context/resume/job-info-context"
import "@/css/resume/job-title-step.css"

export default function JobTitleStep({ onNext, onBack }) {
  const { jobInfo, updateField } = useJobInfo()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (jobInfo.jobTitle.trim()) {
      onNext()
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    updateField(name, value)
  }

  return (
    <div className="create-resume-container">
      <div className="create-resume-content">
        <h2 className="app-name">AI Resume Builder</h2>
        <h1 className="main-heading">
          Automate your CV creation
          <br />
          with our AI resume builder.
        </h1>
        <p className="subtitle">
          Some people simply don't enjoy writing resumes as much as we do.
          <br />
          That's okay. Our AI Resume Writer is for you.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="section-heading">Target Job</h2>
            <p className="section-description">
              Enter the job title you're aiming for or targeting in your job search. This helps tailor your job search
              and alerts to match your career goals.
            </p>

            <div className="form-group">
              <label htmlFor="jobTitle" className="form-label">
                Target Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                className="form-input"
                placeholder="Enter your target job title"
                value={jobInfo.jobTitle}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="navigation-buttons">
              <button type="submit" className="continue-button">
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

