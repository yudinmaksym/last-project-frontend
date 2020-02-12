import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import withAuth from '../../lib/authProvider'
import { loadProjectsByZone } from '../../redux/reducers/projects'
import { loadZonesGroup } from '../../redux/reducers/zones'
import Layout from '../../src/layouts/Default'
import ReportsContainer from '../../src/containers/ReportsContainer'
import PageTitle from '../../src/components/common/PageTitle'


class Reports extends React.Component {
  
  static async getInitialProps(ctx) {
    const { query, reduxStore: { getState, dispatch } } = ctx
    
    const promises = []

    promises.push(dispatch(loadProjectsByZone()))
    promises.push(dispatch(loadZonesGroup()))

    await Promise.all(promises)

    return {

    }
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>Reports</title>
        </Head>
  
        <Container fluid className="main-content-container px-4 pb-4">
          <Row noGutters className="page-header py-4">
            <PageTitle title="Reports" className="text-sm-left mb-3" />
          </Row>
       
          <ReportsContainer />
        </Container>
      </Layout>
    )
  }
}

export default withAuth(Reports)