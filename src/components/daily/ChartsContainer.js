import React from 'react';
import {connect} from 'react-redux'
import ProjectPerformanceIndexAxes from '../metrics/ProjectPerformanceIndexAxes';
import BuildingsSavings from '../metrics/BuildingsSavings';
import { Row, Col } from 'shards-react'
import {
  getTotalConsumption,
  getDailyForecast,
  getTenantBaseline,
  getWholeBuildingEnergy,
  getTotalEnergyConsumption,
  getMdbPower,
  getMdbPowerSum,
  getHeatMap,
  getSelectedProject,
} from '../../../redux/reducers/temporaryDaily';

import {
  formatInfluxData
} from '../../utils/format'

const moment = require('moment');

class MainCharts extends React.Component {

  formatEnergyTotalCategories = () => {
    const { selectedProject } = this.props;

    let diff = 0
    diff = moment(selectedProject.endDate).diff(selectedProject.startDate, "days");

    let generateCategories = [];
    for(var i = 0; i <=diff; i++) {
      generateCategories.push(
        moment(selectedProject.startDate).add(i, "days").format("MMM DD"),
      )
    }

    return generateCategories
  }

  formatEnergyTotalData = () => {
    const {consumption} = this.props;

    const data = consumption.items.map(el => {
      return Number(el.value.toFixed(1));
    })
    return data
  }

  formatDailyForecastData = () => {
    const {dailyForecast} = this.props;

    const data = dailyForecast.items.map(el => {
      return Number(el.value.toFixed(1));
    })
    return data
  }

  formatTenantBaselineData = (tenantBaseline, totalEnergyConsumption) => {
    const { selectedProject } = this.props

    const energyConsumption = formatInfluxData(totalEnergyConsumption)
    const tenant = tenantBaseline[0].data.map(el => {
      return Number(el.value);
    })

    let diff = 0
    diff = moment(selectedProject.endDate).diff(selectedProject.startDate, "days");

    let generateEnergyWithZero = [];
    for(var i = 0; i <=diff; i++) {
      generateEnergyWithZero.push({
        date: moment(selectedProject.startDate).add(i, "days").format('YYYY-MM-DDT00:00:00Z'),
        value: 0
      })
    }

    let totalEnergyFilteredData = [];
    energyConsumption.forEach((el) => {
      if(el[0] !== "") {
        const splited = el.split(',');
        totalEnergyFilteredData.push({
          date: moment(splited[3]).format("YYYY-MM-DDT00:00:00Z"),
          value: Number(splited[4])
        })

      }
    })

    for(let i = 0; i<generateEnergyWithZero.length; i++) {
      for(let j = 0; j<totalEnergyFilteredData.length; j++) {
        if(generateEnergyWithZero[i].date === totalEnergyFilteredData[j].date) {
          generateEnergyWithZero[i].value = totalEnergyFilteredData[j].value
        }
      }
    }

    let subtractData=[]
    generateEnergyWithZero.forEach((el,index) => {
      if(tenant[index] !== undefined) {
        subtractData.push(Number((el.value - tenant[index]).toFixed(0)));
      } else {
        subtractData.push(Number(el.value.toFixed(0)));
      }
    })

    return subtractData
  }

  formatBuildingSavings = (tenant, totalConsumption) => {
    const {consumption, selectedProject} = this.props;
    const tenantBaselineData = this.formatTenantBaselineData(tenant, totalConsumption)

    const consump = consumption.items.map(el => {
      return Number(el.value.toFixed(1));
    })

    let subtractData = [];
    consump.forEach((el, index) => {
      if(tenantBaselineData[index] < 0) {
        subtractData.push( Number((consump[index] - consump[index]).toFixed(2)) );
      } else {
        subtractData.push( Number((consump[index] - tenantBaselineData[index]).toFixed(2)) );
      }

    })

    if(selectedProject.endDate === moment().format("YYYY-MM-DD")) {
      subtractData.pop()
    }

    return subtractData
  }

  formatWholeBuildingEnergy = () => {
    const {wholeBuilding} = this.props;

    let finalData = [];
    formatInfluxData(wholeBuilding).forEach((el) => {
      const splited = el.split(',');
      if(splited[3] !== undefined) {
        finalData.push({name: splited[3], y: Number(splited[4])});
      }
    })

    return finalData
  }

  formatPerformanceIndex = (tenant, totalConsumption) => {
    const buildingSavings = this.formatBuildingSavings(tenant, totalConsumption);

    let finalData = [0];

    for(let i = 0; i < buildingSavings.length; i++) {
      const data = finalData[i] + buildingSavings[i];
      finalData.push(Number(data.toFixed(0)));
    }

    return finalData
  }

  render() {
    const {
      consumption,
      tenantBaseline,
      totalEnergyConsumption,
    } = this.props

    return (
      <Row className="mt-4">
        <Col md="6" className="mb-4">
          {totalEnergyConsumption && consumption && consumption.items && consumption.items.length !== 0 &&
          <ProjectPerformanceIndexAxes
            categories={this.formatEnergyTotalCategories()}
            data={this.formatPerformanceIndex(tenantBaseline, totalEnergyConsumption)}
          />}
        </Col>
        <Col md="6" className="mb-4">
          {tenantBaseline && tenantBaseline !== "null" &&
          consumption && consumption.items && consumption.items.length !== 0 &&
          <BuildingsSavings
            buildingSavesData={this.formatBuildingSavings(tenantBaseline, totalEnergyConsumption)}
            categories={this.formatEnergyTotalCategories()}
          />
          }
        </Col>
      </Row>
    )
  }
}

export default connect(
  (state) => ({
    consumption: getTotalConsumption(state),
    dailyForecast: getDailyForecast(state),
    tenantBaseline: getTenantBaseline(state),
    wholeBuilding: getWholeBuildingEnergy(state),
    totalEnergyConsumption: getTotalEnergyConsumption(state),
    selectedProject: getSelectedProject(state),
    mdbPower: getMdbPower(state),
    mdbPowerSum: getMdbPowerSum(state),
    heatmap: getHeatMap(state),
  }),
)(MainCharts);
