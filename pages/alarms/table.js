import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import AlarmsTableContainer from '../../src/containers/AlarmsTableContainer'


class AlarmsTable extends React.Component {
  render() {
    const title='Alarms'
    return (
      <Layout noFooter>
        <Head>
          <title>{title}</title>
        </Head>
        <AlarmsTableContainer />
      </Layout>
    )
  }
}

export default withAuth(AlarmsTable)