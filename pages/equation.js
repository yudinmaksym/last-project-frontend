import * as React from 'react'
import { Container, Button } from 'shards-react'
import Head from 'next/head'

import Layout from '../src/layouts/Default'
import EquationsContainer from '../src/containers/EquationsContainer'


class Equation extends React.Component {


  render() {
   
    return (
      <Layout>
        <Head>
          <title>Equation</title>
        </Head>

        <Container fluid className="main-content-container px-4 pb-4">
          <EquationsContainer />
        </Container>
      </Layout>
    )
  }
}

export default Equation