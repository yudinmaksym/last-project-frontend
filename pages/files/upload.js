import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import GeneralUploadContainer from '../../src/containers/GeneralUploadContainer'
import { initalLoad, loadAll, loadProjectsByZone } from '../../redux/reducers/projects'
import withAuth from '../../lib/authProvider'


class Upload extends React.Component {
  static async getInitialProps(ctx) {
    const {
      reduxStore: { getState, dispatch },
    } = ctx
    const pageSize = 9999

    const promises = []
    promises.push(dispatch(initalLoad(pageSize)))
    promises.push(dispatch(loadAll(pageSize)))
    promises.push(dispatch(loadProjectsByZone()))


    await Promise.all(promises)

    return {}
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>Upload File</title>
        </Head>

        <Container fluid className="main-content-container px-4 pb-4">
          {/* Page Header */}
          <Row noGutters className="page-header py-4">
            <PageTitle
              title="Upload"
              subtitle="Files"
              className="text-sm-left mb-3"
            />
          </Row>

          <GeneralUploadContainer />
        </Container>
      </Layout>
    )
  }
}

export default withAuth(Upload)
