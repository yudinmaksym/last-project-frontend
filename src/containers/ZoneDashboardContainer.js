
import * as React from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'shards-react'
import Router from 'next/router'

import {
  getSingle,
} from '../../redux/reducers/zones'
import ZonesSelect from '../components/zones/ZonesSelect'
import ZoneMetricsContainer from '../containers/ZoneMetricsContainer'
import PageTitle from '../components/common/PageTitle'


class ZoneDashboardContainer extends React.Component {
 
  handleZoneChange = (option) => {
    const id = option.value
    
    Router.push(`/zones/dashboard?id=${id}`)
  }

  getSubTitle = () => 'Zone Dashboard'

  render() {
    const { 
      name,
      id,
      title,
    } = this.props

    const selectedItem = {
      label: name,
      value: id,
    }

    return (
      <Container className="mw-100">
        <Row noGutters className="page-header py-4 justify-content-between">
          {/* Page Header :: Title */}
          <PageTitle title={title} subtitle={this.getSubTitle()} className="text-sm-left mb-3" />

          {/* Page Header :: Datepicker */}
          <Col sm="4" className="d-flex pull-right pt-1">
            <ZonesSelect 
              value={selectedItem}
              onChange={this.handleZoneChange}
              className="w-100"
            />
          </Col>
        </Row>

        <ZoneMetricsContainer />
      </Container>
    )
  }

}

export default connect(
  state => {
    const data = getSingle(state)
    // const consumptionFuelRange = getConsumptionFuelRange(state)
    // const costPerFuelRange = getCostPerFuelRange(state)

    return ({
      // test: 1,
      id: data && data.id,
      Name: data && data.name,
      // consumptionFuelRange,
      // costPerFuelRange,
    })
  },
  (dispatch) => ({
    
    // loadMetersTotal: (id) => dispatch(loadMetersTotal(id)),
    // loadBillsTotal: (id) => dispatch(loadBillsTotal(id)),
    // loadConsumptionFuel: (id) => dispatch(loadConsumptionFuel(id)),
    // loadCostPerFuel: (id) => dispatch(loadCostPerFuel(id)),
    // loadEnergyMetric: (id) => dispatch(loadEnergyMetric(id)),
    // loadMdbMetric: (id) => dispatch(loadMdbMetric(id)),
    // loadScore: (id) => dispatch(loadScore(id)),
    // loadProjectsByZone: (id) => dispatch(loadProjectsByZone(id)),
  })
)(ZoneDashboardContainer)