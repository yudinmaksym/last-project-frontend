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

import { getSystemColor } from '../utils/theme'
import colors from '../utils/colors'
import {
  getProjectsTotal,
  getMetersTotal,
  getBillsTotal,
  getMetersPerMonth,
  getMapPins,

  setMetersPerMonthRange,
  loadMetersPerMonth,
} from '../../redux/reducers/metrics'
import MetricBox from '../components/metrics/MetricBox'
import ProgressBox from '../components/metrics/ProgressBox'
import MapBox from '../components/metrics/MapBox'
import MetersPerMonth from '../components/metrics/MetersPerMonth'
import PoorPerformanceAccounts from '../components/metrics/PoorPerformanceAccounts'


class HomeMetricsContainer extends React.Component {

  handleMetersPerMonthRangeChange = (nextRange) => {
    this.props.setMetersPerMonthRange(nextRange)
    this.props.loadMetersPerMonth(nextRange)
  }

  formatMetersPerMonthDatasets = () => {
    return this.props.metersPerMonth.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: 'start',
      data: [...dataset.data],
      backgroundColor: getSystemColor(dataset.label).toRGBA(0.1),
      borderColor: getSystemColor(dataset.label).toRGBA(1),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: getSystemColor(dataset.label).toRGBA(1),
      borderWidth: 1.5,
    }))
  }

  render() {
    const {
      projects,
      meters,
      bills,
      metersPerMonth,
      mapPins,
    } = this.props

    return (
      <React.Fragment>
        <Row>
          <Col md="4" lg="4" className="mb-4">
            <ProgressBox
              label={'Bills'}
              subLabel={`${bills.startDate} – ${bills.endDate}`}
              percentage={bills.progress.toFixed(0) + '%'}
              value={bills.progress.toFixed(0)}
              uploaded={bills.uploaded}
              total={bills.total}
            />
          </Col>
          <Col md="4" lg="4" className="mb-4">
            <MetricBox
              label={'Projects'}
              value={projects.total}
              percentage={projects.delta}
              variation="1"
            />
          </Col>
          <Col md="4" lg="4" className="mb-4">
            <MetricBox
              label={'Meters'}
              value={meters.total}
              percentage={meters.delta}
              variation="1"
            />
          </Col>
        </Row>
        <Row>
          <Col lg="4" md="12" sm="12" className="mb-4">
            <Row>
              <Col lg="12" md="12" sm="12" className="mb-4 h-100">
                <MetersPerMonth
                  title={'Meter Uploads Per Month'}
                  dataId={metersPerMonth.dataId}
                  chartData={{
                    labels: metersPerMonth.labels,
                    datasets: this.formatMetersPerMonthDatasets(),
                  }}
                  range={metersPerMonth.range}
                  onRangeChange={this.handleMetersPerMonthRangeChange}
                />
              </Col>
              <Col lg="12" md="12" sm="12" className="mb-4 h-100">
                <PoorPerformanceAccounts/>
              </Col>
            </Row>
          </Col>
          <Col lg="8" md="12" sm="12" className="mb-4">
            <MapBox
              points={mapPins}
            />
          </Col>
        </Row>
        <Row>
          <Col md="12" lg="12">
          </Col>
        </Row>
      </React.Fragment>
    )
  }

}


export default connect(
  (state) => ({
    projects: getProjectsTotal(state),
    meters: getMetersTotal(state),
    bills: getBillsTotal(state),
    mapPins: getMapPins(state),
    metersPerMonth: getMetersPerMonth(state),
  }),
  (dispatch) => ({
    setMetersPerMonthRange: (range) => dispatch(setMetersPerMonthRange(range)),
    loadMetersPerMonth: (range) => dispatch(loadMetersPerMonth(range)),
  })
)(HomeMetricsContainer)
