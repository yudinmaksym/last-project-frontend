import React from 'react'
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'shards-react'
import Iframe from 'react-iframe'

const IFrameModal = ({ open, url, closeIframeModal}) => {
  return (
    <Modal open={open} className="modal-lg">
      <ModalHeader toggle={() => closeIframeModal(false)} closeAriaLabel />
      <ModalBody className='vh-75 overflow-auto'>

        <Iframe 
            url={url}
            width="800px"
            height="600px"
            className="iframe mb-4"
            display="initial"
            position="relative"
        />
      </ModalBody>
    </Modal>
  )
}

export default IFrameModal 
