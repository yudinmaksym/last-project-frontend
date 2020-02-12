import React from 'react'
import { connect } from 'react-redux'
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
} from 'shards-react'


const ConfirmationModal = ({ open, onClick, title, text, showCancel }) => {
  return (
    <Modal open={open}>
      <ModalHeader className='text-center'>{title}</ModalHeader>
      <ModalBody className='vh-75 overflow-auto'>{text}</ModalBody>
      <ModalFooter>
        <Button onClick={() => onClick({ success: true })}>OK</Button>
        {showCancel && (
          <Button theme="danger" onClick={() => onClick({ success: false })}>Cancel</Button>
        )}
      </ModalFooter>
    </Modal>
  )
}

ConfirmationModal.defaultProps = {
  title: 'Confirm action',
  showCancel: true,
}

export default connect(
  (state) => ({
    open: state.modals.showConfirmationModal,
    text: state.modals.confirmationModalText,
    onClick: state.modals.onConfirmationModalClick,
  })
)(ConfirmationModal) 
