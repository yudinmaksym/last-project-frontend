import Router from 'next/router'
import { diff } from 'deep-object-diff'
import { initialize } from 'redux-form'

import agent from '../../agent'

import { showAlert } from './alerts'


export const GET_LIST_SALES_OPPORTUNITIES = 'SALES_OPPORTUNITIES//SET_CURRENT_USER'
export const SET_LIST_SALES_OPPORTUNITIES = 'SALES_OPPORTUNITIES//SET_LIST_USERS'
export const SET_LOADING = 'SALES_OPPORTUNITIES//SET_LOADING'
export const SET_ERROR = 'SALES_OPPORTUNITIES//SET_ERROR'
export const SET_LOADED_OPPORTUNITY = 'A/SALES_OPPORTUNITIES//SET_LOADED_OPPORTUNITY'

const initialState = {
  list: {
    page: 0,
    pageSize: 10,
    pagesCount: 0,
    count: 0,
    items: [],
  },
  loadedOpportunity: {},
  loading: false,
  error: '',
}

export default (state = initialState, action) => {
  switch(action.type) {
  case SET_LIST_SALES_OPPORTUNITIES: return {
    ...state,
    list: {
      ...state.list,
      items: action.payload.data,
      count: action.payload.total,
      pagesCount: Math.ceil(action.payload.total/state.list.pageSize),
      page: action.payload.page,
    },
  }

  case SET_LOADING: return {
    ...state,
    loading: action.payload,
    error: action.payload ? '' : state.error,
  }
  
  case SET_ERROR: return {
    ...state,
    error: action.payload,
  }

  case SET_LOADED_OPPORTUNITY: return {
    ...state,
    loadedOpportunity: { ...action.payload },
  }
  default: return state
  }
}

export const getPageSize = (state) => state.users.list.pageSize

export const loadList = (pageSize, page = 0) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING, payload: true })
    const { data } = await agent.Customers.getAll(pageSize, page)
    dispatch({
      type: SET_LIST_SALES_OPPORTUNITIES,
      payload: {
        data: data.rows,
        total: data.count,
        page: page,
      },
    })
  } catch (e) {
    console.log(e)
    // dispatch({ type: SET_ERROR, payload: { message: e.response.text } })
  } finally {
    dispatch({ type: SET_LOADING, payload: false })
  }
}

// export const createSalesOpportunity = (payload) => async (dispatch) => {
//   try {
//     await agent.SalesOpportunity.create(payload)
//     Router.replace('/sales-opportunities')
//     dispatch(showAlert({ show: true, text: 'Sales opportunity successfully craeted' }))
//     dispatch(initialize('wizard', {}))
//   } catch (e) {
//     dispatch({ type: SET_ERROR, payload: { message: e.response.text } })
//   } finally {
//     dispatch({ type: SET_LOADING, payload: false })
//   }
// }

// export const loadOpportunity = (id) => async (dispatch) => {
//   const { data } = await agent.SalesOpportunity.get(id)
//   dispatch({ type: SET_LOADED_OPPORTUNITY, payload: data })
// }

// export const updateOpportunity = ({ id, ...data }) => async (dispatch, getState) => {
//   const { salesOpportunity: { loadedOpportunity } } = getState()
//   const diffKeys = Object.keys(diff(data, loadedOpportunity))
//   const payload = diffKeys.reduce((acc, c) => ({ ...acc, [c]: data[c] }), {})
//   await agent.SalesOpportunity.update(id, payload)
//   Router.replace('/sales-opportunities')
//   dispatch(initialize('wizard', {}))
//   dispatch(showAlert({ show: true, text: 'Sales opportunity successfully updated' }))
// }
