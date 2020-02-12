import React from 'react'
import {connect} from 'react-redux'
import {
    Row,
    Col,
} from 'shards-react'
import { 
    getChillerTemp,
    getAllEquipments,
    getAllProjects,
    getSelectedData,
    getEnergyCons,
    getSTS,
    getEnergyConsDaily,
    getCapTot,
    getDeltaTemp,
    getHoaSTS,
} from '../../../redux/reducers/chiller'

import {
    formatInfluxData,
    splitEnergyData,
    splitDataOnArrays,
    splitStsDataToArrays,
    formatSTSSeries
} from '../../utils/format'

import StackedBarChart from '../metrics/StackedBarChart'
import TimelineChart from '../metrics/TimelineChart'
import RunStsChart from '../metrics/RunSTSChart'

var moment = require('moment')

class ChillerCharts extends React.Component {

    formatEnergyConsDaily = (energy) => {
        let data = []
        const finalData = []
        const filtered = formatInfluxData(energy)
        const structuredData = splitEnergyData(filtered)
        for(let i = 0; i<structuredData.length; i++) {
            structuredData[i].map((el) => {
                data.push(Number(Number(el.value).toFixed(2)))
            })
            finalData.push({
                name: structuredData[i][0].name,
                data: data,
            })

            data = []
        }

        return finalData
    }

    formatCategoriesEnergyConsDaily = (energy) => {
        let categories = []
        const filtered = formatInfluxData(energy)
        const structuredData = splitEnergyData(filtered)

        structuredData[0].map(el => {
            categories.push(moment(el.date, "YYYY-MM-DDT00:00:00Z").format("YYYY-MM-DD"))
        })

        return categories
    }

    formatTimeLineSeries = (line) => {
        const filtered = formatInfluxData(line)
        const structuredData = splitDataOnArrays(filtered)

        return structuredData
    }

    formatSTSSeries = (sts) => {
        const {selectedData} = this.props

        const filtered = formatInfluxData(sts)
        const structuredData = splitStsDataToArrays(filtered)
        return formatSTSSeries(structuredData, selectedData.endDate)
    }

    formatSTSCategories = (sts) => {

        const filtered = formatInfluxData(sts)
        const structuredData = splitStsDataToArrays(filtered)

        const categories = []

        structuredData.map(el => {
            categories.push(el[0].meter)
        })

        return categories
    }

    render() {
        const {
            energyConsDaily,
            chillerTemp,
            capTot,
            deltaTemp,
            sts,
            hoaSts,
        } = this.props

        return(
            <Row>
                {energyConsDaily && energyConsDaily.trim() !== "" &&  <Col lg="6" className="mb-4">
                    <StackedBarChart 
                        categories={this.formatCategoriesEnergyConsDaily(energyConsDaily)}
                        data={this.formatEnergyConsDaily(energyConsDaily)}
                        title={"DAILY ENERGY CONSUMPTION (kWh)"}
                    />
                </Col>}
                {chillerTemp && chillerTemp.trim() !== "" && <Col lg="6" className="mb-4">
                    <TimelineChart 
                        data={this.formatTimeLineSeries(chillerTemp)}
                        title={"EVAPORATOR TEMP (°C)"}
                    />
                </Col>}
                {capTot && capTot.trim() !== "" && <Col lg="6" className="mb-4">
                    <TimelineChart 
                        data={this.formatTimeLineSeries(capTot)}
                        title={"CHILLER CAPACITY (%)"}
                    />
                </Col>}
                {deltaTemp && deltaTemp.trim() !== "" && <Col lg="6" className="mb-4">
                    <TimelineChart 
                        data={this.formatTimeLineSeries(deltaTemp)}
                        title={"CONDENSER TEMPERATURES (°C)"}
                    />
                </Col>}
                {sts && sts.trim() !== "" && <Col lg="6" className="mb-4">
                    <RunStsChart 
                        categories={this.formatSTSCategories(sts)}
                        data={this.formatSTSSeries(sts)}
                        title={"RUN STATUS (Off / Run)"}
                    />
                </Col>}
                {hoaSts && hoaSts.trim() !== "" && <Col lg="6" className="mb-4">
                    <RunStsChart 
                        categories={this.formatSTSCategories(hoaSts)}
                        data={this.formatSTSSeries(hoaSts)}
                        title={"HOA (Hand / Auto)"}
                        start={"HAND"}
                        end={"AUTO"}
                    />
                </Col>}
            </Row>
        )
    }
}

export default connect(
    (state) => ({
        chillerTemp: getChillerTemp(state),
        capTot: getCapTot(state),
        deltaTemp: getDeltaTemp(state),
        projects: getAllProjects(state),
        equipList: getAllEquipments(state),
        selectedData: getSelectedData(state),
        energyCons: getEnergyCons(state),
        energyConsDaily: getEnergyConsDaily(state),
        sts: getSTS(state),
        hoaSts: getHoaSTS(state),
    }),
    (dispatch) => ({
        
    })
)(ChillerCharts)