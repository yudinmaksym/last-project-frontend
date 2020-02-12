import * as React from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from 'shards-react'

import colors from '../utils/colors'
import { getColor } from '../utils/theme'
import { formatNumber } from '../../src/utils/format'
import ReportsConsumptionByYears from '../components/reports/ReportsConsumptionByYears'
import ReportsCostPerFuel from '../components/reports/ReportsCostPerFuel'
import ReportsEnergyConsumptionByLevel from '../components/reports/ReportsEnergyConsumptionByLevel'
import ReportsEnergyConsumptionBaselineVsActual from '../components/reports/ReportsEnergyConsumptionBaselineVsActual'
import ReportsYearOnYearConsumption from '../components/reports/ReportsYearOnYearConsumption'


const formatValue = value => isNaN(value) ? 0 : value.toFixed(0)

export default class ReportLayoutContainer extends React.Component {

  static defaultProps = {
    title: 'Project Name',
    subTitle: 'Month',
    value: '250',
    valueStr: 'EUI',
    energy: {
      current: { 
        energy: { consumption:0, cost: 0 },
        electricity: { consumption:0, cost: 0 },
        chilledWater: { consumption:0, cost: 0 },
        water: { consumption:0, cost: 0 }, 
      },
      past:{ 
        energy: { consumption:0.9, cost: 0 },
        electricity: { consumption:0, cost: 0 },
        chilledWater: { consumption: 0, cost: 0 },
        water: { consumption:0, cost: 0 }, 
      },
    },
  }

  getFuelColor = (fuelType) => {
    switch (fuelType) {
    case 'Electricity':
      return 'rgba(255, 180, 0, 1)'

    case 'Water':
      return 'rgba(0, 123, 255, 1)'

    case 'Chilled Water':
      return 'rgba(0, 184, 216, 1)'

    case 'Other':
    default:
      return 'rgba(158, 158, 158, 1)'
    }
  }

  formatCostPerFuelDataset = () => {
    return [
      {
        hoverBorderColor: colors.white.toRGBA(1),
        data: [ ...this.props.energyCost.datasets ],
        backgroundColor: this.props.energyConsumptionYOY.datasets.map((v, i) => {
          console.dir(v)
          return (
            getColor(i, 3).toHex()
          )
        }),
      },
    ]
  }

  formatConsumptionByYearsDataset = () => {
    return this.props.energyConsumptionByYears.datasets.map((dataset, index) => ({
      label: dataset.label,
      fill: 'start',
      data: [...dataset.data],
      backgroundColor: getColor(index).toRGBA(0.1),
      borderColor: getColor(index).toRGBA(1),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: getColor(index).toRGBA(1),
      borderWidth: 1.5,
    }))
  }

  formatConsumptionYOY = () => {
    return [
      {
        hoverBorderColor: colors.white.toRGBA(1),
        data: [ ...this.props.energyConsumptionYOY.datasets ],
        backgroundColor: this.props.energyConsumptionYOY.datasets.map((v, i) => (
          getColor(i).toHex()
        )),
      },
    ]
  }

  formatConsumptionPerLevel = () => {
    if (this.props.type === 'project') {
      return this.props.energyConsumptionByLevel.datasets.map((dataset, index) => ({
        label: dataset.label,
        fill: 'start',
        data: [ ...dataset.data ],
        backgroundColor: getColor(index).toHex(),//.toRGBA(0.1),
        borderColor: getColor(index).toHex(),//.toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: getColor(index).toRGBA(1),
        borderWidth: 1.5,
      }))
    }

    if (this.props.type === 'zone') {
      return this.props.energyConsumptionByLevel.datasets.map((dataset, index) => ({
        label: dataset.label,
        fill: 'start',
        data: [...dataset.data],
        backgroundColor: getColor(index).toHex(0.1),
        borderColor: getColor(index).toHex(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: getColor(index).toRGBA(1),
        borderWidth: 1.5,
      }))
    }

    return [
      {
        hoverBorderColor: colors.white.toRGBA(1),
        data: [ ...this.props.energyConsumptionByLevel.datasets ],
        icons: [
          '<i class="material-icons">&#xE30B;</i>',
          '<i class="material-icons">&#xE32F;</i>',
          '<i class="material-icons">&#xE325;</i>',
        ],
        backgroundColor: this.props.energyConsumptionByLevel.datasets.map((v, i) => (
          getColor(i).toHex()
        )),
      },
    ]
  }

  formatBaselineVsActual = () => {
    return this.props.energyConsumptionActualBaseline.datasets.map((dataset, index) => ({
      type: 'line',
      fill: false,
      label: dataset.label,
      // fill: 'start',
      data: [...dataset.data],
      // backgroundColor: getColor(index).toRGBA(0.1),
      borderColor: getColor(index).toRGBA(1),
      // pointBackgroundColor: colors.white.toHex(),
      // pointHoverBackgroundColor: getColor(index).toRGBA(1),
      borderWidth: 1.5,
    }))
  }


  getTypeLevelSubtitle = () => {
    switch (this.props.type) {
    case 'zone':
      return 'Project'

    case 'project':
      return 'Meter'

    case 'portfolio':
    default:
      return 'Zone'
    }
  }

  render() {
    const { 
      title, 
      month,
      subTitle, 
      value, 
      valueStr,
      energy,
      energyCost,
      energyConsumptionByYears,
      energyConsumptionYOY,
      energyConsumptionByLevel,
      energyConsumptionActualBaseline,
    } = this.props

    return (
      <div className="page size__A4">
        <Container fluid className="page__content m-0">
          
          <Row className="page__header">
            <Col className="page__header__titles">
              <h1 className="page__title">{title}</h1> 
              <h3 className="page__subTitle">{subTitle}</h3>
            </Col>
            <Col className="page__header__value text-right">
              <h3>
                <b>{formatValue(value)}</b>
                <br />
                {valueStr}
              </h3>
            </Col>
          </Row>

          <Row className="page__section">
            <Col md="12" sm="12">
              <table 
                className="page__table" 
                cellspacing="0"
                cellpadding="0"
              >
                <thead>
                  <tr>
                    <th width="100px"></th>
                    <th 
                      width="20%"
                      className="page__table__column page__table__column--header"
                    >
                      <div 
                        className="page__table__column--title"
                        style={{
                          backgroundColor: getColor(1).toHex(),
                        }}
                      >
                       Energy
                      </div>
                    </th>
                    <th 
                      width="20%"
                      className="page__table__column page__table__column--header"
                    >
                      <div 
                        className="page__table__column--title"
                        style={{
                          backgroundColor: getColor(2).toHex(),
                        }}
                      >
                        Electricity
                      </div>
                    </th>
                    <th 
                      width="20%"
                      className="page__table__column page__table__column--header"
                    >
                      <div 
                        className="page__table__column--title"
                        style={{
                          backgroundColor: getColor(3).toHex(),
                        }}
                      >
                        Chilled Water
                      </div>
                    </th>
                    <th 
                      width="20%"
                      className="page__table__column page__table__column--header"
                    >
                      <div 
                        className="page__table__column--title"
                        style={{
                          backgroundColor: getColor(4).toHex(),
                        }}
                      >
                        Water
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><br />Current Month</td>
                    <td className="page__table__column page__table__column--energy">
                      <table className="page__table__values">
                        <tr>
                          <th className="page__table__values__column page__table__values__column--header">
                            <span>
                              kWh
                            </span>
                          </th>
                          <th className="page__table__values__column page__table__values__column--header page__table__values__column--cost">
                            <span>
                              AED
                            </span>
                          </th>
                        </tr>
                        <tr>
                          <td className="page__table__values__column page__table__values__column--consumption">
                            <span>{formatNumber(energy.current.energy.consumption)}</span>
                          </td>
                          <td className="page__table__values__column page__table__values__column--cost">
                            <span>{formatNumber(energy.current.energy.cost)}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td className="page__table__column page__table__column--energy">
                      <table className="page__table__values">
                        <tr>
                          <th className="page__table__values__column page__table__values__column--header">
                            <span>kWh</span>
                          </th>
                          <th className="page__table__values__column page__table__values__column--header page__table__values__column--cost">
                            <span>AED</span>
                          </th>
                        </tr>
                        <tr>
                          <td className="page__table__values__column page__table__values__column--consumption">
                            <span>
                              {formatNumber(energy.current.electricity.consumption)}
                            </span>
                          </td>
                          <td className="page__table__values__column page__table__values__column--cost">
                            <span>
                              {formatNumber(energy.current.electricity.cost)}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td className="page__table__column page__table__column--energy">
                      <table className="page__table__values">
                        <tr>
                          <th className="page__table__values__column page__table__values__column--header">
                            <span>kWh</span>
                          </th>
                          <th className="page__table__values__column page__table__values__column--header page__table__values__column--cost">
                            <span>AED</span>
                          </th>
                        </tr>
                        <tr>
                          <td className="page__table__values__column page__table__values__column--consumption">
                            <span>
                              {formatNumber(energy.current.chilledWater.consumption)}
                            </span>  
                          </td>
                          <td className="page__table__values__column page__table__values__column--cost">
                            <span>
                              {formatNumber(energy.current.chilledWater.cost)}
                            </span>  
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td className="page__table__column page__table__column--energy">
                      <table className="page__table__values">
                        <tr>
                          <th className="page__table__values__column page__table__values__column--header">
                            <span>kWh</span>
                          </th>
                          <th className="page__table__values__column page__table__values__column--header page__table__values__column--cost">
                            <span>AED</span>
                          </th>
                        </tr>
                        <tr>
                          <td className="page__table__values__column page__table__values__column--consumption">
                            <span>
                              {formatNumber(energy.current.water.consumption)}
                            </span>
                          </td>
                          <td className="page__table__values__column page__table__values__column--cost">
                            <span>
                              {formatNumber(energy.current.water.cost)}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>Past 12 Months</td>
                    <td className="page__table__column page__table__column--energy">
                      <table className="page__table__values">
                        <tr>
                          <td className="page__table__values__column page__table__values__column--consumption">
                            <span>{formatNumber(energy.past.energy.consumption)}</span>
                          </td>
                          <td className="page__table__values__column page__table__values__column--cost">
                            <span>{formatNumber(energy.past.energy.cost)}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td className="page__table__column page__table__column--energy">
                      <table className="page__table__values">
                        <tr>
                          <td className="page__table__values__column page__table__values__column--consumption">
                            <span>{formatNumber(energy.past.electricity.consumption)}</span>
                          </td>
                          <td className="page__table__values__column page__table__values__column--cost">
                            <span>{formatNumber(energy.past.electricity.cost)}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td className="page__table__column page__table__column--energy">
                      <table className="page__table__values">
                        <tr>
                          <td className="page__table__values__column page__table__values__column--consumption">
                            <span>{formatNumber(energy.past.chilledWater.consumption)}</span>
                          </td>
                          <td className="page__table__values__column page__table__values__column--cost">
                            <span>{formatNumber(energy.past.chilledWater.cost)}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td className="page__table__column page__table__column--energy">
                      <table className="page__table__values">
                        <tr>
                          <td className="page__table__values__column page__table__values__column--consumption">
                            <span>{formatNumber(energy.past.water.consumption)}</span>
                          </td>
                          <td className="page__table__values__column page__table__values__column--cost">
                            <span>{formatNumber(energy.past.water.cost)}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          
          <Row className="page__section">
            <Col md="8" sm="8">
              <ReportsConsumptionByYears 
                title={'Energy Consumption (kWh)'}
                subTitle={'By Years'}
                dataId={energyConsumptionByYears.dataId}
                chartData={{
                  labels: energyConsumptionByYears.labels,
                  datasets: this.formatConsumptionByYearsDataset(),
                }}
              />
            </Col>
            <Col md="4" sm="4">
              <ReportsCostPerFuel 
                title={'Utility Cost (AED)'}
                subTitle={'Per Fuel'}
                dataId={energyCost.dataId}
                chartData={{
                  labels: energyCost.labels,
                  total: energyCost.total,
                  datasets: this.formatCostPerFuelDataset(),
                }}
              />
            </Col>
          </Row>
                                        
          <Row className="page__section">
            <Col md="12" sm="12">
              <ReportsEnergyConsumptionByLevel 
                title={'Energy Consumption (kWh)'}
                subTitle={`Per ${this.getTypeLevelSubtitle()}`}
                dataId={energyConsumptionByLevel.dataId}
                chartData={{
                  labels: energyConsumptionByLevel.labels,
                  total: energyConsumptionByLevel.total,
                  datasets: this.formatConsumptionPerLevel(),
                }}
              />
            </Col>
          </Row>

          <Row className="page__section">
            <Col md="6" sm="6">
              <ReportsEnergyConsumptionBaselineVsActual 
                title={'Energy Consumption (kWh)'}
                subTitle="Baseline vs Actual"
                type="line"
                dataId={energyConsumptionActualBaseline.dataId}
                chartData={{
                  labels: energyConsumptionActualBaseline.labels,
                  // total: energyConsumptionActualBaseline.total,
                  datasets: this.formatBaselineVsActual(),
                }}
              />
            </Col>
            <Col md="6" sm="6">
              <ReportsYearOnYearConsumption 
                title={'Year on Year'}
                subTitle={`${month} Consumption (kWh)`}
                dataId={energyConsumptionYOY.dataId}
                chartData={{
                  labels: energyConsumptionYOY.labels,
                  total: energyConsumptionYOY.total,
                  datasets: this.formatConsumptionYOY(),
                }}
              />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

}