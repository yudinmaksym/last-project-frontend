import { change, initialize, reset } from 'redux-form'

import agent from '../../agent'
import { FORM_KEY } from '../../src/forms/FileFieldsForm'
import { FORM_KEY as UPLOAD_FORM_KEY } from '../../src/forms/UploadForm'
import UploadConfirmationContent from '../../src/shared/UploadConfirmationContent'
import InvalidInvoiceUpload from '../../src/shared/InvalidInvoiceUpload'

import { showConfirmationModal } from './modals'
import { showAlert } from './alerts'
// actions

export const PUBLISH_REQUEST = 'UPLOAD//PUBLISH_REQUEST'
export const PUBLISH_SUCCESS = 'UPLOAD//PUBLISH_SUCCESS'
export const PUBLISH_FAILED = 'UPLOAD//PUBLISH_FAILED'

export const EXTRACT_FIELDS_REQUEST = 'EXTRACT_FIELDS_REQUEST'
export const EXTRACT_FIELDS_SUCCESS = 'EXTRACT_FIELDS_SUCCESS'
export const EXTRACT_FIELDS_FAILED = 'EXTRACT_FIELDS_FAILED'

// state
const initialState = {
  uploadData: {},
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
  case PUBLISH_REQUEST:
    return {
      ...state,
      uploadData: action.payload,
    }

  default:
    return state
  }
}

// actions handlers
const addFile = file => ({
  type: ADD_FILE,
  payload: {
    file,
  },
})

export const addFiles = files => dispatch => {
  dispatch({ type: ADD_FILES })
  files.map(f => formatFile(f)).forEach(f => dispatch(addFile(f)))
}

export const removeFile = file => ({
  type: REMOVE_FILE,
  payload: {
    file,
  },
})

export const updateFile = (file, data) => ({
  type: UPDATE_FILE,
  payload: {
    file,
    data,
  },
})

const onConfirmationModalSubmit = ({ success }) => (dispatch, getState) => {
  const { upload } = getState()

  dispatch(showConfirmationModal({ show: false, text: '' }))
  if (!success) {
    return dispatch(reset(UPLOAD_FORM_KEY))
  }
  dispatch(publish({ ...upload.uploadData, force: true }))
}

const onInvalidModalSumbit = ({ success }) => (dispatch, getState) => {
  dispatch(showConfirmationModal({ show: false, text: '' }))
  dispatch(reset(UPLOAD_FORM_KEY))
}

export const publish = (data) => (dispatch, getState) => {
  dispatch({
    type: PUBLISH_REQUEST,
    payload: data,
  })

  return agent.Upload.publish(data)
    .then(result => {
      if (result.success) {
        dispatch({
          type: PUBLISH_SUCCESS,
          payload: {
            result,
          },
        })
        dispatch(reset(UPLOAD_FORM_KEY))

        if (result.invalidInvoices) {
          dispatch(showConfirmationModal({ 
            show: true,
            text: (<InvalidInvoiceUpload items={result.invalidMeters} />),
            onClick: (res) => dispatch(onInvalidModalSumbit(res)),
          }))
        }

        dispatch(showAlert({ show: true, text: 'Publish successfull' }))
      } else {
        if(result.type == 'foundDuplicates') {
          dispatch(showConfirmationModal({ 
            show: true,
            text: (<UploadConfirmationContent items={result.result}/>),
            onClick: (res) => dispatch(onConfirmationModalSubmit(res)),
          }))
        } else if(result.type == 'invalidInvoices') {
          console.log(result)
          dispatch(showConfirmationModal({ 
            show: true,
            text: (<InvalidInvoiceUpload items={result.result} />),
            onClick: (res) => dispatch(onInvalidModalSumbit(res)),
          }))
        }
      }
    })
    .catch(error => {
      dispatch({
        type: PUBLISH_FAILED,
        payload: {
          error,
        },
      })
    })
}

const validateSuccess = (formField, response) => dispatch => {
  response[0].selected = true

  dispatch(
    initialize(FORM_KEY, {
      invoices: response,
    })
  )

  dispatch({
    type: EXTRACT_FIELDS_SUCCESS,
    payload: {
      response,
    },
  })
}

export const extractFields = (formField, data) => (dispatch, getState) => {
  dispatch({
    type: EXTRACT_FIELDS_REQUEST,
    payload: {
      formField,
      data,
    },
  })

  return agent.Upload.extractData(data)
    .then(result => {
      const { invoices } = result
      dispatch(validateSuccess(formField, invoices))
    })
    .catch(error => {
      dispatch({
        type: EXTRACT_FIELDS_FAILED,
        payload: {
          error,
        },
      })
    })
}

// getters
export const getExpectedFields = state =>
  state.upload && state.upload.expectedFields
