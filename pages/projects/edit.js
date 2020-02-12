import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'
import { reset } from 'redux-form'
import get from 'lodash/get'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import {
  load,
  getProjectData,
} from '../../redux/reducers/projects'
import {
  getListCompanies,
} from '../../redux/reducers/companies'
import {
  loadZonesGroup,
} from '../../redux/reducers/zones'
import EditProjectContainer from '../../src/containers/EditProjectContainer'
import withAuth from '../../lib/authProvider'
import { FORM_KEY } from '../../src/forms/projects/ProjectZoneSelectForm'
import ConfirmationModal from '../../src/modals/ConfirmationModal'


class ProjectList extends React.Component {

  static async getInitialProps(ctx) {
    const { query, reduxStore: { getState, dispatch } } = ctx
    const { id, tab } = query 
    const state = await getState()
    const promises = []
    // promises.push(dispatch(reset(FORM_KEY)))
    promises.push(dispatch(load(id)))
    promises.push(dispatch(loadZonesGroup()))
    promises.push(dispatch(getListCompanies(100)))
    await Promise.all(promises)

    const data = getProjectData(state)

    return { 
      tab,
      id,
      Name: data && data.Name,
    }
  }


  render() {
    return (
      <>
        <Layout>
          <Head>
            <title>Edit {this.props.Name}</title>
          </Head>

          <Container fluid className="main-content-container px-4 pb-4">
            <Row noGutters className="page-header py-4">
              <PageTitle title="Edit" subtitle="Projects" className="text-sm-left mb-3" />
            </Row>
   
            <EditProjectContainer id={this.props.id} tab={this.props.tab} />
          </Container>
        </Layout>
        <ConfirmationModal />
      </>
    )
  }

}

export default withAuth(ProjectList)
