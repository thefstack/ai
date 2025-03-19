"use client"
import { createContext, useContext, useReducer, useMemo, useCallback } from "react"
import { certificationsReducer, CERTIFICATIONS_ACTIONS } from "@/reducers/resume/certifications-reducer"

const CertificationsContext = createContext()

export function CertificationsProvider({ children, initialData = null }) {
  const [certifications, dispatch] = useReducer(certificationsReducer, initialData?.certifications || [])

  const addCertification = useCallback(() => {
    dispatch({ type: CERTIFICATIONS_ACTIONS.ADD_CERTIFICATION })
  }, [])

  const updateCertification = useCallback((newCertifications) => {
    dispatch({
      type: CERTIFICATIONS_ACTIONS.UPDATE_CERTIFICATION, 
      payload: newCertifications, // ✅ Ensure entire array is set
    });
  }, []);

  const deleteCertification = useCallback((id) => {
    dispatch({
      type: CERTIFICATIONS_ACTIONS.DELETE_CERTIFICATION,
      payload: { id },
    })
  }, [])

  const toggleCertification = useCallback((id) => {
    dispatch({
      type: CERTIFICATIONS_ACTIONS.TOGGLE_CERTIFICATION,
      payload: { id },
    })
  }, [])

  const updateField = useCallback((id, field, value) => {
    dispatch({
      type: CERTIFICATIONS_ACTIONS.UPDATE_FIELD,
      payload: { id, field, value },
    })
  }, [])

  const value = useMemo(
    () => ({
      certifications,
      addCertification,
      updateCertification,
      deleteCertification,
      toggleCertification,
      updateField,
    }),
    [certifications, addCertification, updateCertification, deleteCertification, toggleCertification, updateField],
  )

  return <CertificationsContext.Provider value={value}>{children}</CertificationsContext.Provider>
}

export function useCertifications() {
  const context = useContext(CertificationsContext)
  if (!context) {
    throw new Error("useCertifications must be used within a CertificationsProvider")
  }
  return context
}

