import Head from 'next/head'

import withAuth from '../../lib/authProvider'
import Layout from '../../src/layouts/Default'
import LobbyDashboardContainer from '../../src/containers/LobbyDashboardContainer';

class LobbyDashboard extends React.Component {
    render() {
      
        const title = `Lobby Dashboard`

        return (
            <div className="lobby">
                <Layout noFooter noNavbar noSidebar>
                    <Head>
                        <title>{title}</title>
                    </Head>


                    <LobbyDashboardContainer />
                </Layout>
            </div>
        )
    }
}

export default withAuth(LobbyDashboard)