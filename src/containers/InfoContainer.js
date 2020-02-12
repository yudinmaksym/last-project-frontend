import React from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Badge,
  Button,
} from 'shards-react'

import Link from '../components/common/Link'


const QUICK_LINKS = [
  {
    title: 'Utility Manager Tool',
    to: '/portfolio/dashboard',
    icon: 'insert_chart_outlined',
  },
  {
    title: 'Energy Monitoring',
    to: '/portfolio/performance',
    icon: 'today',
  },  
]

const FIXED_LINKS = [
  {
    title: 'Create Project',
    to: '/projects/create',
    icon: 'add_to_photos',
  },
  {
    title: 'Input Invoice',
    to: '/files/upload',
    icon: 'cloud_upload',
  },
]

const renderQuickLink = (link, idx) => (
  <Col lg="6" md="6" sm="12" className="mb-4" key={idx}>
    <Card small className="card-quick_link h-100">
      <Link to={link.to}>
        <>
          <CardHeader className="text-center">
            <div
              className="card-quick_link__icon"
            >
              <i className="material-icons">{link.icon}</i>
            </div>
          </CardHeader>
          <CardBody className="border-top text-center">
            <h5 className="card-quick_link__title text-fiord-blue">
              {link.title}
            </h5>
          </CardBody>
        </>
      </Link>
    </Card>
  </Col>
)

export default () => {
  return (
    <>
      <Container fluid className="main-content-container welcome-screen px-4 pb-4 container-fluid">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <i className="material-icons page-header__icon">apartment</i>
          <h3 className="page-header__title">Get started</h3>
          {/* <p className="page-header__message">Welcome to TakaSolution building benchmarking tool.</p> */}
        </Row>

        <Row className="welcome-screen__links">
          {QUICK_LINKS.map(renderQuickLink)}
        </Row>

        <Row className="welcome-screen__links">
          {FIXED_LINKS.map(renderQuickLink)}
        </Row>
      </Container>
    </>
  )
}
