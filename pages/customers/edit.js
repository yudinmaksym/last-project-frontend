import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import { loadCompany } from '../../redux/reducers/companies'
import EditCustomerContainer from '../../src/containers/Customers/EditCustomerContainer'
import withAuth from '../../lib/authProvider'


const EditCustomer = ({ name, id }) => {
  return (
    <Layout>
      <Head>
        <title>Edit {name}</title>
      </Head>

      <Container fluid className="main-content-container px-4 pb-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Edit" subtitle={`Company: ${name}`}  className="text-sm-left mb-3" />
        </Row>
 
        <EditCustomerContainer id={id} />
      </Container>
    </Layout>
  )
} 

EditCustomer.getInitialProps = async (ctx) => {
  const { query, reduxStore: { getState, dispatch } } = ctx

  const { id } = query 

  await Promise.all([
    dispatch(loadCompany(id)),
  ])

  const state = await getState()
  const { name } = state.companies.selectedCompany

  return { 
    id,
    name,
  }
}

export default withAuth(EditCustomer)
