import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import FcuDashboardContainer from '../../src/containers/FcuDashboardContainer';

class FcuDashboard extends React.Component {
    render() {
      
        const title = `FCU`

        return (
            <Layout noFooter>
                <Head>
                    <title>{title}</title>
                </Head>

                <FcuDashboardContainer 
                    title={title}
                />
            </Layout>
        )
    }
}

export default withAuth(FcuDashboard)
