import * as React from 'react'

import Layout from '../src/layouts/Default'
import Errors from '../src/views/Errors'


class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null
    return { statusCode }
  }

  render() {
    const message =  this.props.statusCode
      ? `An error ${this.props.statusCode} occurred on server`
      : 'An error occurred on client'

    return (
      <Layout>
        <Errors 
          code={this.props.statusCode}
          message={message}
        />
      </Layout>
    )
  }
}

export default Error