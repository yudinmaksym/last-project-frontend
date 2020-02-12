import * as React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import {
  Card,
  CardBody,
} from 'shards-react'

import DebounceTableHeader from '../../fields/DebounceTableHeader'
import {
  getLoading,
  getAll,
  getDatas, getComparisonMonths,getCurrentCompany,
} from '../../../redux/reducers/notificationAtProjectLevel'


class PoorPerformanceProjects extends React.Component {
  static defaultProps = {
    pageSize: 25,
  }
  componentDidMount() {
    this.props.getAll(50,0,true)
  }
  componentDidUpdate(prevProps) {
    if(prevProps.currentCompany !== this.props.currentCompany){
      this.props.getAll(50, 0,true )
    }
  }
  getColumns() {
    return [
      {
        Header: () => (
          <DebounceTableHeader title={'Project'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-left',
        accessor: 'projectName',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Difference(%)'} />
        ),
        headerClassName: 'd-flex align-items-center justify-content-center',
        accessor: 'difference',
        minWidth: 140,
        className: 'text-center d-flex align-items-center',
      },
    ]
  }
  render() {
    const {
      loading,
      notificationData,
    } = this.props

    const tableColumns = this.getColumns()
    return (
      <div>
        <Card>
          <CardBody className="p-0">
            <ReactTable
              showPageSizeOptions={false}
              showPagination={false}
              showPageJump={false}
              columns={tableColumns}
              sortable={true}
              manual

              loading={loading}
              pageSize={10}
              resizable={false}

              data={notificationData}
              onPageChange={this.handlePageChange}
            />
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    loading: getLoading(state),
    notificationData: getDatas(state),
    comparisonMonth: getComparisonMonths(state),
    currentCompany:getCurrentCompany(state),

  }),
  (dispatch) => ({
    getAll: (pageSize, lastKey, filter, isNext, reset) => dispatch(getAll(pageSize, lastKey, filter, isNext, reset)),
  })
)(PoorPerformanceProjects)

