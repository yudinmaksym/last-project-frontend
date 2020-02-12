import agent from '../../agent'

// actions
export const CREATE_REQUEST = 'MISSING_CONSUMPTION//CREATE_REQUEST'
export const CREATE_SUCCESS = 'MISSING_CONSUMPTION//CREATE_SUCCESS'
export const CREATE_FAILED = 'MISSING_CONSUMPTION//CREATE_FAILED'

export const SET_PAGE = 'MISSING_CONSUMPTION//SET_PAGE'
export const RESET_PAGINATION = 'MISSING_CONSUMPTION//RESET_PAGINATION'

export const GET_MISSING_CONSUMPTION_REQUEST = 'MISSING_CONSUMPTION//GET_MISSING_CONSUMPTION_REQUEST'
export const GET_MISSING_CONSUMPTION_SUCCESS = 'MISSING_CONSUMPTION//GET_MISSING_CONSUMPTION_SUCCESS'
export const GET_MISSING_CONSUMPTION_FAILED = 'MISSING_CONSUMPTION//GET_MISSING_CONSUMPTION_FAILED'


// state
const initialState = {
  missingConsumptionlist: {
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
      missingConsumptionlist: {
        ...initialState.missingConsumptionlist,
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

  case GET_MISSING_CONSUMPTION_REQUEST:
    return {
      ...state,
      missingConsumptionlist: {
        ...state.missingConsumptionlist,
        loading: true,
      },
    }

  case GET_MISSING_CONSUMPTION_SUCCESS:
    return {
      ...state,
      missingConsumptionlist: {
        ...state.missingConsumptionlist,
        loading: false,
        page: action.payload.result.page,
        count: action.payload.result.count,
        pagesCount: action.payload.result.pages,
        lastKey: action.payload.result.lastKey,
        prevKey: state.missingConsumptionlist.lastKey,
        items: [...action.payload.result.items],
      },
    }

  case GET_MISSING_CONSUMPTION_FAILED:
    return {
      ...state,
      missingConsumptionlist: {
        ...state.missingConsumptionlist,
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

export const loadMissingConsumptionList = (pageSize, page, filters) => (dispatch) => {
  dispatch({
    type: GET_MISSING_CONSUMPTION_REQUEST,
  })
  return agent.MissingConsumption.loadMissingConsumption(pageSize, page, filters)
    .then((result) => {
      dispatch({
        type: GET_MISSING_CONSUMPTION_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: GET_MISSING_CONSUMPTION_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const initalLoad = (pageSize, page, filters = {}) => (dispatch) => {
  return dispatch(loadMissingConsumptionList(
    pageSize,
    page,
    filters,
    false,
    true
  ))
}

// getters
export const getCurrentPage = (state) => state.missingConsumption
  && state.missingConsumption.missingConsumptionlist.page
export const getPageSize = (state) => state.missingConsumption
  && state.missingConsumption.missingConsumptionlist.pageSize
export const getPagesCount = (state) => state.missingConsumption
  && state.missingConsumption.missingConsumptionlist.pagesCount
export const getLoading = (state) => state.missingConsumption && state.missingConsumption.missingConsumptionlist.loading
export const getCount = (state) => state.missingConsumption && state.missingConsumption.missingConsumptionlist.count
export const getItems = (state) => state.missingConsumption && state.missingConsumption.missingConsumptionlist.items

export const getLastKey = (state) =>  state.missingConsumption
  && state.missingConsumption.missingConsumptionlist.lastKey
export const getPrevKey = (state) => {
  if (!state.missingConsumption) {
    return null
  }

  if (!state.missingConsumption.missingConsumptionlist.prevKeys) {
    return null
  }

  if (!state.missingConsumption.missingConsumptionlist.prevKeys.length) {
    return null
  }

  return
  state.missingConsumption
    .missingConsumptionlist.prevKeys[state.missingConsumption.missingConsumptionlist.prevKeys.length - 1]
}

export const getPrevKeys = (state) => state.missingConsumption
  && state.missingConsumption.missingConsumptionlist.prevKeys

