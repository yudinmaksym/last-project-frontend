import * as React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import _debounce from 'lodash/debounce'
import get from 'lodash/get'
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

import Link from '../components/common/Link'
import { 
  initalLoad,
  loadAll,

  getPageSize,
  getCount,
  getItems,
  getLoading,
  getPagesCount,
  getCurrentPage,
  
  setPage,
  getLastKey,
  getPrevKey,
  getPrevKeys,
  resetPagination,
} from '../../redux/reducers/projectsMeters'
import DebounceTableHeader from '../fields/DebounceTableHeader'

import ProjectsMetersFiltersContainer from './ProjectsMetersFiltersContainer'


const METER_STATE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 1 },
  { label: 'Inactive', value: 0 },
]

class ProjectsMetersContainer extends React.Component {
  static defaultProps = {
    pageSize: 25,
  }

  state = {
    filtered: [],
  }

  componentWillUnmount() {
    this.props.resetPagination()
  }

  getColumns() {
    return [
      {
        Header: () => <DebounceTableHeader title={'Actions'}/>,
        accessor: 'id',
        width: 60,
        sortable: false,
        Filter: () => null,
        Cell: row => (
          <ButtonGroup size="sm" className="d-table ml-auto">
            <Link
              to={`/projectsMeters/edit?id=${row.original.id}`}
              className="btn btn-white"
            >
              <i className="material-icons">&#xE254;</i>
            </Link>
          </ButtonGroup>
        ),
      },
      {
        Header: () => <DebounceTableHeader title={'Project Name'}/>,
        accessor: 'project.name', 
      },
      {
        Header: () => <DebounceTableHeader title={'Meter Name'}/>,
        accessor: 'meter_name', 
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
      {
        Header: () => <DebounceTableHeader title={'State'}/>,
        accessor: 'active', 
        Filter: ({ filter }) => 
          <div>
            <select value={filter && filter.value} style={{ width: '100%' }} onChange={(e) => this.onFilteredChangeCustom(e.target.value, 'active')}>
              {METER_STATE_OPTIONS.map(({ label, value }, i) => (
                <option  key={label + i} value={value}>{label}</option>
              ))}
            </select>
          </div>,
        Cell: row => (
          <span>{get(row, 'original.active') ? 'Active' : 'Inactive'}</span>
        ),
      },
      {
        Header: () => <DebounceTableHeader title={'Utility Provider'}/>,
        accessor: 'utility', 
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
  }),
  (dispatch) => ({
    resetPagination: () => dispatch(resetPagination()),
    loadNext: (pageSize, lastKey, filter, isNext, reset) => 
      dispatch(loadAll(pageSize, lastKey, filter, isNext, reset)),
    initalLoad: (pageSize, filter) => 
      dispatch(initalLoad(pageSize, filter)),
    setPage: (page) => dispatch(setPage(page)),
  })
)(ProjectsMetersContainer)