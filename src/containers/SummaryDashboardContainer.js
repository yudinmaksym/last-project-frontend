import * as React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'next/router'
import { Container } from 'shards-react'
import {
    loadAllProjects,
    loadAllMdbSummaryData,
    loadAllMdbListForCurrentProject,

    getAllProjects,
    getSelectedProject,
    getMdbList,
} from '../../redux/reducers/summary'
import MdbSummary from '../components/summary/MdbSummary';
import TopFilter from '../components/daily/General/TopFilter'

var moment = require('moment');

class SummaryDashboardContainer extends React.Component {
    componentDidMount() {
        const {router} = this.props
        const start = moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD');
        const end = moment().format('YYYY-MM-DD');
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
           mdbList,
           projects,
           selectedProject,

           loadAllMdbListForCurrentProject,
           loadAllMdbSummaryData,
        } = this.props
        return (
            <Container className="summary">
                <TopFilter 
                    title={title}
                    routedData={{
                        project:router.query.project, 
                        id:router.query.projectId,
                        start: router.query.start,
                        end: router.query.end
                    }}
                    selectedData={selectedProject}
                    projects={projects}
                    equipments={mdbList}
                    handleDate={(data,range) => loadAllMdbListForCurrentProject(range,data)}
                    handleProject={(data,range) => loadAllMdbListForCurrentProject(data,range)}
                    handleEquip={(range, data, mdb, mdbList) => loadAllMdbSummaryData(range, data, mdb, mdbList)}
                />
                <MdbSummary />
            </Container>
        )
    }
}

export default withRouter(connect(
    (state) => ({
        projects: getAllProjects(state), 
        selectedProject: getSelectedProject(state),
        mdbList: getMdbList(state),
    }),
    (dispatch) => ({
        loadAllProjects: (start, end, id, project) => dispatch(loadAllProjects(start, end, id, project)),
        loadAllMdbSummaryData: (range, data, mdb, mdbList) => dispatch(loadAllMdbSummaryData(range, data, mdb, mdbList)),
        loadAllMdbListForCurrentProject: (data,range) => dispatch(loadAllMdbListForCurrentProject(data,range)),
    })
)(SummaryDashboardContainer))