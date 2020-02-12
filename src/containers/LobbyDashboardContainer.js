import React from 'react'
import { connect } from 'react-redux'
import { Container } from 'shards-react'
import { withRouter } from 'next/router'
import moment from 'moment'

import LobbyCharts from '../components/lobby/LobbyCharts'
import {
  loadAllData,
  loadMdbList,
} from '../../redux/reducers/lobby'
import TopStats from '../components/lobby/TopStats'
import DepartmentLogo from '../images/lobby-dashboard/department.png'



class LobbyDashboardContainer extends React.Component {
  componentDidMount() {
    const { router } = this.props
    const range = {
      startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    }
    if(router.query.project && router.query.id) {
      const project = [
        { iot_name: router.query.project, id: router.query.id },
      ]
      this.props.loadMdbList(range, project)
    } else {
      this.props.loadMdbList(
        range, 
        [
          { iot_name: 'TRANSCO_HQ_1730', id: 5 },
          { iot_name: 'ADWEA_HQ', id: 6 },
          { iot_name: 'ADWEA_TC_1730', id: 7 },
        ]
      )
    }
  }
    
  render() {
    return (
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            <img src={'/img/logo.jpg'} alt="Takasolution" title="" width="250" />
          </div>
          <div>
            <img src={DepartmentLogo} alt="Department of Energy" title="" width="230" />
          </div>
        </div>
        <LobbyCharts />
        <TopStats />
      </Container>
    )
  }
}



export default withRouter(connect(
  (state) => ({
  }),
  (dispatch) => ({
    loadAllData: (startDate, endDate, project) => dispatch(loadAllData(startDate, endDate, project)),
    loadMdbList: (range, project) => dispatch(loadMdbList(range, project)),
  })
)(LobbyDashboardContainer))