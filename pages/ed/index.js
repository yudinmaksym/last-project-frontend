import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import PageTitle from '../../src/components/common/PageTitle'
import EDToolContainer from '../../src/containers/EDToolContainer/EDToolContainer'
import withAuth from '../../lib/authProvider'
import {
  load,
  getProjectData,
  loadProjectsByZone,
} from '../../redux/reducers/projects'


const CDToolPage = ({ project, baseline }) => (
  <Layout noFooter>
    <Head>
      <title>ED Tool</title>
    </Head>
    <Container className="container--cd" fluid>
      <Row noGutters className="page-header py-4">
        <PageTitle title={project.name} className="text-sm-left mb-3" subtitle="BASELINE PROFILES" />
      </Row>
      <EDToolContainer project={project} baseline={baseline}/>
    </Container>
  </Layout>
)

CDToolPage.getInitialProps = async (ctx) => {
  const { query, reduxStore: { getState, dispatch } } = ctx
  const promises = []

  if(query.id) {
    promises.push(dispatch(loadProjectsByZone()))
    promises.push(dispatch(load(query.id)))
  } else {
    await dispatch(loadProjectsByZone())
    const state = await getState()
    const { id } = state.projects.byZone[0].projects[0] || {}
    promises.push(dispatch(load(id)))
  }

  await Promise.all(promises)
  const state = await getState()

  const data = getProjectData(state)
  return { 
    project: data.project,
    baseline: data.baseline,
  }
}


export default withAuth(CDToolPage)
