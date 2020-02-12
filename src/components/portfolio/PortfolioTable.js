import React from 'react'
import {connect} from 'react-redux'
import { Row, FormCheckbox, Button } from 'shards-react'
import TableManuDropdown from './TableMenuDropdown'
import {
  getBaseline,
  getForecast,
  getTableData,
  getProjects,
  getTenantBaseline,
  getOnlinePoints,
  getOfflineStatus,
  getDisconnectedSensors,
  getConnectedStatus,
  getOverriddenPoints,
  getAlarmsData,
  getConsumption,
} from '../../../redux/reducers/portfolio'
import { formatInfluxData } from '../../utils/format'
import ReactTable from 'react-table'
import Router from 'next/router'
import ActiveAlarm from '../../images/portfolio-dashboard/alarm-red.svg'
import InactiveAlarm from '../../images/portfolio-dashboard/alarm-grey.svg'

class PortfolioTable extends React.Component {
  state = {
    url: '',
    iframe: false,
    AED: false,
  }

  calcConnectedPoints = (project) => {
    const {onlinePoints, offlinePoints} = this.props
    if(onlinePoints && offlinePoints) {
      const online = onlinePoints.find(sensor => sensor.split(',')[3] === project)
      const offline = offlinePoints.find(sensor => sensor.split(',')[3] === project)
      let connectionPoints

      if(online && offline) {
        const offlinePoints = Number(offline.split(',')[4])
        const onlinePoints = Number(online.split(',')[4])
        connectionPoints = Number(( (onlinePoints / (offlinePoints + onlinePoints)) * 100 ).toFixed(0))
      } else {
        connectionPoints = 0
      }

      return [connectionPoints, this.formatOverriddenPoints(project), this.formatDisconnectedSensors(project), this.lastConnection(project), project]
    }
    return [0,0,0,0, project]
  }

  formatEnergyConsumedData = (consumption, period, project) => {
    if(consumption[period].length !== 0) {
      var filtered = formatInfluxData(consumption[period])

      const site = filtered.find(_pr => _pr.split(',')[3] === project)
      if(site !== undefined) {
        return Number(Number(site.split(',')[4]).toFixed(0))
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  formatEnergySavings = (totalConsumed, baseline, tenantBaseline, period, project) => {
    // period - month=0 or week=1
    if(tenantBaseline[period].length !== 0 && baseline[period].length !== 0) {
      const consumedFilteredData = this.formatEnergyConsumedData(totalConsumed, period, project.iot_name)
      const tenant = tenantBaseline[period].find(_pr => _pr.name === project.iot_name)
      const baselin = baseline[period].find(_pr => _pr.name === project.iot_name)
      const energySavings = baselin.result - (consumedFilteredData - tenant.result)
      return [Number(energySavings.toFixed(0)), project.utility_rate_elec]
    } else {
      return [0, 0]
    }
  }

  formatEnergyForecastAccuracy = (totalConsumed, forecast, period, project) => {
    // period - month=0 or week=1
    const consumedFilteredData = this.formatEnergyConsumedData(totalConsumed, period, project)
    if(consumedFilteredData !== 0) {
      if(forecast[period].length !== 0) {
        const forecastPr = forecast[period].find(_pr => _pr.name === project)
        const energyForecastAccuracy = (1 / (consumedFilteredData / forecastPr.result)) * 100
        return Number(energyForecastAccuracy.toFixed(1))
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  formatForecastAccuracyDaily = (totalConsumed, forecast, tenant, period, days, project) => {
    // days
    let consumedFiltered

    if(totalConsumed[period].length !== 0) {
      var filtered = formatInfluxData(totalConsumed[period])
      consumedFiltered = filtered.filter(el => el.split(',')[3] === project)
    }

    const forecastData = forecast[period].find(_pr => _pr.name === project)
    const tenantBasleine = tenant[period].find(_pr => _pr.name === project)

    if(consumedFiltered && forecastData && forecastData.result.length !== 0) {
      const accuracyData = []
      for(let i=0; i<days; i++) {
        if(consumedFiltered.slice(-5)[i].split(',')[6] === '') {
          accuracyData.push(0)
        } else if(tenantBasleine && tenantBasleine.result.length !== 0) {
          const forecastAccuracy = Number((1 / ((consumedFiltered.slice(-5)[i].split(',')[6] - tenantBasleine.result.slice(-5)[i].value) / forecastData.result.slice(-5)[i].value)) * 100)
          .toFixed(0)
          if(forecastAccuracy > 5000) {
            accuracyData.push('-')
          } else {
            accuracyData.push(forecastAccuracy)
          }
        } else {
          const forecastAccuracy = Number((1 / (consumedFiltered.slice(-5)[i].split(',')[6] / forecastData.result.slice(-5)[i].value)) * 100).toFixed(0)
          if(forecastAccuracy > 5000) {
            accuracyData.push('-')
          } else {
            accuracyData.push(forecastAccuracy)
          }
        }
      }
      return accuracyData
    } else {
      return []
    }
  }

  formatDaysMissedSavings = (totalConsumed, forecast, tenantBaseline, period, project) => {
    let consumedFiltered

    if(totalConsumed[period].length !== 0) {
      var filtered = formatInfluxData(totalConsumed[period])
      consumedFiltered = filtered.filter(el => el.split(',')[3] === project)
    }
    
    const forecastData = forecast[period].find(_pr => _pr.name === project)
    const baseline = tenantBaseline[period].find(_pr => _pr.name === project)
    let daysMissed = 0

    if(consumedFiltered && forecastData && forecastData.result.length !== 0) {
      consumedFiltered.forEach((el,index) => {
        if(baseline && baseline.result.length !== 0) {
          if((Number(el.split(',')[6]) - baseline.result[index].value) >= forecastData.result[index].value) {
            daysMissed++
          }
        } else if(Number(el.split(',')[6]) >= forecastData.result[index].value) {
          daysMissed++
        }
      })
    }
    return daysMissed

  }

  formatActiveAlarms = (project) => {
    const {activeAlarms} = this.props
    if(activeAlarms) {
      const alarms = activeAlarms.filter(alarm => alarm.split(',')[8] === project)
    
      return [alarms, project]
    }
    return [0, ""]
  }

  formatDisconnectedSensors = (project) => {
    const {disconnectedSensors} = this.props
    if(disconnectedSensors) {
      const projectDiscSensors = disconnectedSensors.find(sensor => sensor.split(',')[3] === project)

      if(projectDiscSensors) {
        return projectDiscSensors.split(',')[4]
      } 
      return 0
    }
  }

  lastConnection = (project) => {
    const {lastConnection} = this.props
    if(lastConnection) {
      const projectLastConn = lastConnection.find(sensor => sensor.split(',')[8] === project)
      if(projectLastConn && projectLastConn.split(',')[6] === "true") {
        return true
      }
      return false
    } return 0
  }
  
  formatOverriddenPoints = (project) => {
    const {overriddenPoints} = this.props
    if(overriddenPoints) {
      const projectOver = overriddenPoints.find(point => point.split(',')[3] === project)

      if(projectOver) {
        return projectOver.split(',')[4]
      } 
      return 0
    }
  }

  formatDataForTable = () => {
    const {projects, consumption, baseline, forecast, tenantBaseline} = this.props

    let data = []

    projects.map(el => {
      if(el.category !== "audit") {
        data.push({
          project: el.iot_name,
          connectedPoints: this.calcConnectedPoints(el.iot_name),
          actions: <TableManuDropdown
            project={el.iot_name}
            projectId={el.id}
            region={el.region}
            cdd={el.cdd}
            category={el.category}
            youbim={el.youbim_url}
            renderIframe={(project, youbim) => this.renderIframe(project, youbim)}
            renderIframeModal={youbimUrl => this.renderIframeModal(youbimUrl)}
          />,
          savingsMonth: this.formatEnergySavings(consumption, baseline, tenantBaseline, "totalMonth", el),
          savingsWeek: this.formatEnergySavings(consumption, baseline, tenantBaseline, "totalWeek", el),
          accuracyMonth: this.formatEnergyForecastAccuracy(consumption, forecast, "totalMonth", el.iot_name),
          accuracyWeek: this.formatForecastAccuracyDaily(consumption, forecast, tenantBaseline, 'dailyMonth', 5, el.iot_name),
          daysMissed: this.formatDaysMissedSavings(consumption, forecast, tenantBaseline, 'dailyMonth', el.iot_name),
          alarms: this.formatActiveAlarms(el.iot_name),
        })
      }
    })

    return data
  }

  getColumns() {
    return [
      {
        Header: 'Property',
        accessor: 'project',
        Cell: row => <div style={{ textAlign: "left", width: '100%' }}>{row.value}</div>
      },
      {
        Header: 'Site Health',
        accessor: 'connectedPoints',
        Cell: props => <div className="overr">
            <span className={`last_connection ${props.value[3] ? 'green' : 'red'}`}></span>
            <span 
              className={`mb-0 accuracy_block
                ${
                  props.value[0] > 95 && 'dark-green' || 
                  props.value[0] <= 95 && props.value[0] >= 75 && 'green' || 
                  props.value[0] < 75 &&  props.value[0] > 0 && 'orange' || 
                  props.value[0] === 0 && 'red'
                }
              `}
              title="Connected Points (%)"
            >
              {props.value[0]}  
            </span>  
            <span className="mx-1">|</span>
            <Button 
              title="Overridden Points" 
              className="accuracy_block grey"
              onClick={() => Router.push({pathname: '/alarms/table', query: {project: props.value[4], type: 'overridden'}})}
            > 
              {props.value[1]}
            </Button>
            <span className="mx-1">|</span>
            <Button 
              title="Disconnected Sensors" 
              className="accuracy_block grey"
              onClick={() => Router.push({pathname: '/alarms/table', query: {project: props.value[4], type: 'disconnected'}})}
            > 
              {props.value[2]}
            </Button>
          </div>
      },
      {
        Header: '30 Day Energy Savings',
        accessor: 'savingsMonth',
        Cell: props => {
          return this.state.AED ? (props.value[0] * Number(props.value[1])).toLocaleString('en') : props.value[0].toLocaleString('en')
        }
      },
      {
        Header: '7 Day Energy Savings',
        accessor: 'savingsWeek',
        Cell: props => {
          return this.state.AED ? (props.value[0] * Number(props.value[1])).toLocaleString('en') : props.value[0].toLocaleString('en')
        }
      },
      {
        Header: '30 Day Forecast Accuracy',
        accessor: 'accuracyMonth',
        Cell: props =>
          <span className={`mb-0 color
            ${props.value > 100
            ? " green"
            : " red"
            }`}
          >
            {props.value}
          </span>
      },
      {
        Header: '5 Day Forecast Accuracy',
        accessor: 'accuracyWeek',
        Cell: props =>
          <div className="d-flex justify-content-between col-12 px-0">
            {props.value.map(el => {
              return <span className={`mb-0 accuracy_block
                ${el === '-' && " green" ||
                el >= 100 && " green" ||
                el < 100 && el > 75 && " orange" ||
                el <= 75 && " red"
                }`}
              >
                {el}
              </span>
            })}
          </div>
      },
      {
        Header: 'Days Missed Savings Past 30 Days',
        accessor: 'daysMissed',
      },
      {
        Header: '',
        accessor: 'alarms',
        Cell: props => <img 
            src={props.value[0].length > 0 ? ActiveAlarm : InactiveAlarm} 
            width="30" 
            height="30"
            style={{cursor: 'pointer'}}
            title={`Active Alarms ${props.value[0].length}`}
            onClick={() => Router.push({pathname: '/alarms/table', query: {project: props.value[1]}})}
        />,
        width: 100,
      },
      {
        Header: '',
        accessor: 'actions',
        sortable: false,
        width: 50,
      },
    ]
  }

  toggleSavingToAED = () => {
    this.setState({AED: !this.state.AED})
  }

  render() {

    const {
      projects,
      tableData,
    } = this.props

    const columns = this.getColumns()

    return(
      <div>
        <div className="d-flex justify-content-end">
          <div className="d-flex align-items-center">
            <span className="mr-2">kWh</span>
            <fieldset className="d-inline-flex float-right">
              <FormCheckbox 
                className="d-inline-flex mb-0"
                toggle 
                checked={this.state.AED}
                onChange={this.toggleSavingToAED}
              >
                AED
              </FormCheckbox>
            </fieldset>    
          </div>
          
        </div>
        <Row className="mt-3">
          {projects && projects.length !== 0 &&
          <ReactTable
            className="portfolio-performance_table"
            columns={columns}
            defaultSorted={[
              {
                id: "project",
                desc: false
              }
            ]}
            showPagination={false}
            resizable={true}
            defaultPageSize={20}
            data={this.formatDataForTable()}
          />
          }
        </Row>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    tableData: getTableData(state),
    baseline: getBaseline(state),
    forecast: getForecast(state),
    projects: getProjects(state),
    consumption: getConsumption(state),
    tenantBaseline: getTenantBaseline(state),
    connectionStatus: getConnectedStatus(state),
    onlinePoints: getOnlinePoints(state),
    offlinePoints: getOfflineStatus(state),
    disconnectedSensors: getDisconnectedSensors(state),
    overriddenPoints: getOverriddenPoints(state),
    lastConnection: getConnectedStatus(state),
    activeAlarms: getAlarmsData(state),
  }),
  (dispatch) => ({
  })
)(PortfolioTable)
