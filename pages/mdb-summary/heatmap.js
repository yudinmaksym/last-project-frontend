import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import SummaryHeatMapContainer from '../../src/containers/SummaryHeatMapContainer';

class MDBHeatmap extends React.Component {
    render() {
      
        const title = `MDB Consumption Heatmap`

        return (
            <Layout noFooter>
                <Head>
                    <title>{title}</title>
                </Head>


                <SummaryHeatMapContainer 
                    title={title}
                />
            </Layout>
        )
    }
}

export default withAuth(MDBHeatmap)
