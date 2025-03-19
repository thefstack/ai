export const PERSONAL_INFO_ACTIONS = {
  UPDATE_FIELD: "UPDATE_FIELD",
  UPDATE_MULTIPLE_FIELDS: "UPDATE_MULTIPLE_FIELDS",
  RESET_FIELDS: "RESET_FIELDS",
}

export function personalInfoReducer(state, action) {
  switch (action.type) {
    case PERSONAL_INFO_ACTIONS.UPDATE_FIELD:
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      }

    case PERSONAL_INFO_ACTIONS.UPDATE_MULTIPLE_FIELDS:
      return {
        ...state,
        ...action.payload,
      }

    case PERSONAL_INFO_ACTIONS.RESET_FIELDS:
      return {
        firstName: "",
        lastName: "",
        headline: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pin: "",
        linkedin: "",
        github: "",
      }

    default:
      return state
  }
}

