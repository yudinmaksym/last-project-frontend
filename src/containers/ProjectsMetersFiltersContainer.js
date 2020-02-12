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
} from '../../redux/reducers/projectsMeters'
import ProjectsMetersFilterForm from '../forms/ProjectsMetersFilterForm'


class ProjectsMetersFiltersContainer extends React.Component {
  handleFilter = (data) => {
    let { expressions } = data

    if (expressions.length === 0) {
      expressions = null
    }

    this.props.onChange(expressions)
  }

  render() {
    return (
      <ProjectsMetersFilterForm onSubmit={this.handleFilter} />
    )
  }

}


export default connect(
  (state) => ({
  }),
  (dispatch) => ({
  
  })
)(ProjectsMetersFiltersContainer)