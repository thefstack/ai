"use client"
import { createContext, useContext, useReducer, useMemo, useCallback } from "react"
import { skillsReducer, SKILLS_ACTIONS } from "@/reducers/resume/skills-reducer"

const SkillsContext = createContext()

export function SkillsProvider({ children, initialData = null }) {
  const [skills, dispatch] = useReducer(
    skillsReducer,
    initialData?.skills || {
      categories: [],
      skills: [],
      categorySkillsMap: {},
      uncategorizedSkills: [],
      proficiencyLevels: {},
      endorsements: {},
      lastUsed: {},
    },
  )

  // Add a setSkills function to update the entire skills state at once
  const setSkills = useCallback((skillsData) => {
    dispatch({
      type: SKILLS_ACTIONS.SET_SKILLS,
      payload: skillsData,
    })
  }, [])

  const updateCategories = useCallback((categories) => {
    dispatch({
      type: SKILLS_ACTIONS.UPDATE_CATEGORIES,
      payload: categories,
    })
  }, [])

  const updateSkills = useCallback((skills) => {
    dispatch({
      type: SKILLS_ACTIONS.UPDATE_SKILLS,
      payload: skills,
    })
  }, [])

  const updateCategorySkillsMap = useCallback((categorySkillsMap) => {
    dispatch({
      type: SKILLS_ACTIONS.UPDATE_CATEGORY_SKILLS_MAP,
      payload: categorySkillsMap,
    })
  }, [])

  const updateUncategorizedSkills = useCallback((skills) => {
    dispatch({
      type: SKILLS_ACTIONS.UPDATE_UNCATEGORIZED_SKILLS,
      payload: skills,
    })
  }, [])

  const updateProficiency = useCallback((skill, level) => {
    dispatch({
      type: SKILLS_ACTIONS.UPDATE_PROFICIENCY,
      payload: { skill, level },
    })
  }, [])

  const updateEndorsements = useCallback((skill, count) => {
    dispatch({
      type: SKILLS_ACTIONS.UPDATE_ENDORSEMENTS,
      payload: { skill, count },
    })
  }, [])

  const updateLastUsed = useCallback((skill, date) => {
    dispatch({
      type: SKILLS_ACTIONS.UPDATE_LAST_USED,
      payload: { skill, date },
    })
  }, [])

  const updateField = useCallback((field, value) => {
    dispatch({
      type: SKILLS_ACTIONS.UPDATE_FIELD,
      payload: { field, value },
    })
  }, [])

  const value = useMemo(
    () => ({
      skills,
      setSkills,
      updateCategories,
      updateSkills,
      updateCategorySkillsMap,
      updateUncategorizedSkills,
      updateProficiency,
      updateEndorsements,
      updateLastUsed,
      updateField,
    }),
    [
      skills,
      setSkills,
      updateCategories,
      updateSkills,
      updateCategorySkillsMap,
      updateUncategorizedSkills,
      updateProficiency,
      updateEndorsements,
      updateLastUsed,
      updateField,
    ],
  )

  return <SkillsContext.Provider value={value}>{children}</SkillsContext.Provider>
}

export function useSkills() {
  const context = useContext(SkillsContext)
  if (!context) {
    throw new Error("useSkills must be used within a SkillsProvider")
  }
  return context
}

