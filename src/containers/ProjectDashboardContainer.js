import * as React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Button,
  Tooltip,
} from 'shards-react'
import Router from 'next/router'

import {
  getProjectData,
  setDashboardPageState,
  getDashboardPageState,
  getSpecificProjectInfo,
} from '../../redux/reducers/projects'
import {
  loadMetrics,
  loadConsumptionHistory,
  loadConsumption,
  loadYOYConsumption,
  loadForecastConsumption,
  loadForecastVsActual,
  getDate,
  setDate,
  getLoading,
} from '../../redux/reducers/monthlymv'
import ProjectsSelect from '../components/projects/ProjectsSelect'
import DateSelect from '../components/monthlymv/DateSelect'
import PageTitle from '../components/common/PageTitle'
import EquationForm from '../forms/equation/EquationForm'
import CircleLoader from '../components/preloadrers/circle-loader'

import ProjectMetricsContainer from './ProjectMetricsContainer'
import MonthlyMVContainer from './MonthlyMVContainer'


class ProjectDashboardContainer extends React.Component {

  componentWillUnmount() {
    this.props.setDashboardPageState('utility')
  }

  componentDidMount() {
    const { data: { project: { id = '' } = {} } = {} } = this.props
    this.props.getSpecificProjectInfo(id)
  }

  getMonthYearFromDate = (date) => ({
    month: moment(date).format('MMM'),
    year: moment(date).year(),
  })
  
  loadDispatches = (id, month, year) => {
    this.props.loadConsumptionHistory(id, month, year, 'electricity')
    this.props.loadConsumption(id, month, year, 'electricity')
    this.props.loadYOYConsumption(id, month, year, 'electricity')
    this.props.loadForecastConsumption(id, month, year, 'electricity')
    this.props.loadForecastVsActual(id, month, year, 'electricity')

    this.props.loadConsumptionHistory(id, month, year, 'chw')
    this.props.loadConsumption(id, month, year, 'chw')
    this.props.loadYOYConsumption(id, month, year, 'chw')
    this.props.loadForecastConsumption(id, month, year, 'chw')
    this.props.loadForecastVsActual(id, month, year, 'chw')
    
  }
  handleProjectChange = (option) => {
    const id = option.value

    this.props.getSpecificProjectInfo(id)

    Router.push(`/projects/dashboard?id=${id}`)
    const { month, year } = this.getMonthYearFromDate(this.props.date)
    
    this.loadDispatches(id, month, year)
   
  }

  handleDateChange = (date) => {
    const id = this.props.data.project.id
    this.props.setDate(date)

    const { month, year } = this.getMonthYearFromDate(date)
    this.props.loadMetrics(id, month, year)
    
    this.loadDispatches(id, month, year)
  }

  handleMonthlyMVUpdate = () => {
    const id = this.props.data.project.id
    const { month, year } = this.getMonthYearFromDate(this.props.date)

    this.props.loadMetrics(id, month, year)
    
    this.loadDispatches(id,month,year)
  }

  handleToggle = (type) => () => this.props.setDashboardPageState(type)

  getToggleState = (activeType) => activeType === this.props.state ? 'primary' : 'white'

  getTitle = () => 
    this.props.state == 'utility'
      ? 'Project Dashboard'
      : ''

  getSubTitle = () => 
    this.props.state == 'utility'
      ? 'Project Dashboard'
      : 'Montly M&V'

  render() {
    const { 
      name,
      id,
      title,
      date,
      loading,
      state,
      mvEnabled,
    } = this.props
    
    const selectedItem = {
      label: name,
      value: id,
    }

    return (
      <Container className="mw-100" fluid>
        <CircleLoader 
          show={loading}
        />

        {/* <Row noGutters className="page-header py-4">
          <Col md="8" className="m-0">
            <h3 className="page-title">{title}</h3>
          </Col>
          <Col className="pull-right">
            <ProjectsSelect 
              value={selectedItem}
              onChange={this.handleProjectChange}
            />
          </Col>
        </Row> */}

        <Row noGutters className="page-header py-4">
          {/* Page Header :: Title */}
          <PageTitle 
            title={title} 
            subtitle={this.getSubTitle()} 
            className="text-sm-left" 
            sm={4}
          />

          {/* Page Header :: Actions */}
        
          <Col xs="12" sm="4" className="col d-flex align-items-center pt-1">
            <ButtonGroup size="sm" className="d-inline-flex mb-3 mb-sm-0 mx-auto">
              <Button 
                theme={this.getToggleState('utility')}
                onClick={this.handleToggle('utility')}
              >
                <b>Utility</b>
              </Button>
              <Button 
                disabled={!mvEnabled}
                theme={this.getToggleState('mv')}
                onClick={this.handleToggle('mv')}
              >
                <b>{'M&V'}</b>
              </Button>
            </ButtonGroup>
          </Col>
       

          {/* Page Header :: Datepicker */}
          <Col sm="4" className="d-flex pull-right pt-1">
            <ProjectsSelect 
              value={selectedItem}
              onChange={this.handleProjectChange}
              className="w-100"
            />
            {state === 'mv' && (
              <DateSelect
                value={date}
                onChange={this.handleDateChange}
              />
            )}
          </Col>
        </Row>

        {state === 'mv' 
          ? <MonthlyMVContainer onUpdate={this.handleMonthlyMVUpdate}/>
          : <ProjectMetricsContainer />
        }
      </Container>
    )
  }

}

export default connect(
  state => {
    const data = getProjectData(state)
    const date = getDate(state)

    return ({
      data,
      projectMeters: data.meters,
      id: data && data.id,
      Name: data && data.Name,
      date,
      loading: getLoading(state),
      state: getDashboardPageState(state),
    })
  },
  (dispatch) => ({
    setDate: (date) => 
      dispatch(setDate(date)),
    getSpecificProjectInfo: (id) => dispatch(getSpecificProjectInfo(id)),
    setDashboardPageState: (type) => 
      dispatch(setDashboardPageState(type)),
    loadMetrics: (projectId, month, year) => 
      dispatch(loadMetrics(projectId, month, year)),
    loadConsumptionHistory: (projectId, month, year, type) => 
      dispatch(loadConsumptionHistory(projectId, month, year, type)),
    loadConsumption: (projectId, month, year, type) => 
      dispatch(loadConsumption(projectId, month, year, type)),
    loadYOYConsumption: (projectId, month, year, type) => 
      dispatch(loadYOYConsumption(projectId, month, year, type)),
    loadForecastConsumption: (projectId, month, year, type) => 
      dispatch(loadForecastConsumption(projectId, month, year, type)),
    loadForecastVsActual: (projectId, month, year, type) => 
      dispatch(loadForecastVsActual(projectId, month, year, type)),
  })
)(ProjectDashboardContainer)
