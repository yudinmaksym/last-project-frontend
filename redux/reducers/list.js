import agent from '../../agent'

// actions

export const SET_PAGE = 'LIST//SET_PAGE'

export const GET_ALL_REQUEST = 'LIST//GET_ALL_REQUEST'
export const GET_ALL_SUCCESS = 'LIST//GET_ALL_SUCCESS'
export const GET_ALL_FAILED = 'LIST//GET_ALL_FAILED'

// state
const initialState = {
  page: 0,
  pageSize: 12,
  pagesCount: 0,
  loading: false,
  count: 0,
  prevKey: null,
  lastKey: null,
  prevKeys: [],
  items: [],
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

  case SET_PAGE: 
    return {
      ...state,
      page: action.payload.page,
    }

  case GET_ALL_REQUEST: 
    return {
      ...state,
      loading: true,
    }
    
  case GET_ALL_SUCCESS:
    return {
      ...state,
      loading: false,
      count: action.payload.result.count,
      page: action.payload.reset 
        ? initialState.page  
        : (action.payload.isNext ? state.page + 1 : state.page - 1),
      pagesCount: action.payload.result.pages,
      lastKey: action.payload.result.lastKey,
      items: [
        ...action.payload.result.items,
      ],
      prevKeys: (action.payload.isNext && state.page !== 0)
        ? [
          ...state.prevKeys,
          state.prevKey,
        ]
        : removePrevKey(state),
    }

  case GET_ALL_FAILED: 
    return {
      ...state,
      loading: false,
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

export const getAll = (pageSize, lastKey, isNext) => (dispatch) => {
  dispatch({
    type: GET_ALL_REQUEST,
  })

  return agent.List.getAll(pageSize, lastKey)
    .then((result) => {
      dispatch({
        type: GET_ALL_SUCCESS,
        payload: {
          result,
          isNext,
        },
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_ALL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const initalLoad = (pageSize, filters = {}) => (dispatch) => {
  return dispatch(loadAll(
    pageSize, 
    undefined, 
    filters, 
    false, 
    true
  ))
}

// getters
export const getCurrentPage = (state) => state.list && state.list.page 
export const getPageSize = (state) => state.list && state.list.pageSize 
export const getPagesCount = (state) => state.list && state.list.pagesCount 
export const getLoading = (state) => state.list && state.list.loading 
export const getCount = (state) => state.list && state.list.count 
export const getItems = (state) => state.list && state.list.items

export const getLastKey = (state) =>  state.list && state.list.lastKey
export const getPrevKey = (state) => {
  if (!state.list) {
    return null
  }

  if (!state.list.prevKeys) {
    return null
  }

  if (!state.list.prevKeys.length) {
    return null
  }

  return state.list.prevKeys[state.list.prevKeys.length - 2]
}

export const getPrevKeys = (state) => state.list && state.list.prevKeys