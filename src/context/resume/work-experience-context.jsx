"use client"
import { createContext, useContext, useReducer, useMemo, useCallback } from "react"
import { workExperienceReducer, WORK_EXPERIENCE_ACTIONS } from "@/reducers/resume/work-experience-reducer"

const WorkExperienceContext = createContext()

export function WorkExperienceProvider({ children, initialData = null }) {
  const [workExperience, dispatch] = useReducer(workExperienceReducer, initialData?.workExperience || [])

  const addExperience = useCallback(() => {
    dispatch({ type: WORK_EXPERIENCE_ACTIONS.ADD_EXPERIENCE })
  }, [])

  const updateExperience = useCallback((experiences) => {
    dispatch({
      type: WORK_EXPERIENCE_ACTIONS.UPDATE_EXPERIENCE,
      payload: experiences,
    })
  }, [])

  const deleteExperience = useCallback((id) => {
    dispatch({
      type: WORK_EXPERIENCE_ACTIONS.DELETE_EXPERIENCE,
      payload: { id },
    })
  }, [])

  const toggleExperience = useCallback((id) => {
    dispatch({
      type: WORK_EXPERIENCE_ACTIONS.TOGGLE_EXPERIENCE,
      payload: { id },
    })
  }, [])

  const toggleCurrentRole = useCallback((id) => {
    dispatch({
      type: WORK_EXPERIENCE_ACTIONS.TOGGLE_CURRENT_ROLE,
      payload: { id },
    })
  }, [])

  const updateField = useCallback((id, field, value) => {
    dispatch({
      type: WORK_EXPERIENCE_ACTIONS.UPDATE_FIELD,
      payload: { id, field, value },
    })
  }, [])

  const value = useMemo(
    () => ({
      workExperience,
      addExperience,
      updateExperience,
      deleteExperience,
      toggleExperience,
      toggleCurrentRole,
      updateField,
    }),
    [
      workExperience,
      addExperience,
      updateExperience,
      deleteExperience,
      toggleExperience,
      toggleCurrentRole,
      updateField,
    ],
  )

  return <WorkExperienceContext.Provider value={value}>{children}</WorkExperienceContext.Provider>
}

export function useWorkExperience() {
  const context = useContext(WorkExperienceContext)
  if (!context) {
    throw new Error("useWorkExperience must be used within a WorkExperienceProvider")
  }
  return context
}

