import * as React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import {
  ButtonGroup,
  Card,
  CardBody,
} from 'shards-react'
import get from 'lodash/get'

import Link from '../components/common/Link'
import { 
  loadListUsers,
  deleteUser,
} from '../../redux/reducers/users'
import DebounceTableHeader from '../fields/DebounceTableHeader'


const getEditLink = (role) => role.includes('Taka') ? '/users/taka-edit' : '/users/edit'

class UsersContainer extends React.Component {
  static defaultProps = {
    pageSize: 25,
  }

  handleDelete({ id }) {
    this.props.deleteUser(id)
  }

  getColumns() {
    const columns = [
      {
        Header: () => <DebounceTableHeader title={'Email'}/>,
        accessor: 'Email',
        minWidth: 160,
        Cell: row => (
          <b>{row.original.email}</b>
        ),
      },
      {
        Header: () => <DebounceTableHeader title={'Name'}/>,
        accessor: 'Name',
        minWidth: 160,
        Cell: row => (
          <b>{row.original.name}</b>
        ),
      },
      {
        Header: () => <DebounceTableHeader title={'Role'}/>,
        accessor: 'Role',
        minWidth: 160,
        Cell: row => (
          <b>{row.original.role}</b>
        ),
      },
    ]   
    const { user } = this.props
    const disabled = {}
    const adminRoles = ['TakaAdmin', 'Admin']
    if(!adminRoles.includes(get(user, 'role', ''))){
      disabled.pointerEvents = 'none'
      disabled.opacity = 0.5
    }
    columns.push({
      Header: () => <DebounceTableHeader title={'Actions'}/>,
      accessor: 'id',
      width: 120,
      sortable: false,
      Cell: row => (
        <ButtonGroup style={disabled} size="sm" className="d-table ml-auto">
          <Link
            to={`${getEditLink(row.original.role)}?id=${row.original.id}`}
            className="btn btn-white"
          >
            <i className="material-icons">&#xE254;</i>
          </Link>
          {row.original.id !==this.props.user.id && <Link
            to=''
            className="btn btn-white"
            onClick={this.handleDelete.bind(this, row.original)}
          >
            <i className="material-icons">restore_from_trash</i>
          </Link>}
        </ButtonGroup>
      ),
    })
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
            pageSize={currentPageSize}
            resizable={false}

            data={items.map(i => ({ ...i }))}
            onPageChange={(page) => loadNext(pageSize, page)}
          />
        </CardBody>
      </Card>
    )
  }

}


export default connect(
  (state) => ({
    page: state.users.list.page,
    pageSize: state.users.list.pageSize,
    items: state.users.list.items,
    pages: state.users.list.pagesCount,
    loading: state.users.loading,
    count: state.users.list.count,
    user: state.users.currentUser,
    currentPageSize: state.users.list.items.length,
  }),
  (dispatch) => ({
    loadNext: (pageSize, page) => dispatch(loadListUsers(pageSize, page)),
    deleteUser: (id) => dispatch(deleteUser(id)),
  })
)(UsersContainer)