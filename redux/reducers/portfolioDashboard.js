import { parseCookies } from 'nookies'
import shortid from 'shortid'

import agentDaily from '../../agentDaily'
import agent from '../../agent'


import { showStickLoader } from './loaders'


var moment = require('moment')

// CONSTANTS

export const LOAD_PROJECT_DATA_REQUEST = 'PORTFOLIO//LOAD_PROJECT_DATA_REQUEST'
export const LOAD_PROJECT_DATA_SUCCESS = 'PORTFOLIO//LOAD_PROJECT_DATA_SUCCESS'
export const LOAD_PROJECT_DATA_FAILED = 'PORTFOLIO//LOAD_PROJECT_DATA_FAILED'

export const LOAD_ALL_PROJECTS_SUCCESS = "PORTFOLIO//LOAD_ALL_PROJECTS_SUCCESS"

export const LOAD_POWER_ALL_PROJECTS_SUCCESS = 'PORTFOLIO//LOAD_POWER_ALL_PROJECTS_SUCCESS'
export const LOAD_ENERGY_CONSUMPTION_SUCCESS = 'PORTFOLIO//LOAD_ENERGY_CONSUMPTION_SUCCESS'
export const LOAD_BASELINE_SUCCESS = 'PORTFOLIO//LOAD_BASELINE_SUCCESS'
export const LOAD_TENANT_SUCCESS = 'PORTFOLIO//LOAD_TENANT_SUCCESS'
export const LOAD_FORECAST_SUCCESS = 'PORTFOLIO//LOAD_FORECAST_SUCCESS'
export const SAVE_SELECTED_DATA = 'PORTFOLIO//SAVE_SELECTED_DATA'
export const CLEAR_STATE = 'PORTFOLIO//CLEAR_STATE'

const initialState = {
  data: {
    
  },
  tenantBaseline: [],
  totalConsumptionBaseline: [],
}

// REDUCERS
export default (state = initialState, action) => {
  switch (action.type) {
  case LOAD_PROJECT_DATA_SUCCESS:
    return {
      ...state,
      data: {
        ...action.payload.result,
      },
    }
  case LOAD_ALL_PROJECTS_SUCCESS:
    return {
      ...state,
      projects: action.payload
    }
  case LOAD_POWER_ALL_PROJECTS_SUCCESS:
    return {
      ...state,
      mdbSum: action.payload.result,
    }
  case LOAD_ENERGY_CONSUMPTION_SUCCESS:
    return {
      ...state,
      energyConsumption: action.payload.result,
    }
  case LOAD_BASELINE_SUCCESS:
    return {
      ...state,
      totalConsumptionBaseline: action.payload.result,
    }
  case LOAD_TENANT_SUCCESS:
    return {
      ...state,
      tenantBaseline: action.payload.result,
    }
  case LOAD_FORECAST_SUCCESS:
    return {
      ...state,
      forecast: action.payload.result,
    }
  case CLEAR_STATE:
    return {
      ...state,
      mdbSum: null,
      energyConsumption: null,
      totalConsumptionBaseline: null,
      tenantBaseline: null,
      forecast: null,
    }
  case SAVE_SELECTED_DATA:
    return {
      ...state,
      selectedData: {
        start: action.payload.start,
        end: action.payload.end,
      },
    }
  default: return state
  }
}

// ACTIONS

export const loadProjectData = (projectId, start, end) => dispatch => {
  dispatch({
    type: LOAD_PROJECT_DATA_REQUEST,
  })
  
  return agent.MV.loadDailyProjectData(projectId, start, end)
    .then((result) => {
      dispatch({
        type: LOAD_PROJECT_DATA_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_PROJECT_DATA_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadAllData = (start, end, projectList) => async dispatch => {
  dispatch({ type: CLEAR_STATE })
  dispatch(showStickLoader(true))
  await Promise.all([
    dispatch(saveSelectedData(start, end)),
    dispatch(generateAllProjects(start, end, projectList)),
    dispatch(loadConsumptionBaseline(start, end, projectList)),
    dispatch(loadTenantBaseline(start, end, projectList)),
    dispatch(loadForecast(start, end, projectList)),
  ])
  dispatch(showStickLoader(false))
}

export const saveSelectedData = (start, end) => dispatch => {
  dispatch({
    type: SAVE_SELECTED_DATA,
    payload: {
      start,
      end,
    },
  })
}

export const loadAllProjects = (start, end) => dispatch => {
  dispatch(saveSelectedData(start, end))
  return agentDaily.Default.loadAllProjects()
    .then(result => {
      dispatch(loadAllData(start, end, result.items))
      dispatch({
        type: LOAD_ALL_PROJECTS_SUCCESS,
        payload: result.items
      })
    })
}

export const loadAllMdbListForCurrentProject = (projectId) => {
  return agentDaily.Daily.loadAllMdbListForCurrentProject(projectId)
    .then(result => result)
}

const generateQueryString = (type, items, site) => {
  let equip = ''
  items.map((el, index) => {
    equip += `r.${type} == "${el.iot_name}" or `
  })
  let string = `(r.site == "${site}" and (${equip.slice(0, -3)})) or `
  return string
}

export const generateAllProjects = (start, end, projects) => async dispatch =>{
  let site = ''
    
  return await Promise.all(projects.map(el => {
    return agentDaily.Daily.loadAllMdbListForCurrentProject(el.id)
      .then(result => {
        if(result.items.length !== 0) {
          site += generateQueryString('equip', result.items, el.iot_name)
        }
      })
  })).then(() => {
    dispatch(loadMdbSumPwr(start, end, site)),
    dispatch(loadEnergyConsumption(start, end, site))
  })
}

export const loadMdbSumPwr = (start, end, site) => dispatch => {
  const body = 
        'from(bucket: "taka-iot-data")'
        + `|> range(start: ${start}, stop: ${end})`
        + `|> filter(fn: (r) => ${site.slice(0, -3)})`
        + '|> filter(fn: (r) => r._measurement == "PWR" and r._field == "value")'
        + '|> keep(columns: ["_time", "site", "equip", "equipOrd", "_value"])'
        + '|> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])'
        + '|> aggregateWindow(every: 1h, timeSrc: "_start", fn: mean)'
        + '|> keep(columns: ["_time", "site", "_value"])'
        + '|> aggregateWindow(every: 1h, timeSrc: "_start", fn: sum)'

  return agentDaily.Influx.loadInfluxData(body)
    .then(result => {
      dispatch({
        type: LOAD_POWER_ALL_PROJECTS_SUCCESS,
        payload: {
          result,
        },
      })
    })
}

export const loadEnergyConsumption = (start, end, site) => dispatch => {
  const body = 
        'from(bucket: "taka-iot-data-energy")'
        + `|> range(start: ${moment(start).format('YYYY-MM-DDT00:16:00+04:00')}, stop: ${moment(end).add(1,'day').format('YYYY-MM-DDT00:00:00+04:00')})`
        + `|> filter(fn: (r) => ${site.slice(0, -3)})`
        + '|> filter(fn: (r) => r._measurement == "ENERGY_TDY" or r._measurement == "ENERGY_TOT_TDY" and r._field == "value")'
        + '|> keep(columns: ["_time", "site", "equip", "equipOrd", "_value"])'
        + '|> timeShift(duration: 3h, columns: ["_start", "_stop", "_time"])'
        + '|> timeShift(duration: 44m, columns: ["_start", "_stop", "_time"])'
        + '|> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)'
        + '|> keep(columns: ["_time", "site", "_value"])'
        + '|> aggregateWindow(every: 1d, timeSrc: "_start", fn: sum)' 

  return agentDaily.Influx.loadInfluxData(body)
    .then(result => {
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_SUCCESS,
        payload: {
          result,
        },
      })
    })
}

export const loadForecast = (start, end, projects) => async dispatch => {
  let result = []
  const newRange = {
    startDate: moment(start).subtract(1, 'year').format('YYYY-MM-DD'),
    endDate: moment(end).subtract(1, 'year').format('YYYY-MM-DD')
  }
  return await Promise.all(projects.map(el => {
    return agentDaily.Daily.loadDailyForecast(newRange, el.id)
      .then(res => result.push({ result: res.items, name: el.iot_name }))
  })).then(() => {
    dispatch({
      type: LOAD_FORECAST_SUCCESS,
      payload: {
        result,
      },
    })
  })
}

export const loadConsumptionBaseline = (start, end, projects) => async dispatch => {
  let result = []
  const newRange = {
    startDate: moment(start).subtract(1, 'year').format('YYYY-MM-DD'),
    endDate: moment(end).subtract(1, 'year').format('YYYY-MM-DD')
  }
  return await Promise.all(projects.map(el => {
    return agentDaily.Daily.loadTotalConsumption(newRange, el.id)
      .then(res => result.push({ result: res.items, name: el.iot_name }))
  })).then(() => {
    dispatch({
      type: LOAD_BASELINE_SUCCESS,
      payload: {
        result,
      },
    })
  })
}

export const loadTenantBaseline = (start, end, projects) => async dispatch => {
  let result = []
  const newRange = {
    startDate: moment(start).subtract(1, 'year').format('YYYY-MM-DD'),
    endDate: moment(end).subtract(1, 'year').format('YYYY-MM-DD')
  }
  return await Promise.all(projects.map(el => {
    return agentDaily.Daily.loadTenantBaseline(newRange, el.iot_name)
      .then(res => {
        if(res) {
          result.push({ result: res[0].data, name: el.iot_name })
        }
      })
  })).then(() => {
    dispatch({
      type: LOAD_TENANT_SUCCESS,
      payload: {
        result,
      },
    })
  })
}


// GETTERS
export const getMdbSum = (state) => state.portfolioDashboard && state.portfolioDashboard.mdbSum
export const getEnergyConsumption = (state) => state.portfolioDashboard && state.portfolioDashboard.energyConsumption
export const getConsumptionBaseline = (state) => state.portfolioDashboard && state.portfolioDashboard.totalConsumptionBaseline
export const getTenantBaseline = (state) => state.portfolioDashboard && state.portfolioDashboard.tenantBaseline
export const getForecast = (state) => state.portfolioDashboard && state.portfolioDashboard.forecast
export const getSelectedData = (state) => state.portfolioDashboard && state.portfolioDashboard.selectedData

export const getProjectData = (state) => state.portfolioDashboard && state.portfolioDashboard.data
export const getProjectList = (state) => state.portfolioDashboard && state.portfolioDashboard.projects