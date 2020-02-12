import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import {
  SET_SELECTED_USER,
} from '../../redux/reducers/users'
import {
  loadAll,
} from '../../redux/reducers/projects'
import EditUserContainer from '../../src/containers/TakaEditUserContainer'
import withAuth from '../../lib/authProvider'


const CreateUserContainer = () => {
  return (
    <Layout>
      <Head>
        <title>Create</title>
      </Head>
  
      <Container fluid className="main-content-container px-4 pb-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Create" subtitle="Users" className="text-sm-left mb-3" />
        </Row>
     
        <EditUserContainer isNew={true} />
      </Container>
    </Layout>
  )
} 

CreateUserContainer.getInitialProps = async (ctx) => {
  const { reduxStore: { dispatch } } = ctx
  dispatch({ type: SET_SELECTED_USER, payload: { } })
  await dispatch(loadAll(100))
     
  return {}
}

export default withAuth(CreateUserContainer)

