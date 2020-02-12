import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'shards-react'

import {
  getMdbSum,
  getEnergyConsumption,
  getConsumptionBaseline,
  getTenantBaseline,
  getForecast,
  getSelectedData,
} from '../../../redux/reducers/portfolioDashboard'
import {
  formatInfluxData,
  splitDataOnArrays,
} from '../../utils/format'
import TimelineChart from '../metrics/TimelineChart'
import MdbEnergyTotal from '../metrics/MdbEnergyTotal'
import ProjectPerformanceIndexAxes from '../metrics/ProjectPerformanceIndexAxes'
import BuildingsSavings from '../metrics/BuildingsSavings'
import EnergyUsagePerMdb from '../metrics/EnergyUsagePerMdb'


var moment = require('moment')


class PortfolioCharts extends React.Component {
    formatSumMdb = (data) => {
        const filtered = formatInfluxData(data)
        const finalData = splitDataOnArrays(filtered)
        return finalData
    }

    formatEnergyTotalCategories = () => {
      const { selectedData } = this.props
      let diff = 0
      diff = moment(selectedData.end).diff(selectedData.start, 'days')
      let generateCategories = []
      for(var i = 0; i <=diff; i++) {
        generateCategories.push(
          moment(selectedData.start).add(i, 'days').format('MMM DD'),
        )
      }
      return generateCategories
    }

    formatPerformanceIndex = (energyConsumption, tenantBaseline, consumptionBaseline) => {
      const buildingSavings = this.props.formatBuildingSavings(energyConsumption, tenantBaseline, consumptionBaseline)
        
      let finalData = [0]

      for(let i = 0; i < buildingSavings.length; i++) {
        const data = finalData[i] + buildingSavings[i]
        finalData.push(Number(data.toFixed(0)))
      }

      return finalData
    }

    formatSavingsPieChart = (energyCons, baseline) => {
      const filteredCons = formatInfluxData(energyCons)
      const splitedCons = splitDataOnArrays(filteredCons)
      const projectsSave = []
      
      splitedCons.map(cons => {
        let daysSum = 0
        const baselineForProject = baseline.filter(el => el.name === cons.name)
        cons.data.map((res, index) => {
          if(baselineForProject[0] && baselineForProject[0].result.length !== 0) {
            daysSum += baselineForProject[0].result[index].value - res.y
          }
        }) 
        if(daysSum > 0) {
          projectsSave.push({
            name: cons.name,
            y: Number(daysSum.toFixed(2)),
          })
        }
      })
      return projectsSave
    }

    formatTotalData = (forecast, energyCons, tenantBaseline, consBaseline) => {
      const forecastData = this.props.formatDailyData(forecast)
      const baseline = this.props.formatTenantData(energyCons, tenantBaseline)
      const energyTotal = this.props.formatDailyData(consBaseline)

      const data = [
        {
          name: 'Energy Adjusted/Tenant',
          data: baseline,
          type: 'column',

        },
        {
          name: 'Forecast',
          data: forecastData,
          type: 'line',
        },
        {
          name: 'Baseline',
          data: energyTotal,
          type: 'line',
        },
      ]
      return data
    }

    render() {
      const {
        sumMdb,
        energyConsumption,
        tenantBaseline,
        consumptionBaseline,
        forecast,
      } = this.props

      return(
        <Row>
          <Col lg="12" className="mb-4">
            <Row>
              <Col lg="3">
                {energyConsumption && consumptionBaseline && (
                  <EnergyUsagePerMdb
                    title={'ENERGY SAVINGS PER DAY'}
                    wholeBuildingData={this.formatSavingsPieChart(energyConsumption, consumptionBaseline)} 
                  />
                )}
              </Col>
              <Col lg="9">
                {energyConsumption 
                && forecast 
                && tenantBaseline 
                && consumptionBaseline 
                && (
                  <MdbEnergyTotal 
                    title={'PROJECT ENERGY TOTAL (kWh)'}
                    data={this.formatTotalData(forecast, energyConsumption, tenantBaseline, consumptionBaseline)}
                    categories={this.formatEnergyTotalCategories()}
                  />
                )}
              </Col>
            </Row>
          </Col>
          <Col lg="12" className="mb-4">
            {sumMdb && sumMdb.trim() !== '' && (
              <TimelineChart 
                data={this.formatSumMdb(sumMdb)}
                title={'MDB POWER (kW)'}
              />
            )}
          </Col>
          <Col md="12" className="mb-4">
            {energyConsumption && tenantBaseline && consumptionBaseline && (
              <BuildingsSavings 
                buildingSavesData={this.props.formatBuildingSavings(energyConsumption, tenantBaseline, consumptionBaseline)}
                categories={this.formatEnergyTotalCategories()}
                title={'Daily Savings'}
              />
            )}
          </Col>
          <Col md="12" className="mb-4">
            {energyConsumption && consumptionBaseline && tenantBaseline && (
              <ProjectPerformanceIndexAxes  
                categories={this.formatEnergyTotalCategories()}
                data={this.formatPerformanceIndex(energyConsumption, tenantBaseline, consumptionBaseline)}
              />
            )}
          </Col>
        </Row>
      )
    }
}

export default connect(
  (state) => ({
    sumMdb: getMdbSum(state),
    energyConsumption: getEnergyConsumption(state),
    tenantBaseline: getTenantBaseline(state),
    consumptionBaseline: getConsumptionBaseline(state),
    forecast: getForecast(state),
    selectedData: getSelectedData(state),
  }),
  (dispatch) => ({
        
  })
)(PortfolioCharts)