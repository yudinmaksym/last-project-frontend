import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'next/router'
import { Container } from 'shards-react' 
import FahuCharts from '../components/fahu/FahuCharts'
import { 
    getAllProjects,
    getAllEquipments,
    getSelectedData,

    loadAllProjects,
    loadAllData,
    loadFahuList,
} from '../../redux/reducers/fahu'
import {
    formatInfluxData,
    splitDataOnArrays,
    formatSTSSeries,
} from '../utils/format'
import TopFilter from '../components/daily/General/TopFilter'

var moment = require('moment')

class FahuDashboardContainer extends React.Component {

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

    formatEquipment = (equipList) => {
        return equipList.map(_equip => ({
            id: _equip.id,
            asset_type: _equip.asset_type,
            meter: _equip.meter,
            name: _equip.iot_name,
            project_id: _equip.project_id,
            tower: _equip.tower,
            type: _equip.type,
            iot_name: `${_equip.tower ? _equip.tower + '-'  + _equip.name : _equip.name}`
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
            
            if(splited[5] === nextSplited[5] && i !== filtered.length - 1) {
                data.push({
                    value: splited[4],
                    date: splited[3],
                    name: splited[5],
                    elapsed: splited[7],
                })
            } else {
                data.push({
                    date: splited[3],
                    value: splited[4],
                    name: splited[5],
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
            projects,
            equipments,
            selectedData,
            
            loadAllData,
            loadFahuList,
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
                    equipments={equipments && this.formatEquipment(equipments)}
                    handleDate={(range,date,equip,equipList) => loadAllData(range,date,equip,equipList)}
                    handleProject={(data, range) => loadFahuList(data, range)}
                    handleEquip={(range,date,equip,equipList) => loadAllData(range,date,equip,equipList)}
                    selectedData={selectedData}
                />

                <Container fluid className="fahu" style={{marginTop: 150}}>
                    <FahuCharts 
                        formatInfluxData={data => formatInfluxData(data)}
                        splitStsDataToArrays={string => this.splitStsDataToArrays(string)}
                        splitDataOnArrays={string => splitDataOnArrays(string)}
                        formatSTSSeries={(data, end) => formatSTSSeries(data, end)}
                    />
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
        loadAllProjects: (startDate, endDate, id, project) => dispatch(loadAllProjects(startDate, endDate, id, project)),
        loadAllData: (range,date,equip,equipList) => dispatch(loadAllData(range,date,equip,equipList)),
        loadFahuList: (data, range) => dispatch(loadFahuList(data, range)),
    })
)(FahuDashboardContainer))