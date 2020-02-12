import React from 'react'
import {Row, Col, Container, ButtonGroup, Button} from 'shards-react';
import {connect} from 'react-redux'
import {
    loadAllData,
    getPageState,
    getSelectedProject,
} from '../../../redux/reducers/alarmsTable'
import DatePicker from '../daily/General/DatePicker'
import ProjectFilter from '../portfolioDashboard/ProjectFilter';
import ProjectsSelect from '../daily/General/ProjectsSelect'

var lodash = require('lodash');

var moment = require('moment');

class TopFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: moment().subtract(3,'days').format('YYYY-MM-DD'),
            endDate: moment().subtract(1, "day").format('YYYY-MM-DD'),
        }
    }

    handleChangeProject = (data) => {
        const {startDate, endDate} = this.state
        const {pageState} = this.props
        this.setState({
            project: data.label,
            id: data.value
        })
        this.props.loadAllData(startDate, endDate, data.label, pageState)
    }
        
    handleDateRange = (startDate, endDate) => {
        const {pageState, selectedProject} = this.props
        this.setState({
          startDate: startDate,
          endDate: endDate,
        })
        this.props.loadAllData(startDate, endDate, selectedProject, pageState)
    }

    getToggleState = (activeType) => {
        return activeType === this.props.pageState ? 'primary' : 'white'
    }

    handleToggle = (type) => {
        const {startDate, endDate} = this.state
        const {selectedProject} = this.props
        this.props.loadAllData(startDate, endDate, selectedProject, type)
    }

    render() {
        const { 
            title,
            projects,
            selectedProject,
            pageState
        } = this.props
        return(
            <Container fluid>
                <Row className="pl-3 align-items-center">
                    <Col className="px-0"><h3>{title || pageState.charAt(0).toUpperCase() + pageState.slice(1)}</h3></Col>
                    <Col className="px-0 text-center">
                        <ButtonGroup>
                            <Button 
                                theme={this.getToggleState('alarms')}
                                onClick={() => this.handleToggle('alarms')}
                            >
                                Alarms
                            </Button>
                            <Button 
                                theme={this.getToggleState('overridden')}
                                onClick={() => this.handleToggle('overridden')}
                            >
                                Overridden
                            </Button>
                            <Button 
                                theme={this.getToggleState('disconnected')}
                                onClick={() => this.handleToggle('disconnected')}
                            >
                                Disconnected
                            </Button>
                        </ButtonGroup>
                    </Col>
                    <Col className="d-flex align-items-center justify-content-end">
                        <span className="mr-3">Date range:</span>
                        <DatePicker 
                            onApply={(startDate, endDate) => 
                                    this.handleDateRange(moment(startDate).format("YYYY-MM-DD"), moment(endDate).format("YYYY-MM-DD"))
                            } 
                        >
                            <input 
                                type="text" 
                                value={`${this.state.startDate} / ${this.state.endDate}`} 
                                className="daily_pick-date-input mb-0" 
                                readOnly={true} 
                            />
                        </DatePicker>
                    </Col>
                    
                </Row>
                <Row className="pb-3 pt-2 row">
                    <Col lg="2">
                        {projects &&
                            <>
                                <p className="mb-1"><small>Projects</small></p>
                                <ProjectsSelect
                                    value={{
                                        // value: this.state.id,
                                        label: selectedProject
                                    }}
                                    projects={projects}
                                    onChange={e => this.handleChangeProject(e)}
                                />
                            </>
                        }
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default connect(
    (state) => ({
        pageState: getPageState(state),
        selectedProject: getSelectedProject(state)
    }),
    (dispatch) => ({
        loadAllData: (start, end, projectList, type) => dispatch(loadAllData(start, end, projectList, type)),
        loadAllProjects: (start, end) => dispatch(loadAllProjects(start, end))
    })
)(TopFilter)