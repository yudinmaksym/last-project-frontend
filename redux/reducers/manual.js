import { SubmissionError } from 'redux-form'

import agent from '../../agent'

// actions
export const CREATE_REQUEST = 'MANUAL//CREATE_REQUEST'
export const CREATE_SUCCESS = 'MANUAL//CREATE_SUCCESS'
export const CREATE_FAILED = 'MANUAL//CREATE_FAILED'


// state
const initialState = {
  
}

const removePrevKey = (state) => {  
  const items = [
    ...state.prevKeys,
  ]

  items.pop()

  return items
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {

  case CREATE_REQUEST:
    return {
      ...state,
    } 
    
  case CREATE_SUCCESS:
    return {
      ...state,
    } 
    
  case CREATE_FAILED:
    return {
      ...state,
    } 

  default: 
    return state
  }

}

// actions handlers

export const inputData = (data) => (dispatch) => {
  dispatch({
    type: CREATE_REQUEST,
  })

  return agent.Tables.manual(data)
    .then((result) => {
      dispatch({
        type: CREATE_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      const message = (
        error && error.response && error.response.body && error.response.body.error
      ) || 'System error'
      
      dispatch({
        type: CREATE_FAILED,
        payload: {
          error: message,
        },
      })

      throw new SubmissionError({
        _error: message,
      })
    })
}


// getters
