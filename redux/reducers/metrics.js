import { SubmissionError } from 'redux-form'
import shortid from 'shortid'

import agent from '../../agent'

// actions
export const LOAD_PROJECTS_TOTAL_REQUEST = 'METRICS//LOAD_PROJECTS_TOTAL_REQUEST'
export const LOAD_PROJECTS_TOTAL_SUCCESS = 'METRICS//LOAD_PROJECTS_TOTAL_SUCCESS'
export const LOAD_PROJECTS_TOTAL_FAILED = 'METRICS//LOAD_PROJECTS_TOTAL_FAILED'

export const LOAD_METERS_TOTAL_REQUEST = 'METRICS//LOAD_METERS_TOTAL_REQUEST'
export const LOAD_METERS_TOTAL_SUCCESS = 'METRICS//LOAD_METERS_TOTAL_SUCCESS'
export const LOAD_METERS_TOTAL_FAILED = 'METRICS//LOAD_METERS_TOTAL_FAILED'

export const LOAD_BILLS_TOTAL_REQUEST = 'METRICS//LOAD_BILLS_TOTAL_REQUEST'
export const LOAD_BILLS_TOTAL_SUCCESS = 'METRICS//LOAD_BILLS_TOTAL_SUCCESS'
export const LOAD_BILLS_TOTAL_FAILED = 'METRICS//LOAD_BILLS_TOTAL_FAILED'

export const SET_CONSUMPTION_FUEL_RANGE = 'METRICS//SET_CONSUMPTION_FUEL_RANGE'
export const LOAD_CONSUMPTION_FUEL_REQUEST = 'METRICS//LOAD_CONSUMPTION_FUEL_REQUEST'
export const LOAD_CONSUMPTION_FUEL_SUCCESS = 'METRICS//LOAD_CONSUMPTION_FUEL_SUCCESS'
export const LOAD_CONSUMPTION_FUEL_FAILED = 'METRICS//LOAD_CONSUMPTION_FUEL_FAILED'

export const SET_CONSUMPTION_ZONE_FUEL_RANGE = 'METRICS//SET_CONSUMPTION_ZONE_FUEL_RANGE'
export const LOAD_CONSUMPTION_ZONE_FUEL_REQUEST = 'METRICS//LOAD_CONSUMPTION_ZONE_FUEL_REQUEST'
export const LOAD_CONSUMPTION_ZONE_FUEL_SUCCESS = 'METRICS//LOAD_CONSUMPTION_ZONE_FUEL_SUCCESS'
export const LOAD_CONSUMPTION_ZONE_FUEL_FAILED = 'METRICS//LOAD_CONSUMPTION_ZONE_FUEL_FAILED'

export const SET_COST_PER_FUEL_RANGE = 'METRICS//SET_COST_PER_FUEL_RANGE'
export const LOAD_COST_PER_FUEL_REQUEST = 'METRICS//LOAD_COST_PER_FUEL_REQUEST'
export const LOAD_COST_PER_FUEL_SUCCESS = 'METRICS//LOAD_COST_PER_FUEL_SUCCESS'
export const LOAD_COST_PER_FUEL_FAILED = 'METRICS//LOAD_COST_PER_FUEL_FAILED'

export const LOAD_YEARS_ZONE_CONSUMPTION_REQUEST = 'METRICS//LOAD_YEARS_ZONE_CONSUMPTION_REQUEST'
export const LOAD_YEARS_ZONE_CONSUMPTION_SUCCESS = 'METRICS//LOAD_YEARS_ZONE_CONSUMPTION_SUCCESS'
export const LOAD_YEARS_ZONE_CONSUMPTION_FAILED = 'METRICS//LOAD_YEARS_ZONE_CONSUMPTION_FAILED'

export const SET_CONSUMPTION_BY_ZONE_RANGE = 'METRICS//SET_CONSUMPTION_BY_ZONE_RANGE'
export const SET_CONSUMPTION_BY_ZONE_TYPE = 'METRICS//SET_CONSUMPTION_BY_ZONE_TYPE'
export const LOAD_CONSUMPTION_BY_ZONE_REQUEST = 'METRICS//LOAD_CONSUMPTION_BY_ZONE_REQUEST'
export const LOAD_CONSUMPTION_BY_ZONE_SUCCESS = 'METRICS//LOAD_CONSUMPTION_BY_ZONE_SUCCESS'
export const LOAD_CONSUMPTION_BY_ZONE_FAILED = 'METRICS//LOAD_CONSUMPTION_BY_ZONE_FAILED'

export const LOAD_PORTFOLIO_INFO_REQUEST = 'METRICS//LOAD_PORTFOLIO_INFO_REQUEST'
export const LOAD_PORTFOLIO_INFO_SUCCESS = 'METRICS//LOAD_PORTFOLIO_INFO_SUCCESS'
export const LOAD_PORTFOLIO_INFO_FAILED = 'METRICS//LOAD_PORTFOLIO_INFO_FAILED'

export const SET_CONSUMPTIONS_RANGE = 'METRICS//SET_CONSUMPTIONS_RANGE'
export const LOAD_CONSUMPTIONS_REQUEST = 'METRICS//LOAD_CONSUMPTIONS_REQUEST'
export const LOAD_CONSUMPTIONS_SUCCESS = 'METRICS//LOAD_CONSUMPTIONS_SUCCESS'
export const LOAD_CONSUMPTIONS_FAILED = 'METRICS//LOAD_CONSUMPTIONS_FAILED'

export const SET_METERS_PER_MONTH_RANGE = 'METRICS//SET_METERS_PER_MONTH_RANGE'
export const LOAD_METERS_PER_MONTH_REQUEST = 'METRICS//LOAD_METERS_PER_MONTH_REQUEST'
export const LOAD_METERS_PER_MONTH_SUCCESS = 'METRICS//LOAD_METERS_PER_MONTH_SUCCESS'
export const LOAD_METERS_PER_MONTH_FAILED = 'METRICS//LOAD_METERS_PER_MONTH_FAILED'

export const LOAD_PORTFOLIO_CONSUMPTIONS_BY_YEARS_REQUEST = 'METRICS//LOAD_PORTFOLIO_CONSUMPTIONS_BY_YEARS_REQUEST'
export const LOAD_PORTFOLIO_CONSUMPTIONS_BY_YEARS_SUCCESS = 'METRICS//LOAD_PORTFOLIO_CONSUMPTIONS_BY_YEARS_SUCCESS'
export const LOAD_PORTFOLIO_CONSUMPTIONS_BY_YEARS_FAILED = 'METRICS//LOAD_PORTFOLIO_CONSUMPTIONS_BY_YEARS_FAILED'

export const LOAD_MAP_PINS_REQUEST = 'METRICS//LOAD_MAP_PINS_REQUEST'
export const LOAD_MAP_PINS_SUCCESS = 'METRICS//LOAD_MAP_PINS_SUCCESS'
export const LOAD_MAP_PINS_FAILED = 'METRICS//LOAD_MAP_PINS_FAILED'

// state
const initialState = {
  projects: {
    total: 0,
    delta: 0,
  },
  meters: {
    total: 0,
    delta: 0,
  },
  portfolioInfo: {},
  bills: {
    startDate: '',
    endDate: '',
    uploaded: 0,
    total: 0,
    delta: 0,
    progress: 0,
  },
  consumptionFuel: {
    dataId: null,
    totalConsumption_kWH: 0,
    totalConsumption_AED: 0,
    range: 6,
    startDate: '',
    endDate: '',
    labels: [],
    datasets: [],
  },
  consumptionZone: {
    dataId: null,
    range: 6,
    startDate: '',
    endDate: '',
    labels: [],
    datasets: [],
  },
  costPerFuel: {
    dataId: null,
    total: 0,
    range: 6,
    startDate: '',
    endDate: '',
    labels: [],
    datasets: [],
  },
  yearsZoneConsumption: {
    dataId: null,
    labels: [],
    datasets: [],
  },
  consumptionByZone: {
    dataId: null,
    type: 'kWh',
    total: 0,
    range: 6,
    labels: [],
    datasets: [],
  },
  consumptionByYears: {
    dataId: null,
    labels: [],
    datasets: [],
  },
  consumptions: {
    dataId: null,
    total: 0,
    range: 6,
    startDate: '',
    endDate: '',
    labels: [],
    datasets: [],
  },
  metersPerMonth: {
    dataId: null,
    total: 0,
    range: 6,
    startDate: '',
    endDate: '',
    labels: [],
    datasets: [],
  },
  map: {
    dataId: null,
    pins: [],
  },
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {

  case LOAD_METERS_TOTAL_SUCCESS:
    return {
      ...state,
      meters: {
        ...state.meters,
        total: action.payload.result.total || 0,
        delta: action.payload.result.delta || 0,
      },
    }

  case LOAD_PROJECTS_TOTAL_SUCCESS:
    return {
      ...state,
      projects: {
        ...state.projects,
        total: action.payload.result.total || 0,
        delta: action.payload.result.delta || 0,
      },
    }

  case LOAD_BILLS_TOTAL_SUCCESS:
    return {
      ...state,
      bills: {
        ...state.bills,
        startDate: action.payload.result.dates.startDate,
        endDate: action.payload.result.dates.endDate,
        uploaded: action.payload.result.uploaded,
        total: action.payload.result.total,
        delta: action.payload.result.delta,
        progress: action.payload.result.progress,
      },
    }

  case SET_CONSUMPTION_FUEL_RANGE:
    return {
      ...state,
      consumptionFuel: {
        ...state.consumptionFuel,
        range: action.payload.range,
      },
    }
    
  case LOAD_CONSUMPTION_FUEL_SUCCESS:
    return {
      ...state,
      consumptionFuel: {
        ...state.consumptionFuel,
        dataId: action.payload.dataId,
        startDate: action.payload.result.dates.startDate,
        endDate: action.payload.result.dates.endDate,
        totalConsumption_kWH: action.payload.result.totalConsumption_kWH,
        totalConsumption_AED: action.payload.result.totalConsumption_AED,
        labels: [ ...action.payload.result.labels],
        datasets: [ ...action.payload.result.datasets ],
      },
    }

  case LOAD_CONSUMPTION_ZONE_FUEL_SUCCESS:
    return {
      ...state,
      consumptionZone: {
        ...state.consumptionZone,
        dataId: action.payload.dataId,
        startDate: action.payload.result.dates.startDate,
        endDate: action.payload.result.dates.endDate,
        labels: [ ...action.payload.result.labels],
        datasets: [ ...action.payload.result.datasets ],
      },
    }

  case SET_COST_PER_FUEL_RANGE:
    return {
      ...state,
      costPerFuel: {
        ...state.costPerFuel,
        range: action.payload.range,
      },
    }

  case SET_CONSUMPTION_ZONE_FUEL_RANGE:
    return {
      ...state,
      consumptionZone: {
        ...state.consumptionZone,
        range: action.payload.range,
      },
    }

  case LOAD_COST_PER_FUEL_SUCCESS:
    return {
      ...state,
      costPerFuel: {
        ...state.costPerFuel,
        dataId: action.payload.dataId,
        startDate: action.payload.result.dates.startDate,
        endDate: action.payload.result.dates.endDate,
        total: action.payload.result.total,
        labels: [ ...action.payload.result.labels],
        datasets: [ ...action.payload.result.datasets ],
      },
    }

  case LOAD_YEARS_ZONE_CONSUMPTION_SUCCESS:
    return {
      ...state,
      yearsZoneConsumption: {
        ...state.yearsZoneConsumption,
        dataId: action.payload.dataId,
        labels: [ ...action.payload.result.labels],
        datasets: [ ...action.payload.result.datasets ],
      },
    }

  case SET_CONSUMPTION_BY_ZONE_RANGE:
    return {
      ...state,
      consumptionByZone: {
        ...state.consumptionByZone,
        range: action.payload.range,
      },
    }
  
  case SET_CONSUMPTION_BY_ZONE_TYPE:
    return {
      ...state,
      consumptionByZone: {
        ...state.consumptionByZone,
        type: action.payload.type,
      },
    }  

  case LOAD_CONSUMPTION_BY_ZONE_SUCCESS:
    return {
      ...state,
      consumptionByZone: {
        ...state.consumptionByZone,
        dataId: action.payload.dataId,
        total: action.payload.result.total,
        labels: [ ...action.payload.result.labels],
        datasets: [ ...action.payload.result.datasets ],
      },
    }

  case LOAD_PORTFOLIO_INFO_SUCCESS:
    return {
      ...state,
      portfolioInfo: {
        ...state.portfolioInfo,
        ...action.payload.result,
      },
    }  
  
  case SET_CONSUMPTIONS_RANGE:
    return {
      ...state,
      consumptions: {
        ...state.consumptions,
        range: action.payload.range,
      },
    }
  
  case LOAD_CONSUMPTIONS_SUCCESS:
    return {
      ...state,
      consumptions: {
        ...state.consumptions,
        ...action.payload.result,
        dataId: action.payload.dataId,
      },
    }  

  case LOAD_METERS_PER_MONTH_SUCCESS:
    return {
      ...state,
      metersPerMonth: {
        ...state.metersPerMonth,
        ...action.payload.result,
        dataId: action.payload.dataId,
      },
    }  

  case LOAD_PORTFOLIO_CONSUMPTIONS_BY_YEARS_SUCCESS:
    return {
      ...state,
      consumptionByYears: {
        ...state.consumptionByYears,
        ...action.payload.result,
        dataId: action.payload.dataId,
      },
    }  
  
  case SET_METERS_PER_MONTH_RANGE:
    return {
      ...state,
      metersPerMonth: {
        ...state.metersPerMonth,
        range: action.payload.range,
      },
    }
  
  case LOAD_MAP_PINS_SUCCESS:
    return {
      ...state,
      map: {
        ...state.map,
        ...action.payload.result,
        dataId: action.payload.dataId,
      },
    }


  default: 
    return state
  }

}

// actions handlers

export const loadProjectsTotal = (meta) => (dispatch) => {
  dispatch({
    type: LOAD_PROJECTS_TOTAL_REQUEST,
  })

  return agent.Metrics.projects(meta)
    .then((result) => {
      dispatch({
        type: LOAD_PROJECTS_TOTAL_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_PROJECTS_TOTAL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadMetersTotal = (meta) => (dispatch) => {
  dispatch({
    type: LOAD_METERS_TOTAL_REQUEST,
  })

  return agent.Metrics.meters(meta)
    .then((result) => {
      dispatch({
        type: LOAD_METERS_TOTAL_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_METERS_TOTAL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadBillsTotal = (meta) => (dispatch) => {
  dispatch({
    type: LOAD_BILLS_TOTAL_REQUEST,
  })

  return agent.Metrics.bills(meta)
    .then((result) => {
      dispatch({
        type: LOAD_BILLS_TOTAL_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_BILLS_TOTAL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const setConsumptionFuelRange = range => ({
  type: SET_CONSUMPTION_FUEL_RANGE,
  payload: {
    range,
  },
})

export const loadConsumptionFuel = (meta, fuelType) => (dispatch) => {
  dispatch({
    type: LOAD_CONSUMPTION_FUEL_REQUEST,
  })

  return agent.Metrics.consumptionFuel(meta, fuelType)
    .then((result) => {
      dispatch({
        type: LOAD_CONSUMPTION_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_CONSUMPTION_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const setConsumptionZoneFuelRange = range => ({
  type: SET_CONSUMPTION_ZONE_FUEL_RANGE,
  payload: {
    range,
  },
})

export const loadConsumptionZoneFuel = (delta) => (dispatch) => {
  dispatch({
    type: LOAD_CONSUMPTION_ZONE_FUEL_REQUEST,
  })

  return agent.Metrics.consumptionZoneFuel(delta)
    .then((result) => {
      dispatch({
        type: LOAD_CONSUMPTION_ZONE_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_CONSUMPTION_ZONE_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const setCostPerFuelRange = range => ({
  type: SET_COST_PER_FUEL_RANGE,
  payload: {
    range,
  },
})


export const loadCostPerFuel = (meta) => (dispatch) => {
  dispatch({
    type: LOAD_COST_PER_FUEL_REQUEST,
  })

  return agent.Metrics.costPerFuel(meta)
    .then((result) => {
      dispatch({
        type: LOAD_COST_PER_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_COST_PER_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadYearsZoneConsumption = (meta) => (dispatch) => {
  dispatch({
    type: LOAD_YEARS_ZONE_CONSUMPTION_REQUEST,
  })

  return agent.Metrics.yearsZoneConsumption(meta)
    .then((result) => {
      dispatch({
        type: LOAD_YEARS_ZONE_CONSUMPTION_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_YEARS_ZONE_CONSUMPTION_FAILED,
        payload: {
          error,
        },
      })
    })
}


export const setConsumptionByZoneRange = range => ({
  type: SET_CONSUMPTION_BY_ZONE_RANGE,
  payload: {
    range,
  },
})

export const setConsumptionByZoneType = type => ({
  type: SET_CONSUMPTION_BY_ZONE_TYPE,
  payload: {
    type,
  },
})

export const loadConsumptionByZone = (type, range) => (dispatch) => {
  dispatch({
    type: LOAD_CONSUMPTION_BY_ZONE_REQUEST,
  })

  return agent.Metrics.consumptionByZone(type, range)
    .then((result) => {
      dispatch({
        type: LOAD_CONSUMPTION_BY_ZONE_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_CONSUMPTION_BY_ZONE_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadPortfolioInfo = () => (dispatch) => {
  dispatch({
    type: LOAD_PORTFOLIO_INFO_REQUEST,
  })

  return agent.Portfolio.info()
    .then((result) => {
      dispatch({
        type: LOAD_PORTFOLIO_INFO_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_PORTFOLIO_INFO_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const setConsumptionsRange = range => ({
  type: SET_CONSUMPTIONS_RANGE,
  payload: {
    range,
  },
})

export const loadConsumptions = (range) => (dispatch) => {
  dispatch({
    type: LOAD_CONSUMPTIONS_REQUEST,
  })

  return agent.Metrics.consumptions(range)
    .then((result) => {
      dispatch({
        type: LOAD_CONSUMPTIONS_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_CONSUMPTIONS_FAILED,
        payload: {
          error,
        },
      })
    })
}


export const setMetersPerMonthRange = range => ({
  type: SET_METERS_PER_MONTH_RANGE,
  payload: {
    range,
  },
})

export const loadMetersPerMonth = (range) => (dispatch) => {
  dispatch({
    type: LOAD_METERS_PER_MONTH_REQUEST,
  })

  return agent.Metrics.metersPerMonth(range)
    .then((result) => {
      dispatch({
        type: LOAD_METERS_PER_MONTH_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_METERS_PER_MONTH_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadPortfolioConsumptionByYears = (zoneIds) => (dispatch) => {
  dispatch({
    type: LOAD_PORTFOLIO_CONSUMPTIONS_BY_YEARS_REQUEST,
  })

  return agent.Metrics.portfolioConsumptionByYears(zoneIds)
    .then((result) => {
      dispatch({
        type: LOAD_PORTFOLIO_CONSUMPTIONS_BY_YEARS_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_PORTFOLIO_CONSUMPTIONS_BY_YEARS_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadMapPins = () => (dispatch) => {
  dispatch({
    type: LOAD_MAP_PINS_REQUEST,
  })

  return agent.Buildings.mapPins()
    .then((result) => {
      dispatch({
        type: LOAD_MAP_PINS_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_MAP_PINS_FAILED,
        payload: {
          error,
        },
      })
    })
}

// getters
export const getProjectsTotal = (state) => state.metrics && state.metrics.projects
export const getMetersTotal = (state) => state.metrics && state.metrics.meters
export const getBillsTotal = (state) => state.metrics && state.metrics.bills
export const getMapPins = (state) => state.metrics && state.metrics.map && state.metrics.map.pins

export const getConsumptionFuelData = (state) => state.metrics && state.metrics.consumptionFuel
export const getConsumptionFuelRange = (state) => state.metrics && state.metrics.consumptionFuel 
  && state.metrics.consumptionFuel.range

export const getConsumptionZoneFuelData = (state) => state.metrics && state.metrics.consumptionZone
export const getConsumptionZoneFuelRange = (state) => state.metrics && state.metrics.consumptionZone 
  && state.metrics.consumptionZone.range

export const getConsumptionZone = (state) => state.metrics && state.metrics.consumptionZone


export const getCostPerFuelData = (state) => state.metrics && state.metrics.costPerFuel
export const getCostPerFuelRange = (state) => state.metrics && state.metrics.costPerFuel 
  && state.metrics.costPerFuel.range

export const getYearsZoneConsumption = (state) => state.metrics && state.metrics.yearsZoneConsumption

export const getConsumptionByZoneType = (state) => state.metrics && state.metrics.consumptionByZone
  && state.metrics.consumptionByZone.type

export const getConsumptionByZoneRange = (state) => state.metrics && state.metrics.consumptionByZone
  && state.metrics.consumptionByZone.range

export const getConsumptionByZone = (state) => state.metrics && state.metrics.consumptionByZone

export const getPortfolioInfo = (state) => state.metrics && state.metrics.portfolioInfo

export const getConsumptions = (state) => state.metrics && state.metrics.consumptions

export const getConsumptionsRange = (state) => state.metrics && state.metrics.consumptions.range

export const getMetersPerMonth = (state) => state.metrics && state.metrics.metersPerMonth

export const getMetersPerMonthRange = (state) => state.metrics && state.metrics.metersPerMonth.range

export const getConsumptionByYears = (state) => state.metrics && state.metrics.consumptionByYears