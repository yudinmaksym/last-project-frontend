import React, { useMemo } from 'react'
import { Modal, ModalHeader, ModalBody } from 'shards-react'     
import ReactTable from 'react-table'
import capitalize from 'lodash/capitalize'


const EndUseProfilesModal = ({ data, isOpen, handleClose }) => {
  const { TableHeaders = [], TableData = [] } = useMemo(() => {
    return {
      TableHeaders: [{
        Header: () => <div>Month</div>,
        minWidth: 100,
        // headerStyle,
        Cell: row => (
          <b>{row.original.name} </b>
        ),
      },
      ...data
        .map(({ name }) => {
          return {
            Header: () => <div>{name}</div>,
            minWidth: 100,
            // headerStyle,
            Cell: row => (
              <b>{row.original[name]} </b>
            ),
          }
        })],
      TableData: data.reduce((acc, { id, companyId, projectId, createdAt, updatedAt, name, ...rest }) => {
        Object.entries(rest).forEach(([k, v]) => {
          const existedGroup = acc.find(({ name }) => name.toLowerCase() === k.toLowerCase())
          if(existedGroup) {
            return existedGroup[name] = v
          }
          acc.push({ name: capitalize(k), [name]: v })
        })
        return acc
      }, []),
    }
  }, [data])
  

  return (
    <Modal open={isOpen} className="modal-lg" toggle={() => handleClose(false)}>
      <ModalHeader
        className='text-center'
        toggle={() => handleClose(false)}
        closeAriaLabel>End Use Profiles</ModalHeader>
      <ModalBody>
        <ReactTable
          showPageSizeOptions={false}
          showPageJump={false}
          columns={TableHeaders}
          sortable={false}
          showPagination={false}
          manual
          className='w-100'
          // loading={tableLoading}
          pageSize={1}
          data={TableData}
        />
      </ModalBody>
    </Modal>
  )
}

export default EndUseProfilesModal