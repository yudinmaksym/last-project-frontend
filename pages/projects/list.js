import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import {
  initalLoad,
  getPageSize,
} from '../../redux/reducers/projects'
import ProjectsContainer from '../../src/containers/ProjectsContainer'
import withAuth from '../../lib/authProvider'


class ProjectList extends React.Component {


  static async getInitialProps(ctx) {
    const { reduxStore: { getState, dispatch } } = ctx
    const state = getState()
    const pageSize = getPageSize(state)

    const promises = []
    promises.push(dispatch(initalLoad(pageSize)))

    await Promise.all(promises)

    return {  }
  }


  render() {
    return (
      <Layout>
        <Head>
          <title>List</title>
        </Head>

        <Container fluid className="main-content-container px-4 pb-4">
          <Row noGutters className="page-header py-4">
            <PageTitle title="List" subtitle="Projects" className="text-sm-left mb-3" />
          </Row>
   
          <ProjectsContainer />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(ProjectList)