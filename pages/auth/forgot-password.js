import React from 'react'
import Head from 'next/head'

import ForgotPasswordContainer from '../../src/containers/Auth/ForgotPasswordContainer'
import AuthLayout from '../../src/layouts/AuthLayout'
import SticksLoader from '../../src/components/preloadrers/sticks-loader'


export default () => {
  return (
    <AuthLayout>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <SticksLoader />
      <ForgotPasswordContainer />
    </AuthLayout>
  )
}
