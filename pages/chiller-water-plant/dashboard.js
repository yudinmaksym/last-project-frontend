import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import ChillerWaterPlantDashboardContainer from '../../src/containers/ChillerWaterPlantDashboardContainer';

class ChillerWaterPlantDashboard extends React.Component {
    render() {
      
        const title = `CHW`

        return (
            <Layout noFooter>
                <Head>
                    <title>{title} Plant</title>
                </Head>


                <ChillerWaterPlantDashboardContainer 
                    title={title}
                />
            </Layout>
        )
    }
}

export default withAuth(ChillerWaterPlantDashboard)
