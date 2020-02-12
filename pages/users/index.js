import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'
import { get } from 'lodash'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import {
  loadListUsers,
  getPageSize,
} from '../../redux/reducers/users'
import UsersContainer from '../../src/containers/UsersContainer'
import Link from '../../src/components/common/Link'
import withAuth from '../../lib/authProvider'


const ProjectList = ({ showLink }) => {
  
  return (
    <Layout>
      <Head>
        <title>Manage Users</title>
      </Head>

      <Container fluid className="main-content-container px-4 pb-4">
        <Row noGutters className="page-header py-4 d-flex justify-content-between">
          <PageTitle title="Manage Users" subtitle="Manage Users" className="text-sm-left mb-3" />
          { showLink
            && <Link className='btn btn-white d-flex align-items-center' to='/users/create'>Create User</Link>
          }
        </Row>
 
        <UsersContainer />
      </Container>
    </Layout>
  )
} 

ProjectList.getInitialProps = async (ctx) => {
  const { reduxStore: { getState, dispatch } } = ctx
  const state = getState()
  const pageSize = getPageSize(state)

  const promises = []
  promises.push(dispatch(loadListUsers(pageSize)))

  await Promise.all(promises)
  const adminRoles = ['TakaAdmin', 'Admin']
  const showLink = adminRoles.includes(get(state, 'users.currentUser.role', ''))

  return { showLink }
}

export default withAuth(ProjectList)
