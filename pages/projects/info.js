import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import {
  loadInfoSet,
} from '../../redux/reducers/projects'
import ProjectsInfoContainer from '../../src/containers/ProjectsInfoContainer'
import withAuth from '../../lib/authProvider'


class ProjectsInfo extends React.Component {


  static async getInitialProps(ctx) {
    const { reduxStore: { dispatch, getState } } = ctx

    const { users: { currentUser } } = getState()
    const promises = []
    promises.push(dispatch(loadInfoSet([ currentUser.companyId ])))

    await Promise.all(promises)

    return {  }
  }


  render() {
    return (
      <Layout>
        <Head>
          <title>Info</title>
        </Head>

        <Container fluid className="main-content-container px-4 pb-4">
          <Row noGutters className="page-header py-4">
            <PageTitle title="Info" subtitle="Projects" className="text-sm-left mb-3" />
          </Row>
   
          <ProjectsInfoContainer />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(ProjectsInfo)