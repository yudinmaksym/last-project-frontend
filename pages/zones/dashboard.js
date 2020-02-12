import * as React from 'react'
import Head from 'next/head'

import {
  load,
  initalLoad,
  loadZonesGroup,
  loadBuildingsList,
  loadZoneConsumption,

  getSingle,
  getItems,
  getBuildingsList,
} from '../../redux/reducers/zones'
import Layout from '../../src/layouts/Default'
import withAuth from '../../lib/authProvider'
import ZoneDashboardContainer from '../../src/containers/ZoneDashboardContainer'


class ZoneDashboard extends React.Component {
    
  static async getInitialProps(ctx) {
    const { query, reduxStore: { getState, dispatch } } = ctx
    let { id } = query 
    let state = getState()
   
    if (!id) {
      await dispatch(initalLoad(1))
      state = getState()
      const items = getItems(state)
      id = items[0] && items[0].id
    }

    let promises = []

    promises.push(dispatch(load(id)))
    promises.push(dispatch(loadZonesGroup(id)))
    
    await Promise.all(promises)
    
    promises = []
    promises.push(dispatch(loadBuildingsList(id)))
    await Promise.all(promises)
    
    state = await getState()
    const data = getSingle(state)

    return { 
      data,
      id,
      name: data && data.name,
    }
  }

  render() {
    const {
      id,
      name,
      data,
    } = this.props

    const title = `${name} Dashboard`
  
    return (
      <Layout noFooter>
        <Head>
          <title>{title}</title>
        </Head>

        <ZoneDashboardContainer 
          id={id}
          title={title}
          name={name}
        />
      </Layout>
    )
  }

}

export default withAuth(ZoneDashboard)