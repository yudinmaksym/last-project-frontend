import * as React from 'react'
import {
  Container,
  Row ,
  Col,
  Button,
  Popover, PopoverBody,
} from 'shards-react'
import Head from 'next/head'
import Router from 'next/router'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import {
  initalLoad,
  getPageSize,
  getCurrentPage,
} from '../../redux/reducers/projectsMeters'
import ProjectsMetersContainer from '../../src/containers/ProjectsMetersContainer'
import MeterSearchContainer from '../../src/containers/MeterSearchContainer'
import withAuth from '../../lib/authProvider'


class ProjectsMeterList extends React.Component {

  state = {
    open: false,
  }

  static async getInitialProps(ctx) {
    const { reduxStore: { getState, dispatch } } = ctx
    const state = getState()
    const pageSize = getPageSize(state)
    const page = getCurrentPage(state)

    const promises = []
    promises.push(dispatch(initalLoad(
      pageSize,
      page
    )))

    await Promise.all(promises)

    return {  }
  }

  toggle = (e) => {
    const target = event.target

    // debugger
    if (target.closest('.popover')) {
      return
    }

    this.setState({
      open: !this.state.open,
    })
  }
  handleHeatmapClick = () => {
    Router.push('/heatmap')
  }
  handleUnmappedClick= () => {
    Router.push('/projectsMeters/unmapped')
  }
  render() {
    return (
      <Layout>
        <Head>
          <title>Meters List</title>
        </Head>

        <Container fluid className="main-content-container px-4 pb-4">
          <Row noGutters className="page-header py-4">
            <Col className="file-manager__filters__search d-flex" md="6">
              <PageTitle title="List" subtitle="Meters" className="text-sm-left mb-3" />
            </Col>
            <Col className="file-manager__filters__search d-flex justify-content-end align-items-center" md="6">
              <i className="material-icons" style={{ color:'gray' }} onClick={this.handleUnmappedClick}>layers_clear</i>
              <i className="material-icons" style={{ color:'green' }} onClick={this.handleHeatmapClick}>check_circle</i>
              <Button id="meterDataPopover" onClick={this.toggle}>
                Quick Search
              </Button>
              <Popover
                placement="bottom"
                open={this.state.open}
                toggle={this.toggle}
                target="#meterDataPopover"
                style={{
                  minWidth: '270px',
                }}
              >
                {/* <PopoverHeader>Quick Search</PopoverHeader> */}
                <PopoverBody className="p-0">
                  <MeterSearchContainer />
                </PopoverBody>
              </Popover>
            </Col>
          </Row>

          <ProjectsMetersContainer />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(ProjectsMeterList)
