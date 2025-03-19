"use client"
import { useState, useEffect, useMemo, useRef } from "react"
import GuidanceModal from "./modals/GuidanceModal"
import SkillsModal from "./modals/SkillsModal"
import { guidanceData } from "@/utils/guidance-data"
import { calculateResumeScore } from "@/utils/resume-score-calculations"
import { calculateSkillsScore } from "@/utils/skills-match-calculations"
import "@/css/resume/score-cards.css"
import { useResumes } from "@/context/resume/resumes-context"
import { useParams } from "next/navigation"
import { useAnalysis } from "@/context/resume/analysis-context"
import { useCertifications } from "@/context/resume/certifications-context"
import { useEducation } from "@/context/resume/education-context"
import { useWorkExperience } from "@/context/resume/work-experience-context"
import { useProjects } from "@/context/resume/projects-context"
import { usePersonalInfo } from "@/context/resume/personal-info-context"
import { useSkills } from "@/context/resume/skills-context"
import { useCustomSections } from "@/context/resume/custom-sections-context"
import apiClient from "@/lib/apiClient"

export default function ScoreCards() {
  const [showGuidance, setShowGuidance] = useState(false)
  const [showSkillsModal, setShowSkillsModal] = useState(false)

  // Local state for scores - we'll use these instead of directly updating the context in useEffect
  const [resumeScore, setResumeScore] = useState(0)
  const [skillsScore, setSkillsScore] = useState(0)
  const [skillsData, setSkillsData] = useState({
    strongMatch: [],
    partialMatch: [],
    missingMatch: [],
  })

  // Use a ref to track the current resume to avoid dependency issues
  const currentResumeRef = useRef(null)

  // Get data from contexts
  const { resumes } = useResumes()
  const { id } = useParams()
  const { analysis, updateOverallScore, updateKeywords, updateSectionScore, updateSkillsData } = useAnalysis()
  const { personalInfo } = usePersonalInfo()
  const { sections } = useCustomSections()
  const { workExperience: experience } = useWorkExperience()
  const { education } = useEducation()
  const { certifications } = useCertifications()
  const { skills } = useSkills()
  const { projects } = useProjects()

  // Find the current resume
  const currentResume = useMemo(() => {
    const resume = resumes?.find((r) => r._id === id) || null
    currentResumeRef.current = resume
    return resume
  }, [resumes, id])

  // Update keywords when resume changes
  useEffect(() => {
    if (currentResume?.keywords?.length > 0) {
      updateKeywords(currentResume.keywords)
    }
  }, [currentResume, updateKeywords])

  // Calculate scores when data changes
  useEffect(() => {
    // Skip if no resume
    if (!currentResumeRef.current) {
      setResumeScore(0)
      setSkillsScore(0)
      return
    }

    // Calculate overall resume score
    const overallScore = calculateResumeScore(
      currentResumeRef.current,
      personalInfo,
      experience,
      education,
      certifications,
      skills,
      projects,
      sections,
    )

    // Calculate skills match score and data
    const skillsResult = calculateSkillsScore(
      currentResumeRef.current,
      personalInfo,
      experience,
      education,
      certifications,
      skills,
      projects,
      sections,
    )

    // Update local state
    setResumeScore(overallScore)
    setSkillsScore(skillsResult.score)
    setSkillsData(skillsResult.skillsData)
  }, [personalInfo, experience, education, certifications, skills, projects, sections])

  // Update context from local state - this separates the calculation from the context updates
  useEffect(() => {
    // Only update if we have valid scores
    if (resumeScore !== undefined) {
      updateOverallScore(resumeScore)
    }

    if (skillsScore !== undefined) {
      updateSectionScore("skills", skillsScore)
    }

    if (skillsData) {
      updateSkillsData(skillsData)
    }
  }, [resumeScore, skillsScore, skillsData, updateOverallScore, updateSectionScore, updateSkillsData])



  return (
    <div className="score-cards">
      <div className="score-card">
        <div className="score-header">
          <div className="icon-wrapper">
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2>Resume Analysis Score</h2>
        </div>

        <div className="text-progresss-wrapper">
          <p className="score-description">
            Aim for a higher score for an optimized resume which follows best practices
          </p>

          <div className="score-content" data-percentage={`${resumeScore}%`}>
            <div className="circular-progress">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <circle
                  className="circle-bg"
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="2.5"
                />
                <circle
                  className="circle-progress"
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#0066ff"
                  strokeWidth="2.5"
                  strokeDasharray={`${resumeScore}, 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
                <text x="18" y="18.5" className="percentage" textAnchor="middle" dominantBaseline="middle">
                  {resumeScore}%
                </text>
              </svg>
            </div>
          </div>
        </div>

        <button className="view-button" onClick={() => setShowGuidance(true)}>
          View Guidance
        </button>
      </div>

      <div className="score-card">
        <div className="score-header">
          <div className="icon-wrapper">
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
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </div>
          <h2>Skills Score</h2>
        </div>

        <div className="text-progresss-wrapper">
          <p className="score-description">
            Aim for a higher score for an optimized resume which follows best practices
          </p>

          <div className="score-content" data-percentage={`${skillsScore}%`}>
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
                  className="circle-progress"
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#0066ff"
                  strokeWidth="2.5"
                  strokeDasharray={`${skillsScore}, 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
                <text x="18" y="18.5" className="percentage" textAnchor="middle" dominantBaseline="middle">
                  {skillsScore}%
                </text>
              </svg>
            </div>
          </div>
        </div>

        <button className="view-button" onClick={() => setShowSkillsModal(true)}>
          View Details
        </button>
      </div>

      {showGuidance && (
        <GuidanceModal
          title="Resume Analysis"
          onClose={() => setShowGuidance(false)}
          guidanceData={guidanceData.resumeAnalysis}
        />
      )}

      {showSkillsModal && (
        <SkillsModal
          onClose={() => setShowSkillsModal(false)}
          initialMatchPercentage={skillsScore}
          resumeData={currentResumeRef.current}
          skillsData={skillsData}
          keywords={currentResumeRef.current?.keywords || []}
        />
      )}
    </div>
  )
}

