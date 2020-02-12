import agent from '../../agent'


export const SET_DATE_RANGE = 'HEATMAP//SET_DATE_RANGE'
export const SET_FUEL_TYPE = 'HEATMAP//SET_FUEL_TYPE'
export const SET_ZONE_ID = 'HEATMAP//SET_ZONE_ID'
export const RESET_HEATMAP = 'HEATMAP//RESET_HEATMAP'

export const LOAD_HEATMAP_VALUES_REQUEST = 'HEATMAP//LOAD_HEATMAP_VALUES_REQUEST'
export const LOAD_HEATMAP_VALUES_SUCCESS = 'HEATMAP//LOAD_HEATMAP_VALUES_SUCCESS'
export const LOAD_HEATMAP_VALUES_FAILED = 'HEATMAP//LOAD_HEATMAP_VALUES_FAILED'

const initialState = {
  range:36,
  loading: false,
  fuelType: '',
  heatmapValues: [],
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {

  case LOAD_HEATMAP_VALUES_REQUEST:
    return {
      ...state,
      loading: true,
      zoneId: action.payload.zoneId,
      heatmapValues: [],
    }

  case LOAD_HEATMAP_VALUES_SUCCESS:
    return {
      ...state,
      loading: false,
      heatmapValues: [
        ...action.payload.result.perMeterAccountData,
      ],

    }

  case LOAD_HEATMAP_VALUES_FAILED:
    return {
      ...state,
      loading: false,
    }

  case SET_DATE_RANGE:
    return {
      ...state,
      range: action.payload.range,
    }

  case SET_FUEL_TYPE:
    return {
      ...state,
      fuelType: action.payload.fuelType,
    }

  case SET_ZONE_ID:
    return {
      ...state,
      zoneId: action.payload.zoneId,
    }

  case RESET_HEATMAP:
    return {
      ...initialState,
    }

  default:
    return state
  }
}

export const resetHeatmap = () => (dispatch) => {
  dispatch({
    type: RESET_HEATMAP,
  })
}
export const loadHeatmapValues = (zoneId, delta, fuel) => (dispatch) => {
  dispatch({
    type: LOAD_HEATMAP_VALUES_REQUEST,
    payload: {
      zoneId,
    },
  })

  return agent.Heatmap.heatMapValues(zoneId, delta,fuel)
    .then((result) => {
      dispatch({
        type: LOAD_HEATMAP_VALUES_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_HEATMAP_VALUES_FAILED,
        payload: {
          error,
        },
      })
    })
}
export const setDateRange = range => ({
  type: SET_DATE_RANGE,
  payload: {
    range,
  },
})

export const setFuelType = fuelType => {
  return ({
    type: SET_FUEL_TYPE,
    payload: {
      fuelType,
    },
  })}

export const setZoneId = zoneId => ({
  type: SET_ZONE_ID,
  payload: {
    zoneId,
  },
})

export const getDateRange = (state) => state.heatmap
  && state.heatmap.range

export const getFuelType = (state) => state.heatmap
  && state.heatmap.fuelType

export const getSelectedZone = (state) => {
  return state.heatmap
  && state.heatmap.zoneId
}

export const getHeatmapValues = (state) => state.heatmap
  && state.heatmap.heatmapValues

export const getLoading = (state) => state.baseline
  && state.heatmap.loading

export const getCurrentCompany =(state) => state.companies && state.companies.currentCompany
