export const CERTIFICATIONS_ACTIONS = {
  ADD_CERTIFICATION: "ADD_CERTIFICATION",
  UPDATE_CERTIFICATION: "UPDATE_CERTIFICATION",
  DELETE_CERTIFICATION: "DELETE_CERTIFICATION",
  TOGGLE_CERTIFICATION: "TOGGLE_CERTIFICATION",
  UPDATE_FIELD: "UPDATE_FIELD",
}

export function certificationsReducer(state, action) {
  switch (action.type) {
    case CERTIFICATIONS_ACTIONS.ADD_CERTIFICATION:
      return [
        ...state,
        {
          id: Date.now(),
          isOpen: true,
          name: "",
          organization: "",
          issueDate: "",
          expiryDate: "",
          credentialId: "",
          credentialUrl: "",
          description: "",
          skills: [],
        },
      ]

      case CERTIFICATIONS_ACTIONS.UPDATE_CERTIFICATION:
        return Array.isArray(action.payload) ? action.payload : state.map((cert) => 
          cert.id === action.payload.id ? action.payload.certification : cert
        );
        
    case CERTIFICATIONS_ACTIONS.DELETE_CERTIFICATION:
      return state.filter((cert) => cert.id !== action.payload.id)

    case CERTIFICATIONS_ACTIONS.TOGGLE_CERTIFICATION:
      return state.map((cert) => (cert.id === action.payload.id ? { ...cert, isOpen: !cert.isOpen } : cert))

    case CERTIFICATIONS_ACTIONS.UPDATE_FIELD:
      return state.map((cert) =>
        cert.id === action.payload.id ? { ...cert, [action.payload.field]: action.payload.value } : cert,
      )

    default:
      return state
  }
}

