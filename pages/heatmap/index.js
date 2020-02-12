import * as React from 'react'
import { Container, Row, Col, Card, ButtonGroup, Button } from 'shards-react'
import Head from 'next/head'

import {
  loadProjectsByZone,
} from '../../redux/reducers/projects'
import Layout from '../../src/layouts/Default'
import PageTitle from '../../src/components/common/PageTitle'
import HeatmapContainer from '../../src/containers/HeatmapContainer'
import withAuth from '../../lib/authProvider'


class Heatmap extends React.Component {

  static async getInitialProps(ctx) {
    const { reduxStore: { getState, dispatch } } = ctx
    const pageSize = 9999

    const promises = []
    promises.push(dispatch(loadProjectsByZone()))

    await Promise.all(promises)

    return {  }
  }

  render() {
    return (
      <Layout noFooter>
        <Head>
          <title>Heatmap</title>
        </Head>
        <Container>
          <Row noGutters className="page-header py-4">
            <PageTitle title="Heatmap" subtitle="Values" className="text-sm-left mb-3" />
          </Row>

          <HeatmapContainer />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(Heatmap)
