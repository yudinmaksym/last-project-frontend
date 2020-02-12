import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import SummaryDashboardContainer from '../../src/containers/SummaryDashboardContainer';

class MDBSummary extends React.Component {
    render() {
      
        const title = `MDB`

        return (
            <Layout noFooter>
                <Head>
                    <title>{title} Summary</title>
                </Head>


                <SummaryDashboardContainer 
                    title={title}
                />
            </Layout>
        )
    }
}

export default withAuth(MDBSummary)
