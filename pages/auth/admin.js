import React from 'react'
import Head from 'next/head'

import AdminContainer from '../../src/containers/Auth/AdminContainer'
import AuthLayout from '../../src/layouts/AuthLayout'
import SticksLoader from '../../src/components/preloadrers/sticks-loader'


export default () => {
  return (
    <AuthLayout>
      <Head>
        <title>Admin Authorization</title>
      </Head>
      <SticksLoader />
      <AdminContainer />
    </AuthLayout>
  )
}
