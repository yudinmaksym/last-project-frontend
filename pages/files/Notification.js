import * as React from 'react'
import { Col, Container, Row , Button, ButtonGroup } from 'shards-react'
import Head from 'next/head'
import Router from 'next/router'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import NotificationTableContianer  from '../../src/containers/NotificationTableContainer'
import NotificationAtProjectLevel from '../../src/containers/NotificationAtProjectLevelContainer'
import withAuth from '../../lib/authProvider'


class Notification extends React.Component {
 state = {
   options : ['Accounts','Projects'],
   selectedTab :Router.router ?( Router.router.query.type ? 'Projects' : 'Accounts'): 'Accounts',
 }

  handleOption = (option) => () => {
    this.setState({
      selectedTab: option,
    })
  }

  handleBackClick = () => {
    Router.back(-1)
  }

  render() {
    const { selectedTab, options } = this.state
    const isActiveOption = (option) => option === selectedTab

    return (
      <Layout>
        <Head>
          <title>Alarm List</title>
        </Head>
        <Container fluid className="main-content-container px-4 pb-4">
          <Row noGutters className="page-header py-4">
            <Col className="d-flex" md="6">
              <PageTitle title={`Alarms List Of ${selectedTab}`} subtitle="List" className="text-sm-left mb-3" />
            </Col>
            <Col className="d-flex justify-content-end align-items-center" md="6">
              <ButtonGroup>
                {options.map(_option => (
                  <Button
                    key={`option_${_option}`}
                    theme={isActiveOption(_option) ? 'primary' : 'white'}
                    onClick={this.handleOption(_option)}
                  >{_option}</Button>
                ))}
              </ButtonGroup>
              {/* eslint-disable-next-line max-len */}
              <i className="material-icons ml-3" style={{ color:'gray',fontSize:25, cursor:'pointer' }} onClick={this.handleBackClick}>arrow_back</i>
            </Col>
          </Row>
          {selectedTab === 'Accounts' ? <NotificationTableContianer /> : <NotificationAtProjectLevel/>}
        </Container>
      </Layout>
    )
  }

}

export default withAuth(Notification)
