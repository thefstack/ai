"use client"
import { useCallback } from "react"
import { usePersonalInfo } from "./personal-info-context"
import { useEducation } from "./education-context"
import { useWorkExperience } from "./work-experience-context"
import { useProjects } from "./projects-context"
import { useSkills } from "./skills-context"
import { useCertifications } from "./certifications-context"
import { useMetadata } from "./metadata-context"
import { useCustomization } from "./customization-context"
import { useCustomSections } from "./custom-sections-context"
import { transformToDatabase, transformFromDatabase } from "./resume-data-manager"
import apiClient from "@/lib/apiClient"
import { useRouter } from "next/navigation"

export function useResumeSync() {
  const { personalInfo, updateMultipleFields: updatePersonalInfo } = usePersonalInfo()
  const { education, updateEducation } = useEducation()
  const { workExperience, updateExperience } = useWorkExperience()
  const { projects, updateProject, setProjects } = useProjects()
  const { skills, setSkills } = useSkills() // Just use setSkills
  const { certifications, updateCertification } = useCertifications()
  const { metadata, updateMetadata } = useMetadata()
  const { customization, updateCustomization } = useCustomization()
  const { sections, setSections } = useCustomSections()

  const router = useRouter()

  const getAllContextData = useCallback(() => {
    return {
      personalInfo,
      education,
      workExperience,
      projects,
      skills,
      certifications,
      metadata,
      customization,
      customSections: sections, // ✅ Include custom sections
    }
  }, [
    personalInfo,
    education,
    workExperience,
    projects,
    skills,
    certifications,
    metadata,
    customization,
    sections, // ✅ Add sections to dependencies
  ])

  /**
   * ✅ Save Resume to Database
   */
  const saveToDatabase = useCallback(async () => {
    try {
      const contextData = getAllContextData()
      const dbData = transformToDatabase(contextData)

      const response = await apiClient.post("/api/resume", dbData)

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save resume")
      }

      return response.data.data
    } catch (error) {
      console.error("❌ Error saving resume:", error)
      throw error
    }
  }, [getAllContextData])

  /*
  Flow
  loadFromDataBase -> call api and fetch Data if successfull ? transformFromDataBase(this is a function that map the response from database into specific format ) : throw error 

  then we will call the function of each component context.
  From context these will call reducer function for updating specific state.

  basically updatePersonalInfo, updateEducation, ...etc are the reducer function of each context so we are updating using reducer
*/
  const loadFromDatabase = useCallback(
    async (resumeId) => {
      try {
        const response = await apiClient.get(`/api/resume/${resumeId}`)

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to load resume")
        }

        const contextData = transformFromDatabase(response.data.data)

        console.log("context Data in load from database", contextData)

        // Update all contexts with the loaded data
        updatePersonalInfo(contextData.personalInfo)
        updateEducation(contextData.education)
        updateExperience(contextData.workExperience)
        setProjects(contextData.projects)
        setSkills(contextData.skills)
        updateCertification(contextData.certifications)
        setSections(contextData.customSections)
        // updateMetadata(contextData.metadata)
        updateCustomization(contextData.customization)

        return response.data.data
      } catch (error) {
        console.error("❌ Error loading resume:", error)
        throw error
      }
    },
    [
      updatePersonalInfo,
      updateEducation,
      updateExperience,
      setProjects,
      setSkills, // Just include setSkills
      updateCertification,
      updateMetadata,
      updateCustomization,
      setSections, // ✅ Include setSections
    ],
  )

  return {
    saveToDatabase,
    loadFromDatabase,
    getAllContextData,
  }
}

