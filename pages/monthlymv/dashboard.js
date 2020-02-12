import * as React from 'react'
import { Container, Row, Col, Card, ButtonGroup, Button } from 'shards-react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import {
  getProject,
  getMonth,
  getYear,
} from '../../redux/reducers/monthlymv'
import MonthlyMVContainer from '../../src/containers/MonthlyMVContainer'
import withAuth from '../../lib/authProvider'


class MonthlyMV extends React.Component {
    
  static async getInitialProps(ctx) {
    const { reduxStore: { getState, dispatch }, query } = ctx
    let state = getState()

    const project = getProject(state)
    const month = getMonth(state)
    const year = getYear(state)

    const promises = []



    await Promise.all(promises)

    return { 
      name: project && project.name,
      month,
      year,
    }
  }

  render() {
    const {
      name,
      month,
      year, 
    } = this.props

    return (
      <Layout noFooter>
        <Head>
          <title>Monthly M&V Dashboard</title>
        </Head>
        <Container className="mw-100">
          <Row noGutters className="page-header py-4">
            <Col xs="6" sm="6" className="text-sm-left">
              <h3 className="page-title">{name}</h3>
              <span className="text-uppercase page-subtitle">{'Monthly M&V'}</span>
            </Col>
            <Col xs="6" sm="6" className="text-sm-right">
              <h3 className="page-title">{month} {year}</h3>
            </Col>
          </Row>

          <MonthlyMVContainer />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(MonthlyMV)