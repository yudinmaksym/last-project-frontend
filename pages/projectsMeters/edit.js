import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import {
  load,
} from '../../redux/reducers/projectsMeters'
import EditProjectMeterContainer from '../../src/containers/EditProjectMeterContainer'
import withAuth from '../../lib/authProvider'


class EditProjectMeter extends React.Component {

  static async getInitialProps(ctx) {
    const { query, reduxStore: { getState, dispatch } } = ctx
    const { id } = query 

    const promises = []
    promises.push(dispatch(load(id)))

    await Promise.all(promises)

    const state = await getState()

    return { 
      id,
    }
  }


  render() {
    return (
      <Layout>
        <Head>
          <title>Edit</title>
        </Head>

        <Container fluid className="main-content-container px-4 pb-4">
          <Row noGutters className="page-header py-4">
            <PageTitle title="Edit" subtitle="Project Meter" className="text-sm-left mb-3" />
          </Row>
   
          <EditProjectMeterContainer 
            id={this.props.id}
          />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(EditProjectMeter)
