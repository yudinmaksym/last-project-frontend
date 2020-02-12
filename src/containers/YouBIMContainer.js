import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import { Container, Card, CardBody, Row, Col } from 'shards-react'
import Iframe from 'react-iframe'

import ProjectInfo from '../components/metrics/ProjectInfo'
import { formatNumber } from '../utils/format'
import {
  load,
  getProjectData,
} from '../../redux/reducers/projects'


class YouBIMContainer extends React.Component {
    state = {
      noProjectInfo: true,
    }

    componentDidMount() {
      this.props.loadSingle(this.props.router.query.id)
    }

    getProjectInfo(project) {
      if (!project) {
        return []
      }
    
      const projectFuels = []
    
      if (project.project.hasElectricityMeters) {
        projectFuels.push('Electricity')
      }
    
      if (project.project.hasChilledWaterMeters) {
        projectFuels.push('Chilled Water')
      }
    
      if (project.project.hasWaterMeters) {
        projectFuels.push('Water')
      }
    
      if (project.project.hasGasMeters) {
        projectFuels.push('GAS')
      }
    
      const masterBuilding = project.masterBuilding || {}
      return [
        {
          title: 'Neighborhood',
          value: masterBuilding['city'],
        },
        {
          title: 'Year Built',
          value: masterBuilding['year_built'],
        },
        {
          title: 'Meters Count',
          value: project['meters'] ? formatNumber(project['meters'].length) : 0,
        },
        {
          title: 'Fuels',
          value: projectFuels.lenght === 0 ? 'N/A' : projectFuels.join(', '),
        },
        {
          title: 'Occupancy Type',
          value: masterBuilding['occupancy_type'],
        },
        {
          title: 'Cooling Type',
          value: masterBuilding['cooling_type'],
        },
        {
          title: 'Metering Infrastructure',
          value: masterBuilding['metering_infrastructure'],
        },
        {
          title: <span>BUA (m<sup>2</sup>)</span>,
          value: project.project.bua ? formatNumber(project.project.bua) : 0,
        },
        {
          title: <span>GFA (m<sup>2</sup>)</span>,
          value: project.project.gfa ? formatNumber(project.project.gfa) : 0,
        },
        {
          title: <span>Common Space (m<sup>2</sup>)</span>,
          value: project.project.commonSpace ? formatNumber(project.project.commonSpace) : 0,
        },
        {
          title: <span>Tenant Space (m<sup>2</sup>)</span>,
          value: project.project.tenantArea ? formatNumber(project.project.tenantArea) : 0,
        },
      ]
    }

    render() {
      const { router, project } = this.props
      return (
        <>
          <Container fluid> 
            <button 
              className="btn btn-primary" 
              onClick={() => this.setState({ noProjectInfo: !this.state.noProjectInfo })}
            >
                        Hide Sidebar
            </button>
            <Row>
              <Col className="px-0 iframe-container">
                <Iframe
                  url={router.query.url}
                  className="iframe"
                  display="initial"
                  position="relative"
                />
              </Col>
              {this.state.noProjectInfo && project && project.project
                         && <Col lg="3" className="px-0">
                           <ProjectInfo 
                             title={'Information'}
                             info={this.getProjectInfo(project)} 
                           />
                         </Col>
              }
            </Row>
          </Container> 
        </>
      )
    }
}

export default withRouter(connect(
  (state) => ({
    project: getProjectData(state),
  }),
  (dispatch) => ({
    loadSingle: (id) => dispatch(load(id)),
  })
)(YouBIMContainer))