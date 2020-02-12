import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import WeatherDashboardContainer from '../../src/containers/WeatherDashboardContainer'


class PortfolioDashboard extends React.Component {
    render() {
      
        const title = `Weather Dashboard`

        return (
            <div>
                <Layout noFooter>
                    <Head>
                        <title>{title}</title>
                    </Head>

                    <WeatherDashboardContainer />
                    
                </Layout>
            </div>
        )
    }
}

export default withAuth(PortfolioDashboard)
