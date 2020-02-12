import * as React from 'react'
import { connect } from 'react-redux'
import {
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  ListGroup,
  ListGroupItem,
  ButtonGroup,
} from 'shards-react'

import agent from '../../agent'
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
} from '../../redux/reducers/projectsMeters'
import DebounceTableHeader from '../fields/DebounceTableHeader'

import ProjectsMetersFiltersContainer from './ProjectsMetersFiltersContainer'


class MeterSearchContainer extends React.Component {

  state = {
    request: false,
    search: '',
    data: null,
    error: null,
  }

  lookup = (query) => {
    this.setState({
      data: null,
      request: true,
      error: false,
    })

    return agent.ProjectsMeters.lookup(query).then(this.parseRespone)
  }

  parseRespone = (res) => {
    if (res.found) {
      this.setState({
        request: false,
        error: false,
        data: res.meter,
      })
    } else {
      this.setState({
        request: false,
        data: false,
        error: 'Meter not found',
      })
    }
  }

  handleFilterChange = (e) => {
    const search = e.target.value
    this.setState({ search },
      () => this.lookup(search)
    )
  }

  renderMeter = () => {
    const mappedItem = [
      { title: 'Meter Name', value: this.state.data['meter_name'] },
      { title: 'Project Name', value: this.state.data['project'] && this.state.data['project']['name'] },
      { title: 'Zone Name', value: this.state.data['zone'] && this.state.data['zone']['name'] },
      { title: 'Account Number', value: this.state.data['account_number'] },
      { title: 'Meter Number', value: this.state.data['account_number'] },
      { title: 'Premise Number', value: this.state.data['premise_number'] },
      { title: 'Fuel Type', value: this.state.data['fuel_type'] },
      { title: 'Utility Provider', value: this.state.data['utility'] },
    ]

    const items = mappedItem.map((item, idx) => (
      <ListGroupItem key={idx} className="d-flex px-3">
        <span className="text-semibold text-fiord-blue">{item.title}</span>
        <span className="ml-auto text-right text-semibold text-reagent-gray">
          {item.value}
        </span>
      </ListGroupItem>
    ))

    return (
      <>
        {items}
        {this.props.page!=='missingConsumptionData' && <ListGroupItem key={'edit'} className="d-flex px-3">
          <Link
            to={`/projectsMeters/edit?id=${this.state.data.id}`}
            className="btn btn-white btn-block"
          >
            <i className="material-icons">&#xE254;</i>{' Edit'}
          </Link>
        </ListGroupItem>}
      </>
    )
  }

  renderEmpty = () => {
    let message = 'Search for Meter Name, Account Number, Meter Number...'

    if (this.state.search) {
      if (this.state.request) {
        message ='Searching...'
      } else {
        message = this.state.error ? this.state.error : 'Meter not found'
      }
    }

    return (
      <ListGroupItem key={'empty'} className="d-flex px-3">
        <strong class="text-muted d-block my-2">
          {message}
        </strong>
      </ListGroupItem>
    )
  }

  renderResponse = () => this.state.data ? this.renderMeter() : this.renderEmpty()

  render() {
    return (
      <>
        <section className="p-2">
          <InputGroup seamless size="sm" className="ml-auto">
            <InputGroupAddon type="prepend">
              <InputGroupText placeholder="">
                <i className="material-icons">search</i>
              </InputGroupText>
            </InputGroupAddon>
            <FormInput
              onChange={this.handleFilterChange}
              value={this.state.search}
            />
          </InputGroup>
        </section>
        <ListGroup small flush className="list-group-small">
          {this.renderResponse()}
        </ListGroup>
      </>
    )
  }

}


export default connect(
  (state) => ({

  }),
  (dispatch) => ({

  })
)(MeterSearchContainer)
