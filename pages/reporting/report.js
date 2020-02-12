import * as React from 'react'
import Head from 'next/head'

import withAuth from '../../lib/authProvider'
import {
  loadInfo,
  loadEnergyConsumption,
  loadEnergyConsumptionByYears,
  loadEnergyCost,
  loadEnergyConsumptionByLevel,
  loadEnergyConsumptionActual,
  loadEnergyConsumptionYOY,

  getInfo,
  getEnergy,
  getEnergyCost,
  getEnergyConsumptionByYears,
  getEnergyConsumptionYOY,
  getEnergyConsumptionByLevel,
  getEnergyConsumptionActualBaseline,
} from '../../redux/reducers/reports'
import Layout from '../../src/layouts/Default'
import ReportsContainer from '../../src/containers/ReportsContainer'
import PageTitle from '../../src/components/common/PageTitle'
import ReportLayoutContainer from '../../src/containers/ReportLayoutContainer'


class Report extends React.Component {

  static async getInitialProps(ctx) {
    const { query, reduxStore: { getState, dispatch } } = ctx
    let { type = 'portfolio', year, month, id } = query

    const promises = []

    promises.push(
      dispatch(loadInfo(type, year, month, id))
    )

    promises.push(
      dispatch(loadEnergyConsumption(type,year, month, id))
    )

    promises.push(
      dispatch(loadEnergyConsumptionByYears(type,year, month, id))
    )

    promises.push(
      dispatch(loadEnergyCost(type, year, month, id))
    )

    promises.push(
      dispatch(loadEnergyConsumptionByLevel(type,year, month, id))
    )

    promises.push(
      dispatch(loadEnergyConsumptionActual(type,year, month, id))
    )

    promises.push(
      dispatch(loadEnergyConsumptionYOY(type,year, month, id))
    )

    await Promise.all(promises)

    const state = getState()

    const info = getInfo(state)
    const energy = getEnergy(state)
    const energyCost = getEnergyCost(state)
    const energyConsumptionByYears = getEnergyConsumptionByYears(state)
    const energyConsumptionYOY = getEnergyConsumptionYOY(state)
    const energyConsumptionByLevel = getEnergyConsumptionByLevel(state)
    const energyConsumptionActualBaseline = getEnergyConsumptionActualBaseline(state)

    return {
      type,
      info,
      energy,
      energyCost,
      energyConsumptionByYears,
      energyConsumptionYOY,
      energyConsumptionByLevel,
      energyConsumptionActualBaseline,
    }
  }

  render() {
    const { 
      type,
      info: { title, year, month, eui, fileName },
      energy,
      energyCost,
      energyConsumptionByYears,
      energyConsumptionYOY,
      energyConsumptionByLevel,
      energyConsumptionActualBaseline,
    } = this.props
    
    return (
      <div>
        <Head>
          <title>{title} Report</title>
        </Head>

        <ReportLayoutContainer 
          type={type}
          title={title}
          fileName={fileName}
          subTitle={`${month} (${year})`}
          month={month}
          value={eui}
          energy={energy}
          energyCost={energyCost}
          energyConsumptionByYears={energyConsumptionByYears}
          energyConsumptionYOY={energyConsumptionYOY}
          energyConsumptionByLevel={energyConsumptionByLevel}
          energyConsumptionActualBaseline={energyConsumptionActualBaseline}
        />
      </div>
    )
  }
}

export default withAuth(Report)
