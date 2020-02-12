import * as React from 'react'
import { Container, Button } from 'shards-react'
import Head from 'next/head'

import Layout from '../src/layouts/Default'


class Settings extends React.Component {

  render() {
   
    return (
      <Layout>
        <Head>
          <title>Settings</title>
        </Head>

        <Container fluid className="main-content-container px-4 pb-4">
          <div className="error">
            <div className="error__content">
              <h2>{'Settings'}</h2>
              <p>{'Coming soon...'}</p>
            </div>
          </div>
        </Container>
      </Layout>
    )
  }
}

export default Settings