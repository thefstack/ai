export const CUSTOMIZATION_ACTIONS = {
  UPDATE_TEMPLATE: "UPDATE_TEMPLATE",
  UPDATE_FONT_SIZE: "UPDATE_FONT_SIZE",
  UPDATE_FONT_FAMILY: "UPDATE_FONT_FAMILY",
  UPDATE_SPACING: "UPDATE_SPACING",
  UPDATE_COLOR: "UPDATE_COLOR",
  UPDATE_FIELD: "UPDATE_FIELD",
  RESET_TO_DEFAULT: "RESET_TO_DEFAULT",
}

export function customizationReducer(state, action) {
  switch (action.type) {
    case CUSTOMIZATION_ACTIONS.UPDATE_TEMPLATE:
      return { ...state, template: action.payload }

    case CUSTOMIZATION_ACTIONS.UPDATE_FONT_SIZE:
      return { ...state, fontSize: action.payload }

    case CUSTOMIZATION_ACTIONS.UPDATE_FONT_FAMILY:
      return { ...state, fontFamily: action.payload }

    case CUSTOMIZATION_ACTIONS.UPDATE_SPACING:
      return { ...state, spacing: action.payload }

    case CUSTOMIZATION_ACTIONS.UPDATE_COLOR:
      return { ...state, color: action.payload }

    case CUSTOMIZATION_ACTIONS.UPDATE_FIELD:
      return { ...state, [action.payload.field]: action.payload.value }

    case CUSTOMIZATION_ACTIONS.UPDATE_ALL: // ✅ New case to update everything
      return { ...state, ...action.payload }

    case CUSTOMIZATION_ACTIONS.RESET_TO_DEFAULT:
      return {
        template: "modern",
        fontSize: "medium",
        fontFamily: "default",
        spacing: "normal",
        color: "blue",
      }

    default:
      return state
  }
}
