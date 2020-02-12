import * as React from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
} from 'shards-react'

import {
  loadZoneConsumption,
  loadZoneCostPerFuel,
  loadZoneCostPerProject,
  loadZoneBenchmarks,
  loadZoneInfo,
  loadZoneProjectsEnergy,
  loadConsumptionPerBuildingPerFuel,
  
  getSingle,

  getEnergyConsumption,
  getCostPerFuel,
  getCostPerProject,
  getBenchmarks,
  getInfo,
  getBuildingsList,
  getEnergyMetric,
  getConsumptionPerBuildingPerFuel,
} from '../../redux/reducers/zones'
import colors from '../utils/colors'
import { formatNumber } from '../utils/format'
import { getColor, getSystemColor } from '../utils/theme'
import InfoLabel from '../components/common/InfoLabel'
import ZoneInfo from '../components/zones/ZoneInfo'
import BuildingsSelect from '../components/zones/BuildingsSelect'
import ZoneMonthlyConsumption from '../components/zones/ZoneMonthlyConsumption'
import ZoneConsumptionByBuilding from '../components/zones/ZoneConsumptionByBuilding'
import CostPerFuel from '../components/metrics/CostPerFuel'
import ZoneCostPerProject from '../components/zones/ZoneCostPerProject'
import ZoneBenchmarking from '../components/zones/ZoneBenchmarking'
import ZoneEnergyConsumption from '../components/zones/ZoneEnergyConsumption'
import DashboardDateBar from '../components/common/DashboardDateBar'


const getAvarageValue = (dataset) => {
  const sum = dataset.reduce((a, b) => a + b, 0.0)

  return sum / (dataset.length - 1)
}

class ZoneMetricsContainer extends React.Component {

  static defaultProps = {
    projects: [],
  }

  state = {
    selectedBuildings: [].concat(this.props.buildings).map(_p => _p.id),
  }

  shouldReload = (ids) => ids.length > 0;

  reload = (ids) => {
    const id = this.props.zone.id

    if (this.shouldReload(ids)) {
      this.setState({
        selectedBuildings: ids,
      }, () => {
        this.props.loadZoneConsumption(id, ids)
        this.props.loadZoneCostPerFuel(id, ids)
        this.props.loadZoneCostPerProject(id, ids)
        this.props.loadZoneBenchmarks(id, ids)
        this.props.loadZoneInfo(id, ids)
        this.props.loadZoneProjectsEnergy(id, ids, 'eui')
        this.props.loadConsumptionPerBuildingPerFuel(
          id, 
          ids, 
          this.props.consumptionPerBuildingPerFuel.range
        )
      })
    }
  }

  getZoneInfo() {
    const {
      zone: {
        code,
      },
      info: {
        annualEnergyCost,
        annualEnergykWh,
        annualElectricalAED,
        annualElectricalkWh,
        annualChilledWaterAED,
        annualChilledWaterRTH,
        annualGas,
        annuaGasAED,
        annualWaterIG,
        annualWaterAED,
        averageEUI,
        averageECI,
        consumptionCO2,
        totalArea,
        tenantArea,
        commonSpace,
        buaArea,
        hasElectricity,
        hasChilledWater,
        hasWater,
        hasGas,
        hasEnergy,
      }, 
    } = this.props

    return [
      { 
        title: (
          <InfoLabel 
            label={'General'} 
            icon={'General'} 
          />
        ),
        space: true,
      },
      { 
        title: (
          <InfoLabel 
            label={'Total Area'}
            unit={<>m<sup>2</sup></>}
          />
        ),
        value: formatNumber(totalArea),
      },
      { 
        title: (
          <InfoLabel 
            label={'Tenant Metered Area'}
            unit={<>m<sup>2</sup></>}
          />
        ),
        value: formatNumber(tenantArea),
      },
      { 
        title: (
          <InfoLabel 
            label={'Common Area'}
            unit={<>m<sup>2</sup></>}
          />
        ),
        value: formatNumber(commonSpace),
      },
      { 
        title: (
          <InfoLabel 
            label={'BUA Area'}
            unit={<>m<sup>2</sup></>}
          />
        ),
        value: formatNumber(buaArea),
      },
      { 
        title: (
          <InfoLabel 
            label={'EUI'}
            unit={<>kWh / m<sup>2</sup></>}
          />
        ),
        value: formatNumber(averageEUI),
        info: 'EUI score is based on 12 months of previous year consumptions.',
      },
      { 
        title: (
          <InfoLabel 
            label={'ECI'}
            unit={<>kWh / m<sup>2</sup></>}
          />
        ),
        value: formatNumber(averageECI),
        info: 'ECI score is based on 12 months of previous year consumptions.',
      },
      { 
        title: (
          <InfoLabel 
            label={'CO2 Emissions'}
            unit={'Kg CO2e'}
          />
        ),
        value: formatNumber(consumptionCO2),
      },
      { 
        title: (
          <InfoLabel 
            label={'Zone Info'} 
            icon={'General'} 
          />
        ),
        space: true,
      },
      { 
        title: (
          <InfoLabel 
            label={'Code'}
          />
        ),
        value: code,
      },
      { 
        title: <InfoLabel label={'Energy'} icon={'Energy'} />,
        space: true,
        hidden: !hasEnergy,
      },
      { 
        title: (
          <InfoLabel 
            label={'Annual Energy Cost'}
            unit={'AED'}
          />
        ),
        value: formatNumber(annualEnergyCost),
        hidden: !hasEnergy,
      },
      { 
        title: (
          <InfoLabel 
            label={'Annual Energy Consumption'}
            unit={'kWh'}
          />
        ),
        value: formatNumber(annualEnergykWh),
        hidden: !hasEnergy,
      },
      { 
        title: (
          <InfoLabel 
            label={'Electricity'}
            icon={'Electricity'}
          />
        ),
        space: true,
        hidden: !hasElectricity,
      },
      { 
        title: (
          <InfoLabel 
            label={'Annual Electricity Cost'}
            unit={'AED'}
          />
        ),
        value: formatNumber(annualElectricalAED),
        hidden: !hasElectricity,
      },
      { 
        title: (
          <InfoLabel 
            label={'Annual Electricity Consumption'}
            unit={'kWh'}
          />
        ), 
        value: formatNumber(annualElectricalkWh),
        hidden: !hasElectricity,
      },
      { 
        title: (
          <InfoLabel 
            label={'Chilled Water'}
            icon={'Chilled Water'}
          />
        ),
        space: true,
        hidden: !hasChilledWater,
      },
      { 
        title: (
          <InfoLabel 
            label={'Annual CHW Cost'}
            unit={'AED'}
          />
        ), 
        value: formatNumber(annualChilledWaterAED),
        hidden: !hasChilledWater,
      },
      { 
        title: (
          <InfoLabel 
            label={'Annual CHW Consumption'}
            unit={'RTH'}
          />
        ), 
        value: formatNumber(annualChilledWaterRTH),
        hidden: !hasChilledWater,
      },
      { 
        title: (
          <InfoLabel 
            label={'LPG (GAS)'}
            icon={'GAS'}
          />
        ),
        space: true,
        hidden: !hasGas,
      },
      { 
        title: (
          <InfoLabel 
            label={'Annual GAS Consumption'}
            unit={'L'}
          />
        ), 
        value: formatNumber(annualGas),
        hidden: !hasGas,
      },
      { 
        title: (
          <InfoLabel 
            label={'Annual GAS Cost'}
            unit={'AED'}
          />
        ), 
        value: formatNumber(annuaGasAED),
        hidden: !hasGas,
      },
      { 
        title: (
          <InfoLabel 
            label={'Water'}
            icon={'Water'}
          />
        ),
        space: true,
        hidden: !hasWater,
      },
      { 
        title: (
          <InfoLabel 
            label={'Annual Water Consumption'}
            unit={'IG'}
          />
        ), 
        value: formatNumber(annualWaterIG),
        hidden: !hasWater,
      },
      { 
        title: (
          <InfoLabel 
            label={'Annual Water Cost'}
            unit={'AED'}
          />
        ), 
        value: formatNumber(annualWaterAED),
        hidden: !hasWater,
      },
    ].filter((_i) => !_i.hidden)
  }

  handleBuildingsCheck = (data) => {
    const { buildings = [] } = data
    const checkedBuildingsIds = buildings.filter(_b => _b.selected).map(_b => _b.value)

    this.reload(checkedBuildingsIds)
  }

  formatBuildings = () => {
    return this.props.buildings.map(_building => ({
      value: _building.id,
      label: _building.name,
      selected: true,
    }))
  }

  formatEnergyConsumption = () => {
    return this.props.energyConsumption.datasets.map((dataset) => ({
      // fill: false,
      label: dataset.label,
      data: [...dataset.data],
      backgroundColor: getSystemColor(dataset.label).toRGBA(0.1),
      borderColor: getSystemColor(dataset.label).toRGBA(1),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: getSystemColor(dataset.label).toRGBA(1),
      borderWidth: 1.5,
    }))
  }

  formatBenchmarks = () => {
    const { benchmarks } = this.props    
    const average = getAvarageValue(benchmarks.datasets)

    const benchmarkColors = this.props.benchmarks.datasets.map((_d, index) =>
      getColor(index, 3).toHex()
    )

    const datasets = [
      {
        type: 'line',
        label: 'Avarage',
        borderColor: colors.gray600.toRGBA(1),
        borderWidth: 1.5,
        borderDash: [10,5],
        // fill: false,
        data: [
          ...benchmarks.datasets.map(() => average),
        ],
        pointRadius: 0,
        backgroundColor: getSystemColor('Avarage').toRGBA(0.1),
        borderColor: getSystemColor('Avarage').toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: getSystemColor('Avarage').toRGBA(1),
        borderWidth: 1.5,
      },
      {
        label: 'EUI',
        label: benchmarks.label,
        fill: false,
        data: [...benchmarks.datasets],
        backgroundColor: benchmarkColors,
        borderColor: benchmarkColors,
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor:benchmarkColors,
      },
    ]

    return datasets
  }

  formatCostPerFuel = () => {
    const costPerFuelColors = this.props.costPerFuel.labels.map(_label =>
      getSystemColor(_label).toHex()
    )

    return [
      {
        label: 'Cost',
        fill: false,
        hoverBorderColor: colors.white.toRGBA(1),
        data: [ ...this.props.costPerFuel.datasets ],
        backgroundColor: costPerFuelColors,
        borderColor: colors.white.toHex(),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: colors.white.toHex(),
        borderWidth: 1.5,
      },
    ]
  }

  formatCostPerProject = () => {
    return [
      {
        hoverBorderColor: colors.white.toRGBA(1),
        data: [ ...this.props.costPerProject.datasets ],
        backgroundColor: [
          ...this.props.costPerProject.labels.map((l, i) => 
            getColor(i, 3).toHex()
          ),
        ],
      },
    ]
  }

  getBuldingNameById = (id) => {
    const project = this.props.buildings.filter(_p => _p.id === id)[0]
    return project ? project.name : 'N/A'
  }

  formatEnergyMetric = () => {
    const energyMetricColors = this.props.energyMetric.datasets.map((_d, index) =>
      getColor(index, 3).toHex()
    )

    return this.props.energyMetric.datasets.map((dataset, index) => ({
      label: this.getBuldingNameById(this.props.energyMetric.projects[index]),
      fill: false,
      data: [...dataset],
      backgroundColor: energyMetricColors,
      borderColor: energyMetricColors,
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: energyMetricColors,
      borderWidth: 1.5, 
    }))
  }

  formatConsumptionByBuilding = () => {
    return this.props.consumptionPerBuildingPerFuel.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: true,
      data: [...dataset.data],
      backgroundColor: getSystemColor(dataset.label).toRGBA(1),
      borderColor: getSystemColor(dataset.label).toRGBA(1),
      pointBackgroundColor: getSystemColor(dataset.label).toRGBA(1),
      pointHoverBackgroundColor: getSystemColor(dataset.label).toRGBA(1),
      borderWidth: 1.5, 
    }))
  }

  handleConsumptionByBuildingChange = (nextRange) => {
    const id = this.props.zone.id
    const ids = this.state.selectedBuildings

    this.props.setConsumptionPerBuildingRange(nextRange)
    this.props.loadConsumptionPerBuildingPerFuel(id, ids, nextRange)
  }

  handleDateBarChanged = async (nextRange) => {
    const id = this.props.zone.id
    const ids = this.state.selectedBuildings

    await Promise.all([
      this.props.loadConsumptionPerBuildingPerFuel,
      this.props.loadZoneConsumption,
      this.props.loadZoneCostPerFuel,
      this.props.loadZoneCostPerProject,
    ].map(fn => fn(id, ids, nextRange)))
  }

  render() {
    const { 
      zone,

      energyConsumption,
      costPerFuel,
      costPerProject,
      benchmarks,
      energyMetric,
      consumptionPerBuildingPerFuel,
    } = this.props

    const zoneEUITitle = 'EUI ' + (benchmarks.year ? `(${benchmarks.year})` : '')

    return (
      <React.Fragment>
        <Row className='d-flex justify-content-end py-4 mr-2'>
          <DashboardDateBar onRangeChange={this.handleDateBarChanged} />
        </Row>  
        <Row>
          <Col md="3" lg="3" className="mb-4">
            <ZoneInfo 
              title={'Information'}
              info={this.getZoneInfo()}
            />
          </Col>
          <Col md="6" lg="6" className="mb-4">
            <ZoneMonthlyConsumption 
              title={'Energy Consumption (kWh)'}
              subTitle={'Per Fuel'}
              dataId={energyConsumption.dataId}
              extraValues={energyConsumption.extraValues}
              chartData={{
                labels: energyConsumption.labels,
                datasets: this.formatEnergyConsumption(),
              }}
            />
          </Col>
          <Col md="3" lg="3" className="mb-4">
            <CostPerFuel 
              title={'Utility Cost (AED)'}
              subTitle={'Per Fuel'}
              dataId={costPerFuel.dataId}
              chartData={{
                total: costPerFuel.total,
                labels: costPerFuel.labels,
                datasets: this.formatCostPerFuel(),
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col md="3" lg="3" className="mb-4">
            <BuildingsSelect 
              title={'Projects'}
              // subTitle={'Select'}
              initialValues={{
                buildings: this.formatBuildings(),
              }}
              onChange={this.handleBuildingsCheck}
            />
          </Col>
          <Col md="6" lg="6" className="mb-4">
            <ZoneConsumptionByBuilding
              title={'Energy Consumption (kWh)'}
              subTitle={'Per Project Per Fuel'}
              dataId={consumptionPerBuildingPerFuel.dataId}
              range={consumptionPerBuildingPerFuel.range}
              onRangeChange={this.handleConsumptionByBuildingChange}
              chartData={{
                labels: consumptionPerBuildingPerFuel.labels,
                datasets: this.formatConsumptionByBuilding(),
              }}
            />
          </Col>
          <Col md="3" lg="3" className="mb-4">
            <ZoneCostPerProject 
              title={'Utility Cost (AED)'}
              subTitle={'Per Project'}
              dataId={costPerProject.dataId}
              chartData={{
                total: costPerProject.total,
                labels: costPerProject.labels,
                datasets: this.formatCostPerProject(),
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col md="3" lg="3" className="mb-4">
           
          </Col>
          <Col md="6" lg="6" className="mb-4">
            <ZoneBenchmarking 
              title={zoneEUITitle}
              subTitle="Zone"
              dataId={benchmarks.dataId}
              chartData={{
                labels: benchmarks.labels,
                datasets: this.formatBenchmarks(),
              }}
            />
          </Col>
          <Col md="3" lg="3" className="mb-4">
            <ZoneEnergyConsumption 
              title={'Consumption (kWh)'}
              subTitle={'Year On Year'}
              dataId={energyMetric.dataId}
              chartData={{
                labels: energyMetric.labels,
                datasets: this.formatEnergyMetric(),
              }}
            />
          </Col>
        </Row>
      </React.Fragment>
    )
  }

}


export default connect(
  (state) => ({
    zone: getSingle(state),
    buildings: getBuildingsList(state),

    energyConsumption: getEnergyConsumption(state),
    costPerFuel: getCostPerFuel(state),
    costPerProject: getCostPerProject(state),
    benchmarks: getBenchmarks(state),
    info: getInfo(state),
    energyMetric: getEnergyMetric(state),
    consumptionPerBuildingPerFuel: getConsumptionPerBuildingPerFuel(state),
  }),
  (dispatch) => ({
    setConsumptionPerBuildingRange: (nextRange) => dispatch(loadZoneConsumption(nextRange)),

    loadZoneConsumption: (id, ids, range) => dispatch(loadZoneConsumption(id, ids, range)),
    loadZoneCostPerFuel: (id, ids, range) => dispatch(loadZoneCostPerFuel(id, ids, range)),
    loadZoneCostPerProject: (id, ids, range) => dispatch(loadZoneCostPerProject(id, ids, range)),
    loadZoneBenchmarks: (id, ids) => dispatch(loadZoneBenchmarks(id, ids)),
    loadZoneInfo: (id, ids) => dispatch(loadZoneInfo(id, ids)),
    loadZoneProjectsEnergy: (id, ids) => dispatch(loadZoneProjectsEnergy(id, ids)),
    loadConsumptionPerBuildingPerFuel: (id, ids, range) => dispatch(loadConsumptionPerBuildingPerFuel(id, ids, range)),
  })
)(ZoneMetricsContainer)
