import React from 'react';
import {connect} from 'react-redux'
import {
    Col,
    Row,
} from 'shards-react';
import BuildingEnergyItem from './BuildingEnergyItem';
import {
    loadAllDailyData,
    loadTotalConsumption,
    loadDailyForecast,
    loadTenantBaseline,
    loadWholeBuildingsEnergy,
    loadTotalEnergyConsumption,
    loadSubjectCdd,
    loadAllMdbListForCurrentProject,
    clearAllState,

    getTotalConsumption,
    getDailyForecast,
    getTenantBaseline,
    getWholeBuildingEnergy,
    getSubjectCdd,
    getTotalEnergyConsumption,
    getAllDailyProjects,
    getAllMdbCurrentProject,
    getSelectedProject,
} from '../../../redux/reducers/temporaryDaily';
import {
    formatInfluxData
} from '../../utils/format'

var moment = require('moment')

class EnergyStats extends React.Component {

    formatTenantBaselineData = () => {
        const {
            tenantBaseline, 
            totalEnergyConsumption,
            selectedProject
        } = this.props

        const tenant = tenantBaseline[0].data.map(el => {
            return Number(el.value);
        })
        var filtered = formatInfluxData(totalEnergyConsumption)

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

    formatBuildingSavings = () => {
        const {consumption} = this.props;

        const tenantBaselineData = this.formatTenantBaselineData()

        const consump = consumption.items.map(el => {
            return Number(el.value.toFixed(1));
        })

        let subtractData = [];
        consump.forEach((el, index) => {
            if(tenantBaselineData[index] < 0 || tenantBaselineData[index] === undefined) {
                subtractData.push(consump[index] - consump[index]);
            } else {
                subtractData.push(consump[index] - tenantBaselineData[index]);
            }
            
        })
        return subtractData

    }

    formatWholeBuildingEnergy = () => {
        const buildingSavings = this.formatBuildingSavings()
        let finalData = 0;
        buildingSavings.forEach((el) => {
            finalData += Number(el.toFixed(0))
        })
        
        return finalData
    }

    formatTotalBuildingConsumption = () => {
        const tenantBaseline = this.formatTenantBaselineData()
        let data = 0;

        tenantBaseline.map(el => {
            data += Number(el.toFixed(0))
        })

        return data
    }

    render() {
        const {
            buildingCdd,
            tenantBaseline,
            consumption,
            totalEnergyConsumption,
        } = this.props

        return (    
            <Row className="jusify-content-between" style={{marginTop: 150}}>
                {buildingCdd && 
                    <BuildingEnergyItem 
                        title="CDD (Building)" 
                        value={buildingCdd.items[0].value.toFixed(0)} unit="" 
                    />
                }
                {totalEnergyConsumption && tenantBaseline &&
                    <BuildingEnergyItem 
                        value={this.formatTotalBuildingConsumption().toLocaleString('en')} 
                        title="Total Building Consumption" 
                    />
                }
                {consumption && consumption.items && consumption.items.length !== 0 &&
                    <>
                        <BuildingEnergyItem 
                            value={this.formatWholeBuildingEnergy().toLocaleString('en')} 
                            title="Total Energy Savings" 
                        />
                        <BuildingEnergyItem 
                            value={Number((this.formatWholeBuildingEnergy() * 0.45).toFixed(0)).toLocaleString('en')} 
                            title="Total Cost Savings" 
                            unit="AED"
                        />
                    </>
                }
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
        buildingCdd: getSubjectCdd(state),
        totalEnergyConsumption: getTotalEnergyConsumption(state),
        projects: getAllDailyProjects(state),
        mdbList: getAllMdbCurrentProject(state),
        selectedProject: getSelectedProject(state),
    }),
    (dispatch) => ({
        loadTotalConsumption: (startDate, endDate, subject) => dispatch(loadTotalConsumption(startDate, endDate, subject)),
        loadDailyForecast: (startDate, endDate, subject) => dispatch(loadDailyForecast(startDate, endDate, subject)),
        loadTenantBaseline: (startDate, endDate, subject) => dispatch(loadTenantBaseline(startDate, endDate, subject)),
        loadWholeBuildingsEnergy: (startDate, endDate, site) => dispatch(loadWholeBuildingsEnergy(startDate, endDate, site)),
        loadSubjectCdd: (startDate, endDate) => dispatch(loadSubjectCdd(startDate, endDate)),
        loadTotalEnergyConsumption: (startDate, endDate, site) => dispatch(loadTotalEnergyConsumption(startDate, endDate, site)),
        loadAllDailyData: (startDate, endDate, subject, mdbList) => dispatch(loadAllDailyData(startDate, endDate, subject, mdbList)),
        loadAllMdbListForCurrentProject: (projectId, projectName, startDate, endDate, region, cdd, category) => 
            dispatch(loadAllMdbListForCurrentProject(projectId, projectName, startDate, endDate, region, cdd, category)),
        clearAllState: () => dispatch(clearAllState())
    })
)(EnergyStats);