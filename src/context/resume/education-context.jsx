"use client"
import { createContext, useContext, useReducer } from "react"
import { educationReducer, EDUCATION_ACTIONS } from "@/reducers/resume/education-reducer"

const EducationContext = createContext()

export function EducationProvider({ children, initialData = null }) {
  const [education, dispatch] = useReducer(educationReducer, initialData?.education || [])

  const addEducation = () => {
    dispatch({ type: EDUCATION_ACTIONS.ADD_EDUCATION })
  }

  const updateEducation = (educationData) => {
    if (Array.isArray(educationData)) {
      dispatch({ type: EDUCATION_ACTIONS.UPDATE_EDUCATION, payload: educationData }); // ✅ Overwrite education
    } else {
      dispatch({
        type: EDUCATION_ACTIONS.UPDATE_EDUCATION,
        payload: { id: educationData.id, education: educationData },
      });
    }
  };

  const deleteEducation = (id) => {
    dispatch({
      type: EDUCATION_ACTIONS.DELETE_EDUCATION,
      payload: { id },
    })
  }

  const toggleEducation = (id) => {
    dispatch({
      type: EDUCATION_ACTIONS.TOGGLE_EDUCATION,
      payload: { id },
    })
  }

  const toggleCurrentlyStudying = (id) => {
    dispatch({
      type: EDUCATION_ACTIONS.TOGGLE_CURRENTLY_STUDYING,
      payload: { id },
    })
  }

  const updateField = (id, field, value) => {
    dispatch({
      type: EDUCATION_ACTIONS.UPDATE_FIELD,
      payload: { id, field, value },
    })
  }

  return (
    <EducationContext.Provider
      value={{
        education,
        addEducation,
        updateEducation,
        deleteEducation,
        toggleEducation,
        toggleCurrentlyStudying,
        updateField,
      }}
    >
      {children}
    </EducationContext.Provider>
  )
}

export function useEducation() {
  const context = useContext(EducationContext)
  if (!context) {
    throw new Error("useEducation must be used within an EducationProvider")
  }
  return context
}

