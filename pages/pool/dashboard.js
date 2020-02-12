import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import PoolDashboardContainer from '../../src/containers/PoolDashboardContainer'


class PoolDashboard extends React.Component {
  render() {
    const title='Pool Dashboard'
    return (
      <Layout noFooter>
        <Head>
          <title>{title}</title>
        </Head>
        <PoolDashboardContainer 
          title={title}
        />
      </Layout>
    )
  }
}

export default withAuth(PoolDashboard)