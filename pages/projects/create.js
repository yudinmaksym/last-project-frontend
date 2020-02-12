import * as React from 'react'
import get from 'lodash/get'
import { Container, Row, Col, Card, ButtonGroup, Button } from 'shards-react'
import Head from 'next/head'
import { reset } from 'redux-form'

import Layout from '../../src/layouts/Default'
import PageTitle from '../../src/components/common/PageTitle'
import {
  getListCompanies,
} from '../../redux/reducers/companies'
import withAuth from '../../lib/authProvider'
import ProjectCreateProcessContainer from '../../src/containers/ProjectCreateProcessContainer'
import ConfirmationModal from '../../src/modals/ConfirmationModal'


class Create extends React.Component {
    
  static async getInitialProps(ctx) {
    const { reduxStore: { getState, dispatch } } = ctx

    const promises = []
    promises.push(dispatch(getListCompanies()))

    await Promise.all(promises)

    return {  }
  }

  render() {
    return (
      <>
        <Layout noFooter>
          <Head>
            <title>Create</title>
          </Head>
          <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
              <PageTitle
                title="Create Projects"
                subtitle="Creation" 
                md="12"
                className="ml-sm-auto mr-sm-auto" 
              />
            </Row>
          
            <ProjectCreateProcessContainer />
          </Container>
        </Layout>
        <ConfirmationModal />
      </>
    )
  }

}

export default withAuth(Create)
