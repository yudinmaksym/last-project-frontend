import * as React from 'react'
import {
  Container,
  Row ,
  Col,
  Button,
  Popover, PopoverBody,
} from 'shards-react'
import Head from 'next/head'
import moment from 'moment'
import Router from 'next/router'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import {
  initalLoad,
  getPageSize,
  getCurrentPage,
} from '../../redux/reducers/missingConsumption'
import MissingConsumptionContainer from '../../src/containers/MissingConsumptionContainer'
import MeterSearchContainer from '../../src/containers/MeterSearchContainer'
import withAuth from '../../lib/authProvider'


class MissingConsumption extends React.Component {

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

    if (target.closest('.popover')) {
      return
    }

    this.setState({
      open: !this.state.open,
    })
  }

  handleBackClick= () => {
    Router.back(-1)
  }


  render() {
    return (
      <Layout>
        <Head>
          <title>Missing Consumption List</title>
        </Head>

        <Container fluid className="main-content-container px-4 pb-4">
          <Row noGutters className="page-header py-4">
            <Col className="file-manager__filters__search d-flex" md="6">
              <PageTitle title="Missing Consumption" month={moment().startOf('month').subtract(1, 'month').format('MMMM YYYY')} subtitle="Meters" className="text-sm-left mb-3" />
            </Col>
            <Col className="file-manager__filters__search d-flex justify-content-end align-items-center" md="6">
              <i className="material-icons" style={{ color:'gray' }} onClick={this.handleBackClick}>arrow_back</i>
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
                <PopoverBody className="p-0">
                  <MeterSearchContainer page='missingConsumptionData'/>
                </PopoverBody>
              </Popover>
            </Col>
          </Row>

          <MissingConsumptionContainer />
        </Container>
      </Layout>
    )
  }

}

export default withAuth(MissingConsumption)
