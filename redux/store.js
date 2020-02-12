import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { reducer as formReducer } from 'redux-form'
import thunk from 'redux-thunk'
// import reduxLogger from 'redux-logger'

import reducers from './reducers'


const initialState = {}

const storeReducers = combineReducers({
  ...reducers,
  form: formReducer,
})

export function initializeStore(initialState = {}) {
  return createStore(
    storeReducers,
    initialState,
    
    composeWithDevTools(applyMiddleware(thunk))
  )
}

