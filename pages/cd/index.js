import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import { loadProjectsByZone } from '../../redux/reducers/projects'
import { loadProjectInfo } from '../../redux/reducers/cd'
import Layout from '../../src/layouts/Default'
import CDToolContainer from '../../src/containers/CDToolContainer'
import withAuth from '../../lib/authProvider'


class CDToolPage extends React.Component {

  static async getInitialProps(ctx) {
    const { query: { projectId }, reduxStore: { getState, dispatch } } = ctx 
    
    const promises = []

    promises.push(dispatch(loadProjectsByZone()))

    if (projectId) {
      promises.push(dispatch(loadProjectInfo(projectId)))
    }
    
    await Promise.all(promises)
  }


  render() {
    return (
      <Layout noFooter>
        <Head>
          <title>CD tool</title>
        </Head>
        <Container className="container--cd" fluid>
          <CDToolContainer />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(CDToolPage)
