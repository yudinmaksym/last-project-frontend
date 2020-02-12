import * as React from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
} from 'shards-react'

import { getColor, getSystemColor } from '../utils/theme'
import colors from '../utils/colors'
import { formatNumber } from '../utils/format'
import {  
  getConsumptionFuelData,
  getCostPerFuelData,
  getConsumptionZoneFuelData,
  getYearsZoneConsumption,
  getConsumptionByZone,
  getConsumptions,
  
  getPortfolioInfo,
  getConsumptionFuelRange,
  getCostPerFuelRange,
  getConsumptionZoneFuelRange,
  getConsumptionByYears,

  setConsumptionFuelRange,
  setCostPerFuelRange,
  setConsumptionZoneFuelRange,
  setConsumptionByZoneRange,
  setConsumptionByZoneType,
  setConsumptionsRange,
  
  loadPortfolioConsumptionByYears,
  loadConsumptionFuel,
  loadCostPerFuel,
  loadConsumptionZoneFuel,
  loadConsumptionByZone,
  loadConsumptions,
} from '../../redux/reducers/metrics'
import EnergyConsumption from '../components/metrics/EnergyConsumption'
import CostPerFuel from '../components/metrics/CostPerFuel'
import ConsumptionByZone from '../components/metrics/ConsumptionByZone'
import ConsumptionByYears from '../components/projects/ConsumptionByYears'
import YearsZoneConsumption from '../components/metrics/YearsZoneConsumption'
import ConsumptionByZonePie from '../components/metrics/ConsumptionByZonePie'
import PortfolioInfo from '../components/metrics/PortfolioInfo'
import InfoLabel from '../components/common/InfoLabel'
import Consumptions from '../components/metrics/Consumptions'
import DashboardDateBar from '../components/common/DashboardDateBar'


class PortfolioMetricsContainer extends React.Component {

  getInfo() {
    const {
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

  formatEnergyDatasets = () => {
    return this.props.consumptionFuel.datasets.map((dataset, index) => ({
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

  formatCostPerFuelDataset = () => {
    return [
      {
        hoverBorderColor: colors.white.toRGBA(1),
        data: [ ...this.props.costPerFuel.datasets ],
        icons: [
          '<i class="material-ic,ons">&#xE30B;</i>',
          '<i class="material-icons">&#xE32F;</i>',
          '<i class="material-icons">&#xE325;</i>',
        ],
        backgroundColor: this.props.costPerFuel.labels.map(label => 
          getSystemColor(label).toRGBA(1)
        ),
      },
    ]
  }

  formatConsumptionZoneFuel = () => {
    const consumptionZoneFuelColors = this.props.consumptionZoneFuel.datasets.map((_d, index) =>
      getColor(index).toHex()
    )

    return [
      {
        label: 'Consumption',
        fill: false,
        data: [
          ...this.props.consumptionZoneFuel.datasets,
        ],
        backgroundColor: consumptionZoneFuelColors,
        borderColor: consumptionZoneFuelColors,
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: consumptionZoneFuelColors,
        borderWidth: 1.5,
      },
    ]
  }

  formatYOYZoneConsumption = () => {
    return this.props.yearsZoneConsumption.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: false,
      data: [...dataset.data],
      backgroundColor: getColor(index, 3).toHex(0.1),
      borderColor: getColor(index, 3).toHex(1),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: getColor(index, 3).toRGBA(1),
      borderWidth: 1.5,
    }))
  }

  formatConsumptionByZone = () => {
    return [
      {
        hoverBorderColor: colors.white.toRGBA(1),
        data: [ ...this.props.consumptionByZone.datasets ],
        icons: [
          '<i class="material-icons">&#xE30B;</i>',
          '<i class="material-icons">&#xE32F;</i>',
          '<i class="material-icons">&#xE325;</i>',
        ],
        backgroundColor: this.props.consumptionByZone.datasets.map(
          (v, i) => getColor(i).toHex()
        ),
      },
    ]
  }

  formatConsumptions = () => {
    return [
      {
        hoverBorderColor: colors.white.toRGBA(1),
        data: [ ...this.props.consumptions.datasets ],
        icons: [
          '<i class="material-icons">&#xE30B;</i>',
          '<i class="material-icons">&#xE32F;</i>',
          '<i class="material-icons">&#xE325;</i>',
        ],
        backgroundColor: this.props.consumptions.datasets.map(
          (v, i) => getColor(i).toHex()
        ),
      },
    ]
  }

  formatConsumptionByYearsDataset = () => {
    return this.props.consumptionByYears.datasets.map((dataset, index) => ({
      label: dataset.label,
      // fill: false,
      data: [...dataset.data],
      backgroundColor: getColor(index, 3).toRGBA(0.1),
      borderColor: getColor(index, 3).toRGBA(1),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: getColor(index, 3).toRGBA(1),
      borderWidth: 1.5,
    }))
  }


  handleEnegyConsumptionRangeChange = (nextRange) => {
    this.props.setConsumptionFuelRange(nextRange)
    this.props.loadConsumptionFuel(
      nextRange,
      'EnergyPerFuel'
    )
  }

  handleCostPerFuelRangeChange = (nextRange) => {
    this.props.setCostPerFuelRange(nextRange)
    this.props.loadCostPerFuel(nextRange)
  }

  handleConsumptionByZoneFuelRangeChange = (nextRange) => {
    this.props.setConsumptionZoneFuelRange(nextRange)
    this.props.loadConsumptionZoneFuel(nextRange)
  }

  handleConsumptionByZoneRangeChange = (nextRange) => {
    const type = this.props.consumptionByZone.type
    this.props.setConsumptionByZoneRange(nextRange)
    this.props.loadConsumptionByZone(type, nextRange)
  }

  handleConsumptionByZoneTypeChange = () => {
    const range= this.props.consumptionByZone.range
    const nextType = (this.props.consumptionByZone.type === 'AED') ? 'kWh' : 'AED'

    this.props.setConsumptionByZoneType(nextType)
    this.props.loadConsumptionByZone(nextType, range)
  }

  handleConsumptionsRangeChange = (nextRange) => {
    this.props.setConsumptionsRange(nextRange)
    this.props.loadConsumptions(nextRange)
  }

  formatZones = () => {
    return this.props.info.zones
      .map(_meter => ({
        value: _meter.id,
        label: _meter.zone || _meter.name,
        selected: true,
      }))
  }

  handleZoneCheck = (data) => {
    const { options = [] } = data
    let checkedZones = options.filter(_b => _b.selected).map(_b => _b.value)

    this.props.loadPortfolioConsumptionByYears(checkedZones)
  }

  handleDateBarChanged = async (nextRange) => {
    await Promise.all([
      this.handleEnegyConsumptionRangeChange(nextRange),
      this.handleCostPerFuelRangeChange(nextRange),
      this.handleConsumptionByZoneFuelRangeChange(nextRange),
      this.handleConsumptionByZoneRangeChange(nextRange),
      this.handleConsumptionsRangeChange(nextRange),
    ])
  }
  
  render() {
    const { 
      consumptionFuel,
      costPerFuel,
      consumptionByYears,
      yearsZoneConsumption,
      consumptionZoneFuel,
      consumptionByZone,
      consumptions,
      
      costPerFuelRange,
      consumptionFuelRange,
      consumptionZoneFuelRange,
    } = this.props

    return (
      <React.Fragment>      
        <Row className='d-flex justify-content-end py-4 mr-2'>
          <DashboardDateBar onRangeChange={this.handleDateBarChanged} />
        </Row>
        <Row>
          <Col md="3" lg="3" className="mb-4">
            <PortfolioInfo 
              title={'Information'}
              info={this.getInfo()}
            />
          </Col>
          <Col md="6" lg="6" className="mb-4">
            <EnergyConsumption 
              title={'Energy Consumption (kWh)'}
              subTitle={'Per Fuel'}
              dataId={consumptionFuel.dataId}
              type="line"
              chartData={{
                labels: consumptionFuel.labels,
                datasets: this.formatEnergyDatasets(),
              }}
              range={consumptionFuelRange}
              onRangeChange={this.handleEnegyConsumptionRangeChange}
              totalConsumption_kWH={consumptionFuel.totalConsumption_kWH}
              totalConsumption_AED={consumptionFuel.totalConsumption_AED}
            />
          </Col>
          <Col md="3" lg="3" className="mb-4">
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

        <Row>
          <Col md="9" lg="9" className="mb-4">
            <ConsumptionByYears 
              title={'Energy Consumption (kWh)'}
              subTitle={'By Years'}
              dataId={consumptionByYears.dataId}
              chartData={{
                labels: consumptionByYears.labels,
                datasets: this.formatConsumptionByYearsDataset(),
              }}
              initialValues={{
                options: this.formatZones(),
              }}
              onOptionsChange={this.handleZoneCheck}
            />
          </Col>
          <Col md="3" lg="3" className="mb-4">
            <YearsZoneConsumption 
              title={'Energy Consumption (kWh)'}
              subTitle={'Year On Year By Zone'}
              dataId={yearsZoneConsumption.dataId}
              chartData={{
                labels: yearsZoneConsumption.labels,
                datasets: this.formatYOYZoneConsumption(),
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col md="9" lg="9" className="mb-4">
            <ConsumptionByZone 
              title="Energy Consumption (kWh)"
              subTitle="By Zone"
              dataId={consumptionZoneFuel.dataId}
              chartData={{
                labels: consumptionZoneFuel.labels,
                datasets: this.formatConsumptionZoneFuel(),
              }}
              range={consumptionZoneFuel.range}
              onRangeChange={this.handleConsumptionByZoneFuelRangeChange}
            />
          </Col>
          <Col md="3" lg="3" className="mb-4">
            <ConsumptionByZonePie 
              title={'Energy Consumption (kWh)'}
              subTitle={'By Zone'}
              dataId={consumptionByZone.dataId}
              
              type={consumptionByZone.type}
              onTypeChange={this.handleConsumptionByZoneTypeChange}
              
              range={consumptionByZone.range}
              onRangeChange={this.handleConsumptionByZoneRangeChange}
              
              chartData={{
                total: consumptionByZone.total,
                labels: consumptionByZone.labels,
                datasets: this.formatConsumptionByZone(),
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col md="9" lg="9" className="mb-4">
            <Consumptions 
              title={'Energy Consumption (kWh)'}
              subTitle={'Common Vs. Tenant Consumption'}
              dataId={consumptions.dataId}
              chartData={{
                labels: consumptions.labels,
                total: consumptions.total,
                datasets: this.formatConsumptions(),
              }}
              range={consumptions.range}
              onRangeChange={this.handleConsumptionsRangeChange}
            />
          </Col>
          
        </Row>
      </React.Fragment>
    )
  }

}


export default connect(
  (state) => ({
    info: getPortfolioInfo(state),
    
    consumptionFuel: getConsumptionFuelData(state),
    costPerFuel: getCostPerFuelData(state),
    consumptionZoneFuel: getConsumptionZoneFuelData(state),
    consumptionByZone: getConsumptionByZone(state),
    consumptions: getConsumptions(state),
  
    consumptionFuelRange: getConsumptionFuelRange(state),
    costPerFuelRange: getCostPerFuelRange(state),
    consumptionZoneFuelRange: getConsumptionZoneFuelRange(state),
    yearsZoneConsumption: getYearsZoneConsumption(state),

    consumptionByYears: getConsumptionByYears(state),
  }),
  (dispatch) => ({
    setConsumptionFuelRange: (range) => dispatch(setConsumptionFuelRange(range)),
    setCostPerFuelRange: (range) => dispatch(setCostPerFuelRange(range)),
    setConsumptionZoneFuelRange: (range) => dispatch(setConsumptionZoneFuelRange(range)),
    setConsumptionByZoneRange: (range) => dispatch(setConsumptionByZoneRange(range)),
    setConsumptionByZoneType: (type) => dispatch(setConsumptionByZoneType(type)),
    setConsumptionsRange: (range) => dispatch(setConsumptionsRange(range)),

    loadPortfolioConsumptionByYears: (zones) => dispatch(loadPortfolioConsumptionByYears(zones)),
    loadConsumptionFuel: (range, fuelType) => dispatch(loadConsumptionFuel(range, fuelType)),
    loadCostPerFuel: (range) => dispatch(loadCostPerFuel(range)),
    loadConsumptionZoneFuel: (range) => dispatch(loadConsumptionZoneFuel(range)),
    loadConsumptionByZone: (type, range) => dispatch(loadConsumptionByZone(type, range)),
    loadConsumptions: (range) => dispatch(loadConsumptions(range)),
  })
)(PortfolioMetricsContainer)