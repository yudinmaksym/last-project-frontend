import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import BenchmarkingContainer from '../../src/containers/BenchmarkingContainer'
import withAuth from '../../lib/authProvider'


class Benchmarking extends React.Component {

  render() {
    return (
      <Layout>
        <Head>
          <title>Benchmarking</title>
        </Head>

        <Container fluid className="main-content-container px-4 pb-4">
          <Row noGutters className="page-header pt-4">
            <PageTitle title="Benchmarking" subtitle="Projects" className="text-sm-left mb-3" />
          </Row>

          <BenchmarkingContainer />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(Benchmarking)
