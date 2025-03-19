"use client"

import { createContext, useContext, useReducer, useCallback } from "react"
import { analysisReducer, initialAnalysisState, ANALYSIS_ACTIONS } from "@/reducers/resume/analysis-reducer"
import apiClient from "@/lib/apiClient"

const AnalysisContext = createContext()

export const AnalysisProvider = ({ children }) => {
  const [analysis, dispatch] = useReducer(analysisReducer, initialAnalysisState)

  // Memoize functions to prevent unnecessary re-renders
  const updateOverallScore = useCallback((score) => {
    dispatch({
      type: ANALYSIS_ACTIONS.UPDATE_OVERALL_SCORE,
      payload: score,
    })
  }, [])

  const updateSectionScore = useCallback((section, score) => {
    dispatch({
      type: ANALYSIS_ACTIONS.UPDATE_SECTION_SCORE,
      payload: { section, score },
    })
  }, [])

  const updateKeywords = useCallback((keywords) => {
    dispatch({
      type: ANALYSIS_ACTIONS.UPDATE_KEYWORDS,
      payload: keywords,
    })
  }, [])

  const updateSkillsData = useCallback((skillsData) => {
    dispatch({
      type: ANALYSIS_ACTIONS.UPDATE_SKILLS_DATA,
      payload: skillsData,
    })
  }, [])

  const resetAnalysis = useCallback(() => {
    dispatch({ type: ANALYSIS_ACTIONS.RESET })
  }, [])

    //save sanlysis
  const saveAnalysis=async(resumeId)=>{
    try {
      console.log("saving analysis....")
      const response = await apiClient.post("/api/resume/analysis", {
        resumeId,
        analysisData:analysis,
      })
  
      if (response.data.success) {
        console.log("✅ Analysis saved:", response.data.data)
        return response.data.data
      } else {
        console.error("❌ Failed to save analysis:", response.data.message)
      }
    } catch (error) {
      console.error("❌ API error:", error.response?.data || error.message)
  }
}

  return (
    <AnalysisContext.Provider
      value={{
        analysis,
        updateOverallScore,
        updateSectionScore,
        updateKeywords,
        updateSkillsData,
        resetAnalysis,
        saveAnalysis
      }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}

export const useAnalysis = () => {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider")
  }
  return context
}

