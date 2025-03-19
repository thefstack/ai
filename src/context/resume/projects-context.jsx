"use client"
import { createContext, useContext, useReducer, useMemo, useCallback } from "react"
import { projectsReducer, PROJECTS_ACTIONS } from "@/reducers/resume/projects-reducer"

const ProjectsContext = createContext()

export function ProjectsProvider({ children, initialData = null }) {
  const [projects, dispatch] = useReducer(projectsReducer, initialData?.projects || [])

  const addProject = useCallback(() => {
    dispatch({ type: PROJECTS_ACTIONS.ADD_PROJECT })
  }, [])

  const updateProject = useCallback((id, project) => {
    dispatch({
      type: PROJECTS_ACTIONS.UPDATE_PROJECT,
      payload: { id, project },
    })
  }, [])

  const deleteProject = useCallback((id) => {
    dispatch({
      type: PROJECTS_ACTIONS.DELETE_PROJECT,
      payload: { id },
    })
  }, [])

  const toggleProject = useCallback((id) => {
    dispatch({
      type: PROJECTS_ACTIONS.TOGGLE_PROJECT,
      payload: { id },
    })
  }, [])

  const toggleCurrentProject = useCallback((id) => {
    dispatch({
      type: PROJECTS_ACTIONS.TOGGLE_CURRENT_PROJECT,
      payload: { id },
    })
  }, [])

  const updateField = useCallback((id, field, value) => {
    dispatch({
      type: PROJECTS_ACTIONS.UPDATE_FIELD,
      payload: { id, field, value },
    })
  }, [])

  const updateDescription = useCallback((id, description) => {
    dispatch({
      type: PROJECTS_ACTIONS.UPDATE_DESCRIPTION,
      payload: { id, description },
    })
  }, [])

  const setProjects = useCallback((projectsArray) => {
    dispatch({
      type: PROJECTS_ACTIONS.SET_PROJECTS,
      payload: projectsArray,
    });
  }, []);
  const addTechnology = useCallback((id, technology) => {
    dispatch({
      type: PROJECTS_ACTIONS.ADD_TECHNOLOGY,
      payload: { id, technology },
    })
  }, [])

  const removeTechnology = useCallback((id, index) => {
    dispatch({
      type: PROJECTS_ACTIONS.REMOVE_TECHNOLOGY,
      payload: { id, index },
    })
  }, [])

  const value = useMemo(
    () => ({
      projects,
      addProject,
      updateProject,
      deleteProject,
      toggleProject,
      toggleCurrentProject,
      updateField,
      updateDescription,
      setProjects,
      addTechnology,
      removeTechnology,
    }),
    [
      projects,
      addProject,
      updateProject,
      deleteProject,
      toggleProject,
      toggleCurrentProject,
      updateField,
      updateDescription,
      setProjects,
      addTechnology,
      removeTechnology,
    ],
  )

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider")
  }
  return context
}

