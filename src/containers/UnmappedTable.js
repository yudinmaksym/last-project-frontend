import * as React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import moment from 'moment'
import { get } from 'lodash'
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Button,
  FormSelect,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'shards-react'

import DebounceTableHeader from '../fields/DebounceTableHeader'
import Link from '../components/common/Link'
import { 
  getPageSize,
  getCount,
  getLastKey,
  getItems,
  getLoading,
  getPagesCount,
  getCurrentPage,

  getAll,
  setPage,
  getPrevKey,
  getPrevKeys,
  setFilter,
  getFilters,
  setSorting,
  getCurrentPageSize,
} from '../../redux/reducers/tables'
import {
  getUnmapped,
  rejectUnmapped,
  saveUnmapped,
} from '../../redux/reducers/meters'
import { 
  DEWA_ELECTRIC,
  DEWA_WATER,
  CHILLED_WATER,
} from '../types/files'
import MeterEditForm from '../forms/MeterEditForm'


const daysDiff = (startDate, endDate) => {
  startDate = moment(startDate)
  endDate = moment(endDate)

  return endDate.diff(startDate, 'days')
}

const formatDate = (timestamp) => moment(timestamp).format('MM/DD/YYYY')

const formatMonthDate = (month) => moment(month).format('MMM YYYY')

const formatType = (type = 'N/A') => {
  type = type.trim()
  
  switch (type) {
  case DEWA_ELECTRIC:
    return 'DEWA Electric'

  case DEWA_WATER:
    return 'DEWA Water'
  
  case CHILLED_WATER:
    return 'Chilled Water'

  default:
    return `[${type}]`
  }
} 

class UnmappedTable extends React.Component {
  
  state = {
    modal: false,
    meter: null,
  }

  save = (meter) => () => {
    this.setState({
      meter,
      modal: true,
    })
  }

  reject = (id) => () => this.props.rejectUnmapped(id)
 
  getColumns() {
    return [
      {
        Header: () => <DebounceTableHeader title={'Actions'}/>,
        accessor: 'id',
        width: 200,
        sortable: false,
        Cell: row => (
          <ButtonGroup size="sm" className="d-table ml-auto">
            <Button
              theme="primary" 
              outline 
              onClick={this.save(row.original)}
            >
              <i className="material-icons">get_app</i>{' '}Save
            </Button>
            <Button
              theme="danger" 
              outline 
              onClick={this.reject(row.original.id)}
            >
              <i className="material-icons">delete</i>{' '}Reject
            </Button>
          </ButtonGroup>
        ),
      },
      {
        Header: () => <DebounceTableHeader title={'Account Number'}/>,
        accessor: 'account_number', 
      },
      {
        Header: () => <DebounceTableHeader title={'Meter Number'}/>,
        accessor: 'meter_number', 
      },
      {
        Header: () => <DebounceTableHeader title={'Fuel Type'}/>,
        accessor: 'fuel_type', 
      },  
    ]   
  }

  handleSortedChange = ([option]) => {
    this.props.setSorting(option)
    this.props.loadNext(
      this.props.pageSize,
    )
  }

  handlePageChange = (page) => {
    this.props.setPage(page)

    this.props.loadNext(
      this.props.pageSize,
    )
  }

  handleCloseModal = () => this.setState({ modal: false, id: null })

  handleMeterSave = (data) => {
    const { id, ...meterData } = data
    
    this.props.saveUnmapped(
      id,
      meterData
    )

    this.handleCloseModal()
  }

  renderSaveModal() {
    const { modal, meter } = this.state

    return (
      <Modal open={modal}>
        <ModalHeader className='text-center'>Save Meter</ModalHeader>
        <ModalBody className="px-0">
          <MeterEditForm 
            onSubmit={this.handleMeterSave}
            onCancel={this.handleCloseModal}
            initialValues={{
              ...meter,
              project_id: (meter && meter.project_id !== '-1') && meter.project_id,
            }}
          />
        </ModalBody>
      </Modal>
    )
  }

  render() {
    const { 
      page,
      pages,
      loading,
      items,
      pageSize,
      currentPageSize,
    } = this.props

    const tableColumns = this.getColumns()


    return (
      <Card>
        <CardBody className="p-0">
          {this.renderSaveModal()}
          {/* <code>
            {JSON.stringify(this.props.prevKeys)}
          </code> */}
          <ReactTable
            showPageSizeOptions={false}
            showPageJump={false}
            columns={tableColumns}
            sortable={true}
            manual
            
            page={page}
            pages={pages}
            loading={loading}
            pageSize={currentPageSize}
            resizable={false}

            data={items}
            onPageChange={this.handlePageChange}
            onSortedChange={this.handleSortedChange}
          />
        </CardBody>
      </Card>
    )
  }
}


export default connect(
  (state) => ({
    // page: getCurrentPage(state),
    // pageSize: getPageSize(state),
    // pages: getPagesCount(state),
    // loading: getLoading(state),
    // count: getCount(state),
    // lastKey: getLastKey(state),
    // prevKey: getPrevKey(state),
    items: getUnmapped(state),
    // filters: getFilters(state),
    // currentPageSize: getCurrentPageSize(state),
  }),
  (dispatch) => ({
    rejectUnmapped : (meterId) => dispatch(rejectUnmapped(meterId)),
    saveUnmapped : (meterId, data) => dispatch(saveUnmapped(meterId, data)),
  })
)(UnmappedTable) 