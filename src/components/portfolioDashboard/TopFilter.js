import React from 'react'
import {
    Row,
    Col,
    Container,
} from 'shards-react';
import {connect} from 'react-redux'
import Router from 'next/router'
import {
    loadAllProjects,
    loadAllData,

    getProjectList,
    getSelectedData,
  } from '../../../redux/reducers/portfolioDashboard'
import DatePicker from '../daily/General/DatePicker'
import ProjectFilter from './ProjectFilter';

var moment = require('moment');

class TopFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD'),
            endDate: moment().subtract(1, "day").format('YYYY-MM-DD'),
        }
    }
        
    handleDateRange = (startDate, endDate) => {
        this.setState({
          startDate: startDate,
          endDate: endDate,
        })
        this.props.loadAllProjects(startDate, endDate)
    }

    togglePage = (event) => {
        const value = event.target.value
        switch(value) {
          case "Performance" : {
            return Router.push({pathname: '/portfolio/performance'})
          }
          case "Summary" : {
            return Router.push({pathname: '/daily/dashboard'})
          }
          default: return null
        }
    }

    render() {
        const { 
            title,
            projects,
            selectedData,
        } = this.props
        return(
            <Container className="filterBar">
                <Row className="pl-3">
                    <h3>{title}</h3>
                </Row>
                <Row className="pb-3 pt-2 justify-content-between row">
                    <Col lg="2">
                        {selectedData && <ProjectFilter 
                            loadAllData={this.props.loadAllData}
                            projects={projects}
                            start={selectedData.start}
                            end={selectedData.end}
                        />}
                    </Col>
                    <Col lg="2">
                        <DatePicker 
                            label={"Date Range"}
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
                    <Col lg="2"></Col>
                    <Col lg="2"></Col>
                    <Col lg="2">
                        <p className="mb-1"><small>Pages</small></p>
                        <select
                            className="form-control"
                            onChange={e => this.togglePage(e)}
                            >
                            <option value="Dashboard">Portfolio Dashboard</option>
                            <option value="Performance">Portfolio Performance</option>
                            <option value="Summary">Project Summary</option>
                        </select>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default connect(
    (state) => ({
        projects: getProjectList(state),
        selectedData: getSelectedData(state)
    }),
    (dispatch) => ({
        loadAllData: (start, end, projectList) => dispatch(loadAllData(start, end, projectList)),
        loadAllProjects: (start, end) => dispatch(loadAllProjects(start, end))
    })
)(TopFilter)