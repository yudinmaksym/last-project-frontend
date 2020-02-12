import agentDaily from '../../agentDaily'
import agent from '../../agent'
import { showStickLoader } from './loaders'
import { formatInfluxData } from '../../src/utils/format'

var moment = require('moment');

// CONSTANTS
export const LOAD_TOTAL_ENERGY_CONSUMED_LAST_MONTH_REQUEST = "PORTFOLIO//LOAD_TOTAL_ENERGY_CONSUMED_LAST_MONTH_REQUEST";
export const LOAD_TOTAL_ENERGY_CONSUMED_LAST_MONTH_SUCCESS = "PORTFOLIO//LOAD_TOTAL_ENERGY_CONSUMED_LAST_MONTH_SUCCESS";
export const LOAD_TOTAL_ENERGY_CONSUMED_LAST_MONTH_FAILED = "PORTFOLIO//LOAD_TOTAL_ENERGY_CONSUMED_LAST_MONTH_FAILED";
export const LOAD_DAILY_ENERGY_CONSUMED_LAST_MONTH_REQUEST = "PORTFOLIO//LOAD_DAILY_ENERGY_CONSUMED_LAST_MONTH_REQUEST";
export const LOAD_DAILY_ENERGY_CONSUMED_LAST_MONTH_SUCCESS = "PORTFOLIO//LOAD_DAILY_ENERGY_CONSUMED_LAST_MONTH_SUCCESS";
export const LOAD_DAILY_ENERGY_CONSUMED_LAST_MONTH_FAILED = "PORTFOLIO//LOAD_DAILY_ENERGY_CONSUMED_LAST_MONTH_FAILED";
export const LOAD_TOTAL_ENERGY_CONSUMED_LAST_WEEK_REQUEST = "PORTFOLIO//LOAD_TOTAL_ENERGY_CONSUMED_LAST_WEEK_REQUEST";
export const LOAD_TOTAL_ENERGY_CONSUMED_LAST_WEEK_SUCCESS = "PORTFOLIO//LOAD_TOTAL_ENERGY_CONSUMED_LAST_WEEK_SUCCESS";
export const LOAD_TOTAL_ENERGY_CONSUMED_LAST_WEEK_FAILED = "PORTFOLIO//LOAD_TOTAL_ENERGY_CONSUMED_LAST_WEEK_FAILED";

export const LOAD_TOTAL_BASELINE_LAST_MONTH_REQUEST = "PORTFOLIO//LOAD_TOTAL_BASELINE_LAST_MONTH_REQUEST";
export const LOAD_TOTAL_BASELINE_LAST_MONTH_SUCCESS = "PORTFOLIO//LOAD_TOTAL_BASELINE_LAST_MONTH_SUCCESS";
export const LOAD_TOTAL_BASELINE_LAST_MONTH_FAILED = "PORTFOLIO//LOAD_TOTAL_BASELINE_LAST_MONTH_FAILED";
export const LOAD_TOTAL_BASELINE_LAST_WEEK_REQUEST = "PORTFOLIO//LOAD_TOTAL_BASELINE_LAST_WEEK_REQUEST";
export const LOAD_TOTAL_BASELINE_LAST_WEEK_SUCCESS = "PORTFOLIO//LOAD_TOTAL_BASELINE_LAST_WEEK_SUCCESS";
export const LOAD_TOTAL_BASELINE_LAST_WEEK_FAILED = "PORTFOLIO//LOAD_TOTAL_BASELINE_LAST_WEEK_FAILED";
export const LOAD_DAILY_BASELINE_LAST_MONTH_REQUEST = "PORTFOLIO//LOAD_DAILY_BASELINE_LAST_MONTH_REQUEST";
export const LOAD_DAILY_BASELINE_LAST_MONTH_SUCCESS = "PORTFOLIO//LOAD_DAILY_BASELINE_LAST_MONTH_SUCCESS";
export const LOAD_DAILY_BASELINE_LAST_MONTH_FAILED = "PORTFOLIO//LOAD_DAILY_BASELINE_LAST_MONTH_FAILED";

export const LOAD_TOTAL_FORECAST_LAST_MONTH_REQUEST = "PORTFOLIO//LOAD_TOTAL_FORECAST_LAST_MONTH_REQUEST";
export const LOAD_TOTAL_FORECAST_LAST_MONTH_SUCCESS = "PORTFOLIO//LOAD_TOTAL_FORECAST_LAST_MONTH_SUCCESS";
export const LOAD_TOTAL_FORECAST_LAST_MONTH_FAILED = "PORTFOLIO//LOAD_TOTAL_FORECAST_LAST_MONTH_FAILED";
export const LOAD_TOTAL_FORECAST_LAST_WEEK_REQUEST = "PORTFOLIO//LOAD_TOTAL_FORECAST_LAST_WEEK_REQUEST";
export const LOAD_TOTAL_FORECAST_LAST_WEEK_SUCCESS = "PORTFOLIO//LOAD_TOTAL_FORECAST_LAST_WEEK_SUCCESS";
export const LOAD_TOTAL_FORECAST_LAST_WEEK_FAILED = "PORTFOLIO//LOAD_TOTAL_FORECAST_LAST_WEEK_FAILED";
export const LOAD_DAILY_FORECAST_LAST_MONTH_REQUEST = "PORTFOLIO//LOAD_DAILY_FORECAST_LAST_MONTH_REQUEST";
export const LOAD_DAILY_FORECAST_LAST_MONTH_SUCCESS = "PORTFOLIO//LOAD_DAILY_FORECAST_LAST_MONTH_SUCCESS";
export const LOAD_DAILY_FORECAST_LAST_MONTH_FAILED = "PORTFOLIO//LOAD_DAILY_FORECAST_LAST_MONTH_FAILED";

export const LOAD_TOTAL_TENANT_BASELINE_MONTH_SUCCESS = "PORTFOLIO//LOAD_TOTAL_TENANT_BASELINE_MONTH_SUCCESS";
export const LOAD_TOTAL_TENANT_BASELINE_WEEK_SUCCESS = "PORTFOLIO//LOAD_TOTAL_TENANT_BASELINE_WEEK_SUCCESS";
export const LOAD_DAILY_TENANT_BASELINE_MONTH_SUCCESS = "PORTFOLIO//LOAD_DAILY_TENANT_BASELINE_MONTH_SUCCESS";

export const LOAD_ALL_DAILY_PROJECTS_SUCCESS = "PORTFOLIO//LOAD_ALL_DAILY_PROJECTS_SUCCESS";

export const LOAD_DATA_FOR_PROJECT = "PORTFOLIO//LOAD_DATA_FOR_PROJECT";
export const LOAD_ALARMS_DATA = "PORTFOLIO//LOAD_ALARMS_DATA";
export const LOAD_CONNECTION_STATUS = "PORTFOLIO//LOAD_CONNECTION_STATUS";
export const LOAD_ONLINE_POINTS = "PORTFOLIO//LOAD_ONLINE_POINTS";
export const LOAD_OFFLINE_POINTS = "PORTFOLIO//LOAD_OFFLINE_POINTS";
export const LOAD_DISCONNECTED_SENSORS = "PORTFOLIO//LOAD_DISCONNECTED_SENSORS";
export const LOAD_OVERRIDDEN_POINTS = "PORTFOLIO//LOAD_OVERRIDDEN_POINTS";

export const CLEAR_STATE = "PORTFOLIO//CLEAR_STATE"


const initialState = {
  totalConsumption: {
    totalMonth: [],
    totalWeek: [],
    dailyMonth: []
  },
  baseline: {
    totalMonth: [],
    totalWeek: [],
    dailyMonth: []
  },
  forecast: {
    totalMonth: [],
    totalWeek: [],
    dailyMonth: [],
  },
  tenant: {
    totalMonth: [],
    totalWeek: [],
    dailyMonth: [],
  }
}

// REDUCERS
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CONNECTION_STATUS: {
      return {
        ...state,
        lastConnectionStatus: action.payload,
      }
    }
    case LOAD_ONLINE_POINTS: {
      return {
        ...state,
        onlinePoints: action.payload
      }
    }
    case LOAD_OFFLINE_POINTS: {
      return {
        ...state,
        offlinePoints: action.payload
      }
    }
    case LOAD_DISCONNECTED_SENSORS: {
      return {
        ...state,
        disconnectedSensors: action.payload
      }
    }
    case LOAD_OVERRIDDEN_POINTS: {
      return {
        ...state,
        overridenPoints: action.payload
      }
    }
    case LOAD_ALARMS_DATA: {
      return {
        ...state,
        alarmsData: action.payload
      }
    }
    case LOAD_TOTAL_ENERGY_CONSUMED_LAST_MONTH_SUCCESS: {
      return {
        ...state,
        totalConsumption: {
          ...state.totalConsumption,
          totalMonth: action.payload
        }
      }
    }
    case LOAD_TOTAL_ENERGY_CONSUMED_LAST_WEEK_SUCCESS: {
      return {
        ...state,
        totalConsumption: {
          ...state.totalConsumption,
          totalWeek: action.payload
        }
      }
    }
    case LOAD_DAILY_ENERGY_CONSUMED_LAST_MONTH_SUCCESS: {
      return {
        ...state,
        totalConsumption: {
          ...state.totalConsumption,
          dailyMonth: action.payload
        }
      }
    }
    case LOAD_TOTAL_BASELINE_LAST_MONTH_SUCCESS: {
      return {
        ...state,
        baseline: {
          ...state.baseline,
          totalMonth: action.payload.result
        }
      }
    }
    case LOAD_TOTAL_BASELINE_LAST_WEEK_SUCCESS: {
      return {
        ...state,
        baseline: {
          ...state.baseline,
          totalWeek: action.payload.result
        }
      }
    }
    case LOAD_DAILY_BASELINE_LAST_MONTH_SUCCESS: {
      return {
        ...state,
        baseline: {
          ...state.baseline,
          dailyMonth: action.payload.result
        }
      }
    }
    case LOAD_TOTAL_FORECAST_LAST_MONTH_SUCCESS: {
      return {
        ...state,
        forecast: {
          ...state.forecast,
          totalMonth: action.payload.result
        }
      }
    }
    case LOAD_TOTAL_FORECAST_LAST_WEEK_SUCCESS: {
      return {
        ...state,
        forecast: {
          ...state.forecast,
          totalWeek: action.payload.result
        }
      }
    }
    case LOAD_DAILY_FORECAST_LAST_MONTH_SUCCESS: {
      return {
        ...state,
        forecast: {
          ...state.forecast,
          dailyMonth: action.payload.result
        }
      }
    }
    case LOAD_TOTAL_TENANT_BASELINE_MONTH_SUCCESS: {
      return {
        ...state,
        tenant: {
          ...state.tenant,
          totalMonth: action.payload.result
        }
      }
    }
    case LOAD_TOTAL_TENANT_BASELINE_WEEK_SUCCESS: {
      return {
        ...state,
        tenant: {
          ...state.tenant,
          totalWeek: action.payload.result
        }
      }
    }
    case LOAD_DAILY_TENANT_BASELINE_MONTH_SUCCESS: {
      return {
        ...state,
        tenant: {
          ...state.tenant,
          dailyMonth: action.payload.result
        }
      }
    }
    case CLEAR_STATE: {
      return {
        ...state,
        tableData: []
      }
    }
    case LOAD_ALL_DAILY_PROJECTS_SUCCESS: {
      return {
        ...state,
        projects: action.payload.result.items
      }
    }
    default: return state
  }
}

// ACTIONS
export const loadAllDailyProjects = () => dispatch => {
  dispatch({type: CLEAR_STATE})

  return agentDaily.Default.loadAllProjects()
    .then(result => {
      dispatch({
        type: LOAD_ALL_DAILY_PROJECTS_SUCCESS,
        payload: {
          result
        }
      })

      if(result !== undefined) {
        return dispatch(loadAllData(result.items))
      }
    })
}

export const loadAllData = (projectList) => async dispatch => {
  const startDateMonth = moment().subtract(30,'days').subtract(1, 'year').format('YYYY-MM-DD');
  const startDateWeek = moment().subtract(7,'days').subtract(1, 'year').format('YYYY-MM-DD');
  const endDate = moment().subtract(1,'day').subtract(1, 'year').format('YYYY-MM-DD');

  dispatch(showStickLoader(true))
  await Promise.all([
    dispatch(loadConnectionStatus()),
    dispatch(loadConnectionOfflinePoints()),
    dispatch(loadConnectionOnlinePoints()),
    dispatch(loadDisconnectedSensors()),
    dispatch(loadOverriddenPoints()),
    dispatch(loadAlarmsData()),
    dispatch(generateAllProjects(projectList)),
    dispatch(loadBaselineTotalMonth(startDateMonth, endDate, projectList)),
    dispatch(loadBaselineTotalWeek(startDateWeek, endDate, projectList)),
    dispatch(loadBaselineDailyMonth(startDateMonth, endDate, projectList)),
    dispatch(loadForecastTotalMonth(startDateMonth, endDate, projectList)),
    dispatch(loadForecastTotalWeek(startDateWeek, endDate, projectList)),
    dispatch(loadForecastDailyMonth(startDateMonth, endDate, projectList)),
    dispatch(loadTenantBaseline(startDateMonth, endDate, projectList)),
    dispatch(loadTenantBaselineWeek(startDateWeek, endDate, projectList)),
    dispatch(loadDailyTenantBaseline(startDateMonth, endDate, projectList)),
  ])
  dispatch(showStickLoader(false))
}

export const loadAllMdbListForCurrentProject = (projectId) => {
  return agentDaily.Daily.loadAllMdbListForCurrentProject(projectId)
    .then(result => result)
}

export const generateAllProjects = (projects) => async dispatch =>{
  let site = ''
  const startDateMonth = moment().subtract(30,'days').format('YYYY-MM-DD');
  const startDateWeek = moment().subtract(7,'days').format('YYYY-MM-DD');

  return await Promise.all(projects.map(el => {
    return agentDaily.Daily.loadAllMdbListForCurrentProject(el.id)
      .then(result => {
        if(result.items.length !== 0) {
          site += generateQueryString('equip', result.items, el.iot_name)
        }
      })
  })).then(() => {
    dispatch(loadEnergyConsumedTotalMonth(startDateMonth, site)),
    dispatch(loadEnergyConsumedTotalWeek(startDateWeek, site)),
    dispatch(loadEnergyConsumedDailyMonth(startDateMonth, site))
  })
}

const generateQueryString = (type, items, site) => {
  let equip = ''
  items.map((el, index) => {
    equip += `r.${type} == "${el.iot_name}" or `
  })
  let string = `(r.site == "${site}" and (${equip.slice(0, -3)})) or `
  return string
}

export const loadEnergyConsumedTotalMonth = (startDate, site) => dispatch => {
  dispatch({
    type: LOAD_TOTAL_ENERGY_CONSUMED_LAST_MONTH_REQUEST
  })

  const endDate = moment().format("YYYY-MM-DDT00:00:00+04:00")
  const body = `
    from(bucket: "taka-iot-data-energy")
      |> range(start: ${startDate}, stop: ${endDate})
      ${site  ? `|> filter(fn: (r) => ${site.slice(0, -3)})` : ''}
      |> filter(fn: (r) => r._measurement == "ENERGY_TDY" or r._measurement == "ENERGY_TOT_TDY" and r._field == "value")
      |> keep(columns: ["_time", "site", "equip", "equipOrd", "_value"])
      |> timeShift(duration: 3h, columns: ["_start", "_stop", "_time"])
      |> timeShift(duration: 44m, columns: ["_start", "_stop", "_time"])
      |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)
      |> keep(columns: ["_time", "site", "_value"])
      |> sum()` ;

    return agentDaily.Influx.loadInfluxData(body)
      .then(result => {
        dispatch({
          type: LOAD_TOTAL_ENERGY_CONSUMED_LAST_MONTH_SUCCESS,
          payload: result
        })
      })
}

export const loadEnergyConsumedTotalWeek = (startDate, site) => dispatch => {
  dispatch({
    type: LOAD_TOTAL_ENERGY_CONSUMED_LAST_WEEK_REQUEST
  })

  const endDate = moment().format("YYYY-MM-DDT00:00:00+04:00")
  const body = `
    from(bucket: "taka-iot-data-energy")
      |> range(start: ${startDate}, stop: ${endDate})
      ${site  ? `|> filter(fn: (r) => ${site.slice(0, -3)})` : ''}
      |> filter(fn: (r) => r._measurement == "ENERGY_TDY" or r._measurement == "ENERGY_TOT_TDY" and r._field == "value")
      |> keep(columns: ["_time", "site", "equip", "equipOrd", "_value"])
      |> timeShift(duration: 3h, columns: ["_start", "_stop", "_time"])
      |> timeShift(duration: 44m, columns: ["_start", "_stop", "_time"])
      |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)
      |> keep(columns: ["_time", "site", "_value"])
      |> sum()`

  return agentDaily.Influx.loadInfluxData(body)
    .then(result => {
      dispatch({
        type: LOAD_TOTAL_ENERGY_CONSUMED_LAST_WEEK_SUCCESS,
        payload: result
      })
    })
}

export const loadEnergyConsumedDailyMonth = (startDate, site) => dispatch => {
  dispatch({
    type: LOAD_DAILY_ENERGY_CONSUMED_LAST_MONTH_REQUEST
  })

  const endDate = moment().format("YYYY-MM-DDT00:00:00+04:00")

  const body = `
    from(bucket: "taka-iot-data-energy")
      |> range(start: ${startDate}T00:16:00+04:00, stop: ${endDate})
      ${site  ? `|> filter(fn: (r) => ${site.slice(0, -3)})` : ''}
      |> filter(fn: (r) => r._measurement == "ENERGY_TDY" or r._measurement == "ENERGY_TOT_TDY" and r._field == "value")
      |> keep(columns: ["_time", "equip", "site", "_value"]) 
      |> timeShift(duration: 3h, columns: ["_start", "_stop", "_time"])
      |> timeShift(duration: 44m, columns: ["_start", "_stop", "_time"])
      |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)
      |> keep(columns: ["_time", "site", "_value"])
      |> aggregateWindow(every: 1d, timeSrc: "_start", fn: sum)`

    return agentDaily.Influx.loadInfluxData(body)
      .then(result => {
        dispatch({
          type: LOAD_DAILY_ENERGY_CONSUMED_LAST_MONTH_SUCCESS,
          payload: result
        })
      })
}

export const loadBaselineTotalMonth = (startDate, endDate, projects) => async dispatch => {
  dispatch({
    type: LOAD_TOTAL_BASELINE_LAST_MONTH_REQUEST
  })

  let result = []

  return await Promise.all(projects.map(el => {
    return agentDaily.Portfolio.baselineTotalMonth(el.id, startDate, endDate)
      .then(res => result.push({ result: res.items[0].value, name: el.iot_name }))
  })).then(() => {
    dispatch({
      type: LOAD_TOTAL_BASELINE_LAST_MONTH_SUCCESS,
      payload: {
        result
      },
    })
  })
}

export const loadBaselineTotalWeek = (startDate, endDate, projects) => async dispatch => {
  dispatch({
    type: LOAD_TOTAL_BASELINE_LAST_WEEK_REQUEST
  })

  let result = []

  return await Promise.all(projects.map(el => {
    return agentDaily.Portfolio.baselineTotalWeek(el.id, startDate, endDate)
      .then(res => result.push({ result: res.items[0].value, name: el.iot_name }))
  })).then(() => {
    dispatch({
      type: LOAD_TOTAL_BASELINE_LAST_WEEK_SUCCESS,
      payload: {
        result
      },
    })
  })
}

export const loadBaselineDailyMonth = (startDate, endDate, projects) => async dispatch => {
  dispatch({
    type: LOAD_DAILY_BASELINE_LAST_MONTH_REQUEST
  })

  let result = []

  return await Promise.all(projects.map(el => {
    return agentDaily.Portfolio.baselineDailyMonth(el.id, startDate, endDate)
      .then(res => result.push({ result: res.items, name: el.iot_name }))
  })).then(() => {
    dispatch({
      type: LOAD_DAILY_BASELINE_LAST_MONTH_SUCCESS,
      payload: {
        result
      },
    })
  })
}

export const loadForecastTotalMonth = (startDate, endDate, projects) => async dispatch => {
  dispatch({
    type: LOAD_TOTAL_FORECAST_LAST_MONTH_REQUEST
  })
  let result = []
  return await Promise.all(projects.map(el => {
    return agentDaily.Portfolio.forecastTotalMonth(el.id, startDate, endDate)
      .then(res => result.push({ result: res.items[0].value, name: el.iot_name }))
  })).then(() => {
    dispatch({
      type: LOAD_TOTAL_FORECAST_LAST_MONTH_SUCCESS,
      payload: {
        result
      },
    })
  })
}

export const loadForecastTotalWeek = (startDate, endDate, projects) => async dispatch => {
  dispatch({
    type: LOAD_TOTAL_FORECAST_LAST_WEEK_REQUEST
  })
  let result = []
  return await Promise.all(projects.map(el => {
    return agentDaily.Portfolio.forecastTotalWeek(el.id, startDate, endDate)
      .then(res => result.push({ result: res.items[0].value, name: el.iot_name }))
  })).then(() => {
    dispatch({
      type: LOAD_TOTAL_FORECAST_LAST_WEEK_SUCCESS,
      payload: {
        result
      },
    })
  })
}

export const loadForecastDailyMonth = (startDate, endDate, projects) => async dispatch => {
  dispatch({
    type: LOAD_DAILY_FORECAST_LAST_MONTH_REQUEST
  })
  let result = []
  return await Promise.all(projects.map(el => {
    return agentDaily.Portfolio.forecastDailyMonth(el.id, startDate, endDate)
      .then(res => result.push({ result: res.items, name: el.iot_name }))
  })).then(() => {
    dispatch({
      type: LOAD_DAILY_FORECAST_LAST_MONTH_SUCCESS,
      payload: {
        result
      },
    })
  })
}

export const loadTenantBaseline = (startDate, endDate, projects) => async dispatch => {

  let result = []
  return await Promise.all(projects.map(el => {
    return agentDaily.Portfolio.tenantBaseline(el.id, startDate, endDate)
      .then(res => result.push({ result: res.items[0].value, name: el.iot_name }))
  })).then(() => {
    dispatch({
      type: LOAD_TOTAL_TENANT_BASELINE_MONTH_SUCCESS,
      payload: {
        result
      },
    })
  })
}

export const loadTenantBaselineWeek = (startDate, endDate, projects) => async dispatch => {

  let result = []
  return await Promise.all(projects.map(el => {
    return agentDaily.Portfolio.tenantBaseline(el.id, startDate, endDate)
      .then(res => result.push({ result: res.items[0].value, name: el.iot_name }))
  })).then(() => {
    dispatch({
      type: LOAD_TOTAL_TENANT_BASELINE_WEEK_SUCCESS,
      payload: {
        result
      },
    })
  })
}

export const loadDailyTenantBaseline = (startDate, endDate, projects) => async dispatch => {
  let result = []
  return await Promise.all(projects.map(el => {
    return agentDaily.Portfolio.dailyTenantBaseline(el.id, startDate, endDate)
      .then(res => result.push({ result: res.items, name: el.iot_name }))
  })).then(() => {
    dispatch({
      type: LOAD_DAILY_TENANT_BASELINE_MONTH_SUCCESS,
      payload: {
        result
      },
    })
  })
}

export const loadConnectionOfflinePoints = () => dispatch => {
  const body = 
    'from(bucket: "_monitoring")'
    + '|> range(start: -1d)'
    + '|> filter(fn: (r) => r._field == "dead")'
    + '|> filter(fn: (r) => r._value == true)'
    + '|> last()'
    + '|> keep(columns: ["site", "equip", "_source_measurement"])'
    + '|> group(columns: ["site"], mode:"by")'
    + '|> count(column: "_source_measurement")'
    + '|> rename(columns: {_source_measurement: "offline"})'

  return agentDaily.Influx.loadInfluxData(body)
    .then(result => {
      var filtered = formatInfluxData(result)
      dispatch({
        type: LOAD_OFFLINE_POINTS,
        payload: filtered
      })
    })
}

export const loadConnectionOnlinePoints = () => dispatch => {
  const body = 
    'from(bucket: "taka-iot-data")'
    + '|> range(start: -1d)'
    + '|> last()'
    + '|> keep(columns: ["site", "equip", "_measurement"])'
    + '|> group(columns: ["site"], mode:"by")'
    + '|> count(column: "_measurement")'
    + '|> rename(columns: {_measurement: "online"})'

    return agentDaily.Influx.loadInfluxData(body)
    .then(result => {
      var filtered = formatInfluxData(result)
      dispatch({
        type: LOAD_ONLINE_POINTS,
        payload: filtered
      })
    })
}

export const loadOverriddenPoints = () => dispatch => {
  const body = 
    `import "strings"
    from(bucket: "taka-iot-data")
    |> range(start: -1d)
    |> last()
    |> filter(fn: (r) => (strings.index(v: r.pointStatus, substr: "overridden") > -1))
    |> keep(columns: ["site", "equip", "_measurement"])
    |> group(columns: ["site"], mode:"by")
    |> count(column: "_measurement")
    |> rename(columns: {_measurement: "overridden"})`

    return agentDaily.Influx.loadInfluxData(body)
    .then(result => {
      var filtered = formatInfluxData(result)
      dispatch({
        type: LOAD_OVERRIDDEN_POINTS,
        payload: filtered
      })
    })
}

export const loadAlarmsData = () => dispatch => {

  const body = 'from(bucket: "taka-iot-alarms")'
  + `|> range(start: -2d)`
  + '|> filter(fn: (r) => r.toState != "normal")'
  + '|> toString()'
  + '|> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")'
  + '|> group()'
  + '|> keep(columns: ["site", "class", "_time", "equip", "_measurement", "priority", "count", "alarmValue", "offnormalValue", "presentValue", "source"])'
  + '|> unique(column: "source")'

  return agentDaily.Influx.loadInfluxData(body)
      .then(result => {
        var filtered = formatInfluxData(result)
        dispatch({
          type: LOAD_ALARMS_DATA,
          payload: filtered
        })
      })
}

export const loadDisconnectedSensors = () => dispatch => {
  const body = 
    `from(bucket: "_monitoring")
    |> range(start: -90m)
    |> filter(fn: (r) => r._field == "dead")
    |> filter(fn: (r) => r._value == true)
    |> last()
    |> keep(columns: ["_time", "site", "equip", "_source_measurement"])
    |> group(columns: ["site"], mode:"by")
    |> count(column: "_source_measurement")
    |> rename(columns: {_source_measurement: "offline"})`

    return agentDaily.Influx.loadInfluxData(body)
    .then(result => {
      var filtered = formatInfluxData(result)

      dispatch({
        type: LOAD_DISCONNECTED_SENSORS,
        payload: filtered
      })
    })
}

export const loadConnectionStatus = () => dispatch => {
  const body = `
    from(bucket: "taka-iot-monitor")
    |> range(start: -1h)
    |> drop(columns: ["status"])
    |> sort(columns: ["_time"], desc: false)
    |> last()
    |> group(columns: ["_measurement"], mode:"by")
    |> group()
  `

  return agentDaily.Influx.loadInfluxData(body)
    .then(result => {
      var filtered = formatInfluxData(result)

      dispatch({
        type: LOAD_CONNECTION_STATUS,
        payload: filtered
      })
        
    })
}

export const getTableData = (state) => state.portfolio && state.portfolio.tableData
export const getConnectedStatus = (state) => state.portfolio && state.portfolio.lastConnectionStatus
export const getOnlinePoints = (state) => state.portfolio && state.portfolio.onlinePoints
export const getOfflineStatus = (state) => state.portfolio && state.portfolio.offlinePoints
export const getDisconnectedSensors = (state) => state.portfolio && state.portfolio.disconnectedSensors
export const getOverriddenPoints = (state) => state.portfolio && state.portfolio.overridenPoints
export const getAlarmsData = (state) => state.portfolio && state.portfolio.alarmsData
export const getProjects = (state) => state.portfolio && state.portfolio.projects
export const getConsumption = (state) => state.portfolio && state.portfolio.totalConsumption
export const getBaseline = (state) => state.portfolio && state.portfolio.baseline
export const getForecast = (state) => state.portfolio && state.portfolio.forecast
export const getTenantBaseline = (state) => state.portfolio && state.portfolio.tenant
