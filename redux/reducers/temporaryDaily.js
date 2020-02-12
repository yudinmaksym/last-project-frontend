import { showStickLoader } from './loaders'
import agentDaily from '../../agentDaily'
import { parseCookies } from 'nookies'
var moment = require('moment');

// CONSTANTS
export const LOAD_ALL_DAILY_PROJECTS_REQUEST = "DAILY//LOAD_ALL_DAILY_PROJECTS_REQUEST";
export const LOAD_ALL_DAILY_PROJECTS_SUCCESS = "DAILY//LOAD_ALL_DAILY_PROJECTS_SUCCESS";
export const LOAD_ALL_DAILY_PROJECTS_ERROR = "DAILY//LOAD_ALL_DAILY_PROJECTS_ERROR";
export const LOAD_ALL_REQUEST = "DAILY//LOAD_ALL_REQUEST";
export const LOAD_ALL_SUCCESS = "DAILY//LOAD_ALL_SUCCESS";
export const LOAD_ALL_FAILED = "DAILY//LOAD_ALL_FAILED";
export const LOAD_SUBJECT_TOTAL_CONSUMPTION_REQUEST = "DAILY//LOAD_MDB_TOTAL_CONSUMPTION_REQUEST";
export const LOAD_SUBJECT_TOTAL_CONSUMPTION_SUCCESS = "DAILY//LOAD_MDB_TOTAL_CONSUMPTION_SUCCESS";
export const LOAD_SUBJECT_TOTAL_CONSUMPTION_FAILED = "DAILY//LOAD_MDB_TOTAL_CONSUMPTION_FAILED";
export const LOAD_SUBJECT_DAILY_FORECAST_REQUEST = "DAILY//LOAD_MDB_DAILY_FORECAST_REQUEST";
export const LOAD_SUBJECT_DAILY_FORECAST_SUCCESS = "DAILY//LOAD_MDB_DAILY_FORECAST_SUCCESS";
export const LOAD_SUBJECT_DAILY_FORECAST_FAILED = "DAILY//LOAD_MDB_DAILY_FORECAST_FAILED";
export const LOAD_SUBJECT_TENANT_BASELINE_REQUEST = "DAILY//LOAD_MDB_TENANT_BASELINE_REQUEST";
export const LOAD_SUBJECT_TENANT_BASELINE_SUCCESS = "DAILY//LOAD_MDB_TENANT_BASELINE_SUCCESS";
export const LOAD_SUBJECT_TENANT_BASELINE_FAILED = "DAILY//LOAD_MDB_TENANT_BASELINE_FAILED";
export const LOAD_SUBJECT_WHOLE_BUILDING_ENERGY_REQUEST = "DAILY//LOAD_MDB_WHOLE_BUILDING_ENERGY_REQUEST";
export const LOAD_SUBJECT_WHOLE_BUILDING_ENERGY_SUCCESS = "DAILY//LOAD_MDB_WHOLE_BUILDING_ENERGY_SUCCESS";
export const LOAD_SUBJECT_WHOLE_BUILDING_ENERGY_FAILED = "DAILY//LOAD_MDB_WHOLE_BUILDING_ENERGY_FAILED";
export const LOAD_SUBJECT_CDD_REQUEST = "DAILY//LOAD_SUBJECT_CDD_REQUEST";
export const LOAD_SUBJECT_CDD_SUCCESS = "DAILY//LOAD_SUBJECT_CDD_SUCCESS";
export const LOAD_SUBJECT_CDD_FAILED = "DAILY//LOAD_SUBJECT_CDD_FAILED";
export const LOAD_SUBJECT_TOTAL_ENERGY_CONSUMPTION_REQUEST = "DAILY//LOAD_SUBJECT_TOTAL_ENERGY_CONSUMPTION_REQUEST";
export const LOAD_SUBJECT_TOTAL_ENERGY_CONSUMPTION_SUCCESS = "DAILY//LOAD_SUBJECT_TOTAL_ENERGY_CONSUMPTION_SUCCESS";
export const LOAD_SUBJECT_TOTAL_ENERGY_CONSUMPTION_FAILED = "DAILY//LOAD_SUBJECT_TOTAL_ENERGY_CONSUMPTION_FAILED";
export const CLEAR_ALL_STATE_REQUEST = "DAILY//CLEAR_ALL_STATE_REQUEST";
export const CLEAR_ALL_STATE_SUCCESS = "DAILY//CLEAR_ALL_STATE_SUCCESS";
export const CLEAR_ALL_STATE_FAILED = "DAILY//CLEAR_ALL_STATE_FAILED";
export const SAVE_SELECTED_PROJECT = "DAILY//SAVE_SELECTED_PROJECT";
export const LOAD_MDB_POWER_REQUEST = "DAILY//LOAD_MDB_POWER_REQUEST";
export const LOAD_MDB_POWER_SUCCESS = "DAILY//LOAD_MDB_POWER_SUCCESS";
export const LOAD_MDB_POWER_FAILED = "DAILY//LOAD_MDB_POWER_FAILED";

export const LOAD_HEATMAP_FORECAST = "DAILY//LOAD_HEATMAP_FORECAST";
export const LOAD_HEATMAP_CONSUMPTION = "DAILY//LOAD_HEATMAP_CONSUMPTION";
export const LOAD_HEATMAP_TENANT = "DAILY//LOAD_HEATMAP_TENANT";

export const LOAD_MDB_POWER_SUM_SUCCESS = "DAILY//LOAD_MDB_POWER_SUM_SUCCESS";

export const LOAD_CHW_TEMP_SUCCESS = "DAILY//LOAD_CHW_TEMP_SUCCESS";

export const DAILY_TEMPERATURE = "DAILY//DAILY_TEMPERATURE";
export const DAILY_CDD = "DAILY//DAILY_CDD";

const initialState = {
  tenantBaseline: [{
    data: []
  }],
  heatmap: {},
  totalEnergyConsumption: ""
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_SELECTED_PROJECT:
      return {
        ...state,
        selectedProject: {
          project: action.payload.data.label,
          projectId: action.payload.data.value,
          region: action.payload.data.region,
          cdd: action.payload.data.cdd,
          category: action.payload.data.category,
          startDate: action.payload.range.startDate,
          endDate: action.payload.range.endDate,
        }
      }
    case LOAD_SUBJECT_TOTAL_CONSUMPTION_SUCCESS:
      return {
        ...state,
        consumption: action.payload.result,
      }
    case LOAD_SUBJECT_DAILY_FORECAST_SUCCESS:
      return {
        ...state,
        dailyForecast: action.payload.result
      }
    case LOAD_SUBJECT_TENANT_BASELINE_SUCCESS:
      return {
        ...state,
        tenantBaseline: action.payload.result
      }
    case LOAD_SUBJECT_WHOLE_BUILDING_ENERGY_SUCCESS:
      return {
        ...state,
        wholeBuilding: action.payload.result
      }
    case LOAD_SUBJECT_CDD_SUCCESS:
      return {
        ...state,
        buildingCdd: action.payload.result

      }
    case LOAD_SUBJECT_TOTAL_ENERGY_CONSUMPTION_SUCCESS:
      return {
        ...state,
        totalEnergyConsumption: action.payload.result
      }
    case LOAD_ALL_DAILY_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: action.payload.result.items
      }
    case LOAD_MDB_POWER_SUCCESS:
      return {
        ...state,
        mdbPower: action.payload
      }
    case LOAD_MDB_POWER_SUM_SUCCESS:
      return {
        ...state,
        mdbPowerSum: action.payload.result
      }
    case LOAD_HEATMAP_CONSUMPTION:
      return {
        ...state,
        heatmap: {
          ...state.heatmap,
          consumption: action.payload.result
        }
      }
    case LOAD_HEATMAP_FORECAST:
      return {
        ...state,
        heatmap: {
          ...state.heatmap,
          forecast: action.payload.result
        }
      }
    case LOAD_HEATMAP_TENANT:
      return {
        ...state,
        heatmap: {
          ...state.heatmap,
          tenant: action.payload.result
        }
      }
    case DAILY_TEMPERATURE: 
      return {
        ...state,
        weather: {
          ...state.weather,
          dailyTemp: action.payload
        }
      }
    case DAILY_CDD: 
      return {
        ...state,
        weather: {
          ...state.weather,
          dailyCdd: action.payload.items
        }
      }
    case CLEAR_ALL_STATE_SUCCESS: {
      return {
        ...state,
        consumption: [],
        dailyForecast: [],
        tenantBaseline: [
          {
            data: [],
            subject: '',
            site: '',
          }
        ],
        mdbPowerSum: "",
        mdbPower: [],
        totalEnergyConsumption: "",
        wholeBuilding: "",
        heatmap: [],
      }
    }
    default: return state
  }
}

// action handler

export const loadAllDailyData = (data, range, mdbList) => async dispatch => {
  dispatch(showStickLoader(true))
  await Promise.all([
    dispatch(clearAllState()),
    dispatch(saveSelectedProject(data, range)),
    dispatch(loadTotalConsumption(data, range)),
    dispatch(loadDailyForecast(data, range)),
    dispatch(loadTenantBaseline(data, range)),
    dispatch(loadWholeBuildingsEnergy(data, range, mdbList)),
    dispatch(loadSubjectCdd(data, range)),
    dispatch(loadTotalEnergyConsumption(data, range, mdbList)),
    dispatch(loadMdbPower(data, range, mdbList)),
    dispatch(loadMdbPowerSum(data, range, mdbList)),
    dispatch(yearTotalEnergyConsumption(data, mdbList)),
    dispatch(yearTenantBaseline(data)),
    dispatch(yearDailyForecast(data)),
    dispatch(loadDailyTemp(data.region, range.startDate, range.endDate)),
    dispatch(loadDailyCDD(data.cdd, data.region, range.startDate, range.endDate))
  ])
  dispatch(showStickLoader(false))
}

export const clearAllState = () => dispatch => {
  dispatch({type: CLEAR_ALL_STATE_SUCCESS})
}

export const loadAllDailyProjects = (start, end, id, project) => dispatch => {
  dispatch({
    type: LOAD_ALL_DAILY_PROJECTS_REQUEST
  })
  return agentDaily.Default.loadAllProjects()
    .then(result => {
      if(result.items !== 0) {
        dispatch({
          type: LOAD_ALL_DAILY_PROJECTS_SUCCESS,
          payload: {
            result
          }
        })

        if(id && project) {
          const routedProject = result.items.find(el => el.iot_name === project)
          dispatch(loadAllMdbListForCurrentProject(
            {
              label: project,
              value: id,
              region: routedProject.region,
              cdd: routedProject.cdd_base,
              category: routedProject.category,
            },
            {
              startDate: start,
              endDate: end
            }
          ))
        } else {
          dispatch(loadAllMdbListForCurrentProject(
            {
              label: result.items[0].iot_name,
              value: result.items[0].id,
              region: result.items[0].region,
              cdd: result.items[0].cdd_base,
              category: result.items[0].category,
            },
            {
              startDate: start,
              endDate: end
            }
          ))
        }
      }
    })
}

export const loadAllMdbListForCurrentProject = (data, range) => dispatch => {
  if(data.category === "audit") {
    return agentDaily.Daily.loadAllMdbListForCurrentProject(data.value)
      .then(result => {
        if(result.count !== 0) {
          dispatch(loadAllDailyData(data, range, result.body.items))
        } else {
          dispatch(loadAllDailyData(data, range, []))
        }
      })
  }
  return agentDaily.Daily.loadAllMdbListForCurrentProject(data.value)
    .then(result => {
      dispatch(loadAllDailyData(data, range, result.items))
    })
}

export const saveSelectedProject = (data, range) => dispatch => {
  dispatch({
    type: SAVE_SELECTED_PROJECT,
    payload: {
      data,
      range
    }
  })
}

export const loadTotalConsumption = (data, range) => dispatch => {
  dispatch({
    type: LOAD_SUBJECT_TOTAL_CONSUMPTION_REQUEST
  })
  const newBaselineRange = {
    startDate: moment(range.startDate).subtract(1, 'year').format('YYYY-MM-DD'),
    endDate: moment(range.endDate).subtract(1, 'year').format('YYYY-MM-DD'),
  }
  return agentDaily.Daily.loadTotalConsumption(newBaselineRange, data.value)
    .then(result => {
      if(result !== null) {
        dispatch({
          type: LOAD_SUBJECT_TOTAL_CONSUMPTION_SUCCESS,
          payload: {
            result,
          }
        })
      }
    })
    .catch(error => {
      dispatch({
        type: LOAD_SUBJECT_TOTAL_CONSUMPTION_FAILED,
        payload: {
          error
        }
      })
    })
}

export const loadDailyForecast = (data, range) => dispatch => {
  dispatch({
    type: LOAD_SUBJECT_DAILY_FORECAST_REQUEST
  })
  const newBaselineRange = {
    startDate: moment(range.startDate).subtract(1, 'year').format('YYYY-MM-DD'),
    endDate: moment(range.endDate).subtract(1, 'year').format('YYYY-MM-DD'),
  }
  return agentDaily.Daily.loadDailyForecast(newBaselineRange, data.value)
    .then(result => {
      dispatch({
        type: LOAD_SUBJECT_DAILY_FORECAST_SUCCESS,
        payload: {
          result
        }
      })
    })
    .catch(error => {
      dispatch({
        type: LOAD_SUBJECT_DAILY_FORECAST_FAILED,
        payload: {
          error
        }
      })
    })
}

export const loadTenantBaseline = (data, range) => dispatch => {
  dispatch({
    type: LOAD_SUBJECT_TENANT_BASELINE_REQUEST
  })

  const newBaselineRange = {
    startDate: moment(range.startDate).subtract(1, 'year').format('YYYY-MM-DD'),
    endDate: moment(range.endDate).subtract(1, 'year').format('YYYY-MM-DD'),
  }

  return agentDaily.Daily.loadTenantBaseline(newBaselineRange, data.label)
    .then(result => {
      if(result !== null) {
        dispatch({
          type: LOAD_SUBJECT_TENANT_BASELINE_SUCCESS,
          payload: {
            result
          }
        })
      }
    })
    .catch(error => {
      dispatch({
        type: LOAD_SUBJECT_TENANT_BASELINE_FAILED,
        payload: {
          error
        }
      })
    })
}

const generateEquipString = (mdbList) => {
  let string = "";
  mdbList && mdbList.map((el, index) => {
    if(el.id !== 82) {
        string += `r.equip == "${el.iot_name}" or `
    }
  })

  return string
}

export const loadWholeBuildingsEnergy = (data, range, mdbList) => dispatch => {
    const body =
      ' from(bucket: "taka-iot-data-energy")' +
      ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:16:00+04:00")}, stop: ${moment(range.endDate).format("YYYY-MM-DDT00:00:00+04:00")})` +
      ` |> filter(fn: (r) => r.site == "${data.label}")` +
      ` ${mdbList.length !== 0 ? `|> filter(fn: (r) => ${generateEquipString(mdbList).slice(0, -3)} )` : '' }` +
      ' |> filter(fn: (r) => r._measurement == "ENERGY_TDY" or r._measurement == "ENERGY_TOT_TDY" and r._field == "value")' +
      ' |> timeShift(duration: 3h, columns: ["_start", "_stop", "_time"])' + 
      ' |> timeShift(duration: 59m, columns: ["_start", "_stop", "_time"])' +
      ' |> window(every: 1d)' +
      ' |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)' +
      ' |> group(columns: ["equip"])' +
      ' |> sum()' +
      ' |> keep(columns: ["equip", "_value"]) ' +
      ' |> group()' ;


    dispatch({
      type: LOAD_SUBJECT_WHOLE_BUILDING_ENERGY_REQUEST
    })

    return agentDaily.Daily.loadWholeBuildingsEnergy(body)
      .then(result => {
        dispatch({
          type: LOAD_SUBJECT_WHOLE_BUILDING_ENERGY_SUCCESS,
          payload: {
            result
          }
        })
      })
      .catch(error => {
        dispatch({
          type: LOAD_SUBJECT_WHOLE_BUILDING_ENERGY_FAILED,
          payload: {
            error
          }
        })
      })
}

export const loadSubjectCdd = (data, range) => dispatch => {
  dispatch({
    type: LOAD_SUBJECT_CDD_REQUEST
  })

  let formatCdd = ""
  if(data.cdd) {
    const splitedCdd = data.cdd.split('.')

    if(Number(splitedCdd[1]) === 0) {
      formatCdd = "cdd_" + splitedCdd[0]
    } else {
      formatCdd = "cdd_" + splitedCdd[0] + splitedCdd[1]
    }
  }

  return agentDaily.Daily.loadSubjectCdd(data.region, formatCdd, range)
    .then(result => {
      dispatch({
        type: LOAD_SUBJECT_CDD_SUCCESS,
        payload: {
          result
        }
      })
    })
    .catch(error => {
      dispatch({
        type: LOAD_SUBJECT_CDD_FAILED,
        payload: {
          error
        }
      })
    })
}

export const loadTotalEnergyConsumption = (data, range, mdbList) => dispatch => {
    const body =
      ' from(bucket: "taka-iot-data-energy")'
      + ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:16:00+04:00")}, stop: ${moment(range.endDate).add(1, "days").format("YYYY-MM-DDT00:00:00+04:00")})`
      + ` |> filter(fn: (r) => r.site == "${data.label}")`
      + ` ${mdbList.length !== 0 ? `|> filter(fn: (r) => ${generateEquipString(mdbList).slice(0, -3)} )` : '' }`
      + ' |> filter(fn: (r) => r._measurement == "ENERGY_TDY" or r._measurement == "ENERGY_TOT_TDY" and r._field == "value")'
      + ' |> keep(columns: ["_time", "equip", "_value"])'
      + ' |> timeShift(duration: 3h, columns: ["_start", "_stop", "_time"])'
      + ' |> timeShift(duration: 44m, columns: ["_start", "_stop", "_time"])'
      + ' |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max) '
      + ' |> group(columns: ["_time"], mode:"by") '
      + ' |> sum() '
      + ' |> group() ';


    dispatch({
      type: LOAD_SUBJECT_TOTAL_ENERGY_CONSUMPTION_REQUEST
    })

    return agentDaily.Daily.loadTotalEnergyConsumption(body)
      .then(result => {
        dispatch({
          type: LOAD_SUBJECT_TOTAL_ENERGY_CONSUMPTION_SUCCESS,
          payload: {
            result
          }
        })
      })
}

export const loadMdbPower = (data, range, mdbList) => dispatch => {
  dispatch({
    type: LOAD_MDB_POWER_REQUEST
  })
  let mdbPower = []

  if(mdbList.length !== 0) {
    mdbList.map(el => {
      const body =
        ' from(bucket: "taka-iot-data")' +
        ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(range.endDate).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})` +
        ` |> filter(fn: (r) => r.site == "${data.label}")` +
        ` |> filter(fn: (r) => r.equip == "${el.iot_name}")` +
        ' |> drop(columns: ["pointStatus"])' +
        ' |> filter(fn: (r) => r._measurement == "PWR" and r._field == "value")' +
        ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
        ' |> keep(columns: ["_time", "equip", "_value"])' +
        ' |> aggregateWindow(every: 1h, timeSrc: "_start", fn: mean, createEmpty: false)';

      return agentDaily.Daily.loadMdbPower(body)
        .then(result => {
          if(result.trim() !== "") {
            mdbPower.push(result)
          }
        })
    })
    dispatch({
      type: LOAD_MDB_POWER_SUCCESS,
      payload: mdbPower
    })
  }
}

export const loadMdbPowerSum = (data, range, mdbList) => dispatch => {
    const body =
      ' from(bucket: "taka-iot-data")' +
      ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(range.endDate).add(1, 'day').format("YYYY-MM-DDT00:00:00+04:00")})` +
      ` |> filter(fn: (r) => r.site == "${data.label}")` +
      ` |> filter(fn: (r) => ${mdbList.length !== 0 ? `${generateEquipString(mdbList).slice(0, -3)} )` : 'r.equip == "null" )' }` +
      ' |> drop(columns: ["pointStatus"])' +
      ' |> filter(fn: (r) => r._measurement == "PWR" and r._field == "value")' +
      ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
      ' |> keep(columns: ["_time", "equip", "_value"])' +
      ' |> aggregateWindow(every: 1h, timeSrc: "_start", fn: mean, createEmpty: false)' +
      ' |> keep(columns: ["_time", "_value"])' +
      ' |> aggregateWindow(every: 1h, timeSrc: "_start", fn: sum, createEmpty: false)';

    return agentDaily.Daily.loadMdbPowerSum(body)
      .then(result => {
        dispatch({
          type: LOAD_MDB_POWER_SUM_SUCCESS,
          payload: {
            result
          }
        })
      })
}

export const yearTotalEnergyConsumption = (data, mdbList) => dispatch => {
    const body =
      ' from(bucket: "taka-iot-data-energy")' +
      ` |> range(start:${moment().subtract(1, 'year').format("YYYY-MM-DDT00:16:00+04:00")}, stop: ${moment().format("YYYY-MM-DDT00:00:00+04:00")})` +
      ` |> filter(fn: (r) => r.site == "${data.label}")` +
      ` ${mdbList.length !== 0 ? `|> filter(fn: (r) => ${generateEquipString(mdbList).slice(0, -3)} )` : '' }` +
      ' |> filter(fn: (r) => r._measurement == "ENERGY_TDY" or r._measurement == "ENERGY_TOT_TDY" and r._field == "value")' +
      ' |> keep(columns: ["_time", "equip", "_value"])' +
      ' |> timeShift(duration: 3h, columns: ["_start", "_stop", "_time"])' +
      ' |> timeShift(duration: 44m, columns: ["_start", "_stop", "_time"])' +
      ' |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max) ' +
      ' |> group(columns: ["_time"], mode:"by") ' +
      ' |> sum() ' +
      ' |> group() ';

    return agentDaily.Influx.loadInfluxData(body)
      .then(result => {
        dispatch({
          type: LOAD_HEATMAP_CONSUMPTION,
          payload: {
            result
          }
        })
      })
}

export const yearDailyForecast = (data) => dispatch => {
  const range = {
    startDate: moment().subtract(2, 'years').format("YYYY-MM-DD"),
    endDate: moment().subtract(1, 'years').format("YYYY-MM-DD")
  }
  return agentDaily.Daily.loadDailyForecast(range, data.value)
    .then(result => {
      dispatch({
        type: LOAD_HEATMAP_FORECAST,
        payload: {
          result
        }
      })
    })
}

export const yearTenantBaseline = (data) => dispatch => {
  const range = {
    startDate: moment().subtract(2, 'years').format("YYYY-MM-DD"),
    endDate: moment().subtract(1, 'years').format("YYYY-MM-DD")
  }
  return agentDaily.Daily.loadTenantBaseline(range, data.label)
    .then(result => {
      if(result !== null) {
        dispatch({
          type: LOAD_HEATMAP_TENANT,
          payload: {
            result
          }
        })
      }
    })
}

export const loadDailyTemp = (city, start, end) => dispatch => {
  const body = 'from(bucket: "taka-weather")'
  + `|> range(start: ${moment(start).add(1, 'day').format('YYYY-MM-DD')}T00:00:00+04:00, stop: ${moment(end).add(1, 'day').format('YYYY-MM-DD')}T00:00:00+04:00)`
  + `|> filter(fn: (r) => r.city == "${city}")`
  + '|> filter(fn: (r) => r._measurement == "temp" and r._field == "value")'
  + '|> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)'
  + '|> group(columns: ["_time"], mode:"by")'
  + '|> sum()'
  + '|> group()'

  return agentDaily.Influx.loadInfluxData(body)
    .then(result => {
      dispatch({
        type: DAILY_TEMPERATURE,
        payload: result
      })
    })
}

export const loadDailyCDD = (cdd, city, start, stop) => dispatch => {
  let formatCdd = ""
  if(cdd) {
    const splitedCdd = cdd.split('.')
    if(Number(splitedCdd[1]) === 0) {
      formatCdd = splitedCdd[0]
    } else {
      formatCdd = splitedCdd[0] + splitedCdd[1]
    }
  }

  return agentDaily.Weather.loadDegrees(formatCdd, city, moment(start).add(1, 'day').format('YYYY-MM-DD'), moment(stop).add(1, 'day').format('YYYY-MM-DD'))
    .then(result => {
      dispatch({
        type: DAILY_CDD,
        payload: result
      })
    })
}

export const getTotalConsumption = (state) => state.daily && state.daily.consumption
export const getDailyForecast = (state) => state.daily && state.daily.dailyForecast
export const getTenantBaseline = (state) => state.daily && state.daily.tenantBaseline
export const getWholeBuildingEnergy = (state) => state.daily && state.daily.wholeBuilding
export const getSubjectCdd = (state) => state.daily && state.daily.buildingCdd
export const getTotalEnergyConsumption = (state) => state.daily && state.daily.totalEnergyConsumption
export const getAllDailyProjects = (state) => state.daily && state.daily.projects
export const getAllMdbCurrentProject = (state) => state.daily && state.daily.mdbList
export const getSelectedProject = (state) => state.daily && state.daily.selectedProject
export const getMdbPower = (state) => state.daily && state.daily.mdbPower
export const getMdbPowerSum = (state) => state.daily && state.daily.mdbPowerSum
export const getHeatMap = (state) => state.daily && state.daily.heatmap
export const getDailyTemp = (state) => state.daily && state.daily.weather
