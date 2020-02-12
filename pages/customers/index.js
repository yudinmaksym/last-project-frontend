import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import {
  getListCompanies,
} from '../../redux/reducers/companies'
import CustomersListContainer from '../../src/containers/Customers/CustomersListContainer'
import Link from '../../src/components/common/Link'
import withAuth from '../../lib/authProvider'


const CustomersList = () => {
  return (
    <Layout>
      <Head>
        <title>Manage Customers</title>
      </Head>

      <Container fluid className="main-content-container px-4 pb-4">
        <Row noGutters className="page-header py-4 d-flex justify-content-between">
          <PageTitle title="Manage Customers" subtitle="Manage Customers" className="text-sm-left mb-3" />
          <Link className='btn btn-white d-flex align-items-center' to='/customers/create'>Create Customer</Link>
        </Row>
 
        <CustomersListContainer />
      </Container>
    </Layout>
  )
} 

CustomersList.getInitialProps = async (ctx) => {
  const { reduxStore: { dispatch } } = ctx

  const promises = []
  promises.push(dispatch(getListCompanies()))

  await Promise.all(promises)
}

export default withAuth(CustomersList)
