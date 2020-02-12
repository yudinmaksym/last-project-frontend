import Router from 'next/router'
import { diff } from 'deep-object-diff'
import { differenceBy, omit, uniqBy, cloneDeep } from 'lodash'
import { initialize, SubmissionError } from 'redux-form'

import agent from '../../agent'

import {
  getCurrentCompany,
  SET_LIST_COMPANIES,
} from './companies'
import { showAlert } from './alerts'


export const SET_CURRENT_USER = 'USERS//SET_CURRENT_USER'
export const GET_CURRENT_USER = 'USERS//GET_CURRENT_USER'
export const GET_LIST_USERS = 'USERS//SET_CURRENT_USER'
export const SET_LIST_USERS = 'USERS//SET_LIST_USERS'
export const SET_SELECTED_USER = 'USERS//SET_SELECTED_USER'
export const SET_LOADING = 'USERS//SET_LOADING'
export const SET_ERROR = 'USERS//SET_ERROR'

const initialState = {
  currentUser: { },
  selectedUser: { },
  list: {
    page: 0,
    pageSize: 10,
    pagesCount: 0,
    count: 0,
    items: [],
  },
  loading: false,
  error: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_CURRENT_USER:
    return {
      ...state,
      currentUser: action.payload,
    }

  case SET_LIST_USERS:
    return {
      ...state,
      list: {
        ...state.list,
        items: action.payload.data,
        count: action.payload.total,
        pagesCount: Math.ceil(action.payload.total / state.list.pageSize),
        page: action.payload.page,
      },
    }

  case SET_SELECTED_USER:
    return {
      ...state,
      selectedUser: action.payload || {},
    }

  case SET_LOADING:
    return {
      ...state,
      loading: action.payload,
      error: action.payload ? '' : state.error,
    }

  case SET_ERROR:
    return {
      ...state,
      error: action.payload,
    }

  default:
    return state
  }
}

const takaRoles = ['TakaAdmin', 'TakaUser']

export const getPageSize = state => state.users.list.pageSize

export const getCurrentUser = state => state.currentUser

export const setCurrentUser = payload => async dispatch => {
  const { data } = await agent.Auth.me()
  dispatch({ type: SET_CURRENT_USER, payload: data })
  dispatch({ type: SET_LIST_COMPANIES, payload: data.companyMap.map(({ company }) => company) })
  await dispatch(getCurrentCompany(data.companyId))
  return data
}

export const loadCurrentUser = payload => async dispatch => {
  const { data } = await agent.Auth.me()
  console.log(data)
  dispatch({ type: SET_LIST_COMPANIES, payload: data.companyMap.map(({ company }) => company) })
  return data
}

export const loadListUsers = (pageSize, page = 0, filters) => async dispatch => {
  try {
    dispatch({ type: SET_LOADING, payload: true })
    const { rows, count } = await agent.Users.getAll(pageSize, page, filters)
    dispatch({
      type: SET_LIST_USERS,
      payload: {
        data: rows,
        total: count,
        page,
      },
    })
  } catch (e) {
    dispatch({ type: SET_ERROR, payload: { message: e.response.text } })
  } finally {
    dispatch({ type: SET_LOADING, payload: false })
  }
}

export const deleteUser = id => async (dispatch, getState) => {
  const data = await agent.Users.delete(id)
  const { users } = getState()
  dispatch(loadListUsers(users.list.pageSize, users.list.page))
}

export const loadUser = id => async dispatch => {
  const { data } = await agent.Users.get(id)
  dispatch({
    type: SET_SELECTED_USER,
    payload: data,
  })
}

export const setSelectedUser = (data) => dispatch => {
  dispatch({ type: SET_SELECTED_USER, payload: data })
}

export const getSelectedUser = state => state.users.selectedUser

export const updateUser = (id, user) => async (dispatch, getState) => {
  try {
    const prev = getSelectedUser(getState())
    const payload = omit(Object.entries(diff(prev, user)).reduce((acc, [k, v]) => {
      return v ? { ...acc, [k]: v } : acc
    }, {}), 'projects')

    const projectsA = differenceBy(prev.projects, user.projects, 'value')
    const projectsB = differenceBy(user.projects, prev.projects, 'value')
    const projects = uniqBy([...projectsA, ...projectsB], 'value')
    projects.length && Object.assign(payload, { projects: projects.map(({ value }) => ({ id: value })) })

    if (!Object.keys(payload).length) return
    const { data } = await agent.Users.update(id, payload)
    dispatch({ type: SET_SELECTED_USER, payload: data })
    initialize('userDetails', data)
    dispatch(showAlert({ text: 'User successfully updated', show: true }))
    const { users } = getState()
    const currentUser = getCurrentUser(users)
    currentUser.id === id && dispatch(setCurrentUser())
  } catch (error) {
    console.error(error)
    const message =
        (error
          && error.response
          && error.response.body
          && error.response.body.message)
        || 'System error'
    console.log(message)
    const formErrors = {}
    if(message.includes('email')) {
      Object.assign(formErrors, { email: message })
    } else {
      Object.assign(formErrors, { _error: message })
    }
    throw new SubmissionError(formErrors)
    // dispatch({ type: SET_ERROR, payload: { message: 'e.response.text' } })
  } finally {
    dispatch({ type: SET_LOADING, payload: false })
  }
}

export const createUser = payload => async dispatch => {
  try {
    const updateObj = cloneDeep(payload)
    Object.assign(updateObj, { projects: (payload.projects || []).map(({ value }) => ({ id: value })) })
    const { data } = await agent.Users.create(updateObj)
    dispatch({
      type: SET_SELECTED_USER,
      payload: data,
    })
    const path = takaRoles.includes(data.role) ? '/users/taka-users' : '/users'
    Router.replace(path)
  } catch (error) {
    const message =
        (error
          && error.response
          && error.response.body
          && error.response.body.message)
        || 'System error'
    const formErrors = {}
    if(message.includes('email')) {
      Object.assign(formErrors, { email: message })
    } else {
      Object.assign(formErrors, { _error: message })
    }
    throw new SubmissionError(formErrors)
  } finally {
    dispatch({ type: SET_LOADING, payload: false })
  }
}
