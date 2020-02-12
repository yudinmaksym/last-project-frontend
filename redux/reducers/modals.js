export const SHOW_CONFIRMATION_MODAL = 'LOADERS//SHOW_CONFIRMATION_MODAL'

const initialState = {
  showConfirmationModal: false,
  confirmationModalText: '',
}

export default (state = initialState, action) => {
  switch(action.type) {
  case SHOW_CONFIRMATION_MODAL: return {
    showConfirmationModal: action.payload.show,
    confirmationModalText: action.payload.text,
    onConfirmationModalClick: action.payload.onClick,
  }

  default: return state
  }
}


export const showConfirmationModal = (payload) => 
  (dispatch) => {
    dispatch({ type: SHOW_CONFIRMATION_MODAL, payload })}
