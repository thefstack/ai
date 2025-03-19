"use client"

import { useState } from "react"
import GuidanceModal from "./modals/GuidanceModal"

const ResumeAnalysis = () => {
  const [showGuidance, setShowGuidance] = useState(false)
  const [guidanceData, setGuidanceData] = useState({
    resumeAnalysis: {
      // Example data, replace with your actual data structure
      title: "Resume Analysis Guidance",
      sections: [
        {
          tabName: "analysis",
          content: "This is the analysis guidance content.",
        },
      ],
    },
  })

  return (
    <div>
      {/* Your component's content here, e.g., a button to trigger the modal */}
      <button onClick={() => setShowGuidance(true)}>Show Resume Analysis Guidance</button>

      {/* When rendering the modal */}
      {showGuidance && (
        <GuidanceModal
          title="Resume Analysis"
          onClose={() => setShowGuidance(false)}
          guidanceData={guidanceData.resumeAnalysis}
          defaultTab="analysis" // Analysis tab will be shown by default
        />
      )}
    </div>
  )
}

export default ResumeAnalysis

