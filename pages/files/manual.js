import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import ManualDataInputContainer from '../../src/containers/ManualDataInputContainer'
import withAuth from '../../lib/authProvider'


class Manual extends React.Component {

  render() {
    return (
      <Layout>
        <Head>
          <title>Manual Data Input</title>
        </Head>

        <Container fluid className="main-content-container px-4 pb-4">
          <Row noGutters className="page-header py-4">
            <PageTitle title="Manual Data Input" subtitle="Files" className="text-sm-left mb-3" />
          </Row>


          <ManualDataInputContainer />
   
        </Container>
      </Layout>
    )
  }

}

export default withAuth(Manual)
