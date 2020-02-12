import omit from 'lodash/omit'
import Router from 'next/router'
import { SubmissionError } from 'redux-form'

import agent from '../../agent'

import { setCurrentUser, loadCurrentUser } from './users'
import { showStickLoader } from './loaders'


const initialState = {
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
      
  default:
    return state
  }
}

export const signIn = (data, setCookie) => async (dispatch) => {
  try {
    dispatch(showStickLoader(true))
    const { accessToken } = await agent.Auth.token(data)
    const token = `Bearer ${accessToken}`
    agent.setToken(token)
    setCookie('token', token, { path: '/' })
    const user = await dispatch(loadCurrentUser())
    if(['TakaAdmin', 'TakaUser'].includes(user.role)) {
      return Router.replace('/auth/admin')
    }
    await dispatch(setCurrentUser())
    user.lastAccessDate
      ? Router.replace('/')
      : Router.replace('/info')
  } catch (error) {
    const message =
        (error
          && error.response
          && error.response.body
          && error.response.body.message)
        || 'System error'
    console.log(message)
    const formErrors = {}
    if( message.includes('Password')) {
      Object.assign(formErrors, { password: message })
    } else if(message.includes('User')) {
      Object.assign(formErrors, { email: message })
    } else {
      Object.assign(formErrors, { _error: message })
    }
    throw new SubmissionError(formErrors)
  } finally {
    dispatch(showStickLoader(false))
  }
}

export const signUp = (user, setCookie) => async (dispatch) => {
  try {
    dispatch(showStickLoader(true))
    await agent.Auth.signUp(user)
    dispatch(signIn(omit(user, 'name'), setCookie))
  } catch (error) {
    const message =
    (error
      && error.response
      && error.response.body
      && error.response.body.message)
    || 'System error'
    const formErrors = {}
    if( message.includes('email')) {
      Object.assign(formErrors, { email: message })
    } else {
      Object.assign(formErrors, { _error: message })
    }
    dispatch(showStickLoader(false))
    throw new SubmissionError(formErrors)
  }
  
}

export const exchange = (payaload, setCookie) => async (dispatch) => {
  dispatch(showStickLoader(true))
  const { data } = await agent.Auth.exchange(payaload)
  const token = `Bearer ${data}`
  agent.setToken(token)
  setCookie('token', token, { path: '/' })
  await dispatch(setCurrentUser())
  dispatch(showStickLoader(false))
  Router.replace('/info')
}

export const requestResetPassword = (payaload) => async (dispatch) => {
  try {
    dispatch(showStickLoader(true))
    const { data } = await agent.Auth.requestResetPassword(payaload)
  } catch (error) {
    const message =
    (error
      && error.response
      && error.response.body
      && error.response.body.message)
    || 'System error'
    const formErrors = {}
    if( message.includes('email')) {
      Object.assign(formErrors, { email: message })
    } else {
      Object.assign(formErrors, { _error: message })
    }
    throw new SubmissionError(formErrors)
  } finally {
    dispatch(showStickLoader(false))
  }
}

export const resetPassword = (payaload) => async (dispatch) => {
  try {
    dispatch(showStickLoader(true))
    const { data } = await agent.Auth.resetPassword(payaload)
    Router.replace('/auth/login')
  } catch (error) {
    const message =
    (error
      && error.response
      && error.response.body
      && error.response.body.message)
    || 'System error'
    console.log(message)
    const formErrors = {}
    Object.assign(formErrors, { _error: message })
    throw new SubmissionError(formErrors)
  } finally {
    dispatch(showStickLoader(false))
  }
}