import React from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'shards-react'
import PortfolioTable from '../components/portfolio/PortfolioTable'

import {
  loadAllData,
  loadAllDailyProjects,
} from '../../redux/reducers/portfolio'

class PortfolioPerformanceContainer extends React.Component {
  state = {
    toggleMap: true,
  }

  componentDidMount() {
    this.props.loadAllDailyProjects()
  }

  render() {
    return (
      <Container fluid>
        {/* <Row>
          <Col lg="2">
              <p className="mb-1"><small>Zone ID</small></p>
              <select 
                  className="form-control my-0"
                  // onChange={e => this.handleChangeCity(e)}
              >
                  <option>Asteco</option>
              </select>
          </Col>
          <Col lg="2">
              <p className="mb-1"><small>Occupancy Type</small></p>
              <select 
                  className="form-control my-0"
              >
                  <option>Hotel</option>
              </select>
          </Col>
          <Col>
          </Col>
        </Row> */}
        <Row className="mx-0">
          <Col className="mt-4 portfolio_table">
            <PortfolioTable />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect(
  (state) => ({
  }),
  (dispatch) => ({
    loadAllData: () => dispatch(loadAllData()),
    loadAllDailyProjects: () => dispatch(loadAllDailyProjects()),
  })
)(PortfolioPerformanceContainer)
