import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import Layout from '../src/layouts/Default'
import PageTitle from '../src/components/common/PageTitle'
import InfoContainer from '../src/containers/InfoContainer'
import withAuth from '../lib/authProvider'


class Info extends React.Component {
  render() {
    return (
      <Layout noFooter>
        <Head>
          <title>Welcome</title>
        </Head>
        <Container>
          <Row noGutters className="page-header py-4">
            <PageTitle title="" className="text-sm-left mb-3" />
          </Row>
          
          <InfoContainer />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(Info)
