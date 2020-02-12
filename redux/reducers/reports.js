import agent from '../../agent'


export const LOAD_INFO_REQUEST = 'REPORTS//LOAD_INFO_REQUEST'
export const LOAD_INFO_SUCCESS = 'REPORTS//LOAD_INFO_SUCCESS'
export const LOAD_INFO_FAIL = 'REPORTS//LOAD_INFO_FAIL'

export const LOAD_ENERGY_CONSUMPTION_REQUEST = 'REPORTS//LOAD_ENERGY_CONSUMPTION_REQUEST'
export const LOAD_ENERGY_CONSUMPTION_SUCCESS = 'REPORTS//LOAD_ENERGY_CONSUMPTION_SUCCESS'
export const LOAD_ENERGY_CONSUMPTION_FAIL = 'REPORTS//LOAD_ENERGY_CONSUMPTION_FAIL'

export const LOAD_ENERGY_CONSUMPTION_BY_YEAR_REQUEST = 'REPORTS//LOAD_ENERGY_CONSUMPTION_BY_YEAR_REQUEST'
export const LOAD_ENERGY_CONSUMPTION_BY_YEAR_SUCCESS = 'REPORTS//LOAD_ENERGY_CONSUMPTION_BY_YEAR_SUCCESS'
export const LOAD_ENERGY_CONSUMPTION_BY_YEAR_FAIL = 'REPORTS//LOAD_ENERGY_CONSUMPTION_BY_YEAR_FAIL'

export const LOAD_ENERGY_COST_REQUEST = 'REPORTS//LOAD_ENERGY_COST_REQUEST'
export const LOAD_ENERGY_COST_SUCCESS = 'REPORTS//LOAD_ENERGY_COST_SUCCESS'
export const LOAD_ENERGY_COST_FAIL = 'REPORTS//LOAD_ENERGY_COST_FAIL'

export const LOAD_ENERGY_CONSUMPTION_BY_LEVEL_REQUEST = 'REPORTS//LOAD_ENERGY_CONSUMPTION_BY_LEVEL_REQUEST'
export const LOAD_ENERGY_CONSUMPTION_BY_LEVEL_SUCCESS = 'REPORTS//LOAD_ENERGY_CONSUMPTION_BY_LEVEL_SUCCESS'
export const LOAD_ENERGY_CONSUMPTION_BY_LEVEL_FAIL = 'REPORTS//LOAD_ENERGY_CONSUMPTION_BY_LEVEL_FAIL'

export const LOAD_ENERGY_CONSUMPTION_ACTUAL_REQUEST = 'REPORTS//LOAD_ENERGY_CONSUMPTION_ACTUAL_REQUEST'
export const LOAD_ENERGY_CONSUMPTION_ACTUAL_SUCCESS = 'REPORTS//LOAD_ENERGY_CONSUMPTION_ACTUAL_SUCCESS'
export const LOAD_ENERGY_CONSUMPTION_ACTUAL_FAIL = 'REPORTS//LOAD_ENERGY_CONSUMPTION_ACTUAL_FAIL'

export const LOAD_ENERGY_CONSUMPTION_YEAR_ON_YEAR_REQUEST = 'REPORTS//LOAD_ENERGY_CONSUMPTION_YEAR_ON_YEAR_REQUEST'
export const LOAD_ENERGY_CONSUMPTION_YEAR_ON_YEAR_SUCCESS = 'REPORTS//LOAD_ENERGY_CONSUMPTION_YEAR_ON_YEAR_SUCCESS'
export const LOAD_ENERGY_CONSUMPTION_YEAR_ON_YEAR_FAIL = 'REPORTS//LOAD_ENERGY_CONSUMPTION_YEAR_ON_YEAR_FAIL'

const initialState = {
  info: {
    
  },
  energy: {
    current: {
      energy: {},
      electricity: {},
      chilledWater: {},
      water: {},
    },
    past: {
      energy: {},
      electricity: {},
      chilledWater: {},
      water: {},
    },
  },
  energyConsumptionByYears: {
    labels: [],
    datasets: [],
  },
  energyCost: {
    labels: [],
    datasets: [],
  },
  energyConsumptionByLevel: {
    labels: [],
    datasets: [],
  },
  energyConsumptionActualBaseline: {
    labels: [],
    datasets: [],
  },
  energyYOYConsumption: {
    labels: [],
    datasets: [],
  },
}

export default (state = initialState, action) => {
  switch(action.type) {

  case LOAD_INFO_SUCCESS: 
    return {
      ...state,
      info: {
        ...state.info,
        ...action.payload.result,
      },
    }

  case LOAD_ENERGY_CONSUMPTION_SUCCESS: 
    return {
      ...state,
      energy: {
        ...state.energy,
        ...action.payload.result,
      },
    }
  
  case LOAD_ENERGY_CONSUMPTION_BY_YEAR_SUCCESS: 
    return {
      ...state,
      energyConsumptionByYears: {
        ...state.energyConsumptionByYears,
        ...action.payload.result,
      },
    }

  case LOAD_ENERGY_COST_SUCCESS: 
    return {
      ...state,
      energyCost: {
        ...state.energyCost,
        ...action.payload.result,
      },
    }

  case LOAD_ENERGY_CONSUMPTION_BY_LEVEL_SUCCESS: 
    return {
      ...state,
      energyConsumptionByLevel: {
        ...state.energyConsumptionByLevel,
        ...action.payload.result,
      },
    }

  case LOAD_ENERGY_CONSUMPTION_ACTUAL_SUCCESS: 
    return {
      ...state,
      energyConsumptionActualBaseline: {
        ...state.energyConsumptionActualBaseline,
        ...action.payload.result,
      },
    }
  
  case LOAD_ENERGY_CONSUMPTION_YEAR_ON_YEAR_SUCCESS: 
    return {
      ...state,
      energyYOYConsumption: {
        ...state.energyYOYConsumption,
        ...action.payload.result,
      },
    }

  default: return state
  }
}

export const loadInfo = (type, year, month, id) => (dispatch, getState) => {
  dispatch({
    type: LOAD_INFO_REQUEST,
  })

  return agent.Reports.info(type, year, month, id)
    .then((result) => {
      dispatch({
        type: LOAD_INFO_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_INFO_FAIL,
        payload: {
          error,
        },
      })
    })
}

export const loadEnergyConsumption = (type, year, month, id) => (dispatch, getState) => {
  dispatch({
    type: LOAD_ENERGY_CONSUMPTION_REQUEST,
  })

  return agent.Reports.energy(type, year, month, id)
    .then((result) => {
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_FAIL,
        payload: {
          error,
        },
      })
    })
}

export const loadEnergyConsumptionByYears = (type, year, month, id) => (dispatch, getState) => {
  dispatch({
    type: LOAD_ENERGY_CONSUMPTION_BY_YEAR_REQUEST,
  })

  return agent.Reports.energyConsumptionByYears(type, year, month, id)
    .then((result) => {
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_BY_YEAR_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_BY_YEAR_FAIL,
        payload: {
          error,
        },
      })
    })
}

export const loadEnergyCost = (type, year, month, id) => (dispatch, getState) => {
  dispatch({
    type: LOAD_ENERGY_COST_REQUEST,
  })

  return agent.Reports.energyCost(type, year, month, id)
    .then((result) => {
      dispatch({
        type: LOAD_ENERGY_COST_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ENERGY_COST_FAIL,
        payload: {
          error,
        },
      })
    })
}

export const loadEnergyConsumptionByLevel = (type, year, month, id) => (dispatch, getState) => {
  dispatch({
    type: LOAD_ENERGY_CONSUMPTION_BY_LEVEL_REQUEST,
  })

  return agent.Reports.energyConsumptionByLevel(type, year, month, id)
    .then((result) => {
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_BY_LEVEL_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_BY_LEVEL_FAIL,
        payload: {
          error,
        },
      })
    })
}

export const loadEnergyConsumptionActual = (type, year, month, id) => (dispatch, getState) => {
  dispatch({
    type: LOAD_ENERGY_CONSUMPTION_ACTUAL_REQUEST,
  })

  return agent.Reports.energyConsumptionActualBaseline(type, year, month, id)
    .then((result) => {
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_ACTUAL_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_ACTUAL_FAIL,
        payload: {
          error,
        },
      })
    })
}

export const loadEnergyConsumptionYOY = (type, year, month, id) => (dispatch, getState) => {
  dispatch({
    type: LOAD_ENERGY_CONSUMPTION_YEAR_ON_YEAR_REQUEST,
  })

  return agent.Reports.energyYOYConsumption(type, year, month, id)
    .then((result) => {
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_YEAR_ON_YEAR_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_YEAR_ON_YEAR_FAIL,
        payload: {
          error,
        },
      })
    })
}

// getters
export const getInfo = (state) => state.reports && state.reports.info 
export const getEnergy = (state) => state.reports && state.reports.energy 
export const getEnergyCost = (state) => state.reports && state.reports.energyCost
export const getEnergyConsumptionByLevel = (state) => state.reports && state.reports.energyConsumptionByLevel
export const getEnergyConsumptionByYears = (state) => state.reports && state.reports.energyConsumptionByYears
export const getEnergyConsumptionYOY = (state) => state.reports && state.reports.energyYOYConsumption

export const getEnergyConsumptionActualBaseline = (state) => 
  state.reports 
  && state.reports.energyConsumptionActualBaseline
