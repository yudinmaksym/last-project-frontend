import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'shards-react' 
import MdbEnergyTotal from './MdbEnergyTotal'
import SavingsPerBuilding from './SavingsPerBuilding'
import { 
    getSelectedData,
    getCurrentWeather,
    getTotal,
    getDaily
} from '../../../redux/reducers/lobby'
import {
    formatInfluxData
} from '../../utils/format'
import SidebarStats from './SidebarStats'

var moment = require('moment');

class LobbyCharts extends React.Component {

    formatXlineValues = () => {
        const { selectedData } = this.props

        let diff = 0
        diff = moment(selectedData.endDate).diff(selectedData.startDate, "days");
        
        let generateCategories = [];
        for(var i = 0; i <=diff; i++) {
            generateCategories.push(
                moment(selectedData.startDate).add(i, "days").format("MMM DD"),
            )
        }

        return generateCategories
    }

    formatDailyEnergyConsumption = () => {
        const { daily, selectedData } = this.props
        var filtered = formatInfluxData(daily.energyConsumption)

        let diff = 0
        diff = moment(selectedData.endDate).diff(selectedData.startDate, "days");
        
        let generateEnergyWithZero = [];
        for(var i = 0; i <=diff; i++) {
            generateEnergyWithZero.push({
                date: moment(selectedData.startDate).add(i, "days").format('YYYY-MM-DDT00:00:00Z'),
                value: 0
            })
        }

        let totalEnergyFilteredData = [];
        filtered.forEach((el) => {
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

        let dailyEnergyFilteredData = [];
        generateEnergyWithZero.forEach((el) => {
            dailyEnergyFilteredData.push(Number(el.value.toFixed(0)))
        })

        return dailyEnergyFilteredData
    }

    formatBaseline = () => {
        const { daily } = this.props;

        const baselineData = []
        daily.baseline.map(_proj => {
            _proj.map((el,index) => {
                baselineData[index] = (baselineData[index] || 0) + Number(el.value.toFixed(0))
            })
        })
        return baselineData
    }

    formatForecast = () => {
        const { daily } = this.props;

        const forecastData = []
        daily.forecast.map(_proj => {
            _proj.map((el,index) => {
                forecastData[index] = (forecastData[index] || 0) + Number(el.value.toFixed(0))
            })
        })
        return forecastData
    }

    formatDailyBuildingSavings = () => {
        const dailyConsumption = this.formatDailyEnergyConsumption()
        const baseline = this.formatBaseline()

        let dailyBuildingSavings = []
        baseline.map((el,index) => {
            dailyBuildingSavings.push(el - dailyConsumption[index])
        })
        return dailyBuildingSavings
    }

    render() {
        const {
            daily,
        } = this.props;

        return(
            <Row className="mt-2">
                <Col lg="5">
                    <SidebarStats />
                </Col>
                <Col lg="7">
                    {daily && daily.energyConsumption && daily.baseline.length !== 0 && daily.forecast.length !== 0
                    &&
                            <MdbEnergyTotal 
                                categories={this.formatXlineValues()}
                                tenantBaselineData={this.formatBaseline()}
                                totalEnergyData={this.formatDailyEnergyConsumption()}
                                dailyForecastData={this.formatForecast()}
                                dailyForecastLegendTitle={"Forecast"}
                            />
                    }
                    <div className="mt-3">
                        {daily && daily.baseline.length !== 0 && daily.energyConsumption
                        &&
                            <SavingsPerBuilding 
                                buildingSavesData={this.formatDailyBuildingSavings()}
                                categories={this.formatXlineValues()}
                            />
                        }
                    </div>
                </Col>
                
            </Row>
        )
    }
}

export default connect(
    (state) => ({
        total: getTotal(state),
        daily: getDaily(state),
        selectedData: getSelectedData(state),
        currentWeather: getCurrentWeather(state),
    }),
    (dispatch) => ({
    })
)(LobbyCharts);