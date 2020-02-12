import * as React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import moment from 'moment'
import {
  Card,
  CardBody,
} from 'shards-react'
import _debounce from 'lodash/debounce'

import DebounceTableHeader from '../fields/DebounceTableHeader'
import {
  getLoading,
  getAll,
  getCurrentPage,
  getPagesCount,
  getPageSize,
  setPage,
  setSorting,
  setDate, setDiff, getDiff, getDate, getDatas, getComparisonMonths,resetPage,getCurrentCompany,resetPagination,
} from '../../redux/reducers/notificationAtProjectLevel'
import DateSelect from '../components/monthlymv/DateSelect'


class NotificationTableContainer extends React.Component {
  static defaultProps = {
    pageSize: 25,
  }

  componentDidMount(){
    this.props.getAll(50, 0 )
  }
  componentWillUnmount() {
    this.props.resetPage()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.currentCompany !== this.props.currentCompany){
      this.props.resetPage()
      this.props.getAll(50, 0 )
    }
  }
  handleDiffChange = async (e) => {
    const { page, pageSize } = this.props
    await this.props.setDiff(e.target.value)
    this.props.resetPagination()
    const debounce = _debounce(() => {
      this.props.getAll(pageSize, page)
    } , 1000)
    debounce()
  }

  handleDateChange = async (date) => {
    const { page, pageSize } = this.props
    await this.props.setDate(date)
    this.props.resetPagination()
    this.props.getAll(
      pageSize,
      page
    )
  }

  handlePageChange = (page) => {
    this.props.setPage(page)

    this.props.getAll(
      this.props.pageSize,
      page
    )
  }

  getColumns() {
    const months = this.props.comparisonMonth && this.props.comparisonMonth.split('_') || []
    return [
      {
        Header: () => (
          <DebounceTableHeader title={'Project'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'projectName',
        minWidth: 190,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={moment(months[0]).format('MMM YYYY') || 'current year'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'consumption',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={moment(months[1]).format('MMM YYYY') || 'prev Year'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'consumption1',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Difference(%)'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'difference',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
      },
    ]
  }
  handleSortedChange = ([option]) => {
    const { page } = this.props
    if(option.id==='difference'){
      this.props.setSorting(option)
      this.props.getAll(
        this.props.pageSize,
        page
      )}
  }

  render() {
    const {
      page,
      pages,
      loading,
      pageSize,
      notificationData,
      date,
      diff,
    } = this.props

    const tableColumns = this.getColumns()
    return (
      <div>
        <div className="diff_wrap">
          <span className="custom_input">
            <label>Difference(%) :</label>
            <input
              type="number"
              placeholder={'Value'}
              value={diff}
              onChange={this.handleDiffChange}
            />
          </span>
          <DateSelect
            value={date}
            onChange={this.handleDateChange}
          />

        </div>
        <Card>
          <CardBody className="p-0">
            <ReactTable
              showPageSizeOptions={false}
              showPageJump={false}
              columns={tableColumns}
              sortable={true}
              manual

              page={page}
              pages={pages}
              loading={loading}
              pageSize={pageSize}
              resizable={false}

              data={notificationData}
              onPageChange={this.handlePageChange}
              onSortedChange={this.handleSortedChange}
            />
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    page: getCurrentPage(state),
    pageSize: getPageSize(state),
    pages: getPagesCount(state),
    loading: getLoading(state),
    notificationData: getDatas(state),
    comparisonMonth: getComparisonMonths(state),
    date: getDate(state),
    diff: getDiff(state),
    currentCompany:getCurrentCompany(state),

  }),
  (dispatch) => ({
    getAll: (pageSize, lastKey, filter, isNext, reset) => dispatch(getAll(pageSize, lastKey, filter, isNext, reset)),
    setPage: (page) => dispatch(setPage(page)),
    setDate:(date) => dispatch(setDate(date)),
    resetPage:() => dispatch(resetPage()),
    setDiff:(diff) => dispatch(setDiff(diff)),
    resetPagination :()=> dispatch(resetPagination()),
    setSorting: (sorting) => dispatch(setSorting(sorting)),
  })
)(NotificationTableContainer)

