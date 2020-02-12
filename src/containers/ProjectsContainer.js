import * as React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import moment from 'moment'
import _debounce from 'lodash/debounce'
import remove from 'lodash/remove'
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
  CardBody,
} from 'shards-react'

import Link from '../components/common/Link'
import { 
  getPageSize,
  getCount,
  getItems,
  getLoading,
  getPagesCount,
  getCurrentPage,
  
  loadAll,
  setPage,
  getLastKey,
  getPrevKey,
  getPrevKeys,
} from '../../redux/reducers/projects'
import DebounceTableHeader from '../fields/DebounceTableHeader'


class ProjectsContainer extends React.Component {
  static defaultProps = {
    pageSize: 25,
    onFilterChange: () => {},
  }

  state = {
    filtered: [],
  }

  getColumns() {
    return [
      {
        Header: () => <DebounceTableHeader title={'Actions'}/>,
        accessor: 'id',
        width: 120,
        sortable: false,
        Filter: () => null,
        Cell: row => (
          <ButtonGroup size="sm" className="d-table ml-auto">
            <Link
              to={`/projects/dashboard?id=${row.original.id}`}
              className="btn btn-white"
            >
              <i className="material-icons">insert_chart_outlined</i>
            </Link>
            <Link
              to={`/projects/edit?id=${row.original.project_id}`}
              className="btn btn-white"
            >
              <i className="material-icons">&#xE254;</i>
            </Link>
          </ButtonGroup>
        ),
      },
      {
        Header: () => <DebounceTableHeader title={'Zone'}/>,
        accessor: 'zone',
        minWidth: 160,
        Cell: row => (
          <b>{row.original.zone}</b>
        ),
      },
      {
        Header: () => <DebounceTableHeader title={'Project Name'}/>,
        accessor: 'project',
        minWidth: 160,
        Cell: row => (
          <b>{row.original.project}</b>
        ),
      },
      {
        Header: () => <DebounceTableHeader title={'Phase'}/>,
        accessor: 'phase',
        minWidth: 160,
        Cell: row => (
          <b>{row.original.phase}</b>
        ),
      },
      {
        Header: () => <DebounceTableHeader title={'Building Name'}/>,
        accessor: 'name',
        minWidth: 160,
        Cell: row => (
          <b>{row.original.name}</b>
        ),
      },
      {
        Header: () => <DebounceTableHeader title={'Address'}/>,
        accessor: 'address',
        minWidth: 300,
      },
      {
        Header: () => <DebounceTableHeader title={'Country'}/>,
        accessor: 'country',
        minWidth: 200,
      },
      {
        Header: () => <DebounceTableHeader title={'Region'}/>,
        accessor: 'neighborhood',
        minWidth: 120,
      },
      {
        Header: () => <DebounceTableHeader title={'Occupancy'}/>,
        accessor: 'occupancy_type',
        minWidth: 120,
      },
      {
        Header: () => <DebounceTableHeader title={'Metering Infrastructure'}/>,
        accessor: 'metering_infrastructure',
        minWidth: 120,
      },
      {
        Header: () => <DebounceTableHeader title={'Building Area(GFA)'}/>,
        accessor: 'gfa',
        minWidth: 80,
      },
      {
        Header: () => <DebounceTableHeader title={'Year Built'}/>,
        accessor: 'year_built',
        minWidth: 80,
      },
      {
        Header: () => <DebounceTableHeader title={'Levels'}/>,
        accessor: 'floor_levels',
        minWidth: 80,
      },
    ]   
  }

  _handlePageChange = (page) => {
    this.props.setPage(page)

    this.props.loadNext(
      this.props.pageSize,
      page,
      this.state.filtered
    )
  }
  
  handlePageChange = (page) => () => {
    this._handlePageChange(page)
  }

  onFilteredChangeCustom = (value, accessor) => {
    let filtered = this.state.filtered
    let insertNewFilter = 1

    if (filtered.length) {
      filtered.forEach((filter, i) => {
        if (filter['id'] === accessor) {
          if (value === '' || !value.length) filtered.splice(i, 1)
          else filter['value'] = value

          insertNewFilter = 0
        }
      })
    }

    if (insertNewFilter) {
      filtered.push({ id: accessor, value: value })
    }

    this.setState(
      { filtered: filtered },
      _debounce(this.handlePageChange(0), 1000)
    )
  };

  handleFilter = (filtered, column, value) => {
    this.onFilteredChangeCustom(value, column.id || column.accessor)
  }

  render() {
    const { 
      page,
      pages,
      lastKey,
      loading,
      items,
      pageSize,
      currentUser,
    } = this.props
    console.log(items)
    const tableColumns = this.getColumns()
    !currentUser.role.startsWith('Taka')
      && remove(tableColumns, ({ accessor }) => accessor === 'phase')

    return (
      <Card>
        <CardBody className="p-0">
          <ReactTable
            showPageSizeOptions={false}
            showPageJump={false}
            columns={tableColumns}
            sortable={false}
            manual

            filterable
            filtered={this.state.filtered}
            defaultFilterMethod={() => true}
            onFilteredChange={this.handleFilter}
            
            page={page}
            pages={pages}
            loading={loading}
            pageSize={pageSize}
            resizable={false}

            data={items}
            onPageChange={this._handlePageChange}
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
    prevKeys: getPrevKeys(state),
    currentUser: state.users.currentUser,
  }),
  (dispatch) => ({
    loadNext: (pageSize, page, filters) => dispatch(loadAll(pageSize, page, filters)),
    setPage: (page) => dispatch(setPage(page)),
  })
)(ProjectsContainer)