import * as React from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'shards-react'
import { withRouter } from 'next/router'

import {
  loadAllDailyData,
  loadAllDailyProjects,
  loadAllMdbListForCurrentProject,

  getAllDailyProjects,
  getAllMdbCurrentProject,
  getStartDate,
  getEndDate,
  getSelectedProject,
} from '../../redux/reducers/temporaryDaily'
import SummaryDashboardContainer from '../../src/containers/SummaryDashboardContainer'
import FahuDashboardContainer from '../../src/containers/FahuDashboardContainer'
import ChillerWaterPlantDashboardContainer from '../../src/containers/ChillerWaterPlantDashboardContainer'
import ChillerDashboardContainer from '../../src/containers/ChillerDashboardContainer'
import FcuDashboardContainer from '../../src/containers/FcuDashboardContainer'
import HotWaterPlantDashboardContainer from '../../src/containers/HotWaterPlantDashboardContainer'
import DailyDashboardContainer from '../../src/containers/DailyDashboardContainer'


class DailyMVGeneralContainer extends React.Component {
    
  state = {
    dashboard: 'Daily',
  }

  handleChangeDashboard = (e) => {
    this.setState({
      dashboard: e.target.value,
    })
  }

  renderDashboard = () => {
    const { 
      dashboard,
    } = this.state
    
    switch (dashboard) {
    case 'Summary': 
      return (
        <SummaryDashboardContainer />
      )
    case 'FAHU': 
      return (
        <FahuDashboardContainer />
      )
    case 'CHW': 
      return (
        <ChillerWaterPlantDashboardContainer />
      )
    case 'Chiller': 
      return (
        <ChillerDashboardContainer />
      )
    case 'FCU': 
      return (
        <FcuDashboardContainer />
      )
    case 'HWP': 
      return (
        <HotWaterPlantDashboardContainer />
      )
    case 'Daily':
    default:
      return (
        <DailyDashboardContainer />
      )
    }
  }

  render() {
    const { 
      dashboard,
    } = this.state

    return (
      <div>
        <Container>
          <Row>
            <Col lg="2" className="ml-auto mt-3 mb-lg-0 mb-3">
              <select 
                className="form-control"
                defaultValue={dashboard}
                onChange={this.handleChangeDashboard}
                onBlur={() => {}}
              >
                <option value="Daily">Project Summary</option>
                <option value="Summary">MDB Summary</option>
                <option value="FAHU">FAHU</option>
                <option value="CHW">CHW Plant</option>
                <option value="Chiller">Chiller</option>
                <option value="FCU">FCU</option>
                <option value="HWP">HWP</option>
              </select>
            </Col>
          </Row>
        </Container>

        {this.renderDashboard()}
      </div>
    )
  }
}

export default connect(
  (state) => ({
    
  }),
  (dispatch) => ({
    
  })
)(DailyMVGeneralContainer)