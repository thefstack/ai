"use client"
import { createContext, useContext, useReducer } from "react"
import { jobInfoReducer, JOB_INFO_ACTIONS } from "@/reducers/resume/job-info-reducer"

const JobInfoContext = createContext()

export function JobInfoProvider({ children, initialData = null }) {
  const [jobInfo, dispatch] = useReducer(
    jobInfoReducer,
    initialData?.jobInfo || {
      jobTitle: "",
      jobDescription: "",
      targetCompany: "",
      jobLocation: "",
      employmentType: "",
    },
  )

  const updateField = (field, value) => {
    dispatch({
      type: JOB_INFO_ACTIONS.UPDATE_FIELD,
      payload: { field, value },
    })
  }

  const updateMultipleFields = (fields) => {
    dispatch({
      type: JOB_INFO_ACTIONS.UPDATE_MULTIPLE_FIELDS,
      payload: fields,
    })
  }

  const resetFields = () => {
    dispatch({ type: JOB_INFO_ACTIONS.RESET_FIELDS })
  }

  return (
    <JobInfoContext.Provider
      value={{
        jobInfo,
        updateField,
        updateMultipleFields,
        resetFields,
      }}
    >
      {children}
    </JobInfoContext.Provider>
  )
}

export function useJobInfo() {
  const context = useContext(JobInfoContext)
  if (!context) {
    throw new Error("useJobInfo must be used within a JobInfoProvider")
  }
  return context
}

