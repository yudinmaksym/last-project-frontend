import * as React from 'react'
import Head from 'next/head'

import Layout from '../../src/layouts/Default'
import NoAccessContainer from '../../src/containers/NoAccessContainer'
import withAuth from '../../lib/authProvider'
import DegreeCalculatorContainer from '../../src/containers/DegreeCalculatorContainer'


class DegreeCalculator extends React.Component {
  render() {
    const title = 'Degree Day Calculator'

    return (
      <Layout noFooter>
        <Head>
          <title>{title}</title>
        </Head>

        {!this.props.hasAccess ? (			
          <NoAccessContainer 
            title={`No access to ${title}`}
          />
        ) : (
          <DegreeCalculatorContainer 
            title={title}
          />
        )}
      </Layout>
    )
  }
}

export default withAuth(DegreeCalculator, {
  rules: {
    companies: [ 1 ],
  },
})
