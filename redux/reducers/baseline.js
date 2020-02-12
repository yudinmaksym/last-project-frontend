import shortid from 'shortid'

import agent from '../../agent'


export const UPDATE_BASELINE_REQUEST = 'BASELINE//UPDATE_BASELINE_REQUEST'
export const UPDATE_BASELINE_SUCCESS = 'BASELINE//UPDATE_BASELINE_SUCCESS'
export const UPDATE_BASELINE_FAILED = 'BASELINE//UPDATE_BASELINE_FAILED'

export const LOAD_PROJECT_METERS_REQUEST = 'BASELINE//LOAD_PROJECT_METERS_REQUEST'
export const LOAD_PROJECT_METERS_SUCCESS = 'BASELINE//LOAD_PROJECT_METERS_SUCCESS'
export const LOAD_PROJECT_METERS_FAILED = 'BASELINE//LOAD_PROJECT_METERS_FAILED'

export const LOAD_BASELINE_VALUES_REQUEST = 'BASELINE//LOAD_BASELINE_VALUES_REQUEST'
export const LOAD_BASELINE_VALUES_SUCCESS = 'BASELINE//LOAD_BASELINE_VALUES_SUCCESS'
export const LOAD_BASELINE_VALUES_FAILED = 'BASELINE//LOAD_BASELINE_VALUES_FAILED'

const initialState = {
  loading: false,
  values: {},
  projectMeters: [],
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
      
  case LOAD_PROJECT_METERS_REQUEST:
    return {
      ...state,
      loading: true,
      projectId: action.payload.projectId,
    }
      
  case LOAD_PROJECT_METERS_SUCCESS:
    return {
      ...state,
      loading: false,
      projectMeters: [
        ...action.payload.result.meters,
      ],
    }

  case LOAD_PROJECT_METERS_FAILED:
    return {
      ...state,
      loading: false,
    }

  case LOAD_BASELINE_VALUES_REQUEST:
    return {
      ...state,
      loading: true,
      projectMeters: [],
      values: {},
    }

  case LOAD_BASELINE_VALUES_SUCCESS:
    return {
      ...state,
      loading: false,
      values: {
        ...action.payload.result.data,
      },
    }

  case LOAD_BASELINE_VALUES_FAILED:
    return {
      ...state,
      loading: false,
    }

  case UPDATE_BASELINE_REQUEST:
    return {
      ...state,
      loading: true,
    }

  case UPDATE_BASELINE_SUCCESS:
    return {
      ...state,
      loading: false,
    }

  case UPDATE_BASELINE_FAILED:
    return {
      ...state,
      loading: false,
    }

  default:
    return state
  }
}

export const loadProjectMeters = (projectId) => (dispatch) => {
  dispatch({
    type: LOAD_PROJECT_METERS_REQUEST,
    payload: {
      projectId,
    },
  })
  
  return agent.Baseline.projectMeters(projectId)
    .then((result) => {
      dispatch({
        type: LOAD_PROJECT_METERS_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_PROJECT_METERS_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadBaselineValues = (projectId, data) => (dispatch) => {
  dispatch({
    type: LOAD_BASELINE_VALUES_REQUEST,
  })
  
  return agent.Baseline.values(projectId)
    .then((result) => {
      dispatch({
        type: LOAD_BASELINE_VALUES_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_BASELINE_VALUES_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const updateBaseline = (projectId, data) => (dispatch) => {
  dispatch({
    type: UPDATE_BASELINE_REQUEST,
  })
  
  return agent.Baseline.update(projectId, data)
    .then((result) => {
      dispatch({
        type: UPDATE_BASELINE_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: UPDATE_BASELINE_FAILED,
        payload: {
          error,
        },
      })
    })
}
  

export const getProjectMeters = (state) => state.baseline
    && state.baseline.projectMeters 
  
export const getSelectedProject = (state) => state.baseline
    && state.baseline.projectId 
  
export const getBaselineValues = (state) => state.baseline
    && state.baseline.values 
  
export const getLoading = (state) => state.baseline
    && state.baseline.loading 
  