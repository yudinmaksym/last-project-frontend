import * as React from 'react'
import { Container, Row, Col, Card, ButtonGroup, Button } from 'shards-react'
import Head from 'next/head'

import Layout from '../src/layouts/Default'
import PageTitle from '../src/components/common/PageTitle'
import {
  loadProjectsTotal,
  loadMetersTotal,
  loadBillsTotal,
  loadMapPins,
  loadMetersPerMonth,
  getMetersPerMonthRange,
} from '../redux/reducers/metrics'
import HomeMetricsContainer from '../src/containers/HomeMetricsContainer'
import withAuth from '../lib/authProvider'
 

class Home extends React.Component {
    
  static async getInitialProps(ctx) {
    const { reduxStore: { getState, dispatch } } = ctx
    const state = getState()

    const promises = []

    promises.push(dispatch(loadProjectsTotal()))
    promises.push(dispatch(loadMetersTotal()))
    promises.push(dispatch(loadBillsTotal()))
    promises.push(dispatch(loadMapPins()))
    
    const metersPerMonthRange = getMetersPerMonthRange(state)
    promises.push(dispatch(
      loadMetersPerMonth(metersPerMonthRange)
    ))

    await Promise.all(promises)

    return {  }
  }

  render() {
    return (
      <Layout noFooter>
        <Head>
          <title>Home</title>
        </Head>
        <Container>
          <Row noGutters className="page-header py-4">
            <PageTitle title="Home" className="text-sm-left mb-3" />
          </Row>
          
          <HomeMetricsContainer />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(Home)
