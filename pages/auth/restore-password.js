import React from 'react'
import Head from 'next/head'

import ResetPasswordContainer from '../../src/containers/Auth/ResetPasswordContainer'
import AuthLayout from '../../src/layouts/AuthLayout'
import SticksLoader from '../../src/components/preloadrers/sticks-loader'


export default () => {
  return (
    <AuthLayout>
      <Head>
        <title>Restore Password</title>
      </Head>
      <SticksLoader />
      <ResetPasswordContainer />
    </AuthLayout>
  )
}
