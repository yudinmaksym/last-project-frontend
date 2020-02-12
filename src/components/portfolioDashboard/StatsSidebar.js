import React from 'react'
import { connect } from 'react-redux'
import {
  Row, Col,
} from 'shards-react'

import {
  getEnergyConsumption,
  getTenantBaseline,
  getConsumptionBaseline,
} from '../../../redux/reducers/portfolioDashboard'
import BuildingEnergyItem from '../daily/BuildingEnergyItem'


class StatsSidebar extends React.Component {

    formatTotalConsumption = (cons, tenant) => {
      const tenantBaseline = this.props.formatTenantData(cons, tenant)
      let data = 0

      tenantBaseline.map(el => {
        data += Number(el.toFixed(0))
      })

      return data
    }

    formatTotalSavings = (cons, tenant, baseline) => {
      const buildingSavings = this.props.formatBuildingSavings(cons, tenant, baseline)
      let finalData = 0
      buildingSavings.forEach((el) => {
        finalData += Number(el.toFixed(0))
      })
        
      return finalData
    }

    render() {
      const {
        energyConsumption,
        tenantBaseline,
        consumptionBaseline,
      } = this.props

      return(
        <Row className="mt-3">
            <Col lg="3">
              {energyConsumption && tenantBaseline
                  && <BuildingEnergyItem 
                    value={this.formatTotalConsumption(energyConsumption, tenantBaseline).toLocaleString('en')} 
                    title="Total Consumption" 
                  />
              }
            </Col>
            {energyConsumption && tenantBaseline && consumptionBaseline
                && 
                <>
                  <Col lg="3">
                    <BuildingEnergyItem 
                      value={this.formatTotalSavings(energyConsumption, tenantBaseline, consumptionBaseline).toLocaleString('en')} 
                      title="Total Savings" 
                    />
                  </Col>
                  <Col lg="3">
                    <BuildingEnergyItem 
                      value={Number((this.formatTotalSavings(energyConsumption, tenantBaseline, consumptionBaseline) * 0.45).toFixed(0)).toLocaleString('en')} 
                      title="Total Cost Savings" 
                      unit="AED"
                    />
                  </Col>
                </>
            }
        </Row>
      )
    }
}

export default connect(
  (state) => ({
    energyConsumption: getEnergyConsumption(state),
    tenantBaseline: getTenantBaseline(state),
    consumptionBaseline: getConsumptionBaseline(state),
  }),
  (dispatch) => ({
  })
)(StatsSidebar)