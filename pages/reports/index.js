import * as React from 'react'
import { Container, Row } from 'shards-react'
import Head from 'next/head'

import PageTitle from '../../src/components/common/PageTitle'
import Layout from '../../src/layouts/Default'
import {
  loadUser,
  getSelectedUser,
} from '../../redux/reducers/users'
import EditUserContainer from '../../src/containers/EditUserContainer'
import withAuth from '../../lib/authProvider'


const EditUserProfile = ({ Name, id }) => {
  return (
    <div>
      print
    </div>
  )
} 

EditUserProfile.getInitialProps = async (ctx) => {
  const { query, reduxStore: { getState, dispatch } } = ctx

  const { id } = query 

  const promises = []
  promises.push(dispatch(loadUser(id)))

  await Promise.all(promises)

  const state = await getState()
  const data = getSelectedUser(state)

  return { 
    id,
    Name: data && data.nickname,
  }
}

export default withAuth(EditUserProfile)
