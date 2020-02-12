import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'next/router'
import {
    Container,
    Row,
    Col,
} from 'shards-react';
import {
    loadAllProjects,
    loadAllData,
    loadFcuEquipList,

    getAllProjects,
    getEquipList,
    getSelectedData,
} from '../../redux/reducers/fcu'
import {
    formatInfluxData,
    splitDataOnArrays,
    splitStsDataToArrays,
    formatSTSSeries,
} from '../utils/format'
import FcuCharts from '../components/fcu/FcuCharts'
import TopFilter from '../components/daily/General/TopFilter';

var moment = require('moment')

class FcuDashboardContainer extends React.Component {
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

    splitDataForLinechart = (filtered) => {
        let measurement = ""
        let structuredData = []
        let data=[]
        for(let i = 0; i < filtered.length; i++) {
            let nextCounter = i + 1;

            if(i === filtered.length - 1) {
                nextCounter = i;
            }

            const splited = filtered[i].split(',');
            const nextSplited = filtered[nextCounter].split(',');

            if(splited[5] === nextSplited[5] && i !== filtered.length - 2) {
                data.push({
                    x: Number(moment(splited[3], 'YYYY-MM-DDTHH:mm:ssZ').format('x')),
                    y: Number(Number(splited[4]).toFixed(2)),
                })
            } else {
                data.push({
                    x: Number(moment(splited[3], 'YYYY-MM-DDTHH:mm:ssZ').format('x')),
                    y: Number(Number(splited[4]).toFixed(2)),
                })
                structuredData.push({
                    data: data,
                    name: measurement,
                    showInLegend: true,
                    turboThreshold: 3000,
                })
                data = []
            } 
            measurement = splited[5] 
        }

        return structuredData
    }

    render() {
        const {
            title,
            router,
            projects,
            equipments,
            selectedData,

            loadAllData,
            loadFcuEquipList,
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
                    equipments={equipments}
                    handleDate={(range, data, equip) => loadAllData(range, data, equip)}
                    handleProject={(range, data) => loadFcuEquipList(data, range)}
                    handleEquip={(range, data, equip) => loadAllData(range, data, equip)}
                    selectedData={selectedData}
                />
                <Container fluid className="fcu" style={{marginTop: 150}}>
                    <Row>
                        <Col lg="12">
                            <FcuCharts 
                                formatInfluxData={data => formatInfluxData(data)}
                                splitDataOnArrays={string => splitDataOnArrays(string)}
                                splitDataForLinechart={string => this.splitDataForLinechart(string)}
                                splitStsDataToArrays={string => splitStsDataToArrays(string)}
                                formatSTSSeries={(data, end) => formatSTSSeries(data, end)}
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
        equipments: getEquipList(state),
        selectedData: getSelectedData(state),
    }),
    (dispatch) => ({
        loadAllProjects: (start, end, id, project) => dispatch(loadAllProjects(start, end, id, project)),
        loadAllData: (range, data, equip) => dispatch(loadAllData(range, data, equip)),
        loadFcuEquipList: (range, data) => dispatch(loadFcuEquipList(range, data)),
    })
)(FcuDashboardContainer))