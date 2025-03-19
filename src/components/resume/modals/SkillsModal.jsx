"use client"

import { useState, useEffect, useRef } from "react"
import { FileText, Check, X } from "lucide-react"
import "@/css/resume/skills-modal.css"

export default function SkillsModal({
  onClose,
  initialMatchPercentage = 0,
  resumeData = null,
  skillsData = {
    strongMatch: [],
    partialMatch: [],
    missingMatch: [],
  },
  keywords = [],
}) {
  console.log("SkillsModal props:", {
    initialMatchPercentage,
    resumeData,
    skillsData,
    keywords,
  })
  const [activeTab, setActiveTab] = useState("job-description")
  const [matchPercentage, setMatchPercentage] = useState(initialMatchPercentage)
  const progressCircleRef = useRef(null)
  const percentageTextRef = useRef(null)

  // Set initial match percentage
  useEffect(() => {
    setMatchPercentage(initialMatchPercentage)
  }, [initialMatchPercentage])

  // Animate the progress circle when matchPercentage changes
  useEffect(() => {
    if (progressCircleRef.current && percentageTextRef.current) {
      let currentPercentage = 0
      const targetPercentage = matchPercentage

      const animateProgress = () => {
        if (currentPercentage < targetPercentage) {
          currentPercentage += 1

          const circumference = 2 * Math.PI * 15.9155
          const dashLength = (currentPercentage / 100) * circumference
          progressCircleRef.current.setAttribute("stroke-dasharray", `${dashLength}, ${circumference}`)

          percentageTextRef.current.textContent = `${currentPercentage}%`

          requestAnimationFrame(animateProgress)
        }
      }

      requestAnimationFrame(animateProgress)
    }
  }, [matchPercentage])

  return (
    <div className="modal-overlay">
      <div className="skills-modal">
        <div className="modal-header">
          <h2>Job Details</h2>
          <button className="close-button" onClick={onClose}>
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

        <div className="skills-overview">
          <div className="circular-progress">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <circle
                className="circle-bg"
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="#2A2A2A"
                strokeWidth="2.5"
                opacity="0.2"
              />
              <circle
                ref={progressCircleRef}
                className="circle-progress"
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="#0066ff"
                strokeWidth="2.5"
                strokeDasharray="0, 100"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
              <text
                ref={percentageTextRef}
                x="18"
                y="18.5"
                className="percentage"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                0%
              </text>
            </svg>
          </div>
          <span className="skill-type">Software</span>
        </div>

        <div className="match-legend">
          <div className="legend-item">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6" fill="#22c55e" />
              <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Strong match
          </div>
          <div className="legend-item">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6" fill="#f97316" />
              <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Partial match
          </div>
          <div className="legend-item">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6" fill="#ef4444" />
              <path
                d="M6 6L10 10M10 6L6 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Missing
          </div>
        </div>

        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === "job-description" ? "active" : ""}`}
            onClick={() => setActiveTab("job-description")}
          >
            Job Description
          </button>
          <button
            className={`tab-button ${activeTab === "keywords" ? "active" : ""}`}
            onClick={() => setActiveTab("keywords")}
          >
            Key words
          </button>
        </div>

        {activeTab === "job-description" ? (
          <div className="job-description-content">
            <p className="job-description-text">{resumeData?.jobDescription || "No job description available."}</p>
          </div>
        ) : (
          <div className="skills-sections">
            <div className="skills-section strong-match">
              <h3>Strong Match</h3>
              <div className="skills-table">
                <div className="table-header">
                  <div className="header-cell">Skill Name</div>
                  <div className="header-cell">Resume</div>
                  <div className="header-cell">JD</div>
                </div>
                {skillsData.strongMatch.length > 0 ? (
                  <div className="table-rows">
                    {skillsData.strongMatch.map((skill, index) => (
                      <div key={index} className="table-row">
                        <div className="cell">{skill.name}</div>
                        <div className="cell">
                          {skill.resume ? (
                            <Check size={16} className="check-icon" />
                          ) : (
                            <X size={16} className="x-icon" />
                          )}
                        </div>
                        <div className="cell">
                          {skill.jd ? <Check size={16} className="check-icon" /> : <X size={16} className="x-icon" />}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <FileText size={48} />
                    <span>No data</span>
                  </div>
                )}
              </div>
            </div>

            <div className="skills-section partial-match">
              <h3>Partial Match</h3>
              <div className="skills-table">
                <div className="table-header">
                  <div className="header-cell">Skill Name</div>
                  <div className="header-cell">Resume</div>
                  <div className="header-cell">JD</div>
                </div>
                {skillsData.partialMatch.length > 0 ? (
                  <div className="table-rows">
                    {skillsData.partialMatch.map((skill, index) => (
                      <div key={index} className="table-row">
                        <div className="cell">{skill.name}</div>
                        <div className="cell">
                          {skill.resume ? (
                            <Check size={16} className="check-icon" />
                          ) : (
                            <X size={16} className="x-icon" />
                          )}
                        </div>
                        <div className="cell">
                          {skill.jd ? <Check size={16} className="check-icon" /> : <X size={16} className="x-icon" />}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <FileText size={48} />
                    <span>No data</span>
                  </div>
                )}
              </div>
            </div>

            <div className="skills-section missing">
              <h3>Missing Keywords</h3>
              <div className="skills-table">
                <div className="table-header">
                  <div className="header-cell">Skill Name</div>
                  <div className="header-cell">Resume</div>
                  <div className="header-cell">JD</div>
                </div>
                {skillsData.missingMatch.length > 0 ? (
                  <div className="table-rows">
                    {skillsData.missingMatch.map((skill, index) => (
                      <div key={index} className="table-row">
                        <div className="cell">{skill.name}</div>
                        <div className="cell">
                          {skill.resume ? (
                            <Check size={16} className="check-icon" />
                          ) : (
                            <X size={16} className="x-icon" />
                          )}
                        </div>
                        <div className="cell">
                          {skill.jd ? <Check size={16} className="check-icon" /> : <X size={16} className="x-icon" />}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <FileText size={48} />
                    <span>No data</span>
                  </div>
                )}
              </div>
            </div>
            <div className="skills-section">
              <h3>Debug: Keywords List</h3>
              <div className="skills-table">
                <div className="table-header">
                  <div className="header-cell">Keyword</div>
                </div>
                {keywords && keywords.length > 0 ? (
                  <div className="table-rows">
                    {keywords.map((keyword, index) => (
                      <div key={index} className="table-row">
                        <div className="cell">{keyword}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <FileText size={48} />
                    <span>No keywords found</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

