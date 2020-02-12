import shortid from 'shortid'

import agent from '../../agent'

// actions

export const LOAD_SINGLE_REQUEST = 'ZONES//LOAD_SINGLE_REQUEST'
export const LOAD_SINGLE_SUCCESS = 'ZONES//LOAD_SINGLE_SUCCESS'
export const LOAD_SINGLE_FAILED = 'ZONES//LOAD_SINGLE_FAILED'

export const LOAD_ALL_REQUEST = 'ZONES//LOAD_ALL_REQUEST'
export const LOAD_ALL_SUCCESS = 'ZONES//LOAD_ALL_SUCCESS'
export const LOAD_ALL_FAILED = 'ZONES//LOAD_ALL_FAILED'

export const LOAD_ZONES_GROUP_REQUEST = 'ZONES//LOAD_ZONES_GROUP_REQUEST'
export const LOAD_ZONES_GROUP_SUCCESS = 'ZONES//LOAD_ZONES_GROUP_SUCCESS'
export const LOAD_ZONES_GROUP_FAILED = 'ZONES//LOAD_ZONES_GROUP_FAILED'

export const LOAD_BUILDINGS_REQUEST = 'ZONES//LOAD_BUILDINGS_REQUEST'
export const LOAD_BUILDINGS_SUCCESS = 'ZONES//LOAD_BUILDINGS_SUCCESS'
export const LOAD_BUILDINGS_FAILED = 'ZONES//LOAD_BUILDINGS_FAILED'

export const LOAD_ZONE_CONSUMPTION_REQUEST = 'ZONES//LOAD_ZONE_CONSUMPTION_REQUEST'
export const LOAD_ZONE_CONSUMPTION_SUCCESS = 'ZONES//LOAD_ZONE_CONSUMPTION_SUCCESS'
export const LOAD_ZONE_CONSUMPTION_FAILED = 'ZONES//LOAD_ZONE_CONSUMPTION_FAILED'

export const LOAD_ZONE_COST_PER_FUEL_REQUEST = 'ZONES//LOAD_ZONE_COST_PER_FUEL_REQUEST'
export const LOAD_ZONE_COST_PER_FUEL_SUCCESS = 'ZONES//LOAD_ZONE_COST_PER_FUEL_SUCCESS'
export const LOAD_ZONE_COST_PER_FUEL_FAILED = 'ZONES//LOAD_ZONE_COST_PER_FUEL_FAILED'

export const LOAD_ZONE_COST_PER_PROJECT_REQUEST = 'ZONES//LOAD_ZONE_COST_PER_PROJECT_REQUEST'
export const LOAD_ZONE_COST_PER_PROJECT_SUCCESS = 'ZONES//LOAD_ZONE_COST_PER_PROJECT_SUCCESS'
export const LOAD_ZONE_COST_PER_PROJECT_FAILED = 'ZONES//LOAD_ZONE_COST_PER_PROJECT_FAILED'

export const LOAD_ZONE_BENCHMARKS_REQUEST = 'ZONES//LOAD_ZONE_BENCHMARKS_REQUEST'
export const LOAD_ZONE_BENCHMARKS_SUCCESS = 'ZONES//LOAD_ZONE_BENCHMARKS_SUCCESS'
export const LOAD_ZONE_BENCHMARKS_FAILED = 'ZONES//LOAD_ZONE_BENCHMARKS_FAILED'

export const LOAD_ZONE_INFO_REQUEST = 'ZONES//LOAD_ZONE_INFO_REQUEST'
export const LOAD_ZONE_INFO_SUCCESS = 'ZONES//LOAD_ZONE_INFO_SUCCESS'
export const LOAD_ZONE_INFO_FAILED = 'ZONES//LOAD_ZONE_INFO_FAILED'

export const LOAD_ZONE_ENERGY_METRICS_REQUEST = 'ZONES//LOAD_ZONE_ENERGY_METRICS_REQUEST'
export const LOAD_ZONE_ENERGY_METRICS_SUCCESS = 'ZONES//LOAD_ZONE_ENERGY_METRICS_SUCCESS'
export const LOAD_ZONE_ENERGY_METRICS_FAILED = 'ZONES//LOAD_ZONE_ENERGY_METRICS_FAILED'

export const SET_ZONE_CONSUMPTION_PER_BUILDING_RANGE = 'ZONES//SET_ZONE_CONSUMPTION_PER_BUILDING_RANGE'

export const LOAD_ZONE_CONSUMPTION_PER_BUILDING_FUEL_REQUEST = 'ZONES//LOAD_ZONE_CONSUMPTION_PER_BUILDING_FUEL_REQUEST'
export const LOAD_ZONE_CONSUMPTION_PER_BUILDING_FUEL_SUCCESS = 'ZONES//LOAD_ZONE_CONSUMPTION_PER_BUILDING_FUEL_SUCCESS'
export const LOAD_ZONE_CONSUMPTION_PER_BUILDING_FUEL_FAILED = 'ZONES//LOAD_ZONE_CONSUMPTION_PER_BUILDING_FUEL_FAILED'

// state
const initialState = {
  group: [],
  list: {
    page: 0,
    pageSize: 100,
    pagesCount: 0,
    loading: false,
    count: 0,
    prevKey: null,
    lastKey: null,
    prevKeys: [],
    items: [],
  },
  single: {
    loading: false,
    error: null,
    data: {
    },
    info: {
      annualElectrical: 0,
      annualCW: 0,
      annualTotal: 0,
      averageEUI: 0,
      totalArea: 0,
    },
    buildings: [],
    energyConsumption: {
      dataId: null,
      labels: [],
      datasets: [],
      extraValues: [],
    },
    costPerFuel: {
      totalConsumption_kWH: 0,
      totalConsumption_AED: 0,
      dataId: null,
      labels: [],
      datasets: [],
    },
    costPerProject: {
      dataId: null,
      labels: [],
      datasets: [],
      total: 0,
    },
    energyMetric: {
      type: 'eui',
      dataId: null,
      labels: [],
      datasets: [],
    },
    benchmarks: {
      dataId: null,
      labels: [],
      datasets: [],
    },
    consumptionPerBuildingPerFuel: {
      range: 6,
      dataId: null,
      labels: [],
      datasets: [],
    },
  },
}

const removePrevKey = (state) => {  
  const items = [
    ...state.prevKeys,
  ]

  items.pop()

  return items
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {

  case LOAD_ALL_SUCCESS:
    return {
      ...state,
      list: {
        ...state.list,
        loading: false,
        page: action.payload.reset 
          ? initialState.list.page  
          : (action.payload.isNext ? state.list.page + 1 : state.list.page - 1),
        count: action.payload.result.count,
        pagesCount: action.payload.result.pages,
        lastKey: action.payload.result.lastKey,
        prevKey: state.list.lastKey,
        items: [
          ...action.payload.result.items,
        ],
        prevKeys: (action.payload.isNext && state.list.page !== 0)
          ? [
            ...state.list.prevKeys,
            state.list.prevKey,
          ]
          : removePrevKey(state.list),   
      },
    }

  case LOAD_SINGLE_REQUEST:
    return {
      ...state,
      single: {
        ...initialState.single,
      },
    }

  case LOAD_SINGLE_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        data: {
          ...action.payload.result,
        },
        loading: false,
      },
    }
    
  case LOAD_SINGLE_FAILED:
    return {
      ...state,
      single: {
        ...state.single,
        error: action.payload.error,
        loading: false,
      },
    }

  case LOAD_ZONES_GROUP_SUCCESS: 
    return {
      ...state,
      group: [
        ...action.payload.result.items,
      ],
    }

  case LOAD_BUILDINGS_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        buildings:[
          ...action.payload.result.projects,
        ],
      },
    }

  case LOAD_ZONE_CONSUMPTION_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        energyConsumption: {
          dataId: action.payload.dataId,
          ...action.payload.result,
        },
      },
    }

  case LOAD_ZONE_COST_PER_FUEL_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        costPerFuel: {
          dataId: action.payload.dataId,
          ...action.payload.result,
        },
      },
    }

  case LOAD_ZONE_COST_PER_PROJECT_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        costPerProject: {
          dataId: action.payload.dataId,
          ...action.payload.result,
        },
      },
    }

  case LOAD_ZONE_BENCHMARKS_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        benchmarks: {
          dataId: action.payload.dataId,
          ...action.payload.result,
        },
      },
    }

  case LOAD_ZONE_INFO_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        info: {
          ...action.payload.result,
        },
      },
    }

  case LOAD_ZONE_ENERGY_METRICS_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        energyMetric: {
          dataId: action.payload.dataId,
          ...action.payload.result,
        },
      },
    }

  case LOAD_ZONE_CONSUMPTION_PER_BUILDING_FUEL_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        consumptionPerBuildingPerFuel: {
          dataId: action.payload.dataId,
          ...action.payload.result,
        },
      },
    }

  case SET_ZONE_CONSUMPTION_PER_BUILDING_RANGE:
    return {
      ...state,
      single: {
        ...state.single,
        consumptionPerBuildingPerFuel: {
          ...state.single.consumptionPerBuildingPerFuel,
          range: action.payload.range,
        },
      },
    }

  default: 
    return state
  }

}

// actions handlers
export const load = (id) => (dispatch) => {
  dispatch({
    type: LOAD_SINGLE_REQUEST,
  })

  return agent.Zones.load(id)
    .then((result) => {
      dispatch({
        type: LOAD_SINGLE_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_SINGLE_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const initalLoad = (pageSize) => (dispatch) => {
  return dispatch(loadAll(
    pageSize, null, false, true
  ))
}

export const loadAll = (pageSize, lastKey, isNext, reset) => (dispatch) => {
  dispatch({
    type: LOAD_ALL_REQUEST,
  })

  return agent.Zones.all(pageSize, lastKey)
    .then((result) => {
      dispatch({
        type: LOAD_ALL_SUCCESS,
        payload: {
          result,
          isNext,
          reset,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ALL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadZonesGroup = () => (dispatch) => {
  dispatch({
    type: LOAD_ZONES_GROUP_REQUEST,
  })

  return agent.Zones.group()
    .then((result) => {
      dispatch({
        type: LOAD_ZONES_GROUP_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ZONES_GROUP_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadBuildingsList = (id) => (dispatch) => {
  dispatch({
    type: LOAD_BUILDINGS_REQUEST,
  })

  return agent.Zones.buildings(id)
    .then((result) => {
      dispatch({
        type: LOAD_BUILDINGS_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_BUILDINGS_FAILED,
        payload: {
          error,
        },
      })
    })
}


export const loadZoneConsumption = (id, ids, range) => (dispatch) => {
  dispatch({
    type: LOAD_ZONE_CONSUMPTION_REQUEST,
  })

  return agent.Zones.consumptionPerFuel(id, ids, range)
    .then((result) => {
      dispatch({
        type: LOAD_ZONE_CONSUMPTION_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ZONE_CONSUMPTION_FAILED,
        payload: {
          error,
        },
      })
    })
}


export const loadZoneCostPerFuel = (id, ids, range) => (dispatch) => {
  dispatch({
    type: LOAD_ZONE_COST_PER_FUEL_REQUEST,
  })

  return agent.Zones.costPerFuel(id, ids, range)
    .then((result) => {
      dispatch({
        type: LOAD_ZONE_COST_PER_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ZONE_COST_PER_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadZoneCostPerProject = (id, ids, range) => (dispatch) => {
  dispatch({
    type: LOAD_ZONE_COST_PER_PROJECT_REQUEST,
  })

  return agent.Zones.costPerProject(id, ids, range)
    .then((result) => {
      dispatch({
        type: LOAD_ZONE_COST_PER_PROJECT_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ZONE_COST_PER_PROJECT_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadZoneBenchmarks = (id, ids) => (dispatch) => {
  dispatch({
    type: LOAD_ZONE_BENCHMARKS_REQUEST,
  })

  return agent.Zones.benchmarks(id, ids)
    .then((result) => {
      dispatch({
        type: LOAD_ZONE_BENCHMARKS_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ZONE_BENCHMARKS_FAILED,
        payload: {
          error,
        },
      })
    })
}


export const loadZoneInfo = (id, ids) => (dispatch) => {
  dispatch({
    type: LOAD_ZONE_INFO_REQUEST,
  })

  return agent.Zones.info(id, ids)
    .then((result) => {
      dispatch({
        type: LOAD_ZONE_INFO_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ZONE_INFO_FAILED,
        payload: {
          error,
        },
      })
    })
}

const loadProjectEnergyMetric = (type, projectId) => {
  return Promise.all([
    agent.Metrics.energy(type, 2016, projectId),
    agent.Metrics.energy(type, 2017, projectId),
    agent.Metrics.energy(type, 2018, projectId),
    agent.Metrics.energy(type, 2019, projectId),
  ])
}

export const loadZoneProjectsEnergy = (id, projects, type = 'consumption_kWh') => (dispatch) => {
  dispatch({
    type: LOAD_ZONE_ENERGY_METRICS_REQUEST,
  })
  
  return Promise.all(
    projects.map(pid => loadProjectEnergyMetric(type, pid))
  ).then((results) => {
    const labels = [2016, 2017, 2018, 2019]
    const datasets = results.map(_projectEnergy => _projectEnergy.map(_pe => _pe.consumption))
  
    dispatch({
      type: LOAD_ZONE_ENERGY_METRICS_SUCCESS,
      payload: {
        result: {
          labels,
          datasets,
          projects,
        },
        dataId: shortid(),
      },
    })
  }).catch((error) => {
    console.log(error)
    dispatch({
      type: LOAD_ZONE_ENERGY_METRICS_FAILED,
      payload: {
        error,
      },
    })
  })
}

export const loadConsumptionPerBuildingPerFuel = (id, ids, range) => (dispatch) => {
  dispatch({
    type: LOAD_ZONE_CONSUMPTION_PER_BUILDING_FUEL_REQUEST,
  })

  return agent.Zones.consumptionByBuildingPerFuel(id, ids, range)
    .then((result) => {
      dispatch({
        type: LOAD_ZONE_CONSUMPTION_PER_BUILDING_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ZONE_CONSUMPTION_PER_BUILDING_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const setConsumptionPerBuildingRange = (range) => ({
  type: SET_ZONE_CONSUMPTION_PER_BUILDING_RANGE,
  payload: {
    range,
  },
})

// getters
export const getSingle = (state) => state.zones
  && state.zones.single
  && state.zones.single.data

export const getZonesGroup = (state) => state.zones
  && state.zones.group

export const getItems = (state) => state.zones
  && state.zones.list
  && state.zones.list.items

export const getBuildingsList = (state) => state.zones
  && state.zones.single
  && state.zones.single.buildings

export const getEnergyConsumption = (state) => state.zones
  && state.zones.single
  && state.zones.single.energyConsumption

export const getCostPerFuel = (state) => state.zones
  && state.zones.single
  && state.zones.single.costPerFuel

export const getCostPerProject = (state) => state.zones
  && state.zones.single
  && state.zones.single.costPerProject

export const getBenchmarks = (state) => state.zones
  && state.zones.single
  && state.zones.single.benchmarks

export const getInfo = (state) => state.zones
  && state.zones.single
  && state.zones.single.info

export const getEnergyMetric = (state) => state.zones
  && state.zones.single
  && state.zones.single.energyMetric

export const getConsumptionPerBuildingPerFuel = (state) => state.zones
  && state.zones.single
  && state.zones.single.consumptionPerBuildingPerFuel
