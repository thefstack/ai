"use client"
import { createContext, useContext, useReducer } from "react"
import { metadataReducer, METADATA_ACTIONS } from "@/reducers/resume/metadata-reducer"

const MetadataContext = createContext()

export function MetadataProvider({ children, initialData = null }) {
  const [metadata, dispatch] = useReducer(
    metadataReducer,
    initialData?.metadata || {
      id: "",
      title: "",
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: 1,
      isPublic: false,
    },
  )

  const updateField = (field, value) => {
    dispatch({
      type: METADATA_ACTIONS.UPDATE_FIELD,
      payload: { field, value },
    })
  }

  const incrementVersion = () => {
    dispatch({ type: METADATA_ACTIONS.INCREMENT_VERSION })
  }

  const togglePublic = () => {
    dispatch({ type: METADATA_ACTIONS.TOGGLE_PUBLIC })
  }

  const updateModified = () => {
    dispatch({ type: METADATA_ACTIONS.UPDATE_MODIFIED })
  }

  const resetMetadata = () => {
    dispatch({ type: METADATA_ACTIONS.RESET_METADATA })
  }

  return (
    <MetadataContext.Provider
      value={{
        metadata,
        updateField,
        incrementVersion,
        togglePublic,
        updateModified,
        resetMetadata,
      }}
    >
      {children}
    </MetadataContext.Provider>
  )
}

export function useMetadata() {
  const context = useContext(MetadataContext)
  if (!context) {
    throw new Error("useMetadata must be used within a MetadataProvider")
  }
  return context
}

