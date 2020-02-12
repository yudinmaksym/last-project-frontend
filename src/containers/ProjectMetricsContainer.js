/* eslint-disable camelcase */
import React, { useMemo } from 'react'
import groupBy from 'lodash/groupBy'
import { connect } from 'react-redux'
import {
  Row,
  Col,
} from 'shards-react'

import colors from '../utils/colors'
import { formatNumber } from '../utils/format'
import { getColor, getSystemColor } from '../utils/theme'
import {
  getProjectData,
  getCostPerFuelData,
  getSpecificProjectInfoData,

  getCostPerFuelRange,
  getConsumptionByYears,
  getConsumptionBaseline,

  getEnergyConsumptionFuelData,
  getElectricityConsumptionFuelData,
  getChilledWaterConsumptionFuelData,
  getWaterConsumptionFuelData,
  getLpgGasConsumptionFuelData,
  setCostPerFuelRange,
  
  loadConsumptionBaseline,
  loadCostPerFuel,
  
  getEnergyMetric,
  setEnergyType,
  
  loadEnergyMetric,
  getMDBMetric,
  
  getScoreBanchmark,

  getMDBRange,
  getConsumptionPerMeter,

  setEnergyConsumptionFuelRange,
  setElectricityConsumptionFuelRange,
  setChilledWaterConsumptionFuelRange,
  setWaterConsumptionFuelRange,
  setLpgGasConsumptionFuelRange,

  setConsumptionPerMeterRange,

  loadEnergyConsumptionFuel,
  loadElectricityConsumptionFuel,
  loadChilledWaterConsumptionFuel,
  loadWaterConsumptionFuel,
  loadEnergyConsumptionPerMeter,
  loadLpgGasConsumptionFuel,

  loadConsumptionByYears,
} from '../../redux/reducers/projects'
import SystemIcon, { TYPES } from '../shared/SystemIcon'
import ProjectInfo from '../components/metrics/ProjectInfo'
import CostPerFuel from '../components/metrics/CostPerFuel'
import EnergyConsumption from '../components/metrics/EnergyConsumption'
import ProjectEnergyMetric from '../components/metrics/ProjectEnergyMetric'
import MetricInfoCard from '../components/metrics/MetricInfoCard'
import ConsumptionByMdb from '../components/metrics/ConsumptionByMdb'
import ProjectEnergyScore from '../components/benchmarks/ProjectEnergyScore'
import ConsumptionByYears from '../components/projects/ConsumptionByYears'
import ProjectMetersSelect from '../components/projects/ProjectMetersSelect'
import ConsumptionPerMeter from '../components/projects/ConsumptionPerMeter'
import BuildingInfo from '../components/projects/SalesInfoCards/BuildingInfo'
import SalesInfo from '../components/projects/SalesInfoCards/SalesInfo'
import ProjectSalesInfo from '../components/projects/SalesInfoCards/ProjectSalesInfo'
import CustomerInfo from '../components/projects/SalesInfoCards/CustomerInfo'
import DashboardDateBar from '../components/common/DashboardDateBar'
import InfoLabel from '../components/common/InfoLabel'


const metricCardFields = [{
  title: 'Annual Energy',
  key: 'annualEnergykWh',
  metric: 'kWh',
}, {
  title: 'Total Project Value',
  key: 'annualEnergyCost',
  metric: 'AED',
}, {
  title: 'Annual Reduction',
  key: 'percentageEnergyReduction',
  metric: '%',
}, {
  title: 'Annual Reduction',
  key: 'annualEnergyReduction',
  metric: 'kWh',
}]

const MetricCardContainer = ({ options = {} }) => (
  <>
    {(Object.keys(options).length && Object.keys(options).length > 0) && metricCardFields
      .map(({ key, ...rest }) => (
        <MetricInfoCard {...rest} value={options[key]} key={key} />
      ))}
  </>
)

const calculateReduction = (baseline, actual) => {
  return baseline.map((val, index) => {
    return val - actual[index]
  })
} 

function formatDiff(diff) {
  const val = (isNaN(diff) || Math.abs(diff) == Infinity) ? 0 : diff
  
  return `${val}%`
}

class ProjectMetricsContainer extends React.Component {

  getValues = (consumptionFuelData,fuelName,baselineFuel) => {
    const baseline = consumptionFuelData.labels.map((l) => {
      const month = l.split(' ')[0]
      const value = this.props.consumptionBaseline[baselineFuel][month] || 0

      return value
    })

    const reduction = calculateReduction(
      baseline,
      consumptionFuelData.datasets[0].data
    )

    const reductionValue = reduction.reduce((acc, v) => acc+v, 0)
    const baselineValue = baseline.reduce((acc, v) => acc+v, 0)

    const diff = (
      (reductionValue / baselineValue) * 100
    ).toFixed(2)

    return [
      {
        label: `${fuelName} Reduction`,
        value: reductionValue,
      },
      ...consumptionFuelData.extraValues,
      {
        label: 'Baseline Total',
        value: baselineValue,
      },
      {
        label: 'Diff',
        rawValue: formatDiff(diff),
      },
    ]
  }

  formatDatasets = (consumptionFuelData,fuelName,baselineFuel) => {
    const datasets = []

    const consumptionFuelDatasets = consumptionFuelData.datasets.map((dataset, index) => ({
      // fill: false,
      order: 3,
      type: 'line',
      label: dataset.label,
      data: [...dataset.data],
      borderColor: getSystemColor(fuelName).toRGBA(1),
      backgroundColor: getSystemColor(fuelName).toRGBA(0.1),
      pointHoverBackgroundColor: getSystemColor(fuelName).toRGBA(1),
      pointBackgroundColor: colors.white.toHex(),
      borderWidth: 1.5,
    }))

    const baseline = consumptionFuelData.labels.map((l) => {
      const month = l.split(' ')[0]
      const value = this.props.consumptionBaseline[baselineFuel][month] || 0
     
      return value
    })

    datasets.push(
      {
        fill: true,
        // type: 'line',
        label: `${fuelName} Reduction`,
        data: calculateReduction(
          baseline,
          consumptionFuelData.datasets[0].data
        ),
        borderColor: getSystemColor('Reduction').toRGBA(1),
        backgroundColor: getSystemColor('Reduction').toRGBA(0.1),
        pointHoverBackgroundColor: getSystemColor('Reduction').toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        borderWidth: 1,
      }
    )

    datasets.push(
      {
        fill: false,
        type: 'line',
        label: `Baseline ${fuelName}`,
        data: [...baseline],
        borderColor: getSystemColor('Baseline').toRGBA(1),
        backgroundColor: getSystemColor('Baseline').toRGBA(0.1),
        pointHoverBackgroundColor: getSystemColor('Baseline').toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        borderWidth: 1.5,
      }
    )

    return [
      ...consumptionFuelDatasets,
      ...datasets,
    ]
  }

  formatConsumptionByYearsDataset = () => {
    return this.props.consumptionByYears.datasets.map((dataset, index) => ({
      label: dataset.label,
      // fill: false,
      data: [...dataset.data],
      borderColor: getColor(index, 3).toHex(),
      backgroundColor: getColor(index, 3).toRGBA(0.1),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: getColor(index, 3).toHex(),
      borderWidth: 1.5,
    }))
  }

  formatCostPerFuelDataset = () => {
    return [
      {
        hoverBorderColor: colors.white.toRGBA(1),
        data: [ ...this.props.costPerFuel.datasets ],
        backgroundColor: this.props.costPerFuel.labels.map(_label => (
          getSystemColor(_label).toHex()
        )),
      },
    ]
  }

  formatConsumptionPerMeter = () => {
    return [
      {
        hoverBorderColor: colors.white.toRGBA(1),
        data: [ ...this.props.consumptionPerMeter.datasets ],
        backgroundColor: this.props.consumptionPerMeter.datasets.map((v, i) => (
          getColor(i, 3).toHex()
        )),
      },
    ]
  }

  formatEnergyDataset = () => {
    const energyColors = this.props.energy.datasets.map((_d, index) =>
      getColor(index, 3).toHex()
    )
    
    return [
      {
        label: this.props.energy.type,
        fill: 'start',
        data: [ ...this.props.energy.datasets ],
        backgroundColor: energyColors,
        borderColor: energyColors,
        pointBackgroundColor: '#FFFFFF',
        pointHoverBackgroundColor: energyColors,
        borderWidth: 1.5,
      },
    ]
  }

  formatMDBDataset = () => {
    return this.props.mdb.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: 'start',
      data: [ ...dataset.data ],
      backgroundColor: getColor(index, 3).toHex(),//.toRGBA(0.1),
      borderColor: getColor(index, 3).toHex(),//.toRGBA(1),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: getColor(index, 3).toRGBA(1),
      borderWidth: 1.5,
    }))
  }

  handleEnergyConsumptionRangeChange = (nextRange) => {
    const projectId = this.props.project.project.id

    this.props.setEnergyConsumptionFuelRange(nextRange)
    this.props.loadEnergyConsumptionFuel(nextRange, projectId)
    // this.props.loadConsumptionBaseline(projectId)
  }

  handleElectricityConsumptionRangeChange = (nextRange) => {
    const projectId = this.props.project.project.id

    this.props.setElectricityConsumptionFuelRange(nextRange)
    this.props.loadElectricityConsumptionFuel(nextRange, projectId)
    // this.props.loadConsumptionBaseline(projectId)
  }

  handleChilledWaterConsumptionRangeChange = (nextRange) => {
    const projectId = this.props.project.project.id

    this.props.setChilledWaterConsumptionFuelRange(nextRange)
    this.props.loadChilledWaterConsumptionFuel(nextRange, projectId)
    // this.props.loadConsumptionBaseline(projectId)
  }

  handleWaterConsumptionRangeChange = (nextRange) => {
    const projectId = this.props.project.project.id

    this.props.setWaterConsumptionFuelRange(nextRange)
    this.props.loadWaterConsumptionFuel(nextRange, projectId)
    // this.props.loadConsumptionBaseline(projectId)
  }

  handleGasConsumptionRangeChange = (nextRange) => {
    const projectId = this.props.project.project.id

    this.props.setLpgGasConsumptionFuelRange(nextRange)
    this.props.loadLpgGasConsumptionFuel(nextRange, projectId)
    // this.props.loadConsumptionBaseline(projectId)
  }

  handleCostPerFuelRangeChange = (nextRange) => {
    const projectId = this.props.project.project.id

    this.props.setCostPerFuelRange(nextRange)
    this.props.loadCostPerFuel(nextRange, projectId)
  }

  handleMDBRangeChange = (nextRange) => {
    const projectId = this.props.project.project.id

    this.props.setCostPerFuelRange(nextRange)
    this.props.loadCostPerFuel(nextRange, projectId)
  }

  handleConsumptionRangeChange = (nextRange) => {
    const projectId = this.props.project.project.id

    this.props.setConsumptionPerMeterRange(nextRange)
    this.props.loadEnergyConsumptionPerMeter(nextRange, projectId)
  }

  handleEnergyTypeChange = () => {
    const projectId = this.props.project.project.id
    const nextType = (this.props.energy.type === 'eui') ? 'eci' : 'eui'

    this.props.setEnergyType(nextType)
    this.props.loadEnergyMetric(nextType, projectId)
  }

  prepareEnergyConsumptionCharts = () => {
    const {  
      electricityConsumptionFuel,
      chilledWaterConsumptionFuel,
      waterConsumptionFuel,
      lpgGasConsumptionFuel,
      project: {
        project: {
          hasElectricityMeters,
          hasChilledWaterMeters,
          hasWaterMeters,
          hasGasMeters,
        },
      }, 
    }= this.props
    let Fuels=[]
    if(hasElectricityMeters){
      Fuels.push(<EnergyConsumption    
        type={'bar'}
        title={'Electricity Consumption (kWh)'}
        subTitle="Baseline vs Actual"
        dataId={electricityConsumptionFuel.dataId}
        chartData={{
          labels: electricityConsumptionFuel.labels,
          datasets: this.formatDatasets(electricityConsumptionFuel,'Electricity','baselineElectricity'),
        }}
        range={electricityConsumptionFuel.range}
        onRangeChange={this.handleElectricityConsumptionRangeChange}
        extraValues={[
          ...this.getValues(electricityConsumptionFuel,'Electricity','baselineElectricity'),
        ]}
      />)
    }
    if(hasChilledWaterMeters){
      Fuels.push( <EnergyConsumption
        type={'bar'}
        title={'Chilled Water Consumption (RTH)'}
        subTitle="Baseline vs Actual"
        dataId={chilledWaterConsumptionFuel.dataId}
        chartData={{
          labels: chilledWaterConsumptionFuel.labels,
          datasets: this.formatDatasets(chilledWaterConsumptionFuel,'Chilled Water','baselineChilledWater'),
        }}
        range={chilledWaterConsumptionFuel.range}
        onRangeChange={this.handleChilledWaterConsumptionRangeChange}
        extraValues={[
          ...this.getValues(chilledWaterConsumptionFuel,'Chilled Water','baselineChilledWater'),
        ]}
      />)      
    }
    if(hasWaterMeters){
      Fuels.push( <EnergyConsumption
        type={'bar'}
        title={'Water Consumption (IG)'}
        subTitle="Baseline vs Actual"
        dataId={waterConsumptionFuel.dataId}
        chartData={{
          labels: waterConsumptionFuel.labels,
          datasets: this.formatDatasets(waterConsumptionFuel,'Water','baselineWater'),
        }}
        range={waterConsumptionFuel.range}
        onRangeChange={this.handleWaterConsumptionRangeChange}
        extraValues={[
          ...this.getValues(waterConsumptionFuel,'Water','baselineWater'),
        ]}
      />)
    }
    if(hasGasMeters){
      Fuels.push( <EnergyConsumption
        type={'bar'}
        title={'LPG Gas Consumption (m3)'}
        subTitle="Baseline vs Actual"
        dataId={lpgGasConsumptionFuel.dataId}
        chartData={{
          labels: lpgGasConsumptionFuel.labels,
          datasets: this.formatDatasets(lpgGasConsumptionFuel,'LPG (Gas)','baselineGas'),
        }}
        range={lpgGasConsumptionFuel.range}
        onRangeChange={this.handleGasConsumptionRangeChange}
        extraValues={[
          ...this.getValues(lpgGasConsumptionFuel,'LPG (Gas)','baselineGas'),
        ]}
      />)
    }
    return Fuels
  }
  
  displayFuelsCharts = () =>{
    let fuelsData = this.prepareEnergyConsumptionCharts()
    let resultArray=[]
    for(let i=0;i<fuelsData.length;i+=2){
      resultArray.push(<Row>
        <Col key={i} md="6" lg="6" className="mb-4">{fuelsData[i]}</Col>
        <Col key={`${i}_`} md="6" lg="6" className="mb-4">{fuelsData[i+1]}</Col>
      </Row>)
    }
    return resultArray
  }
  
  getProjectInfo() {
    const { 
      project, 
      specificProjectInfo = {},
    } = this.props

    if (!project) {
      return []
    }

    const projectFuels = this.projectFuels()

    const masterBuilding = project.masterBuilding || {}

    const { 
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
    } = specificProjectInfo

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
            label={'Project Info'} 
            icon={'General'} 
          />
        ),
        space: true,
      },
      {
        title: 'Neighborhood',
        value: masterBuilding['city'],
      },
      {
        title: 'Year Built',
        value: masterBuilding['year_built'],
      },
      {
        title: '# of Buildings',
        value: project['buildings'] ? formatNumber(project['buildings'].length) : 0,
        additionalInfo: {
          header: 'Building Names',
          list: project['buildings'] ? project['buildings'].map(({ name: value }) => ({ value })) : [],
        },
      },
      {
        title: '# of Meters',
        value: project['meters'] ? formatNumber(project['meters'].length) : 0,
        additionalInfo: {
          header: 'Account Numbers',
          list: project['meters'] 
            ? Object.entries(
              groupBy(project['meters'], 'account_number')
            ).map(([k, v]) => ({ value: `${k} - ${v.map(({ fuel_type }) => fuel_type).join(', ')}` }))
            : [],
        },
      },
      {
        title: 'Fuels',
        value: projectFuels.length === 0 ? 'N/A' : projectFuels.join(', '),
      },
      {
        title: 'Occupancy Type',
        value: masterBuilding['occupancy_type'],
      },
      {
        title: 'Cooling Type',
        value: masterBuilding['cooling_type'],
      },
      {
        title: 'Metering Infrastructure',
        value: masterBuilding['metering_infrastructure'],
      },
      { 
        title: <span><SystemIcon name={TYPES.ENERGY} />Energy</span>,
        space: true,
        hidden: !hasEnergy,
      },
      { 
        title: <span>Annual Energy Cost <small><b>(AED)</b></small></span>, 
        value: formatNumber(annualEnergyCost),
        hidden: !hasEnergy,
      },
      { 
        title: <span>Annual Energy Consumption <small><b>(kWh)</b></small></span>, 
        value: formatNumber(annualEnergykWh),
        hidden: !hasEnergy,
      },
      { 
        title: <span><SystemIcon name={TYPES.ELECTRICITY} /> Electricity</span>,
        space: true,
        hidden: !hasElectricity,
      },
      { 
        title: <span>Annual Electricity Cost <small><b>(AED)</b></small></span>, 
        value: formatNumber(annualElectricalAED),
        hidden: !hasElectricity,
      },
      { 
        title: <span>Annual Electricity Consumption <small><b>(kWh)</b></small></span>, 
        value: formatNumber(annualElectricalkWh),
        hidden: !hasElectricity,
      },
      { 
        title: <span><SystemIcon name={TYPES.CHILLED_WATER} /> Chilled Water</span>,
        space: true,
        hidden: !hasChilledWater,
      },
      { 
        title: <span>Annual CHW Cost <small><b>(AED)</b></small></span>, 
        value: formatNumber(annualChilledWaterAED),
        hidden: !hasChilledWater,
      },
      { 
        title: <span>Annual CHW Consumption <small><b>(RTH)</b></small></span>, 
        value: formatNumber(annualChilledWaterRTH),
        hidden: !hasChilledWater,
      },
      { 
        title: <span> <SystemIcon name={TYPES.GAS} /> LPG (GAS)</span>,
        space: true,
        hidden: !hasGas,
      },
      { 
        title: <span>Annual GAS Consumption <small><b>(L)</b></small></span>, 
        value: formatNumber(annualGas),
        hidden: !hasGas,
      },
      { 
        title: <span>Annual GAS Cost <small><b>(AED)</b></small></span>, 
        value: formatNumber(annuaGasAED),
        hidden: !hasGas,
      },
      { 
        title: <span><SystemIcon name="Water" /> Water</span>,
        space: true,
        hidden: !hasWater,
      },
      { 
        title: <span>Annual Water Consumption <small><b>(IG)</b></small></span>, 
        value: formatNumber(annualWaterIG),
        hidden: !hasWater,
      },
      { 
        title: <span>Annual Water Cost <small><b>(AED)</b></small></span>, 
        value: formatNumber(annualWaterAED),
        hidden: !hasWater,
      },
    ].filter(_i => !_i.hidden)
  }

  handleMetersCheck = (data) => {
    const projectId = this.props.project.project.id
    const { options = [] } = data
    let checkedMeters = options.filter(_b => _b.selected).map(_b => _b.value)

    this.props.loadConsumptionByYears(projectId, checkedMeters)
  }

  formatMeters = () => {
    return this.props.project.meters
      .filter(_meter => _meter.fuel_type !== 'Water')
      .map(_meter => ({
        value: _meter.id,
        label: _meter.meter_name || _meter.account_number,
        selected: true,
      }))
  }

  projectFuels = () =>{
    const {
      project: {
        project: {
          hasElectricityMeters,
          hasChilledWaterMeters,
          hasWaterMeters,
          hasGasMeters,
        },
      },
    }= this.props
    let Fuels=[]
    if (hasElectricityMeters) Fuels.push('Electricity')
    if (hasChilledWaterMeters) Fuels.push('Chilled Water')
    if (hasWaterMeters) Fuels.push('Water')
    if (hasGasMeters) Fuels.push('LPG (GAS)')
    return Fuels
  }
  
  renderSalesSection = () => {
    return (
      <>
        {this.props.project
          && this.props.project.project
          && <div className="mb-4">
            <SalesInfo project={this.props.project.project}/>
          </div>}
        {this.props.project
          && this.props.project.masterBuilding
          && <div className="mb-4">
            <BuildingInfo masterBuilding={this.props.project.masterBuilding}/>
          </div>}
        {this.props.project
          && this.props.project.customer
          && <div className="mb-4">
            <CustomerInfo customer={this.props.project.customer}/>
          </div>}
        {this.props.project
          && this.props.project.customer
          && <div className="mb-4">
            <ProjectSalesInfo
              project={this.props.project}
              projectFuels={this.projectFuels()}
              specificProjectInfo={this.props.specificProjectInfo}
            />
          </div>}
      </>
    )
  }

  handleDateBarChanged = async (nextRange) => {
    await Promise.all([
      this.handleElectricityConsumptionRangeChange,
      this.handleChilledWaterConsumptionRangeChange,
      this.handleWaterConsumptionRangeChange,
      this.handleGasConsumptionRangeChange,
      this.handleEnergyConsumptionRangeChange,
      this.handleCostPerFuelRangeChange,
      this.handleConsumptionRangeChange,
    ].map(fn => fn(nextRange)))
  }

  render() {
    const {
      energy,
      mdb,
      score,
      costPerFuel,
      consumptionByYears,
      energyConsumptionFuel,
      costPerFuelRange,
      mdbRange,
      consumptionPerMeter,
      currentUser,
    } = this.props
    const showSalesSection = currentUser && (currentUser.role ||  '').startsWith('Taka')
    
    return (
      <React.Fragment> 
        <Row className='d-flex justify-content-end py-4 mr-2'>
          <DashboardDateBar onRangeChange={this.handleDateBarChanged} />
        </Row>   
        <Row>
          <Col md="3" lg="3" className="mb-4">
            {showSalesSection 
              ? this.renderSalesSection()
              : <ProjectInfo 
                title={'General Information'}
                info={this.getProjectInfo()}
                masterBuilding={this.props.project && this.props.project.masterBuilding}
              />
            }
          </Col>
          <Col>
            <Row>
              <Col>
                <Row className="mb-4">
                  <Col md='12'>
                    <ProjectEnergyScore 
                      className={'h-100'}
                      score={score.value}
                      value={score.eui}
                    />
                  </Col>
                </Row> 
                {/* Sales */}
                {showSalesSection && (
                  <Row className="mb-4">
                    <MetricCardContainer 
                      options={this.props.specificProjectInfo}
                    />
                  </Row>
                )}
                {/* /Sales */}
                <Row className="mb-4">
                  <Col md="8" lg="8">
                    <EnergyConsumption
                      type={'bar'} 
                      title={'Energy Consumption (kWh)'}
                      subTitle="Baseline vs Actual"
                      dataId={energyConsumptionFuel.dataId}
                      chartData={{
                        labels: energyConsumptionFuel.labels,
                        datasets: this.formatDatasets(energyConsumptionFuel,'Energy','baseline'),
                      }}
                      range={energyConsumptionFuel.range}
                      onRangeChange={this.handleEnergyConsumptionRangeChange}
                      extraValues={[
                        ...this.getValues(energyConsumptionFuel,'Energy','baseline'),
                      ]}
                    />
                  </Col>
                  <Col md="4" lg="4">
                    <CostPerFuel 
                      title={'Utility Cost (AED)'}
                      subTitle={'Per Fuel'}
                      dataId={costPerFuel.dataId}
                      chartData={{
                        labels: costPerFuel.labels,
                        total: costPerFuel.total,
                        datasets: this.formatCostPerFuelDataset(),
                      }}
                      range={costPerFuelRange}
                      onRangeChange={this.handleCostPerFuelRangeChange}
                    />
                  </Col>
                </Row> 
              </Col>
            </Row>
       
            <Row>
              <Col md="8" lg="8" className="mb-4">
                <ConsumptionByYears 
                  title={'Energy Consumption (kWh)'}
                  subTitle={'By Years'}
                  dataId={consumptionByYears.dataId}
                  chartData={{
                    labels: consumptionByYears.labels,
                    datasets: this.formatConsumptionByYearsDataset(),
                  }}
                  initialValues={{
                    options: this.formatMeters(),
                  }}
                  onOptionsChange={this.handleMetersCheck}
                />
              </Col>
              <Col md="4" lg="4" className="mb-4">
                <ProjectEnergyMetric 
                  title={energy.type.toUpperCase()}
                  subTitle={'By Year'}
                  dataId={energy.dataId}
                  chartData={{
                    labels: energy.labels,
                    datasets: this.formatEnergyDataset(),
                  }}
                  type={energy.type}
                  onTypeChange={this.handleEnergyTypeChange}
                />
              </Col>
            </Row>
            <Row>
              <Col md="8" lg="8" className="mb-4">
                <ConsumptionByMdb 
                  title={'Energy Consumption (kWh)'}
                  subTitle={'By Meter'}
                  dataId={mdb.dataId}
                  chartData={{
                    labels: mdb.labels,
                    datasets: this.formatMDBDataset(),
                  }}
                  range={mdbRange}
                  // onRangeChange={this.handleCostPerFuelRangeChange}
                />
              </Col>
              <Col md="4" lg="4" className="mb-4">
                <ConsumptionPerMeter 
                  title={'Consumption (kWh)'}
                  subTitle={'Per Meter'}
                  dataId={consumptionPerMeter.dataId}
                  chartData={{
                    labels: consumptionPerMeter.labels,
                    total: consumptionPerMeter.total,
                    datasets: this.formatConsumptionPerMeter(),
                  }}
                  range={consumptionPerMeter.range}
                  onRangeChange={this.handleConsumptionRangeChange}
                />
              </Col>
            </Row>
            {this.displayFuelsCharts()}
          </Col>
        </Row>
      </React.Fragment>
    )
  }

}


export default connect(
  (state) => ({
    project: getProjectData(state),
    specificProjectInfo: getSpecificProjectInfoData(state),
    energyConsumptionFuel: getEnergyConsumptionFuelData(state),
    electricityConsumptionFuel: getElectricityConsumptionFuelData(state),
    chilledWaterConsumptionFuel: getChilledWaterConsumptionFuelData(state),
    waterConsumptionFuel: getWaterConsumptionFuelData(state),
    lpgGasConsumptionFuel: getLpgGasConsumptionFuelData(state),

    consumptionBaseline: getConsumptionBaseline(state),
    costPerFuel: getCostPerFuelData(state),
    energy: getEnergyMetric(state),
    mdb: getMDBMetric(state),
    score: getScoreBanchmark(state),
    consumptionByYears: getConsumptionByYears(state),

    costPerFuelRange: getCostPerFuelRange(state),
    mdbRange: getMDBRange(state),
    
    consumptionPerMeter: getConsumptionPerMeter(state),
    currentUser: state.users.currentUser,
  }),
  (dispatch) => ({
    setConsumptionPerMeterRange: (range) => dispatch(setConsumptionPerMeterRange(range)),
    setEnergyConsumptionFuelRange: (range) => dispatch(setEnergyConsumptionFuelRange(range)),
    setElectricityConsumptionFuelRange: (range) => dispatch(setElectricityConsumptionFuelRange(range)),
    setChilledWaterConsumptionFuelRange: (range) => dispatch(setChilledWaterConsumptionFuelRange(range)),
    setWaterConsumptionFuelRange: (range) => dispatch(setWaterConsumptionFuelRange(range)),
    setLpgGasConsumptionFuelRange: (range) => dispatch(setLpgGasConsumptionFuelRange(range)),
    
    loadEnergyConsumptionFuel: (range, projectId) => dispatch(loadEnergyConsumptionFuel(range, projectId)),
    loadElectricityConsumptionFuel: (range, projectId) => dispatch(loadElectricityConsumptionFuel(range, projectId)),
    loadChilledWaterConsumptionFuel: (range, projectId) => dispatch(loadChilledWaterConsumptionFuel(range, projectId)),
    loadWaterConsumptionFuel: (range, projectId) => dispatch(loadWaterConsumptionFuel(range, projectId)),
    loadLpgGasConsumptionFuel: (range, projectId) => dispatch(loadLpgGasConsumptionFuel(range, projectId)),
    
    setCostPerFuelRange: (range) => dispatch(setCostPerFuelRange(range)),
    loadConsumptionBaseline: (range, projectId) => dispatch(loadConsumptionBaseline(range, projectId)),
    loadCostPerFuel: (range, projectId) => dispatch(loadCostPerFuel(range, projectId)),
    setEnergyType:(nextType) => dispatch(setEnergyType(nextType)),
    loadEnergyMetric:(nextType, projectId) => dispatch(loadEnergyMetric(nextType, projectId)),
    loadMdbMetric:(nextType, projectId) => dispatch(loadMdbMetric(nextType, projectId)),

    loadConsumptionByYears: (id, meters) => dispatch(loadConsumptionByYears(id, meters)),
    loadEnergyConsumptionPerMeter: (range, projectId) => dispatch(loadEnergyConsumptionPerMeter(range, projectId)),
  })
)(ProjectMetricsContainer)
