import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import PortfolioDashboardContainer from '../../src/containers/PortfolioDashboardContainer'


class PortfolioDashboard extends React.Component {
  render() {
    const title = 'Portfolio Dashboard'
    return (
      <div>
        <Layout noFooter>
          <Head>
            <title>{title}</title>
          </Head>

          <PortfolioDashboardContainer title={title} />
        </Layout>
      </div>
    )
  }
}

export default withAuth(PortfolioDashboard)
