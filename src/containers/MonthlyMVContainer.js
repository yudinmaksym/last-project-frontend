/* eslint-disable camelcase */
import * as React from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormSelect,
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  Alert,
} from 'shards-react'

import { getColor } from '../utils/theme'
import colors from '../utils/colors'
import { formatNumber } from '../utils/format'
import {  
  getMetrics,
  getVariables,
  getElectricalConsumptionHistory,
  getElectricityConsumption,
  getYoyElectricalConsumptionCommonSpace,
  getForecastElectricityConsumption,
  getForecastVSActualSavings,
  getChwConsumptionHistory,
  getChwConsumption,
  getYoyChwConsumptionCommonSpace,
  getForecastChwConsumption,
  getForecastChwVSActualSavings,
  getLoading,
  getEquations,
  getComputedVariablesMap,
} from '../../redux/reducers/monthlymv'
import {
  getProjectData,
} from '../../redux/reducers/projects'
import MonthlyElectricalConsumptionHistory from '../components/monthlymv/MonthlyElectricalConsumptionHistory'
import MonthlyElectricityConsumption from '../components/monthlymv/MonthlyElectricityConsumption'
import MonthlyYOYElectricalConsumptionCommonSpace from '../components/monthlymv/MonthlyYOYElectricalConsumptionCommonSpace'
import MonthlyForecastElectricityConsumption from '../components/monthlymv/MonthlyForecastElectricityConsumption'
import MonthlyForecastActualSavings from '../components/monthlymv/MonthlyForecastActualSavings'
import MetricBox from '../components/metrics/MetricBox'
import SectionTitle from '../components/file-manager-cards/SectionTitle'

import EquationModalContainer from './EquationModalContainer'


const formatFormula = (equation, values) => 
  equation.map(({ type, value }) => {
    if (type === 'var') {
      return `${value}(${formatNumber(values[value])})`
    }
    
    return value
  }).join('')

const getIndexedColor = (colorsMap) => (index) => {
  return colorsMap[index]
}

class MonthlyMVContainer extends React.Component {

  state = {
    equation: false,
  }

  handleToggleEquation = () => this.setState((prevState) => ({
    equation: !prevState.equation,
  }))

  formatElectricalConsumptionHistory = () => {
    return this.props.electricalConsumptionHistory.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: dataset.label === 'Baseline' ? false : 'start',
      type: dataset.label === 'Baseline' ? 'line' : 'bar',
      data: [...dataset.data],
      backgroundColor: index === 0 
        ? colors.actual.toRGBA(1)
        : colors.baseline.toRGBA(1),
      borderColor: index === 0 
        ? colors.actual.toHex()
        : colors.baseline.toHex(),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor:  index === 0 
        ? colors.actual.toHex(0.1)
        : colors.baseline.toHex(0.1),
      borderWidth: 1.5,
    }))
  }

  formatElectricityConsumption = () => {
    return this.props.electricityConsumption.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: 'start',
      data: [...dataset.data],
      backgroundColor: getIndexedColor([
        colors.baseline,
        colors.adjustedbaseline,
        colors.actual,
      ])(index).toRGBA(1),
      borderColor: getIndexedColor([
        colors.baseline,
        colors.adjustedbaseline,
        colors.actual,
      ])(index).toHex(1),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: getColor(index).toRGBA(1),
      borderWidth: 1.5,
    }))
  }

  formatYOYElectricalConsumptionCommonSpace = () => {
    return this.props.yoyElectricalConsumptionCommonSpace.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: 'start',
      data: [...dataset.data],
      backgroundColor: dataset.data.map((v, _i) => colors.actual.toRGBA(1 - ((_i+1) / 10))),
      borderColor: dataset.data.map((v, _i) => colors.actual.toRGBA(1 - ((_i+1) / 10))),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: colors.actual.toHex(),
      borderWidth: 1.5,
    }))
  }

  formatForecastElectricityConsumption = () => {
    return this.props.forecastElectricityConsumption.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: false,
      data: [...dataset.data],
      backgroundColor: index === 0 
        ? colors.forecast.toRGBA()
        : colors.actual.toRGBA(),
      borderColor: index === 0
        ? colors.forecast.toHex()
        : colors.actual.toHex(),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor:  index === 0 
        ? colors.forecast.toHex(0.1)
        : colors.actual.toHex(0.1),
      borderWidth: 1.5,
    }))
  }

  formatForecastVSActualSavings = () => {
    return this.props.forecastVSActualSavings.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: 'start',
      data: [...dataset.data],
      backgroundColor: index === 0 
        ? colors.actual.toRGBA()
        : colors.forecast.toRGBA(),
      borderColor: index === 0
        ? colors.actual.toHex()
        : colors.forecast.toHex(),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: getColor(index).toRGBA(1),
      borderWidth: 1.5,
    }))
  }

  formatChwConsumptionHistory = () => {
    return this.props.chwConsumptionHistory.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: dataset.label === 'Baseline' ? false : 'start',
      type: dataset.label === 'Baseline' ? 'line' : 'bar',
      data: [...dataset.data],
      backgroundColor: index === 0 
        ? colors.actual.toRGBA(1)
        : colors.baseline.toRGBA(1),
      borderColor: index === 0 
        ? colors.actual.toHex()
        : colors.baseline.toHex(),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor:  index === 0 
        ? colors.actual.toHex(0.1)
        : colors.baseline.toHex(0.1),
      borderWidth: 1.5,
    }))
  }

  formatChwConsumption = () => {
    return this.props.chwConsumption.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: 'start',
      data: [...dataset.data],
      backgroundColor: index === 0 
        ? colors.adjustedbaseline.toRGBA(1)
        : colors.actual.toRGBA(1),
      borderColor: index === 0 
        ? colors.adjustedbaseline.toHex()
        : colors.actual.toHex(),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: getColor(index).toRGBA(1),
      borderWidth: 1.5,
    }))
  }

  formatYoyChwConsumptionCommonSpace = () => {
    return this.props.yoyChwConsumptionCommonSpace.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: 'start',
      data: [...dataset.data],
      backgroundColor: dataset.data.map((v, _i) => colors.actual.toRGBA(1 - ((_i+1) / 10))),
      borderColor: dataset.data.map((v, _i) => colors.actual.toRGBA(1 - ((_i+1) / 10))),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: colors.actual.toHex(),
      borderWidth: 1.5,
    }))
  }

  formatForecastChwConsumption = () => {
    return this.props.forecastChwConsumption.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: false,
      data: [...dataset.data],
      backgroundColor: index === 0 
        ? colors.adjustedbaseline.toRGBA(1)
        : colors.actual.toRGBA(1),
      borderColor: index === 0 
        ? colors.adjustedbaseline.toHex()
        : colors.actual.toHex(),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: getColor(index).toRGBA(1),
      borderWidth: 1.5,
    }))
  }

  formatForecastChwVSActualSavings = () => {
    return this.props.forecastChwVSActualSavings.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: 'start',
      data: [...dataset.data],
      backgroundColor: index === 0 
        ? colors.actual.toRGBA()
        : colors.forecast.toRGBA(),
      borderColor: index === 0
        ? colors.actual.toHex()
        : colors.forecast.toHex(),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: getColor(index).toRGBA(1),
      borderWidth: 1.5,
    }))
  }

  getComputedValues = () => 
    Object.keys(this.props.computedVariablesMap)
      .map((variable) => ({ name: variable, value: this.props.computedVariablesMap[variable] }))
  
  getEquationsFormulas = () => 
    this.props.equations.map(({ name, value }) => ({
      name,
      value: formatFormula(
        value, this.props.computedVariablesMap
      ), 
    }))

  hasBldgMVConsumptionSavingskWh = () => (this.props.equations.filter(
    ({ name }) => name === 'BldgMVConsumptionSavings_kWh')
  ).length > 0
  
  hasBldgMVCostSavings_AED = () => (this.props.equations.filter(
    ({ name }) => name === 'BldgMVCostSavings_AED')
  ).length > 0
  
  render() {
    const { 
      project,
      loading,
      variables = [],
      metrics: {
        BldgMVConsumptionSavings_kWh,
        BldgMVCostSavings_AED,
        PrjctMVConsumptionSavings_kWh,
        PrjctMVCostSavings_AED,
      },
      electricalConsumptionHistory,
      electricityConsumption,
      yoyElectricalConsumptionCommonSpace,
      forecastElectricityConsumption,
      forecastVSActualSavings,
      chwConsumptionHistory,
      chwConsumption,
      yoyChwConsumptionCommonSpace,
      forecastChwConsumption,
      forecastChwVSActualSavings,
    } = this.props

    const {
      project: {
        hasElectricityMeters,
        hasChilledWaterMeters,
        // hasWaterMeters,
        // hasGasMeters,
      },
    } = project

    return (
      <React.Fragment>      
        <Row>
          <Col md="12" lg="12" className="mb-4">
            <Button 
              theme={'white'}
              onClick={this.handleToggleEquation}
              className="float-right"
            >
              <i className="material-icons">trending_up</i>
            </Button>
            
            <Button 
              theme={'white'}
              onClick={this.props.onUpdate}
              className="float-right mr-2"
            >
              <i className="material-icons">refresh</i>
            </Button>

            {(!loading) && (
              <EquationModalContainer
                mv={project.mv}
                projectId={project.project.id}
                projectMeters={project.meters}
                variables={variables}
                open={this.state.equation}
                onToggle={this.handleToggleEquation}
                onUpdate={this.props.onUpdate}
              />
            )}
          </Col>
        </Row>

        {/* Validation */}
        {!this.hasBldgMVConsumptionSavingskWh() && (
          <Alert theme="warning">You haven't built <b>BldgMVConsumptionSavings_kWh</b> equation.</Alert>
        )}

        {!this.hasBldgMVCostSavings_AED() && (
          <Alert theme="warning">You haven't built <b>BldgMVCostSavings_AED</b> equation.</Alert>
        )}
        {/* /Validation */}

        <Row>
          <Col md="3" lg="3" className="mb-4">
            <MetricBox 
              label={'Month Savings (kWh)'}
              value={BldgMVConsumptionSavings_kWh && formatNumber(BldgMVConsumptionSavings_kWh)}
              variation="1"
            />
          </Col>
          <Col md="3" lg="3" className="mb-4">
            <MetricBox 
              label={'Month Savings (AED)'}
              value={BldgMVCostSavings_AED && formatNumber(BldgMVCostSavings_AED)}
              variation="1"
            />
          </Col>
          <Col md="3" lg="3" className="mb-4">
            <MetricBox 
              label={'Project Savings (kWh)'}
              value={PrjctMVConsumptionSavings_kWh && formatNumber(PrjctMVConsumptionSavings_kWh)}
              variation="1"
            />
          </Col>
          <Col md="3" lg="3" className="mb-4">
            <MetricBox 
              label={'Project Savings (AED)'}
              value={PrjctMVCostSavings_AED && formatNumber(PrjctMVCostSavings_AED)}
              variation="1"
            />
          </Col>
        </Row>

        {/* Electricity */}
        {hasElectricityMeters && (
          <React.Fragment>
            <SectionTitle title="Electrical" />
            <Row>
              <Col md="9" lg="9" className="mb-4">
                <MonthlyElectricalConsumptionHistory 
                  title={'Electrical Consumption History (kWh)'}
                  subTitle="Baseline vs Actual"
                  type={'bar'}
                  dataId={electricalConsumptionHistory.dataId}
                  chartData={{
                    labels: electricalConsumptionHistory.labels,
                    datasets: this.formatElectricalConsumptionHistory(),
                  }}
                />
              </Col>
              <Col md="3" lg="3" className="mb-4">
                <MonthlyElectricityConsumption
                  type={'bar'}
                  title={'Electricity Consumption (kWh)'}
                  subTitle="Adjusted vs Actual"
                  dataId={electricityConsumption.dataId}
                  chartData={{
                    labels: electricityConsumption.labels,
                    datasets: this.formatElectricityConsumption(),
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Col md="4" lg="4" className="mb-4">
                <MonthlyYOYElectricalConsumptionCommonSpace 
                  type={'bar'}
                  title={'YOY Electrical Consumption'}
                  subTitle="Common Space"
                  dataId={yoyElectricalConsumptionCommonSpace.dataId}
                  chartData={{
                    labels: yoyElectricalConsumptionCommonSpace.labels,
                    datasets: this.formatYOYElectricalConsumptionCommonSpace(),
                  }}
                />
              </Col>
              <Col md="4" lg="4" className="mb-4">
                <MonthlyForecastElectricityConsumption 
                  type={'line'}
                  title="Forecast Electricity Consumption (kWh)"
                  subTitle="Actual vs Forecast"
                  dataId={forecastElectricityConsumption.dataId}
                  chartData={{
                    labels: forecastElectricityConsumption.labels,
                    datasets: this.formatForecastElectricityConsumption(),
                  }}
                />
              </Col>
              <Col md="4" lg="4" className="mb-4">
                <MonthlyForecastActualSavings
                  type="bar"
                  title="Forecast vs Actual Savings (AED)"
                  subTitle="Forecast vs Actual"
                  dataId={forecastVSActualSavings.dataId}
                  chartData={{
                    labels: forecastVSActualSavings.labels,
                    datasets: this.formatForecastVSActualSavings(),
                  }}
                />
              </Col>
            </Row>
          </React.Fragment>
        )}

        {/* Chilled */}
        {hasChilledWaterMeters && (
          <React.Fragment>
            <SectionTitle title="Chilled Water" />

            <Row>
              <Col md="9" lg="9" className="mb-4">
                <MonthlyElectricalConsumptionHistory 
                  title={'Chilled Water Consumption History'}
                  subTitle="Baseline vs Actual"
                  type={'bar'}
                  dataId={chwConsumptionHistory.dataId}
                  chartData={{
                    labels: chwConsumptionHistory.labels,
                    datasets: this.formatChwConsumptionHistory(),
                  }}
                />
              </Col>
              <Col md="3" lg="3" className="mb-4">
                <MonthlyElectricityConsumption
                  type={'bar'}
                  title={'Chilled Water Consumption (kWh)'}
                  subTitle="Unadjusted vs Actual"
                  dataId={chwConsumption.dataId}
                  chartData={{
                    labels: chwConsumption.labels,
                    datasets: this.formatChwConsumption(),
                  }}
                />
              </Col>
            </Row>
 
            <Row>
              <Col md="4" lg="4" className="mb-4">
                <MonthlyYOYElectricalConsumptionCommonSpace 
                  type={'bar'}
                  title={'YOY Chilled Water Consumption'}
                  subTitle="Common Space"
                  dataId={yoyChwConsumptionCommonSpace.dataId}
                  chartData={{
                    labels: yoyChwConsumptionCommonSpace.labels,
                    datasets: this.formatYoyChwConsumptionCommonSpace(),
                  }}
                />
              </Col>
              <Col md="4" lg="4" className="mb-4">
                <MonthlyForecastElectricityConsumption 
                  type={'line'}
                  title="Forecast Chilled Water Consumption (kWh)"
                  subTitle="Actual vs Forecast"
                  dataId={forecastChwConsumption.dataId}
                  chartData={{
                    labels: forecastChwConsumption.labels,
                    datasets: this.formatForecastChwConsumption(),
                  }}
                />
              </Col>
              <Col md="4" lg="4" className="mb-4">
                <MonthlyForecastActualSavings
                  type="bar"
                  title="Forecast vs Actual Savings (AED)"
                  subTitle="Forecast vs Actual"
                  dataId={forecastChwVSActualSavings.dataId}
                  chartData={{
                    labels: forecastChwVSActualSavings.labels,
                    datasets: this.formatForecastChwVSActualSavings(),
                  }}
                />
              </Col>
            </Row>
          </React.Fragment>
        )}

        {/* Debug Zone */}
        <Row>
          <Col md="6" lg="6" className="mb-4">
            <Card small className='h-100'>
              <CardHeader className="border-bottom">
                <h6 className="m-0">Computed Variables</h6>
                {/* <div className="block-handle" /> */}
              </CardHeader>

              <CardBody className="p-0">
                <ListGroup small flush className="list-group-small">
                  {this.getComputedValues().map((item, idx) => (
                    <ListGroupItem key={idx} className="d-flex px-3 py-2">
                      <span className="text-semibold text-fiord-blue">{item.name}</span>
                      <span className="ml-auto text-right text-semibold text-reagent-gray">
                        {item.value ? item.value : 'N/A'}
                      </span>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
          <Col md="6" lg="6" className="mb-4">
            <Card small className='h-100'>
              <CardHeader className="border-bottom">
                <h6 className="m-0">Equations Formulas</h6>
                {/* <div className="block-handle" /> */}
              </CardHeader>

              <CardBody className="p-0">
                <ListGroup small flush className="equations-debug-formulas list-group-small">
                  {this.getEquationsFormulas().map((item, idx) => (
                    <ListGroupItem key={idx} className="d-flex px-3 py-2">
                      [{idx + 1}]{' '}{item.name}{' = '}{item.value}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </React.Fragment>
    )
  }

}


export default connect(
  (state) => ({
    loading: getLoading(state),
    project: getProjectData(state),
    metrics: getMetrics(state),
    variables: getVariables(state),

    electricalConsumptionHistory: getElectricalConsumptionHistory(state),
    electricityConsumption: getElectricityConsumption(state),
    yoyElectricalConsumptionCommonSpace: getYoyElectricalConsumptionCommonSpace(state),
    forecastElectricityConsumption: getForecastElectricityConsumption(state),
    forecastVSActualSavings: getForecastVSActualSavings(state),


    chwConsumptionHistory: getChwConsumptionHistory(state),
    chwConsumption: getChwConsumption(state),
    yoyChwConsumptionCommonSpace: getYoyChwConsumptionCommonSpace(state),
    forecastChwConsumption: getForecastChwConsumption(state),
    forecastChwVSActualSavings: getForecastChwVSActualSavings(state),

    equations: getEquations(state),
    computedVariablesMap: getComputedVariablesMap(state),
  }),
  (dispatch) => ({
    
  })
)(MonthlyMVContainer)