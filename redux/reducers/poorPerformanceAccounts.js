import agent from '../../agent'

// actions
export const GET_ALL_REQUEST = 'POOR_PROJECT_LIST//GET_ALL_REQUEST'
export const GET_ALL_SUCCESS = 'POOR_PROJECT_LIST//GET_ALL_SUCCESS'
export const GET_ALL_FAILED = 'POOR_PROJECT_LIST//GET_ALL_FAILED'


// state
const initialState = {
  loading: false,
  count: 0,
  data: [],
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {

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
      comparisonMonth:action.payload.result.comparison_month,
      count: action.payload.result.count,
      data: [
        ...action.payload.result.items,
      ],
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

export const getAll = () => (dispatch) => {
  dispatch({
    type: GET_ALL_REQUEST,
  })

  return agent.PoorProjectList.getAll()
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


// getters

export const getLoading = ({ poorPerformanceAccounts }) => poorPerformanceAccounts && poorPerformanceAccounts.loading
export const getDatas = ({ poorPerformanceAccounts }) => poorPerformanceAccounts && poorPerformanceAccounts.data
export const getComparisonMonths = ({ poorPerformanceAccounts }) => poorPerformanceAccounts
  && poorPerformanceAccounts.comparisonMonth
export const getCurrentCompany = ({ companies }) => companies && companies.currentCompany

