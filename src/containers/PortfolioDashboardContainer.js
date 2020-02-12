import React from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'shards-react'
import moment from 'moment'

import {
  loadAllData,
  loadAllProjects,

  getProjectList,
  getSelectedData,
} from '../../redux/reducers/portfolioDashboard'
import {
  formatInfluxData,
  splitDataOnArrays,
  splitDataForLinechart,
} from '../utils/format'
import PortfolioCharts from '../components/portfolioDashboard/portfolioCharts'
import StatsSidebar from '../components/portfolioDashboard/StatsSidebar'
import TopFilter from '../components/portfolioDashboard/TopFilter'
import BuildingsSelect from '../components/zones/BuildingsSelect'


class PortfolioDashboardContainer extends React.Component {

  componentDidMount() {
    const startDate = moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD')
    const endDate = moment().format('YYYY-MM-DD')
    this.props.loadAllProjects(startDate, endDate)
  }

  formatTenantData = (energyConsumption, tenantBaseline) => {
    const filteredCons = formatInfluxData(energyConsumption)
    const splitedCons = splitDataOnArrays(filteredCons)
    const finalData = []
    splitedCons.map(res => {
      if(res.data.length !== 0) {
        res.data.map((r,index) => {
          finalData[index] = ( finalData[index] || 0 ) + Number(r.y.toFixed(0))
        })
      }
    })
    tenantBaseline.map(tenant => {
      tenant.result.map((res,index) => {
        finalData[index] = finalData[index] - Number(res.value.toFixed(0))
      })
    })

    return finalData
  }

  formatDailyData = (data) => {
    const finalData = []
    data.map(res => {
      if(res.result.length !== 0) {
        res.result.map((result,index) => {
          finalData[index] = ( finalData[index] || 0 ) + Number(result.value.toFixed(0))
        })
      }
    })

    return finalData
  }

  formatBuildingSavings = (energyConsumption, tenantBaseline, consumptionBaseline) => {
    const tenantBaselineData = this.formatTenantData(energyConsumption, tenantBaseline)
    const consump = this.formatDailyData(consumptionBaseline)
    let subtractData = []
    consump.forEach((el, index) => {
      if(tenantBaselineData[index] < 0) {
        subtractData.push( Number((consump[index] - consump[index]).toFixed(2)) )
      } else {
        subtractData.push( Number((consump[index] - tenantBaselineData[index]).toFixed(2)) )
      }
    })
    return subtractData
  }

  render() {
    const { title } = this.props
    return (
      <>
        <TopFilter 
          title={title}
        />
        <Container fluid style={{ marginTop: 150 }}>
          <Row className="mx-0">
            <Col lg="12">
              <StatsSidebar
                formatTenantData={(cons, tenant) => this.formatTenantData(cons, tenant)}
                formatBuildingSavings={(cons, tenant, baseline) => this.formatBuildingSavings(cons, tenant, baseline)}
                formatDailyData={(data) => this.formatDailyData(data)}
              />
            </Col>
            <Col lg="12" className="mt-4 portfolio_table">
              <PortfolioCharts
                formatTenantData={(cons, tenant) => this.formatTenantData(cons, tenant)}
                formatBuildingSavings={(cons, tenant, baseline) => this.formatBuildingSavings(cons, tenant, baseline)}
                formatDailyData={(data) => this.formatDailyData(data)}
              />
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}



export default connect(
  (state) => ({
    projects: getProjectList(state),
    selectedData: getSelectedData(state),
  }),
  (dispatch) => ({
    loadAllProjects: (start, end, projects) => dispatch(loadAllProjects(start, end, projects)),
    loadAllData: (start, end, projectList) => dispatch(loadAllData(start, end, projectList)),
  })
)(PortfolioDashboardContainer)
