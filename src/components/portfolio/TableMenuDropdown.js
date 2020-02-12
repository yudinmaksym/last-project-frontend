import React from 'react'
import {connect} from 'react-redux'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'shards-react'

import Router from 'next/router'
import ShowOnMap from '../../images/portfolio-dashboard/map-location-fold-paper-geolocation-position.svg'
import GoToDashboard from '../../images/portfolio-dashboard/grid-45.svg'
import GoToYouBIM from '../../images/portfolio-dashboard/wifi.svg'
import GoToControls from '../../images/portfolio-dashboard/preferences.svg'
import Menu from '../../images/portfolio-dashboard/menu.svg'
import { saveSelectedProject } from '../../../redux/reducers/temporaryDaily'

var moment = require('moment')

class TableManuDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)

    this.state = {
      dropdown1: false,
    }
  }

  toggle(which) {
    const newState = { ...this.state }
    newState[which] = !this.state[which]
    this.setState(newState)
  }

  handleRedirectToDashboard = () => {
    this.props.saveSelectedProject(this.props.project,
      this.props.projectId,
      this.props.region,
      this.props.cdd,
      this.props.category
    )

    Router.push({
      pathname: '/daily/dashboard',
      query: {
        project: this.props.project,
        projectId: this.props.projectId,
        region: this.props.region,
        cdd: this.props.cdd,
        category: this.props.category,
        start: moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD'),
      },
    })
  }

  handleRedirectToIframe = () => {
    Router.push({
      pathname: '/youBim',
      query: {
        url: this.props.youbim,
        id: this.props.projectId
      },
    })
  }

  handleRedirectToControlIframe = () => {
    Router.push({
      pathname: '/youBim',
      query: {
        url: 'http://52.41.129.113/login',
      },
    })
  }

  render() {

    return (
      <div style={{position: 'relative'}}>
        <Dropdown
          open={this.state.dropdown1}
          toggle={() => this.toggle('dropdown1')}
          addonType="append"
          className="portfolio_table_menu"
        >
          <DropdownToggle className="portfolio_table_menu-drp">
            <img src={Menu} width="14" />
          </DropdownToggle>
          <DropdownMenu small right>
            <DropdownItem>
              <img src={ShowOnMap} width="15" className="mr-3" />
              Show on map
            </DropdownItem>
            <DropdownItem onClick={this.handleRedirectToDashboard}>
              <img src={GoToDashboard} width="15" className="mr-3" />
              Go To Dashboard
            </DropdownItem>
            <DropdownItem onClick={this.handleRedirectToIframe}>
              <img src={GoToYouBIM} width="15" className="mr-3 youBIM" />
              Go to YouBIM
            </DropdownItem>
            <DropdownItem onClick={this.handleRedirectToControlIframe}>
              <img src={GoToControls} width="15" className="mr-3" />
              Go to Controls
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    )
  }
}

export default connect(
  (state) => ({
  }),
  (dispatch) => ({
    saveSelectedProject: (project, projectId, region, cdd) => dispatch(saveSelectedProject(project, projectId, region, cdd))
  })
)(TableManuDropdown)
