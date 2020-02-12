import App from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'

import "bootstrap/scss/bootstrap.scss";
import '../src/assets/main.scss';

import withReduxStore from '../lib/with-redux-store'
import ToastrAlert from '../src/alerts/alert'
import ZendeskWidget from '../src/components/zendesk/ZendeskWidget'


class MyApp extends App {
  render () {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
          <ToastrAlert />
          <ZendeskWidget />
        </Provider>
      </>
    )
  }
}

export default withReduxStore(MyApp)
