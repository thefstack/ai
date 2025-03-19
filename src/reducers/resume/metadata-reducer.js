export const METADATA_ACTIONS = {
  UPDATE_FIELD: "UPDATE_FIELD",
  INCREMENT_VERSION: "INCREMENT_VERSION",
  TOGGLE_PUBLIC: "TOGGLE_PUBLIC",
  UPDATE_MODIFIED: "UPDATE_MODIFIED",
  RESET_METADATA: "RESET_METADATA",
}

export function metadataReducer(state, action) {
  switch (action.type) {
    case METADATA_ACTIONS.UPDATE_FIELD:
      return {
        ...state,
        [action.payload.field]: action.payload.value,
        lastModified: new Date().toISOString(),
      }

    case METADATA_ACTIONS.INCREMENT_VERSION:
      return {
        ...state,
        version: state.version + 1,
        lastModified: new Date().toISOString(),
      }

    case METADATA_ACTIONS.TOGGLE_PUBLIC:
      return {
        ...state,
        isPublic: !state.isPublic,
        lastModified: new Date().toISOString(),
      }

    case METADATA_ACTIONS.UPDATE_MODIFIED:
      return {
        ...state,
        lastModified: new Date().toISOString(),
      }

    case METADATA_ACTIONS.RESET_METADATA:
      return {
        id: "",
        title: "",
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: 1,
        isPublic: false,
      }

    default:
      return state
  }
}

