import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import FahuDashboardContainer from '../../src/containers/FahuDashboardContainer';

class FahuDashboard extends React.Component {
    render() {
      
        const title = `FAHU`

        return (
            <Layout noFooter>
                <Head>
                    <title>{title}</title>
                </Head>


                <FahuDashboardContainer 
                    title={title}
                />
            </Layout>
        )
    }
}

export default withAuth(FahuDashboard)
