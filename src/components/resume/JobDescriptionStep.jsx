"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJobInfo } from "@/context/resume/job-info-context";
import "@/css/resume/job-description-step.css";
import apiClient from "@/lib/apiClient";
import { useCustomization } from "@/context/resume/customization-context";

export default function JobDescriptionStep({ onNext, onBack }) {
  const { jobInfo, updateField } = useJobInfo();
  const router = useRouter(); // ✅ Use Next.js router for navigation
  const [loading, setLoading] = useState(false); // ✅ Track loading state
  const {customization}=useCustomization();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (jobInfo.jobDescription.trim()) {
      setLoading(true); // ✅ Disable buttons while fetching

      try {
        const jobTitle = jobInfo.jobTitle;
        const jobDescription = jobInfo.jobDescription;

        const res = await apiClient.post("/api/resume", {
          jobTitle,
          jobDescription,
          source: "scratch",
          customization
        });

        if (res.data.success) {
          console.log("✅ Resume Created:", res.data);
          return router.push(`/dashboard/resumedashboard/${res.data.id}`); // ✅ Redirect after success
        }
        setLoading(false); // ✅ Re-enable buttons after fetch
      } catch (error) {
        console.error("❌ Error creating resume:", error.response?.data || error.message);
        setLoading(false); // ✅ Re-enable buttons after fetch
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  return (
    <div className="job-description-container">
      <div className="job-description-content">
        <form onSubmit={handleSubmit}>
          <h1 className="section-heading">Target Job Description</h1>
          <p className="section-description">
            Enter the job description you're aiming for or targeting in your job search. This helps tailor your resume
            to match specific job requirements and increase your chances of getting noticed by employers.
          </p>

          <div className="form-group">
            <label htmlFor="jobDescription" className="form-label">
              Target Job Description
            </label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              className="form-textarea"
              placeholder="Paste the job description here..."
              value={jobInfo.jobDescription}
              onChange={handleInputChange}
              rows={6}
              required
              disabled={loading} // ✅ Disable while fetching
            />
          </div>

          <div className="navigation-buttons">
            <button type="button" className="previous-button" onClick={onBack} disabled={loading}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <button type="submit" className="continue-button" disabled={loading}>
              {loading ? "Processing..." : "Continue"} {/* ✅ Show loading state */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
