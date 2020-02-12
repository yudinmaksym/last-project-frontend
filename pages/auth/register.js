import React from 'react'
import Head from 'next/head'


import RegisterContainer from '../../src/containers/Auth/RegisterContainer'
import AuthLayout from '../../src/layouts/AuthLayout'
import SticksLoader from '../../src/components/preloadrers/sticks-loader'


const RegisterPage = () => (
  <AuthLayout>
    <Head>
      <title>Registration</title>
    </Head>
    <SticksLoader />
    <RegisterContainer />
  </AuthLayout>
)

export default RegisterPage