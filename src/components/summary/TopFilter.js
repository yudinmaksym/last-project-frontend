import React from 'react'
import {
    Row,
    Col,
    Container,
} from 'shards-react';
import {connect} from 'react-redux';
import {
    loadAllMdbSummaryData,
    loadAllMdbListForCurrentProject,

    getMdbList,
    getAllProjects,
    getSelectedProject,
} from '../../../redux/reducers/summary'
import DatePicker from '../daily//DatePicker'
import ProjectsRoute from '../daily/ProjectsRoute'
import ProjectsSelect from '../daily/ProjectsSelect'
import Link from '../common/Link'

var moment = require('moment');

class TopFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD'),
            endDate: moment().subtract(1, "day").format('YYYY-MM-DD'),
            project: '',
        }
    }
    
    handleDateRange = (startDate, endDate) => {
        const {selectedProject} = this.props;
        this.props.loadAllMdbListForCurrentProject(
            selectedProject.projectId, 
            selectedProject.project, 
            startDate, 
            endDate,
        )
        this.setState({
            startDate: startDate,
            endDate: endDate,
        })
    }
        
    handleChangeProject = (data) => {
        const {selectedProject} = this.props
        this.props.loadAllMdbListForCurrentProject(
            data.value, 
            data.label, 
            selectedProject.startDate, 
            selectedProject.endDate,
        )
    }

    handleChangeEquip = (data) => {
        const {selectedProject, mdbList} = this.props
        this.props.loadAllMdbSummaryData(
            selectedProject.startDate, 
            selectedProject.endDate, 
            selectedProject.project,
            selectedProject.projectId, 
            data.label,
            mdbList,
        )
    }



    render() {
        const { 
            projects,
            title,
            selectedProject,
            mdbList,
            routedProject,
        } = this.props
        return(
            <Container className="filterBar">
                <Row className="pl-3 d-flex justify-content-between align-items-center">
                    <h3>{title}</h3>
                    {selectedProject && <Link to={`/mdb-summary/heatmap?project=${selectedProject.project}&id=${selectedProject.projectId}`}>
                        Hourly Consumption Heatmap
                    </Link>}
                </Row>
                <Row className="pb-3 pt-2 justify-content-between row">
                    <Col lg="2">
                        {/* PROJECTS SELECTION */}
                        {projects 
                        && 
                            <>
                                <p className="mb-1"><small>Projects</small></p>
                                <ProjectsSelect 
                                    value={{
                                        value: routedProject.id,
                                        label: routedProject.project
                                    }}
                                    projects={projects}
                                    onChange={e => this.handleChangeProject(e)}
                                />
                            </>
                        }
                    </Col>
                    <Col lg="2">
                        {selectedProject 
                        &&
                            <DatePicker 
                                label={"Date Range"}
                                onApply={(startDate, endDate) => 
                                        this.handleDateRange(moment(startDate).format("YYYY-MM-DD"), moment(endDate).format("YYYY-MM-DD"))
                                } 
                            >
                                <input 
                                    type="text" 
                                    value={`${selectedProject.startDate || this.state.startDate} / ${selectedProject.endDate || this.state.endDate}`} 
                                    className="daily_pick-date-input mb-0" 
                                    readOnly={true} 
                                />
                            </DatePicker>
                        }
                    </Col>
                    
                    <Col lg="2">
                        {mdbList && mdbList.length !== 0
                            &&
                            <>
                                <p className="mb-1"><small>Equipment</small></p>
                                <ProjectsSelect 
                                    value={{
                                        label: mdbList[0].iot_name
                                    }}
                                    equipments={mdbList}
                                    onChange={e => this.handleChangeEquip(e)}
                                />
                            </>
                        }
                    </Col>
                    <Col lg="2"></Col>

                    <Col lg="2">
                        {/* PAGE SELECTION */}
                        <p className="mb-1"><small>Page</small></p>
                        <ProjectsRoute 
                            currentPage={title}
                            selectedData={selectedProject}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default connect(
    (state) => ({
        projects: getAllProjects(state),
        selectedProject: getSelectedProject(state),
        mdbList: getMdbList(state),
    }),
    (dispatch) => ({
        loadAllProject: (start, end) => dispatch(loadAllProjects(start, end)),
        loadAllMdbSummaryData: (start, stop, site, id, mdb, mdbList) => 
            dispatch(loadAllMdbSummaryData(start, stop, site, id, mdb, mdbList)),
        loadAllMdbListForCurrentProject: (projectId, projectName, startDate, endDate) => 
            dispatch(loadAllMdbListForCurrentProject(projectId, projectName, startDate, endDate)),
    })
)(TopFilter)