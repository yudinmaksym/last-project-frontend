import shortid from 'shortid'

import agent from '../../agent'


export const UPDATE_CONSUMPTIONS_REQUEST = 'CONSUMPTIONS//UPDATE_CONSUMPTIONS_REQUEST'
export const UPDATE_CONSUMPTIONS_SUCCESS = 'CONSUMPTIONS//UPDATE_CONSUMPTIONS_SUCCESS'
export const UPDATE_CONSUMPTIONS_FAILED = 'CONSUMPTIONS//UPDATE_CONSUMPTIONS_FAILED'

export const LOAD_PROJECT_METERS_REQUEST = 'CONSUMPTIONS//LOAD_PROJECT_METERS_REQUEST'
export const LOAD_PROJECT_METERS_SUCCESS = 'CONSUMPTIONS//LOAD_PROJECT_METERS_SUCCESS'
export const LOAD_PROJECT_METERS_FAILED = 'CONSUMPTIONS//LOAD_PROJECT_METERS_FAILED'

export const LOAD_CONSUMPTIONS_VALUES_REQUEST = 'CONSUMPTIONS//LOAD_CONSUMPTIONS_VALUES_REQUEST'
export const LOAD_CONSUMPTIONS_VALUES_SUCCESS = 'CONSUMPTIONS//LOAD_CONSUMPTIONS_VALUES_SUCCESS'
export const LOAD_CONSUMPTIONS_VALUES_FAILED = 'CONSUMPTIONS//LOAD_CONSUMPTIONS_VALUES_FAILED'

const initialState = {
  year: null,
  projectId: null,
  values: {},
  projectMeters: [],
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {

  case LOAD_CONSUMPTIONS_VALUES_REQUEST:
    return {
      ...state,
      year: action.payload.year,
      projectId: action.payload.projectId,
      projectMeters: [],
      values: {},
    }

  case LOAD_CONSUMPTIONS_VALUES_SUCCESS:
    return {
      ...state,
      projectMeters: [
        ...action.payload.result.meters,
      ],
      values: {
        ...action.payload.result.values,
      },
    }

  default:
    return state
  }
}

export const loadConsumptionsValues = (projectId, year) => (dispatch) => {
  dispatch({
    type: LOAD_CONSUMPTIONS_VALUES_REQUEST,
    payload: { 
      projectId,
      year,
    },
  })
  
  return agent.Consumptions.getManualValues(projectId, year)
    .then((result) => {
      dispatch({
        type: LOAD_CONSUMPTIONS_VALUES_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_CONSUMPTIONS_VALUES_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const updateConsumptions = (projectId, year, data) => (dispatch) => {
  dispatch({
    type: UPDATE_CONSUMPTIONS_REQUEST,
  })
  
  return agent.Consumptions.updateManualValues(projectId, year, data)
    .then((result) => {
      dispatch({
        type: UPDATE_CONSUMPTIONS_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: UPDATE_CONSUMPTIONS_FAILED,
        payload: {
          error,
        },
      })
    })
}


export const getProjectMeters = (state) => state.consumptions
    && state.consumptions.projectMeters 
  
export const getSelectedProject = (state) => state.consumptions
    && state.consumptions.projectId 
  
export const getSelectedYear = (state) => state.consumptions
    && state.consumptions.year 
  
export const getConsumptionsValues = (state) => state.consumptions
    && state.consumptions.values 