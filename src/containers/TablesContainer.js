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
} from 'shards-react'

import DebounceTableHeader from '../fields/DebounceTableHeader'
import DateRangePickerTableHeader from '../fields/DateRangePickerTableHeader'
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
  DEWA_ELECTRIC,
  DEWA_WATER,
  CHILLED_WATER,
} from '../types/files'


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

class TablesContainer extends React.Component {
  onFilterChange = (e) => {
    this.props.setFilter({ [e.target.name]: e.target.value })
    this.props.loadNext(
      this.props.pageSize,
    )
  }

  onDateFilterChange = (startDate, endDate) => {
    this.props.setFilter({ startDate, endDate })
    this.props.loadNext(
      this.props.pageSize,
    )
  }

  getColumns() {
    return [
      {
        Header: () => (
          <DebounceTableHeader title={'Actions'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'id',
        width: 80,
        sortable: false,
        Cell: row => (
          <ButtonGroup size="sm" className="d-table ml-auto">
            <Link
              to={`/consumptions/edit?id=${row.original.id}`}
              className="btn btn-white"
            >
              <i className="material-icons">&#xE254;</i>
            </Link>
          </ButtonGroup>
        ),
      },
      {
        Header: () => (
          <DebounceTableHeader
            title={'Zone Name'}
            debounceOptions={{
              values: this.props.filters,
              timeout: 1000,
              name: 'zone_name',
              onFilterChange: this.onFilterChange,
            }}/>
        ),
        headerClassName: 'd-flex align-items-center justify-content-center',
        width: 200,
        accessor: 'zone_name',
        className: 'text-right',
        Cell: row => (
          <span>{get(row, 'original.project.zone.name')}</span>
        ),
      },
      {
        Header: () => (
          <DebounceTableHeader
            title={'Project Name'}
            debounceOptions={{
              values: this.props.filters,
              timeout: 1000,
              name: 'name',
              onFilterChange: this.onFilterChange,
            }}/>
        ),
        headerClassName: 'd-flex align-items-center justify-content-center',
        width: 200,
        accessor: 'name',
        className: 'text-right',
        Cell: row => (
          <span>{get(row, 'original.project.name')}</span>
        ),
      },
      {
        Header: () => (
          <DebounceTableHeader
            title={'Meter Name'}
            debounceOptions={{
              values: this.props.filters,
              timeout: 1000,
              name: 'meter_name',
              onFilterChange: this.onFilterChange,
            }}/>
        ),
        headerClassName: 'd-flex align-items-center justify-content-center',
        accessor: 'meter_name',
        minWidth: 200,
        className: 'text-center d-flex align-items-center',
        Cell: row => (
          <span>{get(row, 'original.meter.meter_name')}</span>
        ),
      },
      {
        Header: () => (
          <DateRangePickerTableHeader title={'Month'}
            onChange={this.onDateFilterChange}
            values={this.props.filters}
            />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'month',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
        Cell: row => <span>{formatMonthDate(row.original.month)}</span>,
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Invoice Type'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'invoice_type',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Consumption'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'consumption',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Consumption (AED)'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'consumption_AED',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Sub-Tenant Consumption'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'sub_tenant_consumption',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Sub-Tenant Consumption (AED)'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'sub_tenant_consumption_AED',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Total Building Consumption'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'total_building_consumption',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Total Building Consumption (AED)'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'total_building_consumption_AED',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Start Date'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'start_date',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
        Cell: row => <span>{formatDate(row.original.start_date)}</span>,
      },
      {
        Header: () => (
          <DebounceTableHeader title={'End Date'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'end_date',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
        Cell: row => <span>{formatDate(row.original.end_date)}</span>,
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Days'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'id',
        width: 80,
        sortable: false,
        Cell: row => (
          <span>
            {daysDiff(row.original.start_date, row.original.end_date)}
          </span>
        ),
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Current Reading'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'current_reading',
        minWidth: 200,
        className: 'text-center d-flex align-items-center',
      },

      {
        Header: () => (
          <DebounceTableHeader title={'Previous Reading'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'previous_reading',
        minWidth: 200,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Created At'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'createdAt',
        width: 200,
        className: 'text-right',
        Cell: row => <span>{formatDate(row.original.createdAt)}</span>,
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
    page: getCurrentPage(state),
    pageSize: getPageSize(state),
    pages: getPagesCount(state),
    loading: getLoading(state),
    count: getCount(state),
    lastKey: getLastKey(state),
    prevKey: getPrevKey(state),
    items: getItems(state),
    filters: getFilters(state),
    currentPageSize: getCurrentPageSize(state),
  }),
  (dispatch) => ({
    loadNext: (pageSize, isNextPage) => dispatch(getAll(pageSize, isNextPage)),
    setPage: (page) => dispatch(setPage(page)),
    setFilter: (filter) => dispatch(setFilter(filter)),
    setSorting: (sorting) => dispatch(setSorting(sorting)),
  })
)(TablesContainer)
