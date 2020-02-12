import React from 'react';
import {connect} from 'react-redux'
import MdbEnergyTotal from '../metrics/MdbEnergyTotal';
import MdbPowerChart from '../metrics/MdbPowerChart'
import charts from '../../utils/colors' 
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
    getDailyTemp,
} from '../../../redux/reducers/temporaryDaily';
import {
    formatInfluxData
} from '../../utils/format'
import ChartsContainer from './ChartsContainer';
import TimelineChart from '../metrics/TimelineChart';
import SyncChart from '../metrics/SyncChart';

const moment = require('moment');

class DailyConsumptionChart extends React.Component {

    formatEnergyTotalCategories = () => {
        const {selectedProject} = this.props;

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
            return {y :Number(el.value.toFixed(1))}
        })
        return data
    }

    formatDailyForecastData = () => {
        const {dailyForecast} = this.props;

        const data = dailyForecast.items.map(el => {
            return {y: Number(el.value.toFixed(1))};
        })
        return data
    }

    formatTenantBaselineData = () => {
        const { selectedProject, totalEnergyConsumption, tenantBaseline } = this.props

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
                subtractData.push({ y: Number((el.value - tenant[index]).toFixed(0))});
            } else {
                subtractData.push({ y: Number(el.value.toFixed(0))});
            }
        })
        return subtractData
    }

    formatMdbPower = () => {
        const {mdbPower} = this.props
        let allPowerData = []

        mdbPower.map(el => {
            let data=[]
            let mdbName = ""

            formatInfluxData(el).forEach((el) => {
                const splited = el.split(',');

                if(el[0] !== "") {
                    data.push({
                        x: Number(moment(splited[7], 'YYYY-MM-DDTHH:mm:ssZ').format('x')),
                        y: Number(Number(splited[6]).toFixed(2)),
                    })
                }

                mdbName = splited[3]
            })

            allPowerData.push({
                data:data,
                name: mdbName,
                showInLegend: true,
            })
        })
        allPowerData.push({
            data: this.formatMdbPowerSum(),
            showInLegend: true,
            name: "MDB SUM"
        })
        return allPowerData
    }

    formatMdbPowerSum = () => {
        const {mdbPowerSum} = this.props
        const data = []

        formatInfluxData(mdbPowerSum).forEach((el) => {
            const splited = el.split(',');
            if(splited[3] !== undefined) {
                data.push({
                    x: Number(moment(splited[6], 'YYYY-MM-DDTHH:mm:ssZ').format('x')),
                    y: Number(Number(splited[5]).toFixed(2)),
                });
            }
        })

        return data
    }

    formatDailyCdd = (dailyCdd) => {
        return dailyCdd.map(_cdd => Number(_cdd.value))
    }

    formatTempearture = (weather) => {
        const {selectedProject} = this.props
        const temperature = formatInfluxData(weather.dailyTemp)
        const data = []
        const finalData = []
        temperature.forEach(_temp => {
            const splited = _temp.split(',');
            data.push(Number(parseFloat(splited[4]).toFixed(1)))
        })

        const cdd = this.formatDailyCdd(weather.dailyCdd)

        if(selectedProject.endDate === moment().format("YYYY-MM-DD")) {
            data.pop()
            cdd.pop()
        }

        finalData.push({
            data: data,
            name: "Temperature Max"
        }, {
            data: cdd,
            name: "CDD",
            type: 'column'
        })
        return finalData
    }

    

    formatTotalData = () => {
        const {selectedProject} = this.props
        const forecast = this.formatDailyForecastData()
        const baseline = this.formatTenantBaselineData()
        const energyTotal = this.formatEnergyTotalData()

        if(selectedProject.endDate === moment().format("YYYY-MM-DD")) {
            baseline.pop()
            forecast.pop()
            energyTotal.pop()
        }

        const data = [
            {
                name: "Energy Adjusted/Tenant",
                data: baseline,
                color: charts.primary.value
            },
            {
                name: "Forecast",
                data: forecast,
                type: 'line',
                color: charts.forecast.value
            },
            {
                name: "Baseline",
                data: energyTotal,
                type: 'line',
                color: charts.baseline.value
            }
        ]
        return data
    }

    render() {
        const {
            consumption, 
            dailyForecast, 
            tenantBaseline,
            totalEnergyConsumption,
            mdbPower,
            mdbPowerSum,
            weather,
        } = this.props

        return (
            <div className="mt-4">
                {consumption && consumption.items && dailyForecast && dailyForecast.items && 
                tenantBaseline && tenantBaseline !== "null" && totalEnergyConsumption && totalEnergyConsumption.trim() !== ""
                &&
                    <MdbEnergyTotal 
                        title={"PROJECT ENERGY TOTAL (kWh)"}
                        data={this.formatTotalData()} 
                        categories={this.formatEnergyTotalCategories()}
                        sync={weather && weather.dailyTemp && weather.dailyCdd && weather.dailyTemp.trim() !== "" ? this.formatTempearture(weather) : []}
                    />
                }
                <div className="mt-3">
                    {mdbPower && mdbPower.length !== 0 && mdbPowerSum && <MdbPowerChart 
                        data={this.formatMdbPower()}
                    />}
                </div>
                <ChartsContainer />
            </div>
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
        weather: getDailyTemp(state),
    }),
)(DailyConsumptionChart);