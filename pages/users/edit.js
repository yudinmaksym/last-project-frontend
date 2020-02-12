import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'
import Router from 'next/router'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import { loadUser, getSelectedUser } from '../../redux/reducers/users'
import { loadAll } from '../../redux/reducers/projects'
import EditUserContainer from '../../src/containers/EditUserContainer'
import withAuth from '../../lib/authProvider'


const EditUserProfile = ({ Name, id }) => {
  return (
    <Layout>
      <Head>
        <title>Edit {Name}</title>
      </Head>

      <Container fluid className="main-content-container px-4 pb-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Edit" subtitle="Users" className="text-sm-left mb-3" />
        </Row>
 
        <EditUserContainer id={id} />
      </Container>
    </Layout>
  )
} 

EditUserProfile.getInitialProps = async (ctx) => {
  const { query, reduxStore: { getState, dispatch } } = ctx

  const { id } = query 

  await Promise.all([
    dispatch(loadUser(id)),
    dispatch(loadAll(100)),
  ])

  const state = await getState()
  const data = getSelectedUser(state)

  return { 
    id,
    Name: data && data.name,
  }
}

export default withAuth(EditUserProfile)
