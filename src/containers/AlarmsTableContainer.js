import * as React from 'react'
import {connect} from 'react-redux'
import {
    loadAllData,
    getAlarmsData,
    loadAllProjects,
    getProjects,
    getPageState,
    getConnectionPoints,
    getSelectedProject,
    getConnectionPointsAll,
} from '../../redux/reducers/alarmsTable'
import { Container } from 'shards-react'
import {withRouter} from 'next/router'
import AlarmTable from '../components/alarms/AlarmTable'
import OverrDiscTable from '../components/alarms/OverrDiscTable'
import TopFilter from '../components/alarms/TopFilter'
import TimelineChart from '../components/metrics/TimelineChart'
import {formatInfluxData} from '../utils/format'

var moment = require('moment');

class AlarmsTableContainer extends React.Component {

    componentDidMount() {
        const start = moment().subtract(3,'days').format('YYYY-MM-DD')
        const end = moment().format('YYYY-MM-DD')
        const {router} = this.props
        if(router.query.project) {
            this.props.loadAllProjects(start, end, router.query.project, router.query.type)
        } else {
            this.props.loadAllProjects(start, end)
        }
    }

    renderTable = (page, data) => {
        switch(page) {
            case 'alarms': {
                return <AlarmTable data={data} />
            }
            case 'overridden': {
                return <OverrDiscTable data={data} />
            }
            case 'disconnected': {
                return <OverrDiscTable data={data} />
            }
        }
    }

    formatConnectionPoints = (data, dataAll) => {
        const {router, selectedProject} = this.props
        const filtered = formatInfluxData(data) 
        const filteredAll = formatInfluxData(dataAll) 

        let projectData = []
        let splitedData = []
        const finalData = []

        projectData = filtered.filter(data => data.split(',')[3] === selectedProject)
        projectData.map(_el => {
            splitedData.push({
                x: Number(moment(_el.split(',')[4], 'YYYY-MM-DDTHH:mm:ssZ').format('x')),
                y: +(Number(_el.split(',')[7]).toFixed(2))
            })
        })
        finalData.push({
            data: splitedData,
            name: "Connection Status"
        })
        splitedData = []

        filteredAll.map(_el => {
            splitedData.push({
                x: Number(moment(_el.split(',')[3], 'YYYY-MM-DDTHH:mm:ssZ').format('x')),
                y: +(Number(_el.split(',')[6]).toFixed(2))
            })
        })

        finalData.push({
            data: splitedData,
            name: "Connection Status All Projects"
        })

        return finalData
    }

    render() {
        const {data, projects, router, pageState, connectionPoints, connectionPointsAll} = this.props
        return (
            <Container fluid className="px-0">
                <TopFilter 
                    title={"Alarms"}
                    projects={projects}
                    selectedProject={router.query.project}
                />
                <Container fluid>
                    {data && this.renderTable(pageState, data) }
                </Container>
                <Container fluid className="mt-3">
                    {   
                        connectionPoints && connectionPoints.trim() !== "" 
                        && connectionPointsAll && connectionPointsAll.trim() !== ""
                        &&  <TimelineChart 
                                data={this.formatConnectionPoints(connectionPoints, connectionPointsAll)} 
                                title={"CONNECTION STATUS (%)"}
                            />
                    }
                </Container>
            </Container>
        )
    }
}

export default withRouter(connect(
  (state) => ({
      data: getAlarmsData(state),
      projects: getProjects(state),
      pageState: getPageState(state),
      connectionPoints: getConnectionPoints(state),
      connectionPointsAll: getConnectionPointsAll(state),
      selectedProject: getSelectedProject(state),
  }),
  (dispatch) => ({
    loadAllData: (start, end, project, type) => dispatch(loadAllData(start, end, project, type)),
    loadAllProjects: (start, end, project, type) => dispatch(loadAllProjects(start, end, project, type)),
  })
)(AlarmsTableContainer))
