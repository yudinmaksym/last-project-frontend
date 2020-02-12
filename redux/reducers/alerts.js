export const SHOW_ALERT = 'ALERTS//SHOW_ALERT'

const initialState = {
  show: false,
  text: '',
  alertTimeout: 10000,
  theme: 'success',
}

export default (state = initialState, action) => {
  switch(action.type) {
  case SHOW_ALERT: return {
    ...state,
    ...action.payload,
  }

  default: return state
  }
}


export const showAlert = (payload) => (dispatch, getState) => {
  dispatch({ type: SHOW_ALERT, payload })
  const { alerts } = getState()
  setTimeout(() => dispatch({ type: SHOW_ALERT, payload: initialState }), alerts.alertTimeout || 10000)
} 
