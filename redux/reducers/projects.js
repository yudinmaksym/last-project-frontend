import omit from 'lodash/omit'
import Router from 'next/router'
import { SubmissionError, initialize, change } from 'redux-form'
import shortid from 'shortid'

import { formatNumber } from '../../src/utils/format'
import agent from '../../agent'
import { FORM_KEY as CREATE_PROJECT_FORM_KEY } from '../../src/forms/projects/ProjectZoneSelectForm'
import RedirectToUploadModal from '../../src/shared/RedirectToUploadModal'
import InvalidMetersUpload from '../../src/shared/InvalidMetersUpload'

import { showAlert } from './alerts'
import { showConfirmationModal } from './modals'
import { showStickLoader } from './loaders'

// actions
export const CREATE_REQUEST = 'PROJECTS//CREATE_REQUEST'
export const CREATE_SUCCESS = 'PROJECTS//CREATE_SUCCESS'
export const CREATE_FAILED = 'PROJECTS//CREATE_FAILED'

export const SET_PAGE = 'PROJECTS//SET_PAGE'

export const GET_ALL_REQUEST = 'PROJECTS//GET_ALL_REQUEST'
export const GET_ALL_SUCCESS = 'PROJECTS//GET_ALL_SUCCESS'
export const GET_ALL_FAILED = 'PROJECTS//GET_ALL_FAILED'

export const GET_SINGLE_REQUEST = 'PROJECTS//GET_SINGLE_REQUEST'
export const GET_SINGLE_SUCCESS = 'PROJECTS//GET_SINGLE_SUCCESS'
export const GET_SINGLE_FAILED = 'PROJECTS//GET_SINGLE_FAILED'

export const GET_BASELINE_VALUES_REQUEST = 'PROJECTS//GET_BASELINE_VALUES_REQUEST'
export const GET_BASELINE_VALUES_SUCCESS = 'PROJECTS//GET_BASELINE_VALUES_SUCCESS'
export const GET_BASELINE_VALUES_FAILED = 'PROJECTS//GET_BASELINE_VALUES_FAILED'

export const SET_DASHBOARD_PAGE_STATE = 'PROJECTS//SET_DASHBOARD_PAGE_STATE'

export const UPDATE_SINGLE_REQUEST = 'PROJECTS//UPDATE_SINGLE_REQUEST'
export const UPDATE_SINGLE_SUCCESS = 'PROJECTS//UPDATE_SINGLE_SUCCESS'
export const UPDATE_SINGLE_FAILED = 'PROJECTS//UPDATE_SINGLE_FAILED'

export const UPDATE_EQUATION_REQUEST = 'PROJECTS//UPDATE_EQUATION_REQUEST'
export const UPDATE_EQUATION_SUCCESS = 'PROJECTS//UPDATE_EQUATION_SUCCESS'
export const UPDATE_EQUATION_FAILED = 'PROJECTS//UPDATE_EQUATION_FAILED'

export const LOAD_METERS_TOTAL_REQUEST = 'PROJECTS//LOAD_METERS_TOTAL_REQUEST'
export const LOAD_METERS_TOTAL_SUCCESS = 'PROJECTS//LOAD_METERS_TOTAL_SUCCESS'
export const LOAD_METERS_TOTAL_FAILED = 'PROJECTS//LOAD_METERS_TOTAL_FAILED'

export const LOAD_BILLS_TOTAL_REQUEST = 'PROJECTS//LOAD_BILLS_TOTAL_REQUEST'
export const LOAD_BILLS_TOTAL_SUCCESS = 'PROJECTS//LOAD_BILLS_TOTAL_SUCCESS'
export const LOAD_BILLS_TOTAL_FAILED = 'PROJECTS//LOAD_BILLS_TOTAL_FAILED'

export const LOAD_PROJECT_BENCHMARKS_REQUEST = 'PROJECTS//LOAD_PROJECT_BENCHMARKS_REQUEST'
export const LOAD_PROJECT_BENCHMARKS_SUCCESS = 'PROJECTS//LOAD_PROJECT_BENCHMARKS_SUCCESS'
export const LOAD_PROJECT_BENCHMARKS_FAILED = 'PROJECTS//LOAD_PROJECT_BENCHMARKS_FAILED'
export const SET_ZONE_ID = 'PROJECTS//SET_ZONE_ID'
export const SET_OCCUPANCY_TYPE = 'PROJECTS//SET_OCCUPANCY_TYPE'
export const SET_COOLING_TYPE = 'PROJECTS//SET_COOLING_TYPE'
export const SET_SQUARE_FOOTAGE = 'PROJECTS//SET_SQUARE_FOOTAGE'
export const RESET_BENCHMARK='PROJECTS//RESET_BENCHMARK'
export const SET_OCCUPANCYTYPE_VALUE='PROJECTS//SET_OCCUPANCYTYPE_VALUE'


export const SET_CONSUMPTION_FUEL_RANGE =
  'PROJECTS//SET_CONSUMPTION_FUEL_RANGE'
export const LOAD_CONSUMPTION_FUEL_REQUEST =
  'PROJECTS//LOAD_CONSUMPTION_FUEL_REQUEST'
export const LOAD_CONSUMPTION_FUEL_SUCCESS =
  'PROJECTS//LOAD_CONSUMPTION_FUEL_SUCCESS'
export const LOAD_CONSUMPTION_FUEL_FAILED =
  'PROJECTS//LOAD_CONSUMPTION_FUEL_FAILED'

export const SET_ENERGY_CONSUMPTION_FUEL_RANGE =
  'PROJECTS//SET_ENERGY_CONSUMPTION_FUEL_RANGE'
export const LOAD_ENERGY_CONSUMPTION_FUEL_REQUEST =
  'PROJECTS//LOAD_ENERGY_CONSUMPTION_FUEL_REQUEST'
export const LOAD_ENERGY_CONSUMPTION_FUEL_SUCCESS =
  'PROJECTS//LOAD_ENERGY_CONSUMPTION_FUEL_SUCCESS'
export const LOAD_ENERGY_CONSUMPTION_FUEL_FAILED =
  'PROJECTS//LOAD_ENERGY_CONSUMPTION_FUEL_FAILED'

export const SET_ELECTRICITY_CONSUMPTION_FUEL_RANGE =
  'PROJECTS//SET_ELECTRICITY_CONSUMPTION_FUEL_RANGE'
export const LOAD_ELECTRICITY_CONSUMPTION_FUEL_REQUEST =
  'PROJECTS//LOAD_ELECTRICITY_CONSUMPTION_FUEL_REQUEST'
export const LOAD_ELECTRICITY_CONSUMPTION_FUEL_SUCCESS =
  'PROJECTS//LOAD_ELECTRICITY_CONSUMPTION_FUEL_SUCCESS'
export const LOAD_ELECTRICITY_CONSUMPTION_FUEL_FAILED =
  'PROJECTS//LOAD_ELECTRICITY_CONSUMPTION_FUEL_FAILED'

export const SET_WATER_CONSUMPTION_FUEL_RANGE =
  'PROJECTS//SET_WATER_CONSUMPTION_FUEL_RANGE'
export const LOAD_WATER_CONSUMPTION_FUEL_REQUEST =
  'PROJECTS//LOAD_WATER_CONSUMPTION_FUEL_REQUEST'
export const LOAD_WATER_CONSUMPTION_FUEL_SUCCESS =
  'PROJECTS//LOAD_WATER_CONSUMPTION_FUEL_SUCCESS'
export const LOAD_WATER_CONSUMPTION_FUEL_FAILED =
  'PROJECTS//LOAD_WATER_CONSUMPTION_FUEL_FAILED'

export const SET_CHILLED_WATER_CONSUMPTION_FUEL_RANGE =
  'PROJECTS//SET_CHILLED_WATER_CONSUMPTION_FUEL_RANGE'
export const LOAD_CHILLED_WATER_CONSUMPTION_FUEL_REQUEST =
  'PROJECTS//LOAD_CHILLED_WATER_CONSUMPTION_FUEL_REQUEST'
export const LOAD_CHILLED_WATER_CONSUMPTION_FUEL_SUCCESS =
  'PROJECTS//LOAD_CHILLED_WATER_CONSUMPTION_FUEL_SUCCESS'
export const LOAD_CHILLED_WATER_CONSUMPTION_FUEL_FAILED =
  'PROJECTS//LOAD_CHILLED_WATER_CONSUMPTION_FUEL_FAILED'

export const SET_LPG_GAS_CONSUMPTION_FUEL_RANGE =
  'PROJECTS//SET_LPG_GAS_CONSUMPTION_FUEL_RANGE'
export const LOAD_LPG_GAS_CONSUMPTION_FUEL_REQUEST =
  'PROJECTS//LOAD_LPG_GAS_CONSUMPTION_FUEL_REQUEST'
export const LOAD_LPG_GAS_CONSUMPTION_FUEL_SUCCESS =
  'PROJECTS//LOAD_LPG_GAS_CONSUMPTION_FUEL_SUCCESS'
export const LOAD_LPG_GAS_CONSUMPTION_FUEL_FAILED =
  'PROJECTS//LOAD_LPG_GAS_CONSUMPTION_FUEL_FAILED'

export const LOAD_CONSUMPTION_BASELINE_REQUEST =
  'PROJECTS//LOAD_CONSUMPTION_BASELINE_REQUEST'
export const LOAD_CONSUMPTION_BASELINE_SUCCESS =
  'PROJECTS//LOAD_CONSUMPTION_BASELINE_SUCCESS'
export const LOAD_CONSUMPTION_BASELINE_FAILED =
  'PROJECTS//LOAD_CONSUMPTION_BASELINE_FAILED'

export const SET_COST_PER_FUEL_RANGE = 'PROJECTS//SET_COST_PER_FUEL_RANGE'
export const LOAD_COST_PER_FUEL_REQUEST =
  'PROJECTS//LOAD_COST_PER_FUEL_REQUEST'
export const LOAD_COST_PER_FUEL_SUCCESS =
  'PROJECTS//LOAD_COST_PER_FUEL_SUCCESS'
export const LOAD_COST_PER_FUEL_FAILED = 'PROJECTS//LOAD_COST_PER_FUEL_FAILED'

export const SET_ENERGY_TYPE = 'PROJECTS//SET_ENERGY_TYPE'
export const LOAD_ENERGY_METRIC_REQUEST =
  'PROJECTS//LOAD_ENERGY_METRIC_REQUEST'
export const LOAD_ENERGY_METRIC_SUCCESS =
  'PROJECTS//LOAD_ENERGY_METRIC_SUCCESS'
export const LOAD_ENERGY_METRIC_FAILED = 'PROJECTS//LOAD_ENERGY_METRIC_FAILED'

export const LOAD_MDB_REQUEST = 'PROJECTS//LOAD_MDB_REQUEST'
export const LOAD_MDB_SUCCESS = 'PROJECTS//LOAD_MDB_SUCCESS'
export const LOAD_MDB_FAILED = 'PROJECTS//LOAD_MDB_FAILED'

export const LOAD_SCORE_REQUEST = 'PROJECTS//LOAD_SCORE_REQUEST'
export const LOAD_SCORE_SUCCESS = 'PROJECTS//LOAD_SCORE_SUCCESS'
export const LOAD_SCORE_FAILED = 'PROJECTS//LOAD_SCORE_FAILED'

export const LOAD_PROJECTS_BY_ZONE_REQUEST =
  'PROJECTS//LOAD_PROJECTS_BY_ZONE_REQUEST'
export const LOAD_PROJECTS_BY_ZONE_SUCCESS =
  'PROJECTS//LOAD_PROJECTS_BY_ZONE_SUCCESS'
export const LOAD_PROJECTS_BY_ZONE_FAILED =
  'PROJECTS//LOAD_PROJECTS_BY_ZONE_FAILED'

export const LOAD_CONSUMPTION_BY_YEARS_REQUEST =
  'PROJECTS//LOAD_CONSUMPTION_BY_YEARS_REQUEST'
export const LOAD_CONSUMPTION_BY_YEARS_SUCCESS =
  'PROJECTS//LOAD_CONSUMPTION_BY_YEARS_SUCCESS'
export const LOAD_CONSUMPTION_BY_YEARS_FAILED =
  'PROJECTS//LOAD_CONSUMPTION_BY_YEARS_FAILED'

export const SET_ENERGY_CONSUMPTION_PER_METER_RANGE =
  'PROJECTS//SET_ENERGY_CONSUMPTION_PER_METER_RANGE'
export const LOAD_ENERGY_CONSUMPTION_PER_METER_REQUEST =
  'PROJECTS//LOAD_ENERGY_CONSUMPTION_PER_METER_REQUEST'
export const LOAD_ENERGY_CONSUMPTION_PER_METER_SUCCESS =
  'PROJECTS//LOAD_ENERGY_CONSUMPTION_PER_METER_SUCCESS'
export const LOAD_ENERGY_CONSUMPTION_PER_METER_FAILED =
  'PROJECTS//LOAD_ENERGY_CONSUMPTION_PER_METER_FAILED'

export const SET_INFO_SET =
  'PROJECTS//SET_INFO_SET'

export const SET_SPECIFIC_INFO_SET = 'PROJECTS//SET_SPECIFIC_INFO_SET'

const onUploadRedirectModalSubmit = ({ success }) => (dispatch) => {
  dispatch(showConfirmationModal({ show: false, text: '' }))
  if(success) {
    Router.replace('/files/upload')
  }
}

// state
const initialState = {
  byZone: [],
  list: {
    page: 0,
    pageSize: 15,
    pagesCount: 0,
    loading: false,
    count: 0,
    prevKey: null,
    lastKey: null,
    prevKeys: [],
    items: [],
  },
  single: {
    state: 'utility',
    loading: false,
    error: null,
    data: {
      baseline: {

      },
    },
    meters: 0,
    bills: {
      startDate: '',
      endDate: '',
      uploaded: 0,
      total: 0,
      progress: 0,
    },
    consumptionBaseline: {
      data: {},
    },
    consumptionFuel: {
      dataId: null,
      range: 6,
      startDate: '',
      endDate: '',
      labels: [],
      datasets: [],
      totalConsumption_AED: 0,
      totalConsumption_kWH: 0,
      totalBuildingConsumptionKWH: 0,
      totalBuildingConsumptionAED: 0,
    },
    energyConsumptionFuel: {
      dataId: null,
      range: 6,
      startDate: '',
      endDate: '',
      labels: [],
      datasets: [],
      totalConsumption_AED: 0,
      totalConsumption_kWH: 0,
      totalBuildingConsumptionKWH: 0,
      totalBuildingConsumptionAED: 0,
    },
    electricityConsumptionFuel: {
      dataId: null,
      range: 6,
      startDate: '',
      endDate: '',
      labels: [],
      datasets: [],
      totalConsumption_AED: 0,
      totalConsumption_kWH: 0,
      totalBuildingConsumptionKWH: 0,
      totalBuildingConsumptionAED: 0,
    },
    chilledWaterConsumptionFuel: {
      dataId: null,
      range: 6,
      startDate: '',
      endDate: '',
      labels: [],
      datasets: [],
      totalConsumption_AED: 0,
      totalConsumption_kWH: 0,
      totalBuildingConsumptionKWH: 0,
      totalBuildingConsumptionAED: 0,
    },
    waterConsumptionFuel: {
      dataId: null,
      range: 6,
      startDate: '',
      endDate: '',
      labels: [],
      datasets: [],
      totalConsumption_AED: 0,
      totalConsumption_kWH: 0,
      totalBuildingConsumptionKWH: 0,
      totalBuildingConsumptionAED: 0,
    },
    lpgGasConsumptionFuel: {
      dataId: null,
      range: 6,
      startDate: '',
      endDate: '',
      labels: [],
      datasets: [],
      totalConsumption_AED: 0,
      totalConsumption_kWH: 0,
      totalBuildingConsumptionKWH: 0,
      totalBuildingConsumptionAED: 0,
    },
    costPerFuel: {
      dataId: null,
      range: 6,
      total: 0,
      startDate: '',
      endDate: '',
      labels: [],
      datasets: [],
    },
    benchmarks: {
      loading:false,
      dataId: null,
      labels: [],
      datasets: [],
      occupancyType:'',
      zoneId:null,
      coolingType:'',
      squareFootage:[0, 685602],
      occupancyTypeValue:[],
    },
    energy: {
      dataId: null,
      range: 6,
      type: 'eui',
      labels: [],
      datasets: [],
    },
    mdb: {
      dataId: null,
      range: 6,
      labels: [],
      datasets: [],
    },
    consumptionByYears: {
      dataId: null,
      labels: [],
      datasets: [],
    },
    consumptionPerMeter: {
      dataId: null,
      labels: [],
      datasets: [],
    },
    score: {
      range: 6,
      year: null,
      dataId: null,
      value: null,
    },
    projectsInfo: [],
    specificProjectInfo: {},
  },
}

const removePrevKey = state => {
  const items = [...state.prevKeys]

  items.pop()

  return items
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
  case CREATE_REQUEST:
    return {
      ...state,
    }

  case CREATE_SUCCESS:
    return {
      ...state,
    }

  case CREATE_FAILED:
    return {
      ...state,
    }

  case SET_PAGE:
    return {
      ...state,
      page: action.payload.page,
    }

  case GET_ALL_REQUEST:
    return {
      ...state,
      list: {
        ...state.list,
        loading: true,
      },
    }

  case GET_ALL_SUCCESS:
    return {
      ...state,
      list: {
        ...state.list,
        loading: false,
        page: action.payload.result.page,
        count: action.payload.result.count,
        pagesCount: action.payload.result.pages,
        lastKey: action.payload.result.lastKey,
        prevKey: state.list.lastKey,
        items: [...action.payload.result.items],
      },
    }

  case GET_ALL_FAILED:
    return {
      ...state,
      list: {
        ...state.list,
        loading: false,
      },
    }

  case SET_DASHBOARD_PAGE_STATE:
    return {
      ...state,
      single: {
        ...state.single,
        state: action.payload.state,
      },
    }

  case GET_SINGLE_REQUEST:
    return {
      ...state,
      single: {
        ...state.single,
        loading: true,
      },
    }

  case GET_SINGLE_REQUEST:
    return {
      ...state,
      single: {
        ...initialState.single,
      },
    }

  case GET_SINGLE_SUCCESS:
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

  case GET_SINGLE_FAILED:
    return {
      ...state,
      single: {
        ...state.single,
        error: action.payload.error,
        loading: false,
      },
    }

  case GET_BASELINE_VALUES_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        data: {
          ...state.single.data,
          baseline: {
            ...state.single.data.baseline,
            values: {
              ...action.payload.result.data,
            },
          },
        },
        loading: false,
      },
    }

  case LOAD_METERS_TOTAL_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        meters: action.payload.result.total || 0,
      },
    }

  case LOAD_BILLS_TOTAL_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        bills: {
          ...state.single.bills,
          startDate: action.payload.result.dates.startDate,
          endDate: action.payload.result.dates.endDate,
          uploaded: action.payload.result.uploaded,
          total: action.payload.result.total,
          progress: action.payload.result.progress,
        },
      },
    }

  case SET_CONSUMPTION_FUEL_RANGE:
    return {
      ...state,
      single: {
        ...state.single,
        consumptionFuel: {
          ...state.single.consumptionFuel,
          range: action.payload.range,
        },
      },
    }

  case LOAD_CONSUMPTION_FUEL_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        consumptionFuel: {
          ...state.single.consumptionFuel,
          dataId: action.payload.dataId,
          extraValues: [...action.payload.result.extraValues],
          startDate: action.payload.result.dates.startDate,
          endDate: action.payload.result.dates.endDate,
          labels: [...action.payload.result.labels],
          datasets: [...action.payload.result.datasets],
        },
      },
    }

  case SET_ENERGY_CONSUMPTION_FUEL_RANGE:
    return {
      ...state,
      single: {
        ...state.single,
        energyConsumptionFuel: {
          ...state.single.energyConsumptionFuel,
          range: action.payload.range,
        },
      },
    }

  case LOAD_ENERGY_CONSUMPTION_FUEL_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        energyConsumptionFuel: {
          ...state.single.energyConsumptionFuel,
          dataId: action.payload.dataId,
          extraValues: [...action.payload.result.extraValues],
          startDate: action.payload.result.dates.startDate,
          endDate: action.payload.result.dates.endDate,
          labels: [...action.payload.result.labels],
          datasets: [...action.payload.result.datasets],
        },
      },
    }

  case SET_ELECTRICITY_CONSUMPTION_FUEL_RANGE:
    return {
      ...state,
      single: {
        ...state.single,
        electricityConsumptionFuel: {
          ...state.single.electricityConsumptionFuel,
          range: action.payload.range,
        },
      },
    }

  case LOAD_ELECTRICITY_CONSUMPTION_FUEL_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        electricityConsumptionFuel: {
          ...state.single.electricityConsumptionFuel,
          dataId: action.payload.dataId,
          extraValues: [...action.payload.result.extraValues],
          startDate: action.payload.result.dates.startDate,
          endDate: action.payload.result.dates.endDate,
          labels: [...action.payload.result.labels],
          datasets: [...action.payload.result.datasets],
        },
      },
    }

  case SET_WATER_CONSUMPTION_FUEL_RANGE:
    return {
      ...state,
      single: {
        ...state.single,
        waterConsumptionFuel: {
          ...state.single.waterConsumptionFuel,
          range: action.payload.range,
        },
      },
    }

  case LOAD_WATER_CONSUMPTION_FUEL_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        waterConsumptionFuel: {
          ...state.single.waterConsumptionFuel,
          dataId: action.payload.dataId,
          extraValues: [...action.payload.result.extraValues],
          startDate: action.payload.result.dates.startDate,
          endDate: action.payload.result.dates.endDate,
          labels: [...action.payload.result.labels],
          datasets: [...action.payload.result.datasets],
        },
      },
    }

  case SET_CHILLED_WATER_CONSUMPTION_FUEL_RANGE:
    return {
      ...state,
      single: {
        ...state.single,
        chilledWaterConsumptionFuel: {
          ...state.single.chilledWaterConsumptionFuel,
          range: action.payload.range,
        },
      },
    }

  case LOAD_CHILLED_WATER_CONSUMPTION_FUEL_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        chilledWaterConsumptionFuel: {
          ...state.single.chilledWaterConsumptionFuel,
          dataId: action.payload.dataId,
          extraValues: [...action.payload.result.extraValues],
          startDate: action.payload.result.dates.startDate,
          endDate: action.payload.result.dates.endDate,
          labels: [...action.payload.result.labels],
          datasets: [...action.payload.result.datasets],
        },
      },
    }

  case SET_LPG_GAS_CONSUMPTION_FUEL_RANGE:
    return {
      ...state,
      single: {
        ...state.single,
        lpgGasConsumptionFuel: {
          ...state.single.lpgGasConsumptionFuel,
          range: action.payload.range,
        },
      },
    }

  case LOAD_LPG_GAS_CONSUMPTION_FUEL_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        lpgGasConsumptionFuel: {
          ...state.single.lpgGasConsumptionFuel,
          dataId: action.payload.dataId,
          extraValues: [...action.payload.result.extraValues],
          startDate: action.payload.result.dates.startDate,
          endDate: action.payload.result.dates.endDate,
          labels: [...action.payload.result.labels],
          datasets: [...action.payload.result.datasets],
        },
      },
    }
  case LOAD_CONSUMPTION_BASELINE_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        consumptionBaseline: {
          ...state.single.consumptionBaseline,
          dataId: action.payload.dataId,
          data: { ...action.payload.result },
        },
      },
    }

  case SET_COST_PER_FUEL_RANGE:
    return {
      ...state,
      single: {
        ...state.single,
        costPerFuel: {
          ...state.single.costPerFuel,
          range: action.payload.range,
        },
      },
    }

  case SET_ENERGY_CONSUMPTION_PER_METER_RANGE:
    return {
      ...state,
      single: {
        ...state.single,
        consumptionPerMeter: {
          ...state.single.consumptionPerMeter,
          range: action.payload.range,
        },
      },
    }

  case LOAD_COST_PER_FUEL_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        costPerFuel: {
          ...state.single.costPerFuel,
          dataId: action.payload.dataId,
          startDate: action.payload.result.dates.startDate,
          endDate: action.payload.result.dates.endDate,
          total: action.payload.result.total,
          labels: [...action.payload.result.labels],
          datasets: [...action.payload.result.datasets],
        },
      },
    }

  case SET_ENERGY_TYPE:
    return {
      ...state,
      single: {
        ...state.single,
        energy: {
          ...state.single.energy,
          type: action.payload.type,
        },
      },
    }

  case LOAD_ENERGY_METRIC_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        energy: {
          ...state.single.energy,
          dataId: action.payload.dataId,
          labels: [...action.payload.result.labels],
          datasets: [...action.payload.result.datasets],
        },
      },
    }

  case LOAD_MDB_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        mdb: {
          ...state.single.mdb,
          dataId: action.payload.dataId,
          startDate: action.payload.result.dates.startDate,
          endDate: action.payload.result.dates.endDate,
          labels: [...action.payload.result.labels],
          datasets: [...action.payload.result.datasets],
        },
      },
    }

  case LOAD_CONSUMPTION_BY_YEARS_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        consumptionByYears: {
          ...state.single.consumptionByYears,
          dataId: action.payload.dataId,
          labels: [...action.payload.result.labels],
          datasets: [...action.payload.result.datasets],
        },
      },
    }

  case LOAD_SCORE_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        score: {
          ...state.single.score,
          dataId: action.payload.dataId,
          value: action.payload.result.score,
          year: action.payload.result.meta.year,
          eui: formatNumber(action.payload.result.meta.eui),
        },
      },
    }

  case SET_ENERGY_CONSUMPTION_FUEL_RANGE:
    return {
      ...state,
      single: {
        ...state.single,
        consumptionPerMeter: {
          ...state.single.consumptionByYears,
          range: action.payload.range,
        },
      },
    }

  case LOAD_ENERGY_CONSUMPTION_PER_METER_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        consumptionPerMeter: {
          ...state.single.consumptionPerMeter,
          dataId: action.payload.dataId,
          ...action.payload.result,
        },
      },
    }

  case LOAD_PROJECTS_BY_ZONE_SUCCESS:
    return {
      ...state,
      byZone: [...action.payload.result.groupedByZones],
    }

  case SET_INFO_SET:
    return {
      ...state,
      projectsInfo: action.payload,
    }

  case SET_SPECIFIC_INFO_SET:
    return {
      ...state,
      specificProjectInfo: action.payload,
    }

  case LOAD_PROJECT_BENCHMARKS_SUCCESS:
    return {
      ...state,
      single: {
        ...state.single,
        benchmarks: {
          ...state.single.benchmarks,
          dataId: action.payload.dataId,
          ...action.payload.result,
        },
      },
    }
  case SET_ZONE_ID:
    return {
      ...state,
      single: {
        ...state.single,
        benchmarks: {
          ...state.single.benchmarks,
          zoneId: action.payload.zoneId,
        },
      },
    }

  case SET_OCCUPANCY_TYPE:
    return {
      ...state,
      single: {
        ...state.single,
        benchmarks: {
          ...state.single.benchmarks,
          occupancyType: action.payload.occupancyType,
        },
      },
    }
  case SET_SQUARE_FOOTAGE:
    return {
      ...state,
      single: {
        ...state.single,
        benchmarks: {
          ...state.single.benchmarks,
          squareFootage: action.payload.squareFootage,
        },
      },
    }
  case SET_COOLING_TYPE:
    return {
      ...state,
      single: {
        ...state.single,
        benchmarks: {
          ...state.single.benchmarks,
          coolingType: action.payload.coolingType,
        },
      },
    }

  case RESET_BENCHMARK:
    return {
      ...state,
      single: {
        ...state.single,
        benchmarks: {
          ...initialState.single.benchmarks,
        },
      },
    }

  case SET_OCCUPANCYTYPE_VALUE:
    return {
      ...state,
      single: {
        ...state.single,
        benchmarks: {
          ...state.single.benchmarks,
          occupancyTypeValue: action.payload.value,
        },
      },
    }
  default:
    return state
  }
}

// actions handlers

export const create = ({ customer, zone, ...rest }) => dispatch => {
  const payload = {
    customer: Object.assign(
      { id: customer.value, name: customer.label },
      omit(customer, ['label', 'value']),
    ),
    zone: Object.assign(
      { id: zone.value, name: zone.label },
      omit(zone, ['label', 'value']),
    ),
    ...rest,
  }

  dispatch({
    type: CREATE_REQUEST,
  })

  return agent.Projects.create(payload)
    .then(result => {
      if(result.duplicatedMeters) {
        return  dispatch(showConfirmationModal({
          show: true,
          text: (<InvalidMetersUpload items={result.duplicatedMeters}/>),
          onClick: () => dispatch(showConfirmationModal({ show: false, text: '' })),
        }))
      }
      dispatch({
        type: CREATE_SUCCESS,
        payload: {
          result,
        },
      })
      dispatch(showConfirmationModal({
        show: true,
        text: (<RedirectToUploadModal />),
        onClick: (res) => dispatch(onUploadRedirectModalSubmit(res)),
      }))
      dispatch(
        initialize(CREATE_PROJECT_FORM_KEY, {
          buildings: [{ __isNew__: true }],
          meters: [{ __isNew__: true }],
          zone: {},
          project: {},
          customer: {},
        })
      )

      dispatch(showAlert({ show: true, text: 'Create successfully' }))
    })
    .catch(error => {
      console.error(message)
      const message =
        (error
          && error.response
          && error.response.body
          && error.response.body.error)
        || 'System error'

      dispatch({
        type: CREATE_FAILED,
        payload: {
          error: message,
        },
      })

      throw new SubmissionError({
        _error: message,
      })
    })
}

export const setPage = page => ({
  type: SET_PAGE,
  payload: {
    page,
  },
})

export const loadAll = (pageSize, page, filters) => dispatch => {
  dispatch({
    type: GET_ALL_REQUEST,
  })

  return agent.Projects.getAll(pageSize, page, filters)
    .then(result => {
      dispatch({
        type: GET_ALL_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: GET_ALL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const load = id => dispatch => {
  dispatch({
    type: GET_SINGLE_REQUEST,
  })

  return agent.Projects.get(id)
    .then(result => {
      dispatch({
        type: GET_SINGLE_SUCCESS,
        payload: {
          result: {
            ...result,
            customer: {
              value: result.customer.id,
              label: result.customer.name,
              ...result.customer,
            },
          },
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: GET_SINGLE_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const initalLoad = pageSize => dispatch => {
  return dispatch(loadAll(pageSize, 0, []))
}

export const update = (id, data) => dispatch => {
  dispatch({
    type: UPDATE_SINGLE_REQUEST,
  })

  return agent.Projects.update(id, data)
    .then(result => {
      if(result.duplicatedMeters) {
        return  dispatch(showConfirmationModal({
          show: true,
          text: (<InvalidMetersUpload items={result.duplicatedMeters}/>),
          onClick: () => dispatch(showConfirmationModal({ show: false, text: '' })),
        }))
      }
      dispatch({
        type: UPDATE_SINGLE_SUCCESS,
        payload: {
          result,
        },
      })
      dispatch(showConfirmationModal({
        show: true,
        text: (<RedirectToUploadModal />),
        onClick: (res) => dispatch(onUploadRedirectModalSubmit(res)),
      }))

      dispatch(showAlert({ show: true, text: 'Update successfully' }))
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: UPDATE_SINGLE_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const updateEquation = (id, data) => dispatch => {
  dispatch({
    type: UPDATE_EQUATION_REQUEST,
  })

  return agent.Projects.updateEquation(id, data)
    .then(result => {
      dispatch({
        type: UPDATE_EQUATION_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: UPDATE_EQUATION_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadProjectsTotal = (delta, projectId) => dispatch => {
  dispatch({
    type: LOAD_PROJECTS_TOTAL_REQUEST,
  })

  return agent.Metrics.projects(delta, projectId)
    .then(result => {
      dispatch({
        type: LOAD_PROJECTS_TOTAL_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_PROJECTS_TOTAL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadMetersTotal = projectId => dispatch => {
  dispatch({
    type: LOAD_METERS_TOTAL_REQUEST,
  })

  return agent.Metrics.meters(projectId)
    .then(result => {
      dispatch({
        type: LOAD_METERS_TOTAL_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_METERS_TOTAL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadBillsTotal = projectId => dispatch => {
  dispatch({
    type: LOAD_BILLS_TOTAL_REQUEST,
  })

  return agent.Metrics.bills(projectId)
    .then(result => {
      dispatch({
        type: LOAD_BILLS_TOTAL_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch(error => {
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

export const loadConsumptionFuel = (delta, projectId) => dispatch => {
  dispatch({
    type: LOAD_CONSUMPTION_FUEL_REQUEST,
  })

  return agent.Metrics.consumptionFuel(delta, projectId)
    .then(result => {
      dispatch({
        type: LOAD_CONSUMPTION_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_CONSUMPTION_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const setEnergyConsumptionFuelRange = range => ({
  type: SET_ENERGY_CONSUMPTION_FUEL_RANGE,
  payload: {
    range,
  },
})

export const loadEnergyConsumptionFuel = (delta, projectId) => dispatch => {
  dispatch({
    type: LOAD_ENERGY_CONSUMPTION_FUEL_REQUEST,
  })

  return agent.Metrics.consumptionFuel(delta, 'Energy', projectId)
    .then(result => {
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const setElectricityConsumptionFuelRange = range => ({
  type: SET_ELECTRICITY_CONSUMPTION_FUEL_RANGE,
  payload: {
    range,
  },
})

export const loadElectricityConsumptionFuel = (
  delta,
  projectId
) => dispatch => {
  dispatch({
    type: LOAD_ELECTRICITY_CONSUMPTION_FUEL_REQUEST,
  })

  return agent.Metrics.consumptionFuel(delta, 'Electricity', projectId)
    .then(result => {
      dispatch({
        type: LOAD_ELECTRICITY_CONSUMPTION_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_ELECTRICITY_CONSUMPTION_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadElectricityConsumptionFuelByDateRange = (
  dateRange,
  projectId
) => dispatch => {
  dispatch({
    type: LOAD_ELECTRICITY_CONSUMPTION_FUEL_REQUEST,
  })

  return agent.Metrics.consumptionFuelByDateRange(dateRange.startDate, dateRange.endDate, 'Electricity', projectId)
    .then(result => {
      dispatch({
        type: LOAD_ELECTRICITY_CONSUMPTION_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_ELECTRICITY_CONSUMPTION_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const setWaterConsumptionFuelRange = range => ({
  type: SET_WATER_CONSUMPTION_FUEL_RANGE,
  payload: {
    range,
  },
})

export const loadWaterConsumptionFuel = (delta, projectId) => dispatch => {
  dispatch({
    type: LOAD_WATER_CONSUMPTION_FUEL_REQUEST,
  })

  return agent.Metrics.consumptionFuel(delta, 'Water', projectId)
    .then(result => {
      dispatch({
        type: LOAD_WATER_CONSUMPTION_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_WATER_CONSUMPTION_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadWaterConsumptionFuelByDateRange = (dateRange, projectId) => dispatch => {
  dispatch({
    type: LOAD_WATER_CONSUMPTION_FUEL_REQUEST,
  })

  return agent.Metrics.consumptionFuelByDateRange(dateRange.startDate, dateRange.endDate, 'Water', projectId)
    .then(result => {
      dispatch({
        type: LOAD_WATER_CONSUMPTION_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_WATER_CONSUMPTION_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const setChilledWaterConsumptionFuelRange = range => ({
  type: SET_CHILLED_WATER_CONSUMPTION_FUEL_RANGE,
  payload: {
    range,
  },
})

export const loadChilledWaterConsumptionFuel = (
  delta,
  projectId
) => dispatch => {
  dispatch({
    type: LOAD_CHILLED_WATER_CONSUMPTION_FUEL_REQUEST,
  })

  return agent.Metrics.consumptionFuel(delta, 'Chilled Water', projectId)
    .then(result => {
      dispatch({
        type: LOAD_CHILLED_WATER_CONSUMPTION_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_CHILLED_WATER_CONSUMPTION_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadChilledWaterConsumptionFuelByDateRange = (
  dateRange,
  projectId
) => dispatch => {
  dispatch({
    type: LOAD_CHILLED_WATER_CONSUMPTION_FUEL_REQUEST,
  })

  return agent.Metrics.consumptionFuelByDateRange(dateRange.startDate, dateRange.endDate, 'Chilled Water', projectId)
    .then(result => {
      dispatch({
        type: LOAD_CHILLED_WATER_CONSUMPTION_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_CHILLED_WATER_CONSUMPTION_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const setLpgGasConsumptionFuelRange = range => ({
  type: SET_LPG_GAS_CONSUMPTION_FUEL_RANGE,
  payload: {
    range,
  },
})

export const loadLpgGasConsumptionFuel = (delta, projectId) => dispatch => {
  dispatch({
    type: LOAD_LPG_GAS_CONSUMPTION_FUEL_REQUEST,
  })

  return agent.Metrics.consumptionFuel(delta, 'LPG (Gas)', projectId)
    .then(result => {
      dispatch({
        type: LOAD_LPG_GAS_CONSUMPTION_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_LPG_GAS_CONSUMPTION_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadLpgGasConsumptionFuelByDateRange = (dateRange, projectId) => dispatch => {
  dispatch({
    type: LOAD_LPG_GAS_CONSUMPTION_FUEL_REQUEST,
  })

  return agent.Metrics.consumptionFuelByDateRange(dateRange.startDate, dateRange.endDate, 'LPG (Gas)', projectId)
    .then(result => {
      dispatch({
        type: LOAD_LPG_GAS_CONSUMPTION_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_LPG_GAS_CONSUMPTION_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadConsumptionBaseline = (delta, projectId) => dispatch => {
  dispatch({
    type: LOAD_CONSUMPTION_BASELINE_REQUEST,
  })

  return agent.Baseline.values(delta, projectId)
    .then(result => {
      dispatch({
        type: LOAD_CONSUMPTION_BASELINE_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_CONSUMPTION_BASELINE_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const setDashboardPageState = state => ({
  type: SET_DASHBOARD_PAGE_STATE,
  payload: {
    state,
  },
})

export const setCostPerFuelRange = range => ({
  type: SET_COST_PER_FUEL_RANGE,
  payload: {
    range,
  },
})

export const loadCostPerFuel = (delta, projectId) => dispatch => {
  dispatch({
    type: LOAD_COST_PER_FUEL_REQUEST,
  })

  return agent.Metrics.costPerFuel(delta, projectId)
    .then(result => {
      dispatch({
        type: LOAD_COST_PER_FUEL_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_COST_PER_FUEL_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const setEnergyType = type => ({
  type: SET_ENERGY_TYPE,
  payload: {
    type,
  },
})

export const loadEnergyMetric = (type = 'eui', projectId) => dispatch => {
  dispatch({
    type: LOAD_ENERGY_METRIC_REQUEST,
  })

  return Promise.all([
    agent.Metrics.energy(type, 2016, projectId),
    agent.Metrics.energy(type, 2017, projectId),
    agent.Metrics.energy(type, 2018, projectId),
    agent.Metrics.energy(type, 2019, projectId),
  ])
    .then(results => {
      const labels = [2016, 2017, 2018, 2019]
      const datasets = results.map(_r => _r.value)

      dispatch({
        type: LOAD_ENERGY_METRIC_SUCCESS,
        payload: {
          result: {
            labels,
            datasets,
          },
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_ENERGY_METRIC_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadMdbMetric = projectId => dispatch => {
  dispatch({
    type: LOAD_MDB_REQUEST,
  })

  return agent.Metrics.consumptionByMDB(projectId)
    .then(result => {
      dispatch({
        type: LOAD_MDB_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_MDB_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadScore = (projectId, delta) => dispatch => {
  dispatch({
    type: LOAD_SCORE_REQUEST,
  })

  return agent.Metrics.projectScore(projectId, delta)
    .then(result => {
      dispatch({
        type: LOAD_SCORE_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_SCORE_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadProjectsByZone = () => dispatch => {
  dispatch({
    type: LOAD_PROJECTS_BY_ZONE_REQUEST,
  })

  return agent.Projects.getAllByZone()
    .then(result => {
      dispatch({
        type: LOAD_PROJECTS_BY_ZONE_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_PROJECTS_BY_ZONE_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadConsumptionByYears = (projectId, meters = []) => dispatch => {
  dispatch({
    type: LOAD_CONSUMPTION_BY_YEARS_REQUEST,
  })

  return agent.Projects.projectConsumptionByYears(projectId, meters)
    .then(result => {
      dispatch({
        type: LOAD_CONSUMPTION_BY_YEARS_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_CONSUMPTION_BY_YEARS_FAILED,
        payaload: {
          error,
        },
      })
    })
}

export const setConsumptionPerMeterRange = range => ({
  type: SET_ENERGY_CONSUMPTION_PER_METER_RANGE,
  payload: {
    range,
  },
})

export const loadEnergyConsumptionPerMeter = (
  delta = 12,
  projectId
) => dispatch => {
  dispatch({
    type: LOAD_ENERGY_CONSUMPTION_PER_METER_REQUEST,
  })

  return agent.Projects.energyConsumptionPerMeter(delta, projectId)
    .then(result => {
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_PER_METER_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: LOAD_ENERGY_CONSUMPTION_PER_METER_FAILED,
        payload: {
          error,
        },
      })
    })
}

export const loadInfoSet = (companyIds) => async (dispatch) => {
  try {
    dispatch(showStickLoader(true))
    const { result } = await agent.Projects.loadInfoSet(companyIds)
    dispatch({ type: SET_INFO_SET, payload: result })
  } catch (e) {
    console.error(e)
    dispatch(showAlert({
      show: false,
      text: 'Fail to load info set',
      theme: 'danger',
    }))
  } finally {
    dispatch(showStickLoader(false))
  }
}

export const getSpecificProjectInfo = (id) => async (dispatch) => {
  try {
    const result = await agent.Projects.getSpecificProjectInfo(id)
    return dispatch({ type: SET_SPECIFIC_INFO_SET, payload: result })
  } catch (e) {
    console.error(e)
    dispatch(showAlert({
      show: false,
      text: 'Fail to load specific project info set',
      theme: 'danger',
    }))
  }
}

export const loadProjectInfo = (projectId, startDate) => async (dispatch, getState) => {
  try {
    const result = await agent.Projects.loadInfo(projectId, startDate)
    const { projects } = getState()
    let projectInfo = projects.projectsInfo.find(p => p.id === projectId)
    Object.assign(projectInfo, result)
    dispatch({ type: SET_INFO_SET, payload: projects.projectsInfo })
  } catch (e) {
    console.error(e)
    dispatch(showAlert({
      show: false,
      text: 'Fail to load info set',
      theme: 'danger',
    }))
  }
}

export const setProjectsInfo = (projectsInfo) => (dispatch) => {
  dispatch({ type: SET_INFO_SET, payload: projectsInfo })
}

export const loadBaselineValues = (start, end, id, actual) => dispatch => {
  dispatch({
    type: GET_BASELINE_VALUES_REQUEST,
  })

  return agent.Baseline.loadByDateRange(start, end, id, actual)
    .then(result => {
      dispatch(change('projectCreateProcess', 'baseline.values', result.data))
      dispatch({
        type: GET_BASELINE_VALUES_SUCCESS,
        payload: {
          result,
        },
      })
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: GET_BASELINE_VALUES_FAILED,
        payload: {
          error,
        },
      })
    })
}

// benchmarking
export const loadProjectBenchmarks = () => (dispatch,getState) => {
  dispatch({
    type: LOAD_PROJECT_BENCHMARKS_REQUEST,
    loading:true,
  })
  const state = getState()
  let zoneId = getZoneId(state) && getZoneId(state).value || ''
  const occupancyType = getOccupancyType(state) && getOccupancyType(state).value || ''
  const coolingType = getCoolingType(state) && getCoolingType(state).value || ''
  const squareFootage = getSquareFootage(state) || [0,685602]

  return agent.Projects.benchmarks(zoneId,occupancyType,coolingType,squareFootage)
    .then((result) => {
      dispatch({
        type: LOAD_PROJECT_BENCHMARKS_SUCCESS,
        payload: {
          result,
          dataId: shortid(),
          loading:false,
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_PROJECT_BENCHMARKS_FAILED,
        payload: {
          error,
          loading:false,
        },
      })
    })
}

export const setZoneId = zoneId => {
  return {
    type: SET_ZONE_ID,
    payload: {
      zoneId,
    },
  }
}

export const setOccupancyType = occupancyType => ({
  type: SET_OCCUPANCY_TYPE,
  payload: {
    occupancyType,
  },
})

export const setCoolingType = coolingType => ({
  type: SET_COOLING_TYPE,
  payload: {
    coolingType,
  },
})

export const setSquareFootage = squareFootage => ({
  type: SET_SQUARE_FOOTAGE,
  payload: {
    squareFootage,
  },
})

export const resetBenchmarks = () => ({
  type: RESET_BENCHMARK,
})

export const getSetOccupancyTypeValue = () => (dispatch)=>{
  return agent.EuiScoresBaselines.get()
    .then((result) => {
      result.data.length && dispatch({
        type: SET_OCCUPANCYTYPE_VALUE,
        payload:{
          value:JSON.parse(result.data[0].euiScores),
        },
      })
    })
}

export const setOccupancyTypeValue = value => async (dispatch)=>{
  return agent.EuiScoresBaselines.get()
    .then((result) => {
      if(result.data.length){
        agent.EuiScoresBaselines.update({ euiScores:value }).then(()=>{
          dispatch(getSetOccupancyTypeValue())
        })
      }
      else {
        agent.EuiScoresBaselines.create({ euiScores: value }).then(()=>{
          dispatch(getSetOccupancyTypeValue())
        })
      }

    })


}


// getters
export const getCurrentPage = state =>
  state.projects && state.projects.list.page
export const getPageSize = state =>
  state.projects && state.projects.list.pageSize
export const getPagesCount = state =>
  state.projects && state.projects.list.pagesCount
export const getLoading = state =>
  state.projects && state.projects.list.loading
export const getCount = state => state.projects && state.projects.list.count
export const getItems = state => state.projects && state.projects.list.items

export const getLastKey = state =>
  state.projects && state.projects.list.lastKey
export const getPrevKey = state => {
  if (!state.projects) {
    return null
  }

  if (!state.projects.list.prevKeys) {
    return null
  }

  if (!state.projects.list.prevKeys.length) {
    return null
  }

  return state.projects.list.prevKeys[state.projects.list.prevKeys.length - 1]
}

export const getPrevKeys = state =>
  state.projects && state.projects.list.prevKeys

export const getProjectData = state =>
  state.projects && state.projects.single && state.projects.single.data

export const getSpecificProjectInfoData = state =>
  state.projects && state.projects.specificProjectInfo

export const getProjectLoading = state =>
  state.projects && state.projects.single && state.projects.single.loading

export const getDashboardPageState = state =>
  state.projects && state.projects.single && state.projects.single.state

export const getMetersTotal = state =>
  state.projects && state.projects.single && state.projects.single.meters

export const getBillsTotal = state =>
  state.projects && state.projects.single && state.projects.single.bills

export const getEnergyConsumptionFuelData = state =>
  state.projects
  && state.projects.single
  && state.projects.single.energyConsumptionFuel

export const getEnergyConsumptionFuelRange = state =>
  state.projects
  && state.projects.single
  && state.projects.single.energyConsumptionFuel
  && state.projects.single.energyConsumptionFuel.range

export const getElectricityConsumptionFuelData = state =>
  state.projects
  && state.projects.single
  && state.projects.single.electricityConsumptionFuel

export const getElectricityConsumptionFuelRange = state =>
  state.projects
  && state.projects.single
  && state.projects.single.electricityConsumptionFuel
  && state.projects.single.electricityConsumptionFuel.range

export const getChilledWaterConsumptionFuelData = state =>
  state.projects
  && state.projects.single
  && state.projects.single.chilledWaterConsumptionFuel

export const getChilledWaterConsumptionFuelRange = state =>
  state.projects
  && state.projects.single
  && state.projects.single.chilledWaterConsumptionFuel
  && state.projects.single.chilledWaterConsumptionFuel.range

export const getWaterConsumptionFuelData = state =>
  state.projects
  && state.projects.single
  && state.projects.single.waterConsumptionFuel

export const getWaterConsumptionFuelRange = state =>
  state.projects
  && state.projects.single
  && state.projects.single.waterConsumptionFuel
  && state.projects.single.waterConsumptionFuel.range

export const getLpgGasConsumptionFuelData = state =>
  state.projects
  && state.projects.single
  && state.projects.single.lpgGasConsumptionFuel

export const getLpgGasConsumptionFuelRange = state =>
  state.projects
  && state.projects.single
  && state.projects.single.lpgGasConsumptionFuel
  && state.projects.single.lpgGasConsumptionFuel.range

export const getConsumptionBaseline = state =>
  state.projects
  && state.projects.single
  && state.projects.single.data
  && state.projects.single.data.baseline

export const getMDBRange = state =>
  state.projects
  && state.projects.single
  && state.projects.single.mdb
  && state.projects.single.mdb.range

export const getCostPerFuelData = state =>
  state.projects && state.projects.single && state.projects.single.costPerFuel

export const getCostPerFuelRange = state =>
  state.projects
  && state.projects.single
  && state.projects.single.costPerFuel
  && state.projects.single.costPerFuel.range

export const getEnergyMetric = state =>
  state.projects && state.projects.single && state.projects.single.energy

export const getMDBMetric = state =>
  state.projects && state.projects.single && state.projects.single.mdb

export const getScoreBanchmark = state =>
  state.projects && state.projects.single && state.projects.single.score

export const getProjectsByZone = state =>
  state.projects && state.projects.byZone

export const getConsumptionByYears = state =>
  state.projects
  && state.projects.single
  && state.projects.single.consumptionByYears

export const getConsumptionPerMeter = state =>
  state.projects
  && state.projects.single
  && state.projects.single.consumptionPerMeter

export const getConsumptionPerMeterRange = state =>
  state.projects
  && state.projects.single
  && state.projects.single.consumptionPerMeter.range

//Benchmarking
export const getBenchmarks = (state) => state.projects
  && state.projects.single
  && state.projects.single.benchmarks
export const getZoneId = (state) => state.projects
  && state.projects.single
  && state.projects.single.benchmarks
  && state.projects.single.benchmarks.zoneId

export const getCoolingType = (state) => state.projects
  && state.projects.single
  && state.projects.single.benchmarks
  && state.projects.single.benchmarks.coolingType

export const getOccupancyType = (state) => state.projects
  && state.projects.single
  && state.projects.single.benchmarks
  && state.projects.single.benchmarks.occupancyType

export const getOccupancyTypeValue = (state) => state.projects
  && state.projects.single
  && state.projects.single.benchmarks
  && state.projects.single.benchmarks.occupancyTypeValue

export const getSquareFootage = (state) => state.projects
  && state.projects.single
  && state.projects.single.benchmarks
  && state.projects.single.benchmarks.squareFootage

export const getCurrentCompany =(state) => state.companies && state.companies.currentCompany
