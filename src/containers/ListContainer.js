import * as React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import moment from 'moment'
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
} from 'shards-react'

import { 
  getPageSize,
  getCount,
  getItems,
  getLoading,
  getPagesCount,
  getCurrentPage,
  
  getAll,
  setPage,
  getLastKey,
  getPrevKey,
} from '../../redux/reducers/list'
import DebounceTableHeader from '../fields/DebounceTableHeader'


const formatS3Link = (bucket, key) => `https://${bucket}.s3.amazonaws.com/${key}`

const formatDate = (timestamp) => moment(timestamp).format('MM/DD/YYYY')

class ListContainer extends React.Component {
  static defaultProps = {
    pageSize: 25,
  }

  getColumns() {
    return [
      {
        Header: () => <DebounceTableHeader title={'Name'}/>,
        accessor: 'file_name',
        className: 'text-right',
      },
      {
        Header: () => <DebounceTableHeader title={'Date'}/>,
        accessor: 'created_at',
        width: 200,
        className: 'text-right',
        Cell: row => <span>{formatDate(row.original.created_at)}</span>,
      },
      {
        Header: () => <DebounceTableHeader title={'Status'}/>,
        accessor: 'file_status',
        maxWidth: 100,
        className: 'text-right',
      },
      {
        Header: () => <DebounceTableHeader title={'User'}/>,
        accessor: 'company_id',
        maxWidth: 100,
        className: 'text-right',
      },
      {
        Header: () => <DebounceTableHeader title={'File'}/>,
        accessor: 'id',
        width: 100,
        sortable: false,
        Cell: row => (
          <ButtonGroup size="sm" className="d-table ml-auto">
            <a 
              href={formatS3Link(row.original.s3_bucket_name, row.original.s3_key)}
              target="_blank"
              className="btn btn-white"
            >Download</a>
          </ButtonGroup>
        ),
      },
    ]   
  }

  handlePageChange = (page) => {
    this.props.setPage(page)

    let lastKey

    const isNextPage = page > this.props.page

    if (page !== 0) {
      if (isNextPage) {
        lastKey = this.props.lastKey
      } else {
        lastKey = this.props.prevKey
      }
    }
    
    this.props.loadNext(
      this.props.pageSize,
      lastKey,
      isNextPage
    )
  }

  render() {
    const { 
      page,
      pages,
      lastKey,
      loading,
      items,
      pageSize,
    } = this.props

    const tableColumns = this.getColumns()

    return (
      <Card>
        <CardBody className="p-0">
          <ReactTable
            showPageSizeOptions={false}
            showPageJump={false}
            columns={tableColumns}
            sortable={false}
            
            manual
            page={page}
            pages={pages}
            loading={loading}
            pageSize={pageSize}
            resizable={false}

            data={items}
            onPageChange={this.handlePageChange}
          />
        </CardBody>
      </Card>
    )
  }

}


export default connect(
  (state) => ({
    page: getCurrentPage(state),
    pageSize: getPageSize(state),
    pages: getPagesCount(state),
    loading: getLoading(state),
    count: getCount(state),
    lastKey: getLastKey(state),
    prevKey: getPrevKey(state),
    items: getItems(state),
  }),
  (dispatch) => ({
    loadNext: (pageSize, lastKey, isNext) => dispatch(getAll(pageSize, lastKey, isNext)),
    setPage: (page) => dispatch(setPage(page)),
  })
)(ListContainer)