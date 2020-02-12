import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import HotWaterPlantDashboardContainer from '../../src/containers/HotWaterPlantDashboardContainer';

class HWPDashboard extends React.Component {
    render() {
      
        const title = `HWP`

        return (
            <Layout noFooter>
                <Head>
                    <title>{title}</title>
                </Head>


                <HotWaterPlantDashboardContainer 
                    title={title}
                />
            </Layout>
        )
    }
}

export default withAuth(HWPDashboard)
