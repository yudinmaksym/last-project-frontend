export const SHOW_STICK_LOADER = 'LOADERS//SHOW_STICK_LOADER'

const initialState = {
  showStickLoader: false,
}

export default (state = initialState, action) => {
  switch(action.type) {
  case SHOW_STICK_LOADER: return {
    ...state,
    showStickLoader: action.payload,
  }

  default: return state
  }
}


export const showStickLoader = (loading) =>
  (dispatch) => dispatch({ type: SHOW_STICK_LOADER, payload: loading })
