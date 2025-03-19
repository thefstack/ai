export const JOB_INFO_ACTIONS = {
  UPDATE_FIELD: "UPDATE_FIELD",
  UPDATE_MULTIPLE_FIELDS: "UPDATE_MULTIPLE_FIELDS",
  RESET_FIELDS: "RESET_FIELDS",
}

export function jobInfoReducer(state, action) {
  switch (action.type) {
    case JOB_INFO_ACTIONS.UPDATE_FIELD:
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      }

    case JOB_INFO_ACTIONS.UPDATE_MULTIPLE_FIELDS:
      return {
        ...state,
        ...action.payload,
      }

    case JOB_INFO_ACTIONS.RESET_FIELDS:
      return {
        jobTitle: "",
        jobDescription: "",
        targetCompany: "",
        jobLocation: "",
        employmentType: "",
      }

    default:
      return state
  }
}

