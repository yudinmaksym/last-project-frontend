import React from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'shards-react'
import MainNavbar from '../components/layout/MainNavbar/MainNavbar'
import MainSidebar from '../components/layout/MainSidebar/MainSidebar'
import MainFooter from '../components/layout/MainFooter'




const DefaultLayout = ({ children, noNavbar, noFooter, noSidebar }) => (
  <Container fluid>
    <Row>
      {!noSidebar && <MainSidebar />}
      <Col
        className="main-content p-0"
        lg={{ size: `${!noSidebar ? 10 : 12}`, offset: `${!noSidebar ? 2 : 0}` }}
        md={{ size: 9, offset: `${!noSidebar ? 3 : 0}` }}
        sm="12"
        tag="main"
      >
        {!noNavbar && <MainNavbar />}
        {children}
        {/* {!noFooter && <MainFooter />} */}
      </Col>
    </Row>
  </Container>
)

DefaultLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool,
}

DefaultLayout.defaultProps = {
  noNavbar: false,
  noFooter: false,
}

export default DefaultLayout
