import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import YouBIMContainer from '../../src/containers/YouBIMContainer'

class YouBim extends React.Component {

    render() {
      
        const title = `YouBIM Dashboard`

        return (
            <div>
                <Layout noFooter>
                    <Head>
                        <title>{title}</title>
                    </Head>

                    <YouBIMContainer />
                </Layout>
            </div>
        )
    }
}

export default withAuth(YouBim)
