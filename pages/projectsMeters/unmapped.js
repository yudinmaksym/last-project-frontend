import * as React from 'react'
import { Col, Container, Row } from 'shards-react'
import Head from 'next/head'
import Router from 'next/router'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import {
  loadUnmapped,
} from '../../redux/reducers/meters'
import {
  loadProjectsByZone,
} from '../../redux/reducers/projects'
import UnmappedTable  from '../../src/containers/UnmappedTable'
import withAuth from '../../lib/authProvider'



class UnmappedConsumptionsTable extends React.Component {

  static async getInitialProps(ctx) {
    const { reduxStore: { getState, dispatch } } = ctx
    const state = getState()

    const promises = []
    promises.push(dispatch(loadUnmapped()))
    promises.push(dispatch(loadProjectsByZone()))
    await Promise.all(promises)

    return {  }
  }
  handleBackClick= () => {
    Router.back(-1)
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>Unmapped Meters</title>
        </Head>

        <Container fluid className="main-content-container px-4 pb-4">
          <Row noGutters className="page-header py-4">
            <Col className="file-manager__filters__search d-flex" md="6">
              <PageTitle title="Unmapped" subtitle="Meters" className="text-sm-left mb-3" />
            </Col>
            <Col className="file-manager__filters__search d-flex justify-content-end align-items-center" md="6">
              <i className="material-icons" style={{ color:'gray' }} onClick={this.handleBackClick}>arrow_back</i>
            </Col>
          </Row>

          <UnmappedTable />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(UnmappedConsumptionsTable)
