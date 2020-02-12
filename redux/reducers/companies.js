import Router from 'next/router'

import agent from '../../agent'

import { showStickLoader } from './loaders'
import { exchange } from './auth'


export const SET_CURRENT_COMPANY = 'COMPANIES//SET_CURRENT_COMPANY'
export const SET_LIST_COMPANIES = 'COMPANIES//SET_LIST_COMPANIES'
export const SET_LOADING = 'COMPANIES//SET_LOADING'
export const SET_ERROR = 'COMPANIES//SET_ERROR'
export const SET_SELECTED_COMPANY = 'COMPANIES//SET_SELECTED_COMPANY'

const initialState = {
  list: [],
  currentCompany: {},
  selectedCompany: {},
  loading: false,
  error: '',
}

export default (state = initialState, action) => {
  switch(action.type) {
  case SET_CURRENT_COMPANY: return {
    ...state,
    currentCompany: action.payload,
  }

  case SET_SELECTED_COMPANY: return {
    ...state,
    selectedCompany: action.payload,
  }

  case SET_LOADING: return {
    ...state,
    loading: action.payload,
    error: action.payload ? '' : state.error,
  }

  case SET_LIST_COMPANIES: return {
    ...state,
    list: action.payload,
  }

  case SET_ERROR: return {
    ...state,
    error: action.payload.response.body,
  }

  default: return state
  }
}


export const getCompany = ({ companies }) => companies.currentCompany

export const getCurrentCompany = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING, payload: true })
    const { data } = await agent.Companies.get(companyId)
    dispatch({ type: SET_CURRENT_COMPANY, payload: data })
  } catch (e) {
    dispatch({ type: SET_ERROR, payload: e })
  } finally {
    dispatch({ type: SET_LOADING, payload: false })
  }
}

export const getListCompanies = () => async (dispatch) => {
  try {
    dispatch(showStickLoader(true))
    const { data } = await agent.Companies.getAll()
    dispatch({ type: SET_LIST_COMPANIES, payload: data.rows.map(({ company }) => company) })
  } catch (e) {
    dispatch({ type: SET_ERROR, payload: e })
  } finally {
    dispatch(showStickLoader(false))
  }
}

export const loadCompany = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING, payload: true })
    const { data } = await agent.Companies.get(companyId)
    dispatch({ type: SET_SELECTED_COMPANY, payload: data })
  } catch (e) {
    Router.push('/customers')
    dispatch({ type: SET_ERROR, payload: e })
  } finally {
    dispatch({ type: SET_LOADING, payload: false })
  }
}

export const changeCompany = (payload, setCookie, pathname) => async (dispatch) => {
  try {
    dispatch(showStickLoader(true))
    await dispatch(exchange(payload, setCookie))
    Router.push(pathname)
  }catch{
    dispatch({ type: SET_ERROR, payload: e })
  }finally {
    dispatch(showStickLoader(false))
  }
}

export const updateCompany = ({ id, ...company }) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING, payload: true })
    const { data } = await agent.Companies.update(id, company)
    Router.push('/customers')
    // dispatch({ type: SET_SELECTED_COMPANY, payload: data })
  } catch (e) {
    console.log(e)
    Router.push('/customers')
    dispatch({ type: SET_ERROR, payload: e })
  } finally {
    dispatch({ type: SET_LOADING, payload: false })
  }
}

export const createCompany = ({ label: name, ...company }) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING, payload: true })
    await agent.Companies.create({ name, ...company })
  } catch (e) {
    console.log(e)
    dispatch({ type: SET_ERROR, payload: e })
  } finally {
    Router.push('/customers')
    dispatch({ type: SET_LOADING, payload: false })
  }
}

export const deleteCompany = (id) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING, payload: true })
    await agent.Companies.create(id)
  } catch (e) {
    console.log(e)
    dispatch({ type: SET_ERROR, payload: e })
  } finally {
    Router.push('/customers')
    dispatch({ type: SET_LOADING, payload: false })
  }
}


