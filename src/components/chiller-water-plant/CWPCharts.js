import React from 'react'
import {connect} from 'react-redux'
import { Row, Col } from 'shards-react'
import { 
    getCHW, 
    getBTUList, 
    getPower, 
    getVFDSpeed, 
    getTemperature, 
    getEnergy ,
    getAllEquipments,
    getAllProjects,
    getSelectedData,
    getEnergyCons,
    getSTS,
    getEnergyConsDaily,
} from '../../../redux/reducers/chilledWaterPlant'
import {
    formatChwTemp,
    formatSTSSeries,
} from '../../utils/format'
import RunStsChart from '../metrics/RunSTSChart'
import StackedBarChart from '../metrics/StackedBarChart'
import TimelineChart from '../metrics/TimelineChart'
import SyncChart from '../metrics/SyncChart'

var moment = require('moment');

class CWPCharts extends React.Component {

    formatChwTemp = (dataArray) => {
        const filtered = this.props.formatInfluxData(dataArray)
        return formatChwTemp(filtered)
    }

    formatSTSSeries = () => {
        const {sts, selectedData} = this.props

        const filtered = this.props.formatInfluxData(sts)
        const structuredData = this.props.splitStsDataToArrays(filtered)
        
        return formatSTSSeries(structuredData, selectedData.endDate)
    }

    formatSTSCategories = () => {
        const {sts} = this.props

        const filtered = this.props.formatInfluxData(sts)
        const structuredData = this.props.splitStsDataToArrays(filtered)

        const categories = []

        structuredData.map(el => {
            categories.push(el[0].name)
        })

        return categories
    }

    formatEnergyConsDaily = (energy) => {
        let data = []
        const finalData = []
        energy.map(el => {
            const filtered = this.props.formatInfluxData(el)
            const structuredData = this.props.splitEnergyData(filtered)
            
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
        })

        return finalData
    }

    formatCategoriesEnergyConsDaily = (energy) => {
        let categories = []
        energy.map(el => {
            if(el.trim() !== "") {
                categories = []
                const filtered = this.props.formatInfluxData(el)
                const structuredData = this.props.splitEnergyData(filtered)

                structuredData[0].map(el => {
                    categories.push(moment(el.date, "YYYY-MM-DDT00:00:00Z").format("YYYY-MM-DD"))
                })
            }
        })

        return categories
    }

    formatTimeLineSeries = (line) => {
        const filtered = this.props.formatInfluxData(line)
        const structuredData = this.props.splitDataForLinechart(filtered)
        return structuredData
    }

    render() {
        const {
            CHWTemp, 
            energy, 
            power, 
            vfdSpeed, 
            temperature,
            sts,
            energyConsDaily,
        } = this.props

        return (
            <Row className="mt-3">
                <Col md="12">
                    <Row>
                        {energyConsDaily && energyConsDaily.length !== 0 && <Col lg="6" className="mb-4">
                            <StackedBarChart 
                                categories={this.formatCategoriesEnergyConsDaily(energyConsDaily)}
                                data={this.formatEnergyConsDaily(energyConsDaily)}
                                title={"DAILY ENERGY CONSUMPTION (kWh)"}
                            />
                        </Col>}
                        {CHWTemp && CHWTemp.trim() !=="" &&
                        temperature && temperature.trim() !=="" 
                        &&
                            <Col lg="12" className="mb-4">
                                <SyncChart 
                                    data={this.formatChwTemp(CHWTemp)}
                                    title={"CHW SYSTEMS TEMPERATURE"}
                                    sync={this.formatChwTemp(temperature)}
                                    syncTitle={"SYSTEM PRESSURE (BAR)"}
                                />
                            </Col>
                        }
                        {power && power.trim() !=="" && <Col lg="6" className="mb-4">
                            <TimelineChart 
                                data={this.formatTimeLineSeries(power)}
                                title={"POWER (kW)"}
                            />
                        </Col>}
                        {vfdSpeed && vfdSpeed.trim() !=="" && <Col lg="6" className="mb-4">
                            <TimelineChart 
                                data={this.formatTimeLineSeries(vfdSpeed)}
                                title={"VFD SPEED (%)"}
                            />
                        </Col>}
                        {sts && sts.trim() !== "" && <Col lg="6" className="mb-4">
                            <RunStsChart 
                                categories={this.formatSTSCategories()}
                                data={this.formatSTSSeries(sts)}
                                title={"RUN STATUS (Off / Run)"}
                            />
                        </Col>}
                    </Row>
                    
                </Col>
            </Row>
        )
    }
}



export default connect(
    (state) => ({
        CHWTemp: getCHW(state),
        BTUList: getBTUList(state),
        energy: getEnergy(state),
        power: getPower(state),
        vfdSpeed: getVFDSpeed(state),
        temperature: getTemperature(state),
        projects: getAllProjects(state),
        equipList: getAllEquipments(state),
        selectedData: getSelectedData(state),
        energyCons: getEnergyCons(state),
        energyConsDaily: getEnergyConsDaily(state),
        sts: getSTS(state),
    }),
    (dispatch) => ({
    })
)(CWPCharts);