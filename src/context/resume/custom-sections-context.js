"use client"
import { createContext, useContext, useReducer, useCallback } from "react"
import customSectionsReducer, {
  ADD_SECTION,
  UPDATE_SECTION,
  DELETE_SECTION,
  ADD_BULLET,
  UPDATE_BULLET,
  DELETE_BULLET,
  SET_SECTIONS,
} from "@/reducers/resume/custom-sections-reducer"

const CustomSectionsContext = createContext()

export function CustomSectionsProvider({ children }) {
  const [state, dispatch] = useReducer(customSectionsReducer, { sections: [] })

  const addSection = useCallback(() => {
    const newSection = {
      id: Date.now().toString(),
      title: "New Section",
      description: "",
      bullets: [],
    }

    dispatch({
      type: ADD_SECTION,
      payload: {
        title: newSection.title,
      },
    })

    return newSection
  }, [])

  const updateSection = useCallback((id, data) => {
    dispatch({
      type: UPDATE_SECTION,
      payload: { id, data },
    })
  }, [])

  const deleteSection = useCallback((id) => {
    dispatch({
      type: DELETE_SECTION,
      payload: { id },
    })
  }, [])

  const addBullet = useCallback((sectionId) => {
    dispatch({
      type: ADD_BULLET,
      payload: { sectionId },
    })
  }, [])

  const updateBullet = useCallback((sectionId, bulletId, text) => {
    dispatch({
      type: UPDATE_BULLET,
      payload: { sectionId, bulletId, text },
    })
  }, [])

  const deleteBullet = useCallback((sectionId, bulletId) => {
    dispatch({
      type: DELETE_BULLET,
      payload: { sectionId, bulletId },
    })
  }, [])

  const setSections = useCallback((sections) => {
    dispatch({
      type: SET_SECTIONS,
      payload: sections,
    })
  }, [])

  return (
    <CustomSectionsContext.Provider
      value={{
        sections: state.sections,
        addSection,
        updateSection,
        deleteSection,
        addBullet,
        updateBullet,
        deleteBullet,
        setSections,
      }}
    >
      {children}
    </CustomSectionsContext.Provider>
  )
}

export function useCustomSections() {
  const context = useContext(CustomSectionsContext)
  if (!context) {
    throw new Error("useCustomSections must be used within a CustomSectionsProvider")
  }
  return context
}

