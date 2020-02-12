import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'next/router'
import { 
    Container,
    Row, 
    Col,
} from 'shards-react'
import {
    loadAllProjects,
    loadAllData,
    loadCWPEquipList,

    getAllProjects,
    getAllEquipments,
    getSelectedData,
} from '../../redux/reducers/chilledWaterPlant'
import {
    formatInfluxData,
    splitEnergyData,
    splitDataForLinechart,
    splitStsDataToArrays,
    formatSTSSeries,
    formatChwTemp,
} from '../utils/format'
import CWPCharts from '../components/chiller-water-plant/CWPCharts'
import Sidebar from '../components/chiller-water-plant/Sidebar'
import TopFilter from '../components/daily/General/TopFilter'

var moment = require('moment');

class ChillerWaterPlantDashboardContainer extends React.Component {
    componentDidMount() {
        const {router} = this.props
        const start = moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD')
        const end = moment().format('YYYY-MM-DD')

        if(router.query.project) {
            this.props.loadAllProjects(
              router.query.start, 
              router.query.end,
              router.query.projectId, 
              router.query.project,
            )
        } else {
            this.props.loadAllProjects(start, end)
        }
    }

    formatTowers = (equipList) => {
        const towers = equipList.map(el => {
            return el.tower
        })
        let unique = [...new Set(towers)];
        return unique.map((_uniq, index) => ({
            iot_name: _uniq,
            id: index
        }))
    }

    formatEndUse = (equipList) => {
        const endUse = equipList.map(el => {
            if(el.asset_type) {
                return el.asset_type.type
            }
        })
        let unique = [...new Set(endUse)]
        return unique.map((_uniq, index) => ({
            iot_name: _uniq,
            id: index
        }))
    }

    handleFilterEndUse = (range,data,equip) => {
        const {equipments, selectedData} = this.props
        const equipment = equipments.filter(el => el.asset_type.type === equip.label && el.tower === selectedData.tower)
        const selectedEquip = {
            name: equipment,
            tower: selectedData.tower,
        }
        this.props.loadAllData(range,data,selectedEquip,equipments)
    }

    
    render() {
        const {
            router,
            title,
            selectedData,
            projects,
            equipments,

            loadCWPEquipList,
            loadAllData,
        } = this.props
        return (
            <>
                <TopFilter 
                    title={title}
                    routedData={{
                        project:router.query.project, 
                        id:router.query.projectId,
                        start: router.query.start,
                        end: router.query.end
                    }}
                    projects={projects}
                    equipments={equipments && this.formatEndUse(equipments)}
                    towers={equipments && this.formatTowers(equipments)}
                    handleDate={(range, data, equip) => loadAllData(range, data, equip, equipments)}
                    handleProject={(range, data) => loadCWPEquipList(data, range)}
                    handleEquip={(range, data, equip) => this.handleFilterEndUse(range, data, equip)}
                    handleTower={(range, data, equip) => loadAllData(range, data, equip, equipments)}
                    selectedData={selectedData}
                />
                <Container fluid className="chiller" style={{marginTop: 150}}>
                    <Row>
                        <Col lg="3">
                            <Sidebar 
                                formatInfluxData={influxString => formatInfluxData(influxString)}
                            />
                        </Col>
                        <Col lg="9">
                            <CWPCharts 
                                formatInfluxData={influxString => formatInfluxData(influxString)}
                                splitEnergyData={influxString => splitEnergyData(influxString)}
                                splitDataForLinechart={influxString => splitDataForLinechart(influxString)}
                                splitStsDataToArrays={influxString => splitStsDataToArrays(influxString)}
                                formatSTSSeries={data => formatSTSSeries(data)}
                                formatChwTemp={data => formatChwTemp(data)}
                            />
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}



export default withRouter(connect(
    (state) => ({
        projects: getAllProjects(state),
        equipments: getAllEquipments(state),
        selectedData: getSelectedData(state),
    }),
    (dispatch) => ({
        loadAllData: (startDate, endDate, projectId, project, equip, tower, equipList) => 
            dispatch(loadAllData(startDate, endDate, projectId, project, equip, tower, equipList)),
        loadAllProjects: (start, end, id, project) => dispatch(loadAllProjects(start, end, id, project)),
        loadCWPEquipList: (range, data) => dispatch(loadCWPEquipList(range, data))
    })
)(ChillerWaterPlantDashboardContainer))