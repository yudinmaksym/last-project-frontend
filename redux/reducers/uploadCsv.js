import uniqWith from 'lodash/uniqWith'

import agent from '../../agent'
import UploadConfirmationContent from '../../src/shared/UploadConfirmationContent'
import InvalidInvoiceUpload from '../../src/shared/InvalidInvoiceUpload'
import DuplicationIvoicesModal from '../../src/shared/DuplicationIvoicesModal'

import { showConfirmationModal } from './modals'
import { showAlert } from './alerts'
import { showStickLoader } from './loaders'

// actions

const duplicationComparator = (a, b) => {
  return  a.invoice_type == b.invoice_type
  && a.account_number == b.account_number
  && a.month === b.month
}

export const PUBLISH_REQUEST = 'UPLOAD//PUBLISH_REQUEST'
export const PUBLISH_SUCCESS = 'UPLOAD//PUBLISH_SUCCESS'
export const PUBLISH_FAILED = 'UPLOAD//PUBLISH_FAILED'
const initialState = {
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
  
  default:
    return state
  }
}

const onConfirmationModalSubmit = ({ success }) => (dispatch, getState) => {
  const { upload } = getState()
  dispatch(showConfirmationModal({ show: false, text: '' }))
  if(success) {
    dispatch(publish({ ...upload.uploadData, force: true }))
  }
}

const onDuplicationModalSubmit = ({ success }) => (dispatch, getState) => {
  const { upload } = getState()
  dispatch(showConfirmationModal({ show: false, text: '' }))
  if(success) {
    dispatch(publish({
      data: uniqWith(upload.uploadData.data, duplicationComparator),
    }))
  }
}

const onInvalidModalSumbit = () => (dispatch, getState) => {
  dispatch(showConfirmationModal({ show: false, text: '' }))
}

export const publish = (data) => (dispatch, getState) => {
  dispatch({
    type: PUBLISH_REQUEST,
    payload: data,
  })

  const tempItems = data.data.filter((item, index) =>
    data.data.findIndex((it) => duplicationComparator(item, it)) !== index)
  const possibleDuplications = data.data.filter(item =>
    tempItems.some(it => duplicationComparator(item, it)))

 
  if(possibleDuplications.length) {
    return dispatch(showConfirmationModal({ 
      show: true,
      text: (<DuplicationIvoicesModal items={possibleDuplications}/>),
      onClick: (res) => dispatch(onDuplicationModalSubmit(res)),
    }))
  }

  dispatch(showStickLoader(true))

  return agent.csvFile.create(data)
    .then(result => {
      if (result.success) {
        dispatch({
          type: PUBLISH_SUCCESS,
          payload: {
            result,
          },
        })
        dispatch(showAlert({ show: true, text: 'Publish successfull' }))
      } else {
        if(result.type == 'foundDuplicates') {
          dispatch(showConfirmationModal({ 
            show: true,
            text: (<UploadConfirmationContent items={result.result}/>),
            onClick: (res) => dispatch(onConfirmationModalSubmit(res)),
          }))
        } else if(result.type == 'ivalidInvoice') {
          dispatch(showConfirmationModal({ 
            show: true,
            text: (<InvalidInvoiceUpload items={result.result} />),
            onClick: (res) => dispatch(onInvalidModalSumbit(res)),
          }))
        }
      }
      return result
    })
    .catch(error => {
      dispatch({
        type: PUBLISH_FAILED,
        payload: {
          error,
        },
      })
    }).finally(() => dispatch(showStickLoader(false)))
}

