import * as React from 'react'
import Head from 'next/head'
import Router from 'next/router'

import Link from '../../src/components/common/Link'
import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import NoAccessContainer from '../../src/containers/NoAccessContainer'
import PortfolioPerformanceContainer from '../../src/containers/PortfolioPerformanceContainer'
import WeatherIcon from '../../src/images/portfolio-dashboard/cloud.svg'


class PortfolioPerformance extends React.Component {

togglePage = (event) => {
  const value = event.target.value

  switch(value) {
  case 'Dashboard' : {
    return Router.push({ pathname: '/portfolio/dashboard' })
  }
  case 'Summary' : {
    return Router.push({ pathname: '/daily/dashboard' })
  }
  default: return null
  }
}

render() {
  const title = 'Portfolio Performance'
  return (
    <div>
      <Layout noFooter>
        <Head>
          <title>{title}</title>
        </Head>

        {!this.props.hasAccess ? (			
          <NoAccessContainer 
            title={`No access to ${title}`}
          />
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-between mt-3">
            <h3 className="ml-3">{title}</h3>
            <div className="d-flex align-items-center">
              <Link to={"/weather/dashboard"}>
                <img src={WeatherIcon} alt="weather" width="40" title="Weather" />
              </Link>
              <select
                className="form-control mx-3"
                onChange={e => this.togglePage(e)}
              >
                <option value="Performance">Portfolio Performance</option>
                <option value="Dashboard">Portfolio Dashboard</option>
                <option value="Summary">Project Summary</option>
              </select>
            </div>
          </div>
          <PortfolioPerformanceContainer />
          </>
        )}
      </Layout>
    </div>
  )
}
}

export default withAuth(PortfolioPerformance, {
  rules: {
    companies: [ 1 ],
  },
})
