import * as React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import {
  ButtonGroup,
  Card,
  CardBody,
} from 'shards-react'

import Link from '../../components/common/Link'
import DebounceTableHeader from '../../fields/DebounceTableHeader'


class CustomersListContainer extends React.Component {
  static defaultProps = {
    pageSize: 25,
  }

  handleDelete({ id }) {
    this.props.deleteUser(id)
  }

  getColumns() {
    const columns = [
      {
        Header: () => <DebounceTableHeader title={'Name'}/>,
        accessor: 'name',
        minWidth: 160,
        Cell: row => (
          <b>{row.original.name}</b>
        ),
      },
      {
        Header: () => <DebounceTableHeader title={'State'}/>,
        accessor: 'state',
        minWidth: 160,
        Cell: row => (
          <b>{row.original.state}</b>
        ),
      },
      {
        Header: () => <DebounceTableHeader title={'Actions'}/>,
        accessor: 'id',
        width: 120,
        sortable: false,
        Cell: row => (
          <ButtonGroup size="sm" className="d-table ml-auto">
            <Link
              to={`/customers/edit?id=${row.original.id}`}
              className="btn btn-white"
            >
              <i className="material-icons">&#xE254;</i>
            </Link>
            {/* {row.original.id !==this.props.user.id && <Link
              to=''
              className="btn btn-white"
              onClick={this.handleDelete.bind(this, row.original)}
            >
              <i className="material-icons">restore_from_trash</i>
            </Link>} */}
          </ButtonGroup>
        ),
      },
    ]   
    return columns
  }

  render() {
    const { 
      page,
      pages,
      lastKey,
      loading,
      items,
      pageSize,
      loadNext,
      currentPageSize,
    } = this.props
    console.log(this.props)
    const tableColumns = this.getColumns()

    return (
      <Card>
        <CardBody className="p-0">
          <ReactTable
            showPageSizeOptions={false}
            showPageJump={false}
            columns={tableColumns}
            sortable={false}
            showPagination={false}
            manual
            loading={loading}
            pageSize={items.length}
            resizable={false}
            data={items.map(i => ({ ...i }))}
          />
        </CardBody>
      </Card>
    )
  }
}


export default connect(
  (state) => ({
    items: state.companies.list,
  }),
  (dispatch) => ({
    // deleteUser: (id) => dispatch(deleteUser(id)),
  })
)(CustomersListContainer)