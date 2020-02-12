import React from 'react'
import Head from 'next/head'

import LoginContainer from '../../src/containers/Auth/LoginContainer'
import AuthLayout from '../../src/layouts/AuthLayout'
import SticksLoader from '../../src/components/preloadrers/sticks-loader'


export default () => {
  return (
    <AuthLayout>
      <Head>
        <title>Authorization</title>
      </Head>
      <SticksLoader />
      <LoginContainer />
    </AuthLayout>
  )
}
