import * as React from 'react'
import Head from 'next/head'
import moment from 'moment'

import {
  load,
  initalLoad,
  getProjectData,
  loadEnergyConsumptionFuel,
  loadElectricityConsumptionFuel,
  loadChilledWaterConsumptionFuel,
  loadWaterConsumptionFuel,
  loadLpgGasConsumptionFuel,
  loadConsumptionBaseline,
  loadCostPerFuel,
  loadEnergyMetric,
  loadMdbMetric,
  loadScore,
  loadProjectsByZone,
  getConsumptionFuelRange,
  getConsumptionPerMeterRange,
  getCostPerFuelRange,
  getItems,
  loadConsumptionByYears,
  loadEnergyConsumptionPerMeter,

  getEnergyConsumptionFuelRange,
  getElectricityConsumptionFuelRange,
  getChilledWaterConsumptionFuelRange,
  getWaterConsumptionFuelRange,
  getLpgGasConsumptionFuelRange,
} from '../../redux/reducers/projects'
import {
  loadVariables as loadMVVariables,
  loadMetrics as loadMVMetrics,
  loadConsumptionHistory as loadMVConsumptionHistory,
  loadConsumption as loadMVConsumption,
  loadYOYConsumption as loadMVYOYConsumption,
  loadForecastConsumption as loadMVForecastConsumption,
  loadForecastVsActual as loadMVForecastVsActual,
  getYear as getMVYear,
  getMonth as getMVMonth,
} from '../../redux/reducers/monthlymv'
import Layout from '../../src/layouts/Default'
import ProjectDashboardContainer from '../../src/containers/ProjectDashboardContainer'
import withAuth from '../../lib/authProvider'


const TECOM_COMPANY_ID = 1

class ProjectDashboard extends React.Component {

  static async getInitialProps(ctx) {
    const { query, reduxStore: { getState, dispatch } } = ctx
    let { id } = query 
    let state = getState()
    
    if (!id) {
      await dispatch(initalLoad(1))
      state = getState()
      const items = getItems(state)
      id = items[0] && items[0].project_id
    }

    await dispatch(load(id))

    state = await getState()
    const data = getProjectData(state)

    const hasElectricityMeters = data.project && data.project.hasElectricityMeters
    const hasWaterMeters = data.project && data.project.hasWaterMeters
    const hasChilledWaterMeters = data.project && data.project.hasChilledWaterMeters
    const hasGasMeters = data.project && data.project.hasGasMeters

    const promises = []

    promises.push(dispatch(loadEnergyMetric(
      'eui',
      id
    )))
      
    promises.push(dispatch(loadMdbMetric(
      id
    )))
        
    promises.push(dispatch(loadScore(
      id
    )))
          
    const energyConsumptionFuelRange = getEnergyConsumptionFuelRange(state)
    const electricityConsumptionFuelRange = getElectricityConsumptionFuelRange(state)
    const chilledWaterConsumptionFuelRange = getChilledWaterConsumptionFuelRange(state)
    const waterConsumptionFuelRange = getWaterConsumptionFuelRange(state)
    const lpgGasConsumptionFuelRange = getLpgGasConsumptionFuelRange(state)

    promises.push(dispatch(
      loadEnergyConsumptionFuel(
        energyConsumptionFuelRange,
        id
      )
    ))

    promises.push(dispatch(
      loadElectricityConsumptionFuel(
        electricityConsumptionFuelRange,
        id
      )
    ))

    promises.push(dispatch(
      loadChilledWaterConsumptionFuel(
        chilledWaterConsumptionFuelRange,
        id
      )
    ))

    promises.push(dispatch(
      loadWaterConsumptionFuel(
        waterConsumptionFuelRange,
        id
      )
    ))

    promises.push(dispatch(
      loadLpgGasConsumptionFuel(
        lpgGasConsumptionFuelRange,
        id
      )
    ))

    promises.push(dispatch(
      loadConsumptionBaseline(
        id
      )
    ))
              
    const costPerFuelRange = getCostPerFuelRange(state)
    promises.push(dispatch(
      loadCostPerFuel(
        costPerFuelRange,
        id
      )
    ))

    promises.push(dispatch(loadProjectsByZone()))

    const projectMetersIds = (data && data.meters && data.meters.map(_m => _m.id)) || 0
    promises.push(dispatch(
      loadConsumptionByYears(
        id, 
        projectMetersIds
      )
    ))

    const consumptionPerMeterRange = getConsumptionPerMeterRange(state)
    promises.push(dispatch(
      loadEnergyConsumptionPerMeter(consumptionPerMeterRange, id)
    ))

    // MV area
    promises.push(dispatch(loadMVVariables()))

    const mvConfigured = (data && data.mv && data.mv.configured)

    if (mvConfigured) {
      const mvYear = getMVYear(state)
      const mvMonth = getMVMonth(state)
      
      promises.push(dispatch(loadMVMetrics(id, mvMonth, mvYear)))

      // if (hasElectricityMeters) {
      promises.push(dispatch(loadMVConsumptionHistory(id, mvMonth, mvYear, 'electricity')))
      promises.push(dispatch(loadMVConsumption(id, mvMonth, mvYear, 'electricity')))
      promises.push(dispatch(loadMVYOYConsumption(id, mvMonth, mvYear, 'electricity')))
      promises.push(dispatch(loadMVForecastConsumption(id, mvMonth, mvYear, 'electricity')))
      promises.push(dispatch(loadMVForecastVsActual(id, mvMonth, mvYear, 'electricity')))
      // }

      // if (hasWaterMeters) {
      promises.push(dispatch(loadMVConsumptionHistory(id, mvMonth, mvYear, 'chw')))
      promises.push(dispatch(loadMVConsumption(id, mvMonth, mvYear, 'chw')))
      promises.push(dispatch(loadMVYOYConsumption(id, mvMonth, mvYear, 'chw')))
      promises.push(dispatch(loadMVForecastConsumption(id, mvMonth, mvYear, 'chw')))
      promises.push(dispatch(loadMVForecastVsActual(id, mvMonth, mvYear, 'chw')))
      // }
    }

    await Promise.all(promises)
    
    return { 
      id,
      name: data && data.project.name,
    }
  }

  isMvEnabled = () => {
    // disable for only for TECOM users
    return (
      this.props.currentUser
      && this.props.currentUser.companyId !== TECOM_COMPANY_ID
    )
  }

  render() {
    const {
      id,
      name,
    } = this.props

    const title = `${name} Dashboard`
    const mvEnabled = this.isMvEnabled()

    return (
      <Layout noFooter>
        <Head>
          <title>{title}</title>
        </Head>

        <ProjectDashboardContainer 
          id={id}
          title={title}
          name={name}
          mvEnabled={mvEnabled}
        />
      </Layout>
    )
  }

}

export default withAuth(ProjectDashboard)
