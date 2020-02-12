import shortid from 'shortid'
import moment from 'moment'

import agent from '../../agent'


export const SET_DATE = 'MV//SET_DATE'

export const LOAD_METRICS_REQUEST = 'MV//LOAD_METRICS_REQUEST'
export const LOAD_METRICS_SUCCESS = 'MV//LOAD_METRICS_SUCCESS'
export const LOAD_METRICS_FAILED = 'MV//LOAD_METRICS_FAILED'

export const LOAD_VARIABLES_REQUEST = 'MV//LOAD_VARIABLES_REQUEST'
export const LOAD_VARIABLES_SUCCESS = 'MV//LOAD_VARIABLES_SUCCESS'
export const LOAD_VARIABLES_FAILED = 'MV//LOAD_VARIABLES_FAILED'

export const LOAD_CONSUMPTION_HISTORY_REQUEST = 'MV//LOAD_CONSUMPTION_HISTORY_REQUEST'
export const LOAD_CONSUMPTION_HISTORY_SUCCESS = 'MV//LOAD_CONSUMPTION_HISTORY_SUCCESS'
export const LOAD_CONSUMPTION_HISTORY_FAILED = 'MV//LOAD_CONSUMPTION_HISTORY_FAILED'

export const LOAD_CONSUMPTION_REQUEST = 'MV//LOAD_CONSUMPTION_REQUEST'
export const LOAD_CONSUMPTION_SUCCESS = 'MV//LOAD_CONSUMPTION_SUCCESS'
export const LOAD_CONSUMPTION_FAILED = 'MV//LOAD_CONSUMPTION_FAILED'

export const LOAD_YOY_CONSUMPTION_REQUEST = 'MV//LOAD_YOY_CONSUMPTION_REQUEST'
export const LOAD_YOY_CONSUMPTION_SUCCESS = 'MV//LOAD_YOY_CONSUMPTION_SUCCESS'
export const LOAD_YOY_CONSUMPTION_FAILED = 'MV//LOAD_YOY_CONSUMPTION_FAILED'

export const LOAD_FORECAST_CONSUMPTION_REQUEST = 'MV//LOAD_FORECAST_CONSUMPTION_REQUEST'
export const LOAD_FORECAST_CONSUMPTION_SUCCESS = 'MV//LOAD_FORECAST_CONSUMPTION_SUCCESS'
export const LOAD_FORECAST_CONSUMPTION_FAILED = 'MV//LOAD_FORECAST_CONSUMPTION_FAILED'

export const LOAD_FORECAST_VS_ACTUAL_REQUEST = 'MV//LOAD_FORECAST_VS_ACTUAL_REQUEST'
export const LOAD_FORECAST_VS_ACTUAL_SUCCESS = 'MV//LOAD_FORECAST_VS_ACTUAL_SUCCESS'
export const LOAD_FORECAST_VS_ACTUAL_FAILED = 'MV//LOAD_FORECAST_VS_ACTUAL_FAILED'

const initialState = {
  date: moment(),
  loading: false,
  variables: [],
  metrics: {
    BldgMVConsumptionSavings_kWh: 0,
    BldgMVCostSavings_AED: 0,
    PrjctMVConsumptionSavings_kWh: 0,
    PrjctMVCostSavings_AED: 0,
  },
  equations: [],
  computedVariablesMap: {},
  electricalConsumptionHistory: {
    datasets:[
      
    ],
    labels: [
      
    ],
  },
  electricityConsumption: {
    labels: [
      
    ],
    datasets: [
      
    ],
  },
  yoyElectricalConsumptionCommonSpace: {
    labels: [
      
    ],
    datasets: [
      
    ],
  },
  forecastElectricityConsumption: {
    labels: [
     
    ],
    datasets: [
      
    ],
  },
  forecastVSActualSavings: {
    labels: [
      
    ],
    datasets: [
      
    ],
  },
  chwConsumptionHistory: {
    datasets:[
      
    ],
    labels: [
      
    ],
  },
  chwConsumption: {
    labels: [
      
    ],
    datasets: [
      
    ],
  },
  yoyChwConsumptionCommonSpace: {
    labels: [
      
    ],
    datasets: [
      
    ],
  },
  forecastChwConsumption: {
    labels: [
     
    ],
    datasets: [
      
    ],
  },
  forecastChwVSActualSavings: {
    labels: [
      
    ],
    datasets: [
      
    ],
  },
}

function getActionSource(action, type) {
  if (type === 'chw') {
    switch (action) {
    case LOAD_CONSUMPTION_HISTORY_SUCCESS:
      return 'chwConsumptionHistory'

    case LOAD_CONSUMPTION_SUCCESS:
      return 'chwConsumption'

    case LOAD_YOY_CONSUMPTION_SUCCESS:
      return 'yoyChwConsumptionCommonSpace'

    case LOAD_FORECAST_CONSUMPTION_SUCCESS:
      return 'forecastChwConsumption'

    case LOAD_FORECAST_VS_ACTUAL_SUCCESS:
      return 'forecastChwVSActualSavings'
    }
  }

  switch (action) {
  case LOAD_CONSUMPTION_HISTORY_SUCCESS:
    return 'electricalConsumptionHistory'
        
  case LOAD_CONSUMPTION_SUCCESS:
    return 'electricityConsumption'
        
  case LOAD_YOY_CONSUMPTION_SUCCESS:
    return 'yoyElectricalConsumptionCommonSpace'
        
  case LOAD_FORECAST_CONSUMPTION_SUCCESS:
    return 'forecastElectricityConsumption'
        
  case LOAD_FORECAST_VS_ACTUAL_SUCCESS:
    return 'forecastVSActualSavings'
        
  }
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {

  case LOAD_METRICS_REQUEST: 
    return {
      ...state,
      loading: true,
    }

  case LOAD_METRICS_SUCCESS: 
    return {
      ...state,
      loading: false,
      metrics: {
        ...action.payload.result.computed,
      },
      equations: [
        ...action.payload.result.meta.equationsToCompute,
      ],
      computedVariablesMap: {
        ...action.payload.result.meta.computedVariablesMap,
      },
    }

  case LOAD_CONSUMPTION_HISTORY_SUCCESS: 
    return {
      ...state,
      [getActionSource(LOAD_CONSUMPTION_HISTORY_SUCCESS, action.payload.type)]: {
        ...state[getActionSource(LOAD_CONSUMPTION_HISTORY_SUCCESS, action.payload.type)],
        ...action.payload.result,
        dataId: action.payload.dataId,
      },
    }

  case LOAD_CONSUMPTION_SUCCESS: 
    return {
      ...state,
      [getActionSource(LOAD_CONSUMPTION_SUCCESS, action.payload.type)]: {
        ...state[getActionSource(LOAD_CONSUMPTION_SUCCESS, action.payload.type)],
        ...action.payload.result,
        dataId: action.payload.dataId,
      },
    }

  case LOAD_YOY_CONSUMPTION_SUCCESS: 
    return {
      ...state,
      [getActionSource(LOAD_YOY_CONSUMPTION_SUCCESS, action.payload.type)]: {
        ...state[getActionSource(LOAD_YOY_CONSUMPTION_SUCCESS, action.payload.type)],
        ...action.payload.result,
        dataId: action.payload.dataId,
      },
    }

  case LOAD_FORECAST_CONSUMPTION_SUCCESS: 
    return {
      ...state,
      [getActionSource(LOAD_FORECAST_CONSUMPTION_SUCCESS, action.payload.type)]: {
        ...state[getActionSource(LOAD_FORECAST_CONSUMPTION_SUCCESS, action.payload.type)],
        ...action.payload.result,
        dataId: action.payload.dataId,
      },
    }

  case LOAD_FORECAST_VS_ACTUAL_SUCCESS: 
    return {
      ...state,
      [getActionSource(LOAD_FORECAST_VS_ACTUAL_SUCCESS, action.payload.type)]: {
        ...state[getActionSource(LOAD_FORECAST_VS_ACTUAL_SUCCESS, action.payload.type)],
        ...action.payload.result,
        dataId: action.payload.dataId,
      },
    }

  case LOAD_METRICS_FAILED:
    return {
      ...state,
      loading: false,
    }

  case SET_DATE:
    return {
      ...state,
      date: action.payload.date,
    }

  case LOAD_VARIABLES_SUCCESS: 
    return {
      ...state,
      variables: [
        ...action.payload.result.variables,
      ],
    }

  default:
    return state
  }
}


export const loadVariables = () => dispatch => {
  dispatch({
    type: LOAD_VARIABLES_REQUEST,
  })

  return agent.MV.variables()
    .then(result => {
      dispatch({
        type: LOAD_VARIABLES_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_VARIABLES_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadMetrics = (projectId, month, year) => dispatch => {
  dispatch({
    type: LOAD_METRICS_REQUEST,
  })

  return agent.MV.calculations(projectId, month, year)
    .then(result => {
      dispatch({
        type: LOAD_METRICS_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_METRICS_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadConsumptionHistory = (projectId, month, year, type = 'electricity') => dispatch => {
  dispatch({
    type: LOAD_CONSUMPTION_HISTORY_REQUEST,
  })

  return agent.MV.consumptionHistory(projectId, month, year, type)
    .then(result => {
      dispatch({
        type: LOAD_CONSUMPTION_HISTORY_SUCCESS,
        payload: {
          result,
          type,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_CONSUMPTION_HISTORY_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadConsumption = (projectId, month, year, type = 'electricity') => dispatch => {
  dispatch({
    type: LOAD_CONSUMPTION_REQUEST,
  })

  return agent.MV.consumption(projectId, month, year, type)
    .then(result => {
      dispatch({
        type: LOAD_CONSUMPTION_SUCCESS,
        payload: {
          result,
          type,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_CONSUMPTION_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadYOYConsumption = (projectId, month, year, type = 'electricity') => dispatch => {
  dispatch({
    type: LOAD_YOY_CONSUMPTION_REQUEST,
  })

  return agent.MV.yoyConsumption(projectId, month, year, type)
    .then(result => {
      dispatch({
        type: LOAD_YOY_CONSUMPTION_SUCCESS,
        payload: {
          result,
          type,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_YOY_CONSUMPTION_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadForecastConsumption = (projectId, month, year, type = 'electricity') => dispatch => {
  dispatch({
    type: LOAD_FORECAST_CONSUMPTION_REQUEST,
  })

  return agent.MV.forecastConsumption(projectId, month, year, type)
    .then(result => {
      dispatch({
        type: LOAD_FORECAST_CONSUMPTION_SUCCESS,
        payload: {
          result,
          type,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_FORECAST_CONSUMPTION_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadForecastVsActual = (projectId, month, year, type = 'electricity') => dispatch => {
  dispatch({
    type: LOAD_FORECAST_VS_ACTUAL_REQUEST,
  })

  return agent.MV.forecastVsActual(projectId, month, year, type)
    .then(result => {
      dispatch({
        type: LOAD_FORECAST_VS_ACTUAL_SUCCESS,
        payload: {
          result,
          type,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_FORECAST_VS_ACTUAL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const setDate = (date) => ({
  type: SET_DATE,
  payload: {
    date,
  },
})

export const getYear = (state) => state.consumptions
    && moment(state.monthlymv.date).year()

export const getMonth = (state) => state.consumptions
    && moment(state.monthlymv.date).format('MMM')

export const getDate = (state) => state.consumptions && state.monthlymv.date

export const getProject = (state) => state.consumptions
    && state.monthlymv.project

export const getMetrics = (state) => state.consumptions
    && state.monthlymv.metrics

export const getEquations = (state) => state.consumptions
    && state.monthlymv.equations

export const getComputedVariablesMap = (state) => state.consumptions
    && state.monthlymv.computedVariablesMap

export const getVariables = (state) => state.consumptions
    && state.monthlymv.variables

export const getElectricalConsumptionHistory = (state) => state.consumptions
    && state.monthlymv.electricalConsumptionHistory

export const getElectricityConsumption = (state) => state.consumptions
    && state.monthlymv.electricityConsumption

export const getYoyElectricalConsumptionCommonSpace = (state) => state.consumptions
    && state.monthlymv.yoyElectricalConsumptionCommonSpace

export const getForecastElectricityConsumption = (state) => state.consumptions
    && state.monthlymv.forecastElectricityConsumption

export const getForecastVSActualSavings = (state) => state.consumptions
    && state.monthlymv.forecastVSActualSavings

export const getChwConsumptionHistory = (state) => state.consumptions
    && state.monthlymv.chwConsumptionHistory

export const getChwConsumption = (state) => state.consumptions
    && state.monthlymv.chwConsumption

export const getYoyChwConsumptionCommonSpace = (state) => state.consumptions
    && state.monthlymv.yoyChwConsumptionCommonSpace

export const getForecastChwConsumption = (state) => state.consumptions
    && state.monthlymv.forecastChwConsumption

export const getForecastChwVSActualSavings = (state) => state.consumptions
    && state.monthlymv.forecastChwVSActualSavings

export const getLoading = (state) => state.monthlymv && state.monthlymv.loading
  