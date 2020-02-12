import * as React from 'react'
import { Container, Row, Col, Card, ButtonGroup, Button } from 'shards-react'
import Head from 'next/head'

import {
  loadPortfolioInfo,
  loadConsumptionFuel,
  loadCostPerFuel,
  loadConsumptionZoneFuel,
  loadYearsZoneConsumption,
  loadConsumptionByZone,
  loadConsumptions,
  
  getPortfolioInfo,
  getConsumptionZoneFuelRange,
  getConsumptionFuelRange,

  getCostPerFuelRange,
  setCostPerFuelRange,
  setConsumptionFuelRange,
  setConsumptionZoneFuelRange,

  getConsumptionByZoneRange,
  getConsumptionByZoneType,
  getConsumptionsRange,

  loadPortfolioConsumptionByYears,
} from '../../redux/reducers/metrics'
import Layout from '../../src/layouts/Default'
import PageTitle from '../../src/components/common/PageTitle'
import PortfolioMetricsContainer from '../../src/containers/PortfolioMetricsContainer'
import withAuth from '../../lib/authProvider'


class Portfolio extends React.Component {
    
  static async getInitialProps(ctx) {
    const { reduxStore: { getState, dispatch }, query } = ctx
    let state = getState()

    const { range = 6 } = query

    dispatch(setCostPerFuelRange(range))
    dispatch(setConsumptionFuelRange(range))
    dispatch(setConsumptionZoneFuelRange(range))


    await dispatch(loadPortfolioInfo())
    state = getState()

    const promises = []

    const consumptionFuelRange = getConsumptionFuelRange(state)
    promises.push(dispatch(
      loadConsumptionFuel(
        consumptionFuelRange,
        'EnergyPerFuel'
      )
    ))

    const consumptionZoneFuelRange = getConsumptionZoneFuelRange(state)
    promises.push(dispatch(
      loadConsumptionZoneFuel(
        consumptionZoneFuelRange
      )
    ))

    const costPerFuelRange = getCostPerFuelRange(state)
    promises.push(dispatch(
      loadCostPerFuel(
        costPerFuelRange
      )
    ))

    promises.push(dispatch(
      loadYearsZoneConsumption()
    ))

    const zoneIds = getPortfolioInfo(state).zones.map(_z => _z.id)
    promises.push(dispatch(
      loadPortfolioConsumptionByYears(
        zoneIds
      )
    ))

    const consumptionByZoneRange = getConsumptionByZoneRange(state)
    const consumptionByZoneType = getConsumptionByZoneType(state)
    promises.push(dispatch(
      loadConsumptionByZone(
        consumptionByZoneType,
        consumptionByZoneRange
      )
    ))


    const consumptionsRange = getConsumptionsRange(state)
    promises.push(dispatch(
      loadConsumptions(consumptionsRange)
    ))

    const companyName = state.companies.currentCompany.name

    await Promise.all(promises)

    return { companyName }
  }

  render() {
    return (
      <Layout noFooter>
        <Head>
          <title>{this.props.companyName} Portfolio</title>
        </Head>
        <Container className="mw-100">
          <Row noGutters className="page-header py-4">
            <PageTitle title={`${this.props.companyName} Portfolio`} className="text-sm-left mb-3" />
          </Row>

          <PortfolioMetricsContainer />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(Portfolio)