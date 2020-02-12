import React from 'react'
import {connect} from 'react-redux'
import { 
    Row,
    Col, 
} from 'shards-react'
import BuildingSavings from '../metrics/BuildingsSavings'
import SummaryEnergyConsumptionToBaseline from '../metrics/SummaryEnergyConsumptionToBaseline'

import {
    getTotalyEnergy,
    getTotalySavings,
    getActualConsumption,
    getBaseline,
    getMdbPower,
    getMdbList,
    getSelectedProject,
    getEquipList,
    getEnergyConsDist,
    getHourlyCons,
    getActualConsWholeBuilding,
    getHourlyConsWholeBuilding,
} from '../../../redux/reducers/summary'
import {
    formatInfluxData,
    getRandomColor,
} from '../../utils/format'
import moment from 'moment'
import MdbPowerChart from './MdbPowerChart'
import MdbEnergyTotal from '../metrics/MdbEnergyTotal'
import Sidebar from './Sidebar'
import OrganizationChart from '../metrics/OrganizationChart'
import TimelineChart from '../metrics/TimelineChart'
import StackedBarChart from '../metrics/StackedBarChart'
import colors from '../../utils/colors'
import EnergyStats from './EnergyStats'

class MdbSummary extends React.Component {

    formatActualConsumption = () => {
        const {actualConsumption, selectedProject} = this.props;
        const filtered = formatInfluxData(actualConsumption)

        let tempData = [];
        for(let i = 0; i < filtered.length; i++) {
            const splited = filtered[i].split(',');
            tempData.push({
                date: splited[3],
                value: Number(splited[4]),
                subject: splited[5]
            })
        }

        let diff = 0
        diff = moment(selectedProject.endDate).diff(selectedProject.startDate, "days");
        
        let generateEnergyWithZero = [];
        for(var i = 0; i <=diff; i++) {
            generateEnergyWithZero.push({
                date: moment(selectedProject.startDate).add(i, "days").format('YYYY-MM-DDT00:00:00Z'),
                value: 0
            })
        }

        for(let i = 0; i<generateEnergyWithZero.length; i++) {
            for(let j = 0; j<tempData.length; j++) {
                if(moment(generateEnergyWithZero[i].date).format("YYYY-MM-DD") === moment(tempData[j].date).format("YYYY-MM-DD")) {
                    generateEnergyWithZero[i].value = tempData[j].value
                }
            }
        }

        let data=[]
        generateEnergyWithZero.forEach((el) => {
            data.push(Number((el.value).toFixed(0)));
        })

        if(selectedProject.endDate === moment().format("YYYY-MM-DD")) {
            data.pop()
        }
        return data
    }

    formatBaseline = () => {
        const {baseline, selectedProject} = this.props;
        if(baseline && baseline.length !== 0) {
            const data = baseline[0].data.map(el => Number(Number(el.value).toFixed(2)))

            if(selectedProject.endDate === moment().format("YYYY-MM-DD")) {
                data.pop()
            }

            return data
        }
        return []
    }

    formatCategories = () => {
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

    formatSavingDaily = () => {
        const baseline = this.formatBaseline()
        const actualCons = this.formatActualConsumption()

        const data = []
        if(baseline && baseline.length !== 0) {
            baseline.forEach((el,index) => {
                if(actualCons[index] <= 0) {
                    data.push( Number((el - el).toFixed(2)) )
                } else {
                    data.push( Number((el - Number(actualCons[index])).toFixed(2)) )
                }
            })
            return data
        }
        return 0
    }

    formatMdbPower = () => {
        const {mdbPower} = this.props
        const filtered = formatInfluxData(mdbPower)

        let tempData = []
        if(filtered.length !== 0) {
            for(let i = 0; i < filtered.length; i++) {
                const splited = filtered[i].split(',')

                tempData.push({
                    date: splited[3],
                    value: Number(splited[4]),
                })
            }
            let data=[]
            tempData.map((el) => {
                data.push([Number(moment(el.date, 'YYYY-MM-DDTHH:mm:ssZ').format('x')),Number((el.value).toFixed(2))]);
            })
            return [{
                data: data,
                name: "Power",
            }]
        }
        return []
    }
    
    formatOrganizationData = (selectedProject, mdbList, equipList) => {
        let data = []
        let nodes = []
        let colorIndex = 0
        let endUse = ""
        const colors = [getRandomColor()]
        mdbList.map(_mdb => {
            data.push([selectedProject.project, _mdb.iot_name])
            equipList.map(_equip => {
                if(_equip.meter === _mdb.iot_name && _equip.iot_name !== "") {
                    data.push([_mdb.iot_name,  _equip.iot_name])

                    if(endUse === _equip.asset_type.type) {
                        nodes.push({
                            id: _equip.iot_name,
                            title: _mdb.iot_name,
                            color: colors[colorIndex],
                            name: _equip.iot_name
                        }) 
                    } else {
                        colors.push(getRandomColor())
                        colorIndex++
                        nodes.push({
                            id: _equip.iot_name,
                            title: _mdb.iot_name,
                            color: colors[colorIndex],
                            name: _equip.iot_name
                        })
                        endUse = _equip.asset_type.type
                    }

                }
            })
        })
        return {data: data, nodes: nodes}
    }

    formatHourlyConsumption = (cons) => {
        var filtered = formatInfluxData(cons)
        filtered.shift()
        let data = []
        let finalData = []
        filtered.forEach((el) => {
            const splited = el.split(',');
            data.push(
                {
                    x: Number(moment(splited[7], 'YYYY-MM-DDTHH:mm:ssZ').format('x')),
                    y: Number(Number(splited[6]).toFixed(2)),
                }
            );
        })

        finalData.push({
            data: data,
            name: "Daily Hourly Consumption",
            showInLegend: true,
            turboThreshold: 3000,
        })

        return finalData
    }

    splitDaysOfWeekOnArrays = (data, all) => {
        var filtered = formatInfluxData(data)
        filtered.shift()
        
        const datePosition = `${all ? 3 : 7}`
        const valuePosition = `${all ? 4 : 6}`

        const daysData = [[],[],[],[],[],[],[]]
        const daysInWeek = 7
        for(let i = 0; i< daysInWeek; i++) {

            filtered.forEach((el) => {
                const splited = el.split(',');
                const dayOfWeek = Number(moment.utc(splited[datePosition], 'YYYY-MM-DDTHH:mm:ssZ').format('d'))
                if(dayOfWeek === i) {
                    daysData[i].push({
                        name: moment(splited[datePosition], 'YYYY-MM-DD').format('dddd'),
                        data: {
                            x: moment(splited[datePosition], 'YYYY-MM-DDTHH:mm:ssZ').subtract(2, 'hours').format('HH:mm:ss'),
                            y: Number(Number(splited[valuePosition]).toFixed(2)),
                        }
                    })

                }
            })
        }
        return daysData
    }

    formatHourlyXAxis = () => {
        const hours = 24
        const categories = []
        for(let i=0; i<hours; i++) {
            categories.push(moment(i, 'H').format('HH'))
        }
        return categories
    }

    formatDayOfWeekAverageConsumption = (cons, wholeBuilding) => {
        let dayArray = []
        const finalData = []
        const daysOfWeekInArrays = this.splitDaysOfWeekOnArrays(cons, wholeBuilding)
        daysOfWeekInArrays.map((_weekDay, index) => {
            for(let i = 0; i < _weekDay.length; i++) {
                const firstTime = _weekDay[0].data.x
                if(i !== 0 && _weekDay[i].data.x === firstTime) {
                    break
                }
                let valuesSum = _weekDay[i].data.y
                let counter = 1
                for(let j = i+1; j < _weekDay.length; j++) {
                    if(_weekDay[i].data.x === _weekDay[j].data.x) {
                        counter++
                        valuesSum += _weekDay[j].data.y
                    }
                }
                dayArray.push(Number((valuesSum/counter).toFixed(2)))
            }
            console.log(dayArray)
            finalData.push({
                name: moment(index, 'd').format('dddd'),
                data: dayArray,
                type: 'line'
            })
            dayArray = []
        })
        return finalData
    }

    formatDayOfWeekAverageConsumptionBarChart = (cons) => {
        const {selectedProject} = this.props
        let averageSum = 0, counter = 0, daysInWeek = 7
        let categories = [], tempData = []
        const finalData = []
        var filtered = formatInfluxData(cons)
        
        if(selectedProject.endDate === moment().format('YYYY-MM-DD')) {
            filtered.pop()
        }
        
        for(let i = 0; i< daysInWeek; i++) {

            filtered.forEach((el) => {
                const splited = el.split(',');
                const dayOfWeek = Number(moment(splited[3], 'YYYY-MM-DD').format('d'))
                if(dayOfWeek === i) {
                    counter++
                    averageSum += Number(splited[4])
                }
            })

            categories.push(moment(i, 'd').format('dddd'))
            tempData.push(Number((averageSum / counter).toFixed(2)))
            averageSum = 0, counter = 0
        }

        finalData.push({
            data: tempData,
            type: 'column',
            name: 'Daily Average',
            color: colors.primary.value
        })

        return [finalData, categories]
    }

    formatTotalData = () => {
        const {selectedProject} = this.props
        const baseline = this.formatBaseline()
        const energyTotal = this.formatActualConsumption()

        if(selectedProject.endDate === moment().format("YYYY-MM-DD")) {
            baseline.pop()
            energyTotal.pop()
        }

        const data = [
            {
                name: "Energy Adjusted/Tenant",
                data: energyTotal,
                color: colors.primary.value
            },
            {
                name: "Baseline",
                data: baseline,
                type: 'line',
                color: colors.baseline.value
            }
        ]
        return data
    }
    

    render() {
        const {
            energyTotal,
            savingTotal,
            actualConsumption,
            actualConsWholeBuilding,
            baseline,
            mdbPower,
            equipList,
            energyConsDist,
            selectedProject,
            mdbList,
            hourlyCons,
            hourlyConsWholeBuilding,
        } = this.props

        return (
            <div>
                <div style={{marginTop: 140}}>

                    {energyTotal && energyTotal.trim() !== ""
                    && savingTotal && savingTotal.length > 0
                    && equipList
                    && <EnergyStats 
                            energyTotal={energyTotal}
                            savingTotal={savingTotal}
                            equipList={equipList}
                        /> 
                    }

                    <Row className="mb-5 mt-3">
                        {energyConsDist && energyConsDist.trim() !== "" 
                        && energyTotal && energyTotal.trim() !== "" 
                        && 
                            <Col lg="4">
                                <Sidebar />
                            </Col>
                        }
                        <Col lg="4" className="chart-item_baseline mb-lg-0 mb-3">
                            {actualConsumption &&
                                <SummaryEnergyConsumptionToBaseline 
                                    title={`ENERGY CONSUMPTION (kWh) to Baseline`}
                                    yAxis={{title:{text: 'kWh'}}}
                                    data={this.formatTotalData()}
                                    categories={this.formatCategories()}
                                />
                            }
                        </Col>

                        <Col lg="4" className="chart-item_bar mb-lg-0 mb-3">
                            {baseline && baseline.length !== 0 && actualConsumption && actualConsumption.trim() !== "" &&
                            <BuildingSavings 
                                title={`SAVINGS (kWh)`}
                                yAxis={{title:{text: 'kWh'}}}
                                categories={this.formatCategories()}
                                buildingSavesData={this.formatSavingDaily()}
                            />}
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12" className="chart-item_power mb-lg-0 mb-3">
                            {baseline && baseline.length !== 0 && mdbPower && <MdbPowerChart 
                                yAxis={{title:{text: 'kW'}}}
                                title={"MDB POWER"}
                                data={this.formatMdbPower()}
                            />
                            }
                        </Col>
                        <Col lg="12" className="mt-3">
                            {hourlyCons && <TimelineChart 
                                yAxis={{title:{text: 'kWh'}}}
                                data={this.formatHourlyConsumption(hourlyCons)}
                                title={"HOURLY CONSUMPTION"}
                            />}
                        </Col>
                        <Col lg="12" className="mt-3">
                            {hourlyCons && <MdbEnergyTotal 
                                categories={this.formatHourlyXAxis()}
                                data={this.formatDayOfWeekAverageConsumption(hourlyCons, false)}
                                title={"DAILY AVERAGE HOURLY CONSUMPTION"}
                            />}
                        </Col>
                        <Col lg="12" className="mt-3">
                            {hourlyConsWholeBuilding && <MdbEnergyTotal 
                                categories={this.formatHourlyXAxis()}
                                data={this.formatDayOfWeekAverageConsumption(hourlyConsWholeBuilding, true)}
                                title={"DAILY AVERAGE HOURLY CONSUMPTION WHOLE BUILDING"}
                            />}
                        </Col>
                        <Col lg="12" className="mt-3">
                            {actualConsumption && actualConsumption.trim() !== "" && <StackedBarChart 
                                categories={this.formatDayOfWeekAverageConsumptionBarChart(actualConsumption)[1]}
                                data={this.formatDayOfWeekAverageConsumptionBarChart(actualConsumption)[0]}
                                title={"DAILY AVERAGE CONSUMPTION"}
                            />}
                        </Col>
                        <Col lg="12" className="mt-3">
                            {actualConsWholeBuilding && actualConsWholeBuilding.trim() !== "" &&  <StackedBarChart 
                                categories={this.formatDayOfWeekAverageConsumptionBarChart(actualConsumption)[1]}
                                data={this.formatDayOfWeekAverageConsumptionBarChart(actualConsWholeBuilding)[0]}
                                title={"DAILY AVERAGE CONSUMPTION WHOLE BUILDING"}
                            />}
                        </Col>
                        <Col lg="12" className="mt-3">
                            {selectedProject && mdbList && mdbList.length !== 0 && equipList &&
                                <OrganizationChart data={this.formatOrganizationData(selectedProject, mdbList, equipList)} />
                            }
                        </Col>
                    </Row>

                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        energyTotal: getTotalyEnergy(state),
        savingTotal: getTotalySavings(state),
        actualConsumption: getActualConsumption(state),
        actualConsWholeBuilding: getActualConsWholeBuilding(state),
        baseline: getBaseline(state),
        selectedProject: getSelectedProject(state),
        mdbPower: getMdbPower(state),
        mdbList: getMdbList(state),
        equipList: getEquipList(state),
        energyConsDist: getEnergyConsDist(state),
        hourlyCons: getHourlyCons(state),
        hourlyConsWholeBuilding: getHourlyConsWholeBuilding(state),
    }),
    (dispatch) => ({
    })
)(MdbSummary);