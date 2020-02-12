import moment from 'moment'

import agent from '../../agent'

// actions
export const SET_PAGE = 'NOTIFICATION_AT_PROJECTLEVEL//SET_PAGE'
export const GET_ALL_REQUEST = 'NOTIFICATION_AT_PROJECTLEVEL//GET_ALL_REQUEST'
export const GET_ALL_SUCCESS = 'NOTIFICATION_AT_PROJECTLEVEL//GET_ALL_SUCCESS'
export const GET_ALL_FAILED = 'NOTIFICATION_AT_PROJECTLEVEL//GET_ALL_FAILED'
export const UPDATE_SORT = 'NOTIFICATION_AT_PROJECTLEVEL//UPDATE_SORT'

export const SET_DATE = 'NOTIFICATION_AT_PROJECTLEVEL//SET_DATE'
export const SET_DIFF = 'NOTIFICATION_AT_PROJECTLEVEL//SET_DIFF'
export const RESET_PAGE = 'NOTIFICATION_AT_PROJECTLEVEL//RESET_PAGE'
export const RESET_PAGINATION = 'NOTIFICATION_AT_PROJECTLEVEL//RESET_PAGINATION'


// state
const initialState = {
  sort: {},
  page: 0,
  pageSize: 50,
  pagesCount: 1,
  loading: false,
  count: 0,
  prevKey: null,
  lastKey: null,
  prevKeys: [],
  data: [],
  currentPageSize: 50,
  diff: 10,
  date:moment().subtract(3, 'month').format('YYYY-MM'),
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
      data: [],
    }

  case GET_ALL_SUCCESS:
    return {
      ...state,
      loading: false,
      page: action.payload.result.page,
      comparisonMonth:action.payload.result.comparison_month,
      count: action.payload.result.count,
      pagesCount: action.payload.result.pages,
      lastKey: action.payload.result.lastKey,
      currentPageSize: action.payload.result.items.length,
      data: [
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

  case SET_DATE:
    return {
      ...state,
      date: moment(action.payload.date).format('YYYY-MM-DD'),
    }

  case SET_DIFF:
    return {
      ...state,
      diff: action.payload.diff,
    }
  case RESET_PAGE:
    return {
      ...initialState,
    }

  case RESET_PAGINATION:
    return {
      ...state,
      page: 0,
      pageSize: 50,
      pagesCount: 1,
      count: 0,
      prevKey: null,
      lastKey: null,
      prevKeys: [],
      currentPageSize: 50,
    }

  case UPDATE_SORT:
    return {
      ...state,
      sort: action.payload,
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


export const getAll = (pageSize,page,topWorst=false) => (dispatch, getState) => {
  dispatch({
    type: GET_ALL_REQUEST,
  })

  const state = getState()
  const month = getDate(state)
  const diff = getDiff(state)
  const sorting = getSorting(state)
  const sort = sorting.desc ? 'desc' : 'asc'
  return agent.AlarmingTables.getListWithProjectLevel(pageSize, page,topWorst,month,diff,sort)
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

export const setDate = (date) => (dispatch) => {
  dispatch({
    type: SET_DATE,
    payload:{
      date,
    },
  })
}

export const setDiff = (diff) => (dispatch) => {
  dispatch({
    type: SET_DIFF,
    payload:{
      diff,
    },
  })
}

export const resetPage = () => (dispatch) => {
  dispatch({
    type: RESET_PAGE,

  })
}
export const resetPagination = () => (dispatch) => {
  dispatch({
    type: RESET_PAGINATION,

  })
}
export const setSorting = (sort) => (dispatch) => {
  dispatch({
    type: UPDATE_SORT,
    payload: sort,
  })
}

// getters
export const getCurrentPage = ({ notificationAtProjectLevel }) =>  notificationAtProjectLevel.page
export const getPageSize = ({ notificationAtProjectLevel }) => notificationAtProjectLevel.pageSize
export const getPagesCount = ({ notificationAtProjectLevel }) => notificationAtProjectLevel.pagesCount
export const getLoading = (notificationAtProjectLevel) => notificationAtProjectLevel.loading
export const getSorting = ({ notificationAtProjectLevel }) => notificationAtProjectLevel.sort

export const getDatas = ({ notificationAtProjectLevel }) => notificationAtProjectLevel.data
export const getComparisonMonths = ({ notificationAtProjectLevel }) => notificationAtProjectLevel.comparisonMonth
export const getDate =({ notificationAtProjectLevel }) =>  notificationAtProjectLevel.date
export const getDiff =({ notificationAtProjectLevel }) => notificationAtProjectLevel.diff
export const getCurrentPageSize = ({ notificationAtProjectLevel }) => notificationAtProjectLevel.currentPageSize
export const getCurrentCompany =({ companies }) => companies && companies.currentCompany

