import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import DailyDashboardContainer from '../../src/containers/DailyDashboardContainer'


class DailyDashboard extends React.Component {
  render() {
    const title='Project'
    return (
      <Layout noFooter>
        <Head>
          <title>{title} Summary</title>
        </Head>
        <DailyDashboardContainer 
          title={title}
        />
      </Layout>
    )
  }
}

export default withAuth(DailyDashboard)