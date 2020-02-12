import shortid from 'shortid'

import agent from '../../agent'

// actions
export const GET_SINGLE_REQUEST = 'METERS//GET_SINGLE_REQUEST'
export const GET_SINGLE_SUCCESS = 'METERS//GET_SINGLE_SUCCESS'
export const GET_SINGLE_FAILED = 'METERS//GET_SINGLE_FAILED'

export const UPDATE_SINGLE_REQUEST = 'METERS//UPDATE_SINGLE_REQUEST'
export const UPDATE_SINGLE_SUCCESS = 'METERS//UPDATE_SINGLE_SUCCESS'
export const UPDATE_SINGLE_FAILED = 'METERS//UPDATE_SINGLE_FAILED'

export const LOAD_UNMAPPED_REQUEST = 'METERS//LOAD_UNMAPPED_REQUEST'
export const LOAD_UNMAPPED_SUCCESS = 'METERS//LOAD_UNMAPPED_SUCCESS'
export const LOAD_UNMAPPED_FAILED = 'METERS//LOAD_UNMAPPED_FAILED'

export const REJECT_UNMAPPED_REQUEST = 'METERS//REJECT_UNMAPPED_REQUEST'
export const REJECT_UNMAPPED_SUCCESS = 'METERS//REJECT_UNMAPPED_SUCCESS'
export const REJECT_UNMAPPED_FAILED = 'METERS//REJECT_UNMAPPED_FAILED'

export const SAVE_UNMAPPED_REQUEST = 'METERS//SAVE_UNMAPPED_REQUEST'
export const SAVE_UNMAPPED_SUCCESS = 'METERS//SAVE_UNMAPPED_SUCCESS'
export const SAVE_UNMAPPED_FAILED = 'METERS//SAVE_UNMAPPED_FAILED'

// state
const initialState = {
  single: {
    loading: false,
    error: null,
    data: {},
  },
  unmapped: [],
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

  case GET_SINGLE_REQUEST:
    return {
      ...state,
      single: {
        ...state.single,
        loading: true,
      },
    }
  
  case GET_SINGLE_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        data: {
          ...action.payload.result,
        },
        loading: false,
      },
    }
    
  case GET_SINGLE_FAILED:
    return {
      ...state,
      single: {
        ...state.single,
        error: action.payload.error,
        loading: false,
      },
    }
    
  case LOAD_UNMAPPED_SUCCESS:
    return {
      ...state,
      unmapped: [
        ...action.payload.result.meters,
      ],
    }
    
  case REJECT_UNMAPPED_SUCCESS:
  case SAVE_UNMAPPED_SUCCESS:
    return {
      ...state,
      unmapped: state.unmapped.filter(_meter => _meter.id != action.payload.result.meterId),
    }
    
  default: 
    return state
  }

}

// actions handlers

export const load = (id) => (dispatch) => {
  dispatch({
    type: GET_SINGLE_REQUEST,
  })

  return agent.Meters.load(id)
    .then((result) => {
      dispatch({
        type: GET_SINGLE_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: GET_SINGLE_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const update = (id, data) => (dispatch) => {
  dispatch({
    type: UPDATE_SINGLE_REQUEST,
  })

  return agent.Meters.update(id, data)
    .then((result) => {
      dispatch({
        type: UPDATE_SINGLE_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: UPDATE_SINGLE_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadUnmapped = () => (dispatch) => {
  dispatch({
    type: LOAD_UNMAPPED_REQUEST,
  })
  
  return agent.Meters.loadUnmapped()
    .then((result) => {
      dispatch({
        type: LOAD_UNMAPPED_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_UNMAPPED_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const rejectUnmapped = (meterId) => (dispatch) => {
  dispatch({
    type: REJECT_UNMAPPED_REQUEST,
  })
  
  return agent.Meters.rejectUnmapped(meterId)
    .then((result) => {
      dispatch({
        type: REJECT_UNMAPPED_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: REJECT_UNMAPPED_FAILED,
        payload: {
          error,
        },
      })
    })
}
  

export const saveUnmapped = (meterId, data) => (dispatch) => {
  dispatch({
    type: REJECT_UNMAPPED_REQUEST,
  })
  
  return agent.Meters.unmappedSave(meterId, data)
    .then((result) => {
      dispatch({
        type: REJECT_UNMAPPED_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: REJECT_UNMAPPED_FAILED,
        payload: {
          error,
        },
      })
    })
}
  

// getters
export const getData = (state) => state.meters && state.meters.single && state.meters.single.data
export const getLoading = (state) => state.meters && state.meters.single && state.meters.single.loading
export const getUnmapped = (state) => state.meters && state.meters.unmapped