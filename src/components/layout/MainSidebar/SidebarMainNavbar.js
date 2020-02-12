import React from 'react'
import PropTypes from 'prop-types'
import { Navbar, NavbarBrand } from 'shards-react'
import { connect } from 'react-redux'

// import { Dispatcher, Constants } from "../../../flux";

class SidebarMainNavbar extends React.Component {
  constructor(props) {
    super(props)

    this.handleToggleSidebar = this.handleToggleSidebar.bind(this)
  }

  handleToggleSidebar() {
    // Dispatcher.dispatch({
    //   actionType: Constants.TOGGLE_SIDEBAR
    // });
  }

  render() {
    const { hideLogoText, company } = this.props
    return (
      <div className="main-navbar">
        <Navbar
          className="align-items-stretch bg-white flex-md-nowrap border-bottom p-0"
          type="light"
        >
          <NavbarBrand
            className="w-100 mr-0 p-1"
            href="/"
          >
            <div className="d-flex justify-content-center aling-items-center w-100">
              <img
                id="main-logo"
                className="d-inline-block align-top mr-1 h-100"
                src={company.logo || '/img/logo.jpg'}
                alt="Dashboard"
              />
            </div>
          </NavbarBrand>
          {/* eslint-disable-next-line */}
          <a
            className="toggle-sidebar d-sm-inline d-md-none d-lg-none"
            onClick={this.handleToggleSidebar}
          >
            <i className="material-icons">&#xE5C4;</i>
          </a>
        </Navbar>
      </div>
    )
  }
}

SidebarMainNavbar.propTypes = {
  /**
   * Whether to hide the logo text, or not.
   */
  hideLogoText: PropTypes.bool,
}

SidebarMainNavbar.defaultProps = {
  hideLogoText: false,
}

export default connect(
  ({ companies }) => ({
    company: companies.currentCompany
  })
)(SidebarMainNavbar)
