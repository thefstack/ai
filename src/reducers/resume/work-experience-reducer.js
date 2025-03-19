export const WORK_EXPERIENCE_ACTIONS = {
  ADD_EXPERIENCE: "ADD_EXPERIENCE",
  UPDATE_EXPERIENCE: "UPDATE_EXPERIENCE",
  DELETE_EXPERIENCE: "DELETE_EXPERIENCE",
  TOGGLE_EXPERIENCE: "TOGGLE_EXPERIENCE",
  TOGGLE_CURRENT_ROLE: "TOGGLE_CURRENT_ROLE",
  UPDATE_FIELD: "UPDATE_FIELD",
}

export function workExperienceReducer(state, action) {
  switch (action.type) {
    case WORK_EXPERIENCE_ACTIONS.ADD_EXPERIENCE:
      return [
        ...state,
        {
          id: Date.now(),
          isOpen: true,
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          isCurrentRole: false,
          description: "",
          achievements: [],
        },
      ]

    case WORK_EXPERIENCE_ACTIONS.UPDATE_EXPERIENCE:
      if (Array.isArray(action.payload)) {
        return action.payload
      }
      return state.map((exp) => (exp.id === action.payload.id ? action.payload.experience : exp))

    case WORK_EXPERIENCE_ACTIONS.DELETE_EXPERIENCE:
      return state.filter((exp) => exp.id !== action.payload.id)

    case WORK_EXPERIENCE_ACTIONS.TOGGLE_EXPERIENCE:
      return state.map((exp) => (exp.id === action.payload.id ? { ...exp, isOpen: !exp.isOpen } : exp))

    case WORK_EXPERIENCE_ACTIONS.TOGGLE_CURRENT_ROLE:
      return state.map((exp) =>
        exp.id === action.payload.id
          ? {
              ...exp,
              isCurrentRole: !exp.isCurrentRole,
              endDate: !exp.isCurrentRole ? "" : exp.endDate,
            }
          : exp,
      )

    case WORK_EXPERIENCE_ACTIONS.UPDATE_FIELD:
      return state.map((exp) =>
        exp.id === action.payload.id ? { ...exp, [action.payload.field]: action.payload.value } : exp,
      )

    default:
      return state
  }
}

