import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import ChillerDashboardContainer from '../../src/containers/ChillerDashboardContainer';

class ChillerDashboard extends React.Component {
    render() {
      
        const title = `Chiller`

        return (
            <Layout noFooter>
                <Head>
                    <title>{title}</title>
                </Head>


                <ChillerDashboardContainer 
                    title={title}
                />
            </Layout>
        )
    }
}

export default withAuth(ChillerDashboard)
