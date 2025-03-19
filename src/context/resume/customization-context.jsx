"use client"
import { createContext, useContext, useReducer } from "react"
import { customizationReducer, CUSTOMIZATION_ACTIONS } from "@/reducers/resume/customization-reducer"

const CustomizationContext = createContext()

export function CustomizationProvider({ children, initialData = null }) {
  const [customization, dispatch] = useReducer(
    customizationReducer,
    initialData?.customization || {
      template: "template1",
      fontSize: "medium",
      fontFamily: "default",
      spacing: "normal",
      color: "blue",
    },
  )

  const updateTemplate = (template) => {
    dispatch({
      type: CUSTOMIZATION_ACTIONS.UPDATE_TEMPLATE,
      payload: template,
    })
  }

  const updateFontSize = (fontSize) => {
    dispatch({
      type: CUSTOMIZATION_ACTIONS.UPDATE_FONT_SIZE,
      payload: fontSize,
    })
  }

  const updateFontFamily = (fontFamily) => {
    dispatch({
      type: CUSTOMIZATION_ACTIONS.UPDATE_FONT_FAMILY,
      payload: fontFamily,
    })
  }

  const updateSpacing = (spacing) => {
    dispatch({
      type: CUSTOMIZATION_ACTIONS.UPDATE_SPACING,
      payload: spacing,
    })
  }

  const updateColor = (color) => {
    dispatch({
      type: CUSTOMIZATION_ACTIONS.UPDATE_COLOR,
      payload: color,
    })
  }

  const updateField = (field, value) => {
    dispatch({
      type: CUSTOMIZATION_ACTIONS.UPDATE_FIELD,
      payload: { field, value },
    })
  }

  const updateCustomization = (customizationData) => {
    console.log("ascascb",customizationData)
    dispatch({
      type: CUSTOMIZATION_ACTIONS.UPDATE_ALL,
      payload: customizationData,
    })
  }

  const resetToDefault = () => {
    dispatch({ type: CUSTOMIZATION_ACTIONS.RESET_TO_DEFAULT })
  }

  return (
    <CustomizationContext.Provider
      value={{
        customization,
        updateCustomization,
        updateTemplate,
        updateFontSize,
        updateFontFamily,
        updateSpacing,
        updateColor,
        updateField,
        resetToDefault,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  )
}

export function useCustomization() {
  const context = useContext(CustomizationContext)
  if (!context) {
    throw new Error("useCustomization must be used within a CustomizationProvider")
  }
  return context
}

