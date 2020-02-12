import shortid from 'shortid'
import { change, blur } from 'redux-form'
import _map from 'lodash/map'

import agent from '../../agent'


const FORM_KEY = 'cd'

export const SET_ACTIVE_OPTION = 'CD//SET_ACTIVE_OPTION'
export const SET_PROFITS = 'CD//SET_PROFITS'
export const SET_YEARS_SAVINGS = 'CD//SET_MODELS'
export const SET_MODELS = 'CD//SET_MODELS'

export const LOAD_PROJECT_INFO_REQUEST = 'CD//LOAD_PROJECT_INFO_REQUEST'
export const LOAD_PROJECT_INFO_SUCCESS = 'CD//LOAD_PROJECT_INFO_SUCCESS'
export const LOAD_PROJECT_INFO_FAILED = 'CD//LOAD_PROJECT_INFO_FAILED'

const waitFunc = (typeof window !== 'undefined') 
  ? window.requestAnimationFrame
  : setImmediate

const initialState = {
  loading: false,
  maxYears: 10,
  activeOption: 'C',
  activeProject: {
    id: -1,
    label: 'Unknown Project',
    data: {
      
    },
  },
  options: [
    'A',
    'B',
    'C',
  ],
  profits: {
    customer: {
      TenYearProfit: 0.00,
      NPV: 0.00,
      ROI: 0.00,
      IRR: 0.00,
      TenYearSavingsShare: 0.00,
    },
    esco: {
      NPV: 0.00,
      ROI: 0.00,
      IRR: 0.00,
      TenYearSavingsShare: 0.00,
    },
    dataId: 'BUsIw15',
  },
  inputs: {
    project: {
      //
      baselineCost: 4758584,
      baselineConsumption: 10710167 ,
      energyCostReduction: 18.5,
      annualCostSavings: 879351,
      year0Savings: 0,
      year1RampUp: 1.00,
      // 
      opex: 1987400,
      capex: 398726,
      //
      customerDeployment: 0.101,
      customerSavingShare: 0.3,
      contractLengthYears: 10,
      //
      annualUtilityInflation: 0.00,
      annualCostInflation: 0.03,
      year0ESCOSavingsAccrued: 0.00,
      customerManagementCosts: 0.03,
      ESCODevelopmentFee: 0.00,
      earlyTerminationPenalty: 0.05,
      discountRate: 0.08,
      partnerSharedSavings: 0.00,
      customerDeploymentPayment: 0.10,
      // 
      engineeringCosts: 740000,
      customerDeploymentPaymentTotalConstructionCosts: 1247400 ,
      subcontractorCosts: 0.00,
      annualOpExCosts: 129000,
      customerDeploymentPaymentAnnualOpExCosts: 1.00,
      // Options
      A: {
        engineeringCosts: 0.00,
        totalConstructionCosts: 0.00,
        subcontractorCosts: 0.00,
        customerDeploymentPaymentBondsAndInsuranceValue: 0.00,
        customerDeploymentPaymentConstructionBondCost: 0.00,
        customerDeploymentPaymentEquipmentGuarantees: 0.00,
        customerDeploymentPaymentAnnualSavingsInsurance: 0.00,
        riskFactor: 0.00,
      },
      B: {
        engineeringCosts: 0.00,
        totalConstructionCosts: 0.00,
        subcontractorCosts: 0.00,
        customerDeploymentPaymentBondsAndInsuranceValue: 0.00,
        customerDeploymentPaymentConstructionBondCost: 0.00,
        customerDeploymentPaymentEquipmentGuarantees: 0.00,
        customerDeploymentPaymentAnnualSavingsInsurance: 0.00,
        riskFactor: 0.00,
      },
      C: {
        engineeringCosts: 0.00,
        totalConstructionCosts: 0.00,
        subcontractorCosts: 0.00,
        customerDeploymentPaymentBondsAndInsuranceValue: 3.00,
        customerDeploymentPaymentConstructionBondCost: 3.00,
        customerDeploymentPaymentEquipmentGuarantees: 0.037,
        customerDeploymentPaymentAnnualSavingsInsurance: 0.00,
        riskFactor: 0.09,
      },
    },
  },
  yearSavings: {
    dataId: 'EUsIw15',
  },
  models: {
    projectCashFlow: {
      AnnualSavingsOnCustomersBill: [0,0,0,0,0,0,0,0,0,0],
      Revenue: [0,0,0,0,0,0,0,0,0,0],
      CaPex: [0,0,0,0,0,0,0,0,0,0],
      OpEx: [0,0,0,0,0,0,0,0,0,0],
      NetCashFlow: [0,0,0,0,0,0,0,0,0,0],
      CumulativeCashFlow: [0,0,0,0,0,0,0,0,0,0],
    },
    ESCOCashFlow: {
      AnnualSavingsOnCustomersBill: [0,0,0,0,0,0,0,0,0,0],
      PercentSavingsAccrued: [0,0,0,0,0,0,0,0,0,0],
      SavingsRevenues: [0,0,0,0,0,0,0,0,0,0],
      ServicePayments: [0,0,0,0,0,0,0,0,0,0],
      Investment: [0,0,0,0,0,0,0,0,0,0],
      OpExCosts: [0,0,0,0,0,0,0,0,0,0],
      FinanceCosts: [0,0,0,0,0,0,0,0,0,0],
      EquipmentGuarantees: [0,0,0,0,0,0,0,0,0,0],
      SavingsInsurance: [0,0,0,0,0,0,0,0,0,0],
      CustomerManagement: [0,0,0,0,0,0,0,0,0,0],
      PartnerSavingsShare: [0,0,0,0,0,0,0,0,0,0],
      NetCashFlow: [0,0,0,0,0,0,0,0,0,0],
      CumulativeCashFlow: [0,0,0,0,0,0,0,0,0,0],
    },
    customerCashFlow: {
      AnnualSavingsOnCustomersBill: [0,0,0,0,0,0,0,0,0,0],
      PercentSavingsAccruedToCustomer: [0,0,0,0,0,0,0,0,0,0],
      GrossSavings: [0,0,0,0,0,0,0,0,0,0],
      Investment: [0,0,0,0,0,0,0,0,0,0],
      SavingsInsurance: [0,0,0,0,0,0,0,0,0,0],
      CapExPayment: [0,0,0,0,0,0,0,0,0,0],
      OpExPayment: [0,0,0,0,0,0,0,0,0,0],
      NetCashFlow: [0,0,0,0,0,0,0,0,0,0],
      Profit: [0,0,0,0,0,0,0,0,0,0],
    },
  },
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {

  case SET_ACTIVE_OPTION:
    return {
      ...state,
      activeOption: action.payload.option,
    }

  case SET_PROFITS:
    return {
      ...state,
      profits: {
        ...state.profits, 
        customer: {
          ...state.profits.customer,
          ...action.payload.profits.customer,
        },
        esco: {
          ...state.profits.esco,
          ...action.payload.profits.esco,
        },
        dataId: action.payload.dataId,
      },
    }

  case SET_MODELS:
    return {
      ...state,
      yearSavings: {
        ...state.yearSavings,
        dataId: action.payload.dataId,
      },
      models: {
        ...state.models,
        projectCashFlow: {
          ...state.models.projectCashFlow,
          ...action.payload.models.projectCashFlow,
          dataId: action.payload.dataId,
        },
        ESCOCashFlow: {
          ...state.models.ESCOCashFlow,
          ...action.payload.models.ESCOCashFlow,
          dataId: action.payload.dataId,
        },
        customerCashFlow: {
          ...state.models.customerCashFlow,
          ...action.payload.models.customerCashFlow,
          dataId: action.payload.dataId,
        },
      },
    }

  case LOAD_PROJECT_INFO_REQUEST:
    return {
      ...state,
      loading: true,
      activeProject: {
        id: action.payload.option.id,
        label: action.payload.option.label,
        data: {},
      },
    }

  case LOAD_PROJECT_INFO_SUCCESS:
    return {
      ...state,
      loading: false,
      activeProject: {
        id: action.payload.result.id,
        label: action.payload.result.name,
        data: { ...action.payload.result },
      },
      inputs: {
        ...state.inputs,
        project: {
          ...state.inputs.project,
          ...action.payload.extraFields,
        },
      },
    }

  case LOAD_PROJECT_INFO_FAILED:
    return {
      ...state,
      loading: false,
      activeProject: action.payload.project,
    }

  default:
    return state
  }
}

// actions
export const setActiveOption = (option) => ({
  type: SET_ACTIVE_OPTION,
  payload: {
    option,
  },
})

export const setProfits = (profits) => ({
  type: SET_PROFITS,
  payload: {
    profits,
    dataId: shortid(),
  },
})

export const setModels = (models) => ({
  type: SET_MODELS,
  payload: {
    models,
    dataId: shortid(),
  },
})

const getProjectFields = (info, data) => {
  const {
    percentageEnergyReduction = 0.00,
    forecastCostReduction  = 0.00,
  } = info

  const baselineConsumption = (data && data.baseline && data.baseline.total) || 0.00
  const baselineCost = (data && data.baselineCost && data.baselineCost.total) || 0.00

  return {
    baselineCost,
    baselineConsumption,
    energyCostReduction: (!!percentageEnergyReduction ? percentageEnergyReduction / 100 : 0),
    annualCostSavings: forecastCostReduction,
  }
}

const updateField = (dispatch, form, field, value) => {
  dispatch(change(form, field, value))

  waitFunc(
    () => dispatch(blur(form, field, value))
  )
}

export const loadProjectInfo = (projectId, label) => (dispatch) => {
  dispatch({
    type: LOAD_PROJECT_INFO_REQUEST,
    payload: {
      option: {
        id: projectId,
        label,
      },
    },
  })
  
  return Promise.all([
    agent.Projects.get(projectId),
    agent.Projects.loadInfo(projectId),
  ])
    .then(([project, info]) => {
      const fields = getProjectFields(info, project)
      
      _map(fields, (_value, _field) => {
        updateField(dispatch, FORM_KEY, _field, _value)
      })

      dispatch({
        type: LOAD_PROJECT_INFO_SUCCESS,
        payload: {
          result: info,
          extraFields: fields,
          dataId: shortid(),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: LOAD_PROJECT_INFO_FAILED,
        payload: {
          error,
        },
      })
    })
}

// getters
export const getCD = (state) => state.cd
export const getLoading = (state) => state.cd.loading
export const getActiveProject = (state) => state.cd.activeProject
export const getMaxYears = (state) => state.cd.maxYears
export const getOptionsList = (state) => state.cd.options
export const getActiveOption = (state) => state.cd.activeOption
export const getProfits = (state) => state.cd.profits
export const getInputs = (state) => state.cd.inputs
export const getYearSavings = (state) => state.cd.yearSavings
export const getModels = (state) => state.cd.models
