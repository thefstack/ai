"use client"
import { createContext, useContext, useReducer, useMemo, useCallback } from "react"
import { personalInfoReducer, PERSONAL_INFO_ACTIONS } from "@/reducers/resume/personal-info-reducer"

const PersonalInfoContext = createContext()

export function PersonalInfoProvider({ children, initialData = null }) {
  const [personalInfo, dispatch] = useReducer(
    personalInfoReducer,
    initialData?.personalInfo || {
      firstName: "",
      lastName: "",
      headline: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pin: "",
      linkedin: "",
      github: "",
    },
  )

  const updatePersonalInfo = useCallback((field, value) => {
    dispatch({
      type: PERSONAL_INFO_ACTIONS.UPDATE_FIELD,
      payload: { field, value },
    })
  }, [])

  const updateMultipleFields = useCallback((fields) => {
    dispatch({
      type: PERSONAL_INFO_ACTIONS.UPDATE_MULTIPLE_FIELDS,
      payload: fields,
    })
  }, [])

  const resetFields = useCallback(() => {
    dispatch({ type: PERSONAL_INFO_ACTIONS.RESET_FIELDS })
  }, [])

  const value = useMemo(
    () => ({
      personalInfo,
      updatePersonalInfo,
      updateMultipleFields,
      resetFields,
    }),
    [personalInfo, updatePersonalInfo, updateMultipleFields, resetFields],
  )

  return <PersonalInfoContext.Provider value={value}>{children}</PersonalInfoContext.Provider>
}

export function usePersonalInfo() {
  const context = useContext(PersonalInfoContext)
  if (!context) {
    throw new Error("usePersonalInfo must be used within a PersonalInfoProvider")
  }
  return context
}

