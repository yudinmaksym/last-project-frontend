import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'next/router'
import { Container, Row, Col } from 'shards-react'
import ChillerCharts from '../components/chiller/ChillerCharts'
import Sidebar from '../components/chiller/Sidebar'
import { 
    loadAllProjects,
    loadAllData, 
    loadChillerEquipList,

    getAllEquipments,
    getFilteredEquipList,
    getSelectedData,

    getAllProjects,
} from '../../redux/reducers/chiller'
import TopFilter from '../components/daily/General/TopFilter'
import {
    formatInfluxData,
    splitDataOnArrays,
    splitEnergyData
} from '../utils/format'
var moment = require('moment')

class ChillerDashboardContainer extends React.Component {

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
        let unique = [...new Set(towers)]

        return unique.map((_uniq, index) => ({
            iot_name: _uniq,
            id: index
        }))
    }
    
    splitStsDataToArrays = (filtered) => {
        let structuredData = []
        let data=[]

        for(let i = 0; i < filtered.length; i++) {
            let nextCounter = i + 1;

            if(i === filtered.length - 1) {
                nextCounter = i;
            }

            const splited = filtered[i].split(',');
            const nextSplited = filtered[nextCounter].split(',');
            
            if(splited[6] === nextSplited[6] && i !== filtered.length - 1) {
                data.push({
                    value: splited[4],
                    date: splited[3],
                    name: splited[5],
                    meter: splited[6],
                    elapsed: splited[7],
                })
            } else {
                data.push({
                    date: splited[3],
                    value: splited[4],
                    name: splited[5],
                    meter: splited[6],
                    elapsed: splited[7],
                })
                structuredData.push(data)
                data = []
            }  
        }

        return structuredData
    }
    
    render() {
        const {
            title,
            router,
            selectedData,
            projects,
            equipments,
            filteredEquipList,

            loadAllData,
            loadChillerEquipList,
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
                    equipments={filteredEquipList}
                    towers={equipments && selectedData.tower !== "" && this.formatTowers(equipments)}
                    handleDate={(range, data, equip) => loadAllData(range, data, equip, equipments)}
                    handleProject={(range, data) => loadChillerEquipList(data, range)}
                    handleEquip={(range, data, equip) => loadAllData(range, data, equip, equipments)}
                    handleTower={(range, data, equip) => loadAllData(range, data, equip, equipments)}
                    selectedData={selectedData}
                />
                <Container fluid className="chiller" style={{marginTop: 150}}>
                    <Row>
                        <Col lg="3">
                            <Sidebar 
                                formatInfluxData={data => formatInfluxData(data)}
                            />
                        </Col>
                        <Col lg="9">
                            <ChillerCharts 
                                splitStsDataToArrays={filtered => this.splitStsDataToArrays(filtered)}
                                formatInfluxData={data => formatInfluxData(data)}
                                splitDataOnArrays={filtered => splitDataOnArrays(filtered)}
                                splitEnergyData={filtered => splitEnergyData(filtered)}
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
        equipments: getAllEquipments(state),
        filteredEquipList: getFilteredEquipList(state),
        selectedData: getSelectedData(state),
        projects: getAllProjects(state),
    }),
    (dispatch) => ({
        loadAllProjects: (start, end, id, project) => dispatch(loadAllProjects(start, end, id, project)),
        loadAllData: (range, data, equip, equipList) => dispatch(loadAllData(range, data, equip, equipList)),
        loadChillerEquipList: (range, data) => dispatch(loadChillerEquipList(range, data))
    })
)(ChillerDashboardContainer))