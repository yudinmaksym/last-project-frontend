import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'next/router'
import { 
    Container,
    Col,
    Row
} from 'shards-react'
import {
    loadAllProjects,
    getAllProjects,
    getEquipList,
    getSelectedData,

    loadAllData,
    loadHwpEquipList,
} from '../../redux/reducers/hotWaterPlant'
import {
    formatInfluxData,
    splitDataOnArrays,
} from '../utils/format'
import HWPCharts from '../components/hot-water-plant/HWTCharts'
import TopFilter from '../components/daily/General/TopFilter'

var moment = require('moment')

class HotWaterPlantDashboardContainer extends React.Component {

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
    
    render() {
        const {
            title,
            router,
            projects,
            equipments,
            selectedData,

            loadHwpEquipList,
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
                    equipments={equipments}
                    handleDate={(range, data, equip) => loadAllData(range, data, equip)}
                    handleProject={(range, data) => loadHwpEquipList(data, range)}
                    handleEquip={(range, data, equip) => loadAllData(range, data, equip)}
                    selectedData={selectedData}
                />
                <Container fluid className="hwp" style={{marginTop: 150}}>
                    <Row>
                        <Col lg="12">
                            <HWPCharts 
                                formatInfluxData={influxString => formatInfluxData(influxString)}
                                splitDataOnArrays={influxString => splitDataOnArrays(influxString)}
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
        loadHwpEquipList: (range, data) => dispatch(loadHwpEquipList(range, data)),
    })
)(HotWaterPlantDashboardContainer))