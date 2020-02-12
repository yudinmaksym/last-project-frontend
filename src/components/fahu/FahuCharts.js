import React from 'react'
import {connect} from 'react-redux'
import {
    Row,
    Col,
} from 'shards-react';
import { 
    getCHWValve, 
    getTempTrends, 
    getVFD, 
    getCooling,
    getAllProjects,
    getAllEquipments, 
    getSelectedData,
    getCO2,
    getSTS,
    getEsEfEnergy,
    getEnergyCons,
    getEnthalpy,
    getFlow,
    getExhausVFD,
    getHoaSTS,
} from '../../../redux/reducers/fahu';
import {
    formatInfluxData,
    splitDataOnArrays,
    formatSTSSeries,
} from '../../utils/format'
import Sidebar from './Sidebar'
import TimelineChart from '../metrics/TimelineChart';
import RunStsChart from '../metrics/RunSTSChart';
import StackedBarChart from '../metrics/StackedBarChart';
import SyncChart from '../metrics/SyncChart';

var moment = require('moment');

class FahuCharts extends React.Component {

    formatTimeLineSeries = (line) => {
        const filtered = formatInfluxData(line)
        const structuredData = splitDataOnArrays(filtered)
        return structuredData
    }

    formatSTSSeries = (stsData) => {
        const {selectedData} = this.props

        const filtered = formatInfluxData(stsData)
        const structuredData = this.props.splitStsDataToArrays(filtered)

        return formatSTSSeries(structuredData, selectedData.endDate)
    }

    formatSTSCategories = (stsData) => {
        const filtered = formatInfluxData(stsData)
        const structuredData = this.props.splitStsDataToArrays(filtered)

        const categories = []

        structuredData.map(el => {
            categories.push(el[0].name)
        })

        return categories
    }

    formatSfEfEnergy = (energy) => {
        let data = []
        const finalData = []
        const filtered = formatInfluxData(energy)
        const structuredData = this.props.splitStsDataToArrays(filtered)
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

    formatSfEfCategories = (energy) => {

        const filtered = formatInfluxData(energy)

        let structuredData = []
        let data=[]

        for(let i = 0; i < filtered.length; i++) {
            let nextCounter = i + 1;

            if(i === filtered.length - 1) {
                nextCounter = i;
            }
            const splited = filtered[i].split(',');
            const nextSplited = filtered[nextCounter].split(',');

            if(splited[5] === nextSplited[5] && i !== filtered.length - 1) {
                data.push(splited[3])
            } else {
                data.push(splited[3])
                structuredData.push(data)
                data = []
            }  
        }
        const categories = []

        structuredData[0].map(el => {
            categories.push(moment(el).format("YYYY-MM-DD"))
        })

        return categories
    }

    render() {
        const {
            chwValveTemp,
            tempTrends,
            vfdSpeed,
            cooling,
            co2,
            sts,
            sfEfEnergy,
            energyCons,
            enthalpy,
            flow,
            hoaSts,
            exhausVfdSpeed,
        } = this.props

        return(
            <Row className="mt-3">
                <Col lg="3">
                    <Sidebar 
                        energyCons={energyCons}
                        formatInfluxData={data => formatInfluxData(data)}
                    />
                </Col>
                <Col lg="9">
                    <Row>
                        {sfEfEnergy && sfEfEnergy.trim() !== "" && sfEfEnergy.length !== 0 && <Col className="mb-4" md="6">
                            <StackedBarChart 
                                data={this.formatSfEfEnergy(sfEfEnergy)}
                                categories={this.formatSfEfCategories(sfEfEnergy)}
                                title={"SF & EF ENERGY"}
                            />
                        </Col>}
                        {chwValveTemp && chwValveTemp.trim() !== "" && <Col className="mb-4" md="6">
                            <TimelineChart 
                                data={this.formatTimeLineSeries(chwValveTemp)}
                                title={"COOLING COIL AIR TEMPERATURE (°C)"}
                            />
                        </Col>}

                        {tempTrends && tempTrends.trim() !== "" &&
                        cooling && cooling.trim() !== "" 
                        && 
                            <Col className="mb-4" md="6">
                                <SyncChart 
                                    data={this.formatTimeLineSeries(tempTrends)}
                                    sync={this.formatTimeLineSeries(cooling)}
                                    syncTitle={"COOLING VALVE POSITION (%)"}
                                    title={"AIR TEMPERATURE (°C)"}
                                />
                            </Col>
                        }

                        {vfdSpeed && vfdSpeed.trim() !== "" && <Col className="mb-4" md="6">
                            <TimelineChart 
                                data={this.formatTimeLineSeries(vfdSpeed)}
                                title={"SUPPLY FAN VFD SPEED (%)"}
                            />
                        </Col>}
                        {exhausVfdSpeed && exhausVfdSpeed.trim() !== "" && <Col className="mb-4" md="6">
                            <TimelineChart 
                                data={this.formatTimeLineSeries(exhausVfdSpeed)}
                                title={"EXHAUST FAN VFD SPEED"}
                            />
                        </Col>}
                        {co2 && co2.trim() !== "" && <Col className="mb-4" md="6">
                            <TimelineChart 
                                data={this.formatTimeLineSeries(co2)}
                                title={"CO2 LEVEL (PPM)"}
                            />
                        </Col>}
                        {flow && flow.trim() !== "" && <Col className="mb-4" md="6">
                            <TimelineChart 
                                data={this.formatTimeLineSeries(flow)}
                                title={"FLOW"}
                            />
                        </Col>}
                        {enthalpy && enthalpy.trim() !== "" && <Col className="mb-4" md="6">
                            <TimelineChart 
                                data={this.formatTimeLineSeries(enthalpy)}
                                title={"ENTHALPY"}
                            />
                        </Col>}
                        {sts && sts.trim() !== "" && <Col className="mb-4" md="6">
                            <RunStsChart 
                                categories={this.formatSTSCategories(sts)}
                                data={this.formatSTSSeries(sts)}
                            />
                        </Col>}
                        {hoaSts && hoaSts.trim() !== "" && <Col className="mb-4" md="6">
                            <RunStsChart 
                                title={"HOA STATUS"}
                                categories={this.formatSTSCategories(hoaSts)}
                                data={this.formatSTSSeries(hoaSts)}
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
        chwValveTemp: getCHWValve(state),
        tempTrends: getTempTrends(state),
        vfdSpeed: getVFD(state),
        exhausVfdSpeed: getExhausVFD(state),
        cooling: getCooling(state),
        projects: getAllProjects(state),
        fahuList: getAllEquipments(state),
        selectedData: getSelectedData(state),
        co2: getCO2(state),
        sts: getSTS(state),
        hoaSts: getHoaSTS(state),
        sfEfEnergy: getEsEfEnergy(state),
        energyCons: getEnergyCons(state),
        enthalpy: getEnthalpy(state),
        flow: getFlow(state),
    }),
    (dispatch) => ({
    })
)(FahuCharts)