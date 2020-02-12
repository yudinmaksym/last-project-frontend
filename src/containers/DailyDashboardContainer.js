import * as React from 'react'
import {connect} from 'react-redux'
import { Container, Row, Col } from 'shards-react'
import {
  loadAllDailyProjects,
  loadAllMdbListForCurrentProject,

  getAllDailyProjects,
  getSelectedProject,
  getAllMdbCurrentProject,
} from '../../redux/reducers/temporaryDaily';
import {withRouter} from 'next/router'
import SideBar from '../components/daily/Sidebar';
import DailyConsumptionChart from '../components/daily/DailyConsumptionChart';
import EnergyStats from '../components/daily/EnergyStats';
import TopFilter from '../components/daily/General/TopFilter';

var moment = require('moment');

class DailyDashboardContainer extends React.Component {

  componentDidMount() {
    const {router} = this.props
    const start = moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD');
    const end = moment().format('YYYY-MM-DD');

    if(router.query.project) {
      this.props.loadAllDailyProjects(
        router.query.start, 
        router.query.end,
        router.query.projectId, 
        router.query.project,
      )
    } else {
      this.props.loadAllDailyProjects(start, end)
    }
  }

  render() {
    const {
      title,
      router,
      projects,
      selectedData,

      loadAllMdbListForCurrentProject
    } = this.props
    return (
      <Container fluid className="px-0">
        <TopFilter 
          title={title}
          routedData={{
            project:router.query.project, 
            id:router.query.projectId,
            start: router.query.start,
            end: router.query.end
          }}
          projects={projects}
          handleDate={(data, range) => loadAllMdbListForCurrentProject(range, data)}
          handleProject={(date, range) => loadAllMdbListForCurrentProject(date, range)}
          selectedData={selectedData}
        />
        <Container className="daily">
          <EnergyStats />
          <Row className="">
            <Col lg="3" className="mt-4 [ daily_sidebar ]">
              <SideBar />
            </Col>
            <Col lg="9" className="[ daily_container ]">
              <DailyConsumptionChart />
            </Col>
          </Row>
        </Container>

      </Container>
    )
  }
}

export default withRouter(connect(
  (state) => ({
    projects: getAllDailyProjects(state),
    mdbList: getAllMdbCurrentProject(state),
    selectedData: getSelectedProject(state),
  }),
  (dispatch) => ({
    loadAllDailyProjects: (start, end, id, project) => dispatch(loadAllDailyProjects(start, end, id, project)),
    loadAllMdbListForCurrentProject:  (data, range) => dispatch(loadAllMdbListForCurrentProject(data, range)),
  })
)(DailyDashboardContainer))
