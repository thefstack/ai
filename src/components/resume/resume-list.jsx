"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useResumes } from "@/context/resume/resumes-context"
import "@/css/resume/resume-list.css"
import "@/css/resume/error.css"
import CreateResume from "./CreateResume"
import EditResumeBuilder from "./edit-resume"
import { Filter, X } from "lucide-react"

export default function ResumeList() {
  const router = useRouter()
  const { resumes, loading, error, deleteResume, fetchResumes } = useResumes()

  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  })
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [initialResumeData, setInitialResumeData] = useState(null)
  const [filterSource, setFilterSource] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter resumes based on search term and source
  const filteredResumes = resumes.filter(
    (resume) =>
      (resume.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.personalInfo?.headline?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterSource === "" || resume.source === filterSource),
  )

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilterSource(event.target.value)
  }

  // Handle sorting
  const handleSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get sorted resumes
  const getSortedResumes = () => {
    if (!sortConfig.key) return filteredResumes

    return [...filteredResumes].sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      // Handle nested properties
      if (sortConfig.key === "headline") {
        aValue = a.personalInfo?.headline
        bValue = b.personalInfo?.headline
      }

      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1
      return 0
    })
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await deleteResume(id)
      } catch (err) {
        alert("Failed to delete resume: " + err.message)
      }
    }
  }

  // Handle edit
  const handleEdit = (resume) => {
    console.log(resume)
    router.push(`resumedashboard/${resume._id}`)
  }

  // Get sort direction indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓"
    }
    return "↕"
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading resumes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    )
  }

  return (
    <>
      {showCreateResume ? (
        initialResumeData ? (
          <EditResumeBuilder
            resumeData={initialResumeData}
            onBack={() => {
              setShowCreateResume(false)
              setInitialResumeData(null)
            }}
          />
        ) : (
          <CreateResume />
        )
      ) : (
        <div className="resume-container">
          <header className="resume-header">
            <h1>All Resumes</h1>
            <div className="search-section">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by Resume Title or Job Title"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button className="search-button">
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
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>
              <div className="header-buttons">
                <button className="filter-button" onClick={() => setIsFilterOpen(true)}>
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="create-button" onClick={() => setShowCreateResume(true)}>
                  <span>+</span> Create New Resume
                </button>
              </div>
            </div>
          </header>

          <div className="table-container">
            {getSortedResumes().length === 0 ? (
              <div className="no-resumes">
                <p>No resumes found. Create a new resume or try a different search term.</p>
              </div>
            ) : (
              <table className="resume-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("headline")}>
                      Resume Title <span>{getSortIndicator("headline")}</span>
                    </th>
                    <th onClick={() => handleSort("analysisScore")}>
                      Score <span>{getSortIndicator("analysisScore")}</span>
                    </th>
                    <th onClick={() => handleSort("createdAt")}>
                      Created <span>{getSortIndicator("createdAt")}</span>
                    </th>
                    <th onClick={() => handleSort("updatedAt")}>
                      Modified <span>{getSortIndicator("updatedAt")}</span>
                    </th>
                    <th onClick={() => handleSort("jobTitle")}>
                      Job Title <span>{getSortIndicator("jobTitle")}</span>
                    </th>
                    <th onClick={() => handleSort("source")}>
                      Source <span>{getSortIndicator("source")}</span>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedResumes().map((resume) => (
                    <tr key={resume._id}>
                      <td>{resume.personalInfo?.headline || "Untitled"}</td>
                      <td>
                        <div className="progress-bar">
                          <div className="progress" style={{ width: `${resume.analysis?.overallScore || 0}%` }}></div>
                        </div>
                      </td>
                      <td>{new Date(resume.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(resume.updatedAt).toLocaleDateString()}</td>
                      <td>{resume.jobTitle}</td>
                      <td>{resume.source}</td>
                      <td className="actions">
                        <button
                          className="action-button delete"
                          onClick={() => handleDelete(resume._id)}
                          title="Delete Resume"
                        >
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
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                        <button className="action-button edit" onClick={() => handleEdit(resume)} title="Edit Resume">
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
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      <div className={`filter-sidebar ${isFilterOpen ? "show-sidebar" : ""}`}>
        <div className="filter-header">
          <h3 className="filter-text">Filter Options</h3>
          <X className="close-icon" onClick={() => setIsFilterOpen(false)} />
        </div>
        <label style={{ color: "#003954", fontSize: 13 }}>Sort by Source:</label>
        <select className="filter-dropdown" value={filterSource} onChange={handleFilterChange}>
          <option value="">All Sources</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Indeed">Indeed</option>
          <option value="Scratch">Scratch</option>
          <option value="Referral">Referral</option>
          <option value="Company Portal">Company Portal</option>
        </select>
      </div>
    </>
  )
}

