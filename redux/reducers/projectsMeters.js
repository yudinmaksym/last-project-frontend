import { SubmissionError } from 'redux-form'

import agent from '../../agent'

// actions
export const CREATE_REQUEST = 'METERS//CREATE_REQUEST'
export const CREATE_SUCCESS = 'METERS//CREATE_SUCCESS'
export const CREATE_FAILED = 'METERS//CREATE_FAILED'

export const SET_PAGE = 'METERS//SET_PAGE'
export const RESET_PAGINATION = 'METERS//RESET_PAGINATION'

export const GET_ALL_REQUEST = 'METERS//GET_ALL_REQUEST'
export const GET_ALL_SUCCESS = 'METERS//GET_ALL_SUCCESS'
export const GET_ALL_FAILED = 'METERS//GET_ALL_FAILED'

export const GET_SINGLE_REQUEST = 'METERS//GET_SINGLE_REQUEST'
export const GET_SINGLE_SUCCESS = 'METERS//GET_SINGLE_SUCCESS'
export const GET_SINGLE_FAILED = 'METERS//GET_SINGLE_FAILED'

export const UPDATE_SINGLE_REQUEST = 'METERS//UPDATE_SINGLE_REQUEST'
export const UPDATE_SINGLE_SUCCESS = 'METERS//UPDATE_SINGLE_SUCCESS'
export const UPDATE_SINGLE_FAILED = 'METERS//UPDATE_SINGLE_FAILED'


// state
const initialState = {
  list: {
    page: 0,
    pageSize: 50,
    pagesCount: 0,
    loading: false,
    count: 0,
    prevKey: null,
    lastKey: null,
    prevKeys: [],
    items: [],
  },
  single: {
    loading: false,
    error: null,
    data: {},
  },
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

  case RESET_PAGINATION:
    return {
      ...state,
      list: {
        ...initialState.list,
      },
    } 
    
  case CREATE_SUCCESS:
    return {
      ...state,
    } 
    
  case CREATE_FAILED:
    return {
      ...state,
    } 

  case SET_PAGE: 
    return {
      ...state,
      page: action.payload.page,
    }

  case GET_ALL_REQUEST: 
    return {
      ...state,
      list: {
        ...state.list,
        loading: true,
      },
    }
    
  case GET_ALL_SUCCESS:
    return {
      ...state,
      list: {
        ...state.list,
        loading: false,
        page: action.payload.result.page,
        count: action.payload.result.count,
        pagesCount: action.payload.result.pages,
        lastKey: action.payload.result.lastKey,
        prevKey: state.list.lastKey,
        items: [...action.payload.result.items],
      },
    }

  case GET_ALL_FAILED: 
    return {
      ...state,
      list: {
        ...state.list,
        loading: false,
      },
    }
  
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
    
  default: 
    return state
  }

}

// actions handlers
export const setPage = (page) => ({
  type: SET_PAGE,
  payload: {
    page,
  },
})

export const resetPagination = () => ({
  type: RESET_PAGINATION,
})

export const loadAll = (pageSize, page, filters) => (dispatch) => {
  dispatch({
    type: GET_ALL_REQUEST,
  })

  return agent.ProjectsMeters.loadAll(pageSize, page, filters)
    .then((result) => {
      dispatch({
        type: GET_ALL_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: GET_ALL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const initalLoad = (pageSize, page, filters = {}) => (dispatch) => {
  return dispatch(loadAll(
    pageSize, 
    page, 
    filters, 
    false, 
    true
  ))
}


export const load = (id) => (dispatch) => {
  dispatch({
    type: GET_SINGLE_REQUEST,
  })

  return agent.ProjectsMeters.load(id)
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

  return agent.ProjectsMeters.update(id, data)
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

// getters
export const getSingleData = (state) => state.projectsMeters && state.projectsMeters.single 
  && state.projectsMeters.single.data
export const getSingleLoading = (state) => state.projectsMeters && state.projectsMeters.single 
  && state.projectsMeters.single.loading

// getters
export const getCurrentPage = (state) => state.projectsMeters && state.projectsMeters.list.page 
export const getPageSize = (state) => state.projectsMeters && state.projectsMeters.list.pageSize 
export const getPagesCount = (state) => state.projectsMeters && state.projectsMeters.list.pagesCount 
export const getLoading = (state) => state.projectsMeters && state.projectsMeters.list.loading 
export const getCount = (state) => state.projectsMeters && state.projectsMeters.list.count 
export const getItems = (state) => state.projectsMeters && state.projectsMeters.list.items

export const getLastKey = (state) =>  state.projectsMeters && state.projectsMeters.list.lastKey
export const getPrevKey = (state) => {
  if (!state.projectsMeters) {
    return null
  }

  if (!state.projectsMeters.list.prevKeys) {
    return null
  }

  if (!state.projectsMeters.list.prevKeys.length) {
    return null
  }

  return state.projectsMeters.list.prevKeys[state.projectsMeters.list.prevKeys.length - 1]
}

export const getPrevKeys = (state) => state.projectsMeters && state.projectsMeters.list.prevKeys