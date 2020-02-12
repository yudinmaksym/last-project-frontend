import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import { SET_SELECTED_COMPANY } from '../../redux/reducers/companies'
import EditCustomerContainer from '../../src/containers/Customers/EditCustomerContainer'
import withAuth from '../../lib/authProvider'


const CreateCustomer = () => {
  return (
    <Layout>
      <Head>
        <title>Create</title>
      </Head>

      <Container fluid className="main-content-container px-4 pb-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Create" subtitle='Create customer'  className="text-sm-left mb-3" />
        </Row>
 
        <EditCustomerContainer isNew={true} />
      </Container>
    </Layout>
  )
} 

CreateCustomer.getInitialProps = async (ctx) => {
  const { reduxStore: { dispatch } } = ctx

  dispatch({ type: SET_SELECTED_COMPANY, payload: {} })

  return { }
}

export default withAuth(CreateCustomer)
