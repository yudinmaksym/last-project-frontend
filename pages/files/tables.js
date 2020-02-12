import * as React from 'react'
import { Col, Container, Row } from 'shards-react'
import Head from 'next/head'
import { connect } from 'react-redux'
import Router from 'next/router'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import {
  getAll, getItems,
  getPageSize,
} from '../../redux/reducers/tables'
import TablesContianer  from '../../src/containers/TablesContainer'
import withAuth from '../../lib/authProvider'
import ExportCSV  from '../../src/containers/ExportToCSV'


class Tables extends React.Component {

  static async getInitialProps(ctx) {
    const { reduxStore: { getState, dispatch } } = ctx
    const state = getState()
    const pageSize = getPageSize(state)

    const promises = []
    promises.push(dispatch(getAll(pageSize)))

    await Promise.all(promises)

    return {  }
  }

  handleMissingConsumptionClick = () => {
    Router.push('/projects/missingConsumption')
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>Consumptions Table</title>
        </Head>

        <Container fluid className="main-content-container px-4 pb-4">
          <Row noGutters className="page-header py-4">
            <Col className="d-flex" md="6">
              <PageTitle title="Tables" subtitle="Files" className="text-sm-left mb-3" />
            </Col>
            <Col className="d-flex justify-content-end align-items-center" md="6">
              <i className="material-icons" style={{ fontSize: 35,paddingRight: 15, cursor:'pointer' }}
                onClick={this.handleMissingConsumptionClick}>layers_clear</i>
              <ExportCSV fileName='utility_raw_data_dateRange'/>
            </Col>
          </Row>
          <TablesContianer />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(Tables)
