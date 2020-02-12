import agent from '../../agent'

// actions

export const SET_PAGE = 'TABLES//SET_PAGE'

export const GET_ALL_REQUEST = 'TABLES//GET_ALL_REQUEST'
export const GET_ALL_SUCCESS = 'TABLES//GET_ALL_SUCCESS'
export const GET_ALL_FAILED = 'TABLES//GET_ALL_FAILED'
export const UPDATE_FILTERS = 'TABLES//UPDATE_FILTERS'
export const UPDATE_SORT = 'TABLES//UPDATE_SORT'
export const GET_EXPORT_REQUEST = 'TABLES//GET_EXPORT_REQUEST'
export const GET_EXPORT_SUCCESS = 'TABLES//GET_EXPORT_SUCCESS'
export const GET_EXPORT_FAILED = 'TABLES//GET_EXPORT_FAILED'

// state
const initialState = {
  page: 0,
  pageSize: 100,
  pagesCount: 1,
  loading: false,
  count: 0,
  prevKey: null,
  lastKey: null,
  prevKeys: [],
  items: [],
  filters: {},
  sort: {},
  currentPageSize: 100,
  reportItems: [],
  delta: 36,
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
      items: [],
    }

  case GET_ALL_SUCCESS:
    return {
      ...state,
      loading: false,
      // page: action.payload.result.pages != state.pagesCount ? 0 : state.page,
      count: action.payload.result.count,
      pagesCount: action.payload.result.pages,
      lastKey: action.payload.result.lastKey,
      currentPageSize: action.payload.result.items.length,
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

  case UPDATE_FILTERS:
    return {
      ...state,
      filters: { ...state.filters, ...action.payload },
    }

  case UPDATE_SORT:
    return {
      ...state,
      sort: action.payload,
    }

  case GET_EXPORT_REQUEST:
    return {
      ...state,
      reportItems: [],
    }

  case GET_EXPORT_SUCCESS:
    return {
      ...state,
      reportItems: [
        ...action.payload.result.items,
      ],
    }

  case GET_EXPORT_FAILED:
    return {
      ...state,
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

export const getAll = (pageSize) => (dispatch, getState) => {
  dispatch({
    type: GET_ALL_REQUEST,
  })

  const state = getState()
  const filters = getFilters(state)
  const sorting = getSorting(state)
  const page = getCurrentPage(state)
  const offset = page == 0 ? 0 : page * pageSize

  console.log(sorting)

  return agent.Tables.getAll(pageSize, offset, filters, sorting)
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
export const getExportAll = () => (dispatch, getState) => {
  dispatch({
    type: GET_EXPORT_REQUEST,
  })

  const state = getState()
  const filters = getFilters(state)
  const sorting = getSorting(state)

  return agent.Tables.getExportAll(filters, sorting)
    .then((result) => {
      dispatch({
        type: GET_EXPORT_SUCCESS,
        payload: {
          result,
        },
      })
      return result
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: GET_EXPORT_FAILED,
        payload: {
          error,
        },
      })
    })
}
export const setFilter = (filters) => (dispatch) => {
  dispatch({
    type: UPDATE_FILTERS,
    payload: filters,
  })
}

export const setSorting = (sort) => (dispatch) => {
  dispatch({
    type: UPDATE_SORT,
    payload: sort,
  })
}

// getters
export const getCurrentPage = (state) => state.tables && state.tables.page
export const getPageSize = (state) => state.tables && state.tables.pageSize
export const getPagesCount = (state) => state.tables && state.tables.pagesCount
export const getLoading = (state) => state.tables && state.tables.loading
export const getCount = (state) => state.tables && state.tables.count
export const getItems = (state) => state.tables && state.tables.items
export const getExportItems = (state) => state.tables && state.tables.reportItems

export const getLastKey = (state) =>  state.tables && state.tables.lastKey
export const getPrevKey = (state) => {
  if (!state.tables) {
    return null
  }

  if (!state.tables.prevKeys) {
    return null
  }

  if (!state.tables.prevKeys.length) {
    return null
  }

  return state.tables.prevKeys[state.tables.prevKeys.length - 2]
}

export const getPrevKeys = (state) => state.tables && state.tables.prevKeys
export const getFilters = ({ tables }) => tables.filters
export const getSorting = ({ tables }) => tables.sort
export const getCurrentPageSize = ({ tables }) => tables.currentPageSize
