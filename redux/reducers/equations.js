
const initialState = {
  'headers':[
    'Month',
    'Baseline (Electrical)',
    'Forecast (kWh)',
    'CDD Baseline (23.5)',
    'Forecast Savings (AED)',
    'MDB 01',
    'MDB 02',
    'CDD Actual (23.5)',
    'Month-String',
    'fuelRateDEWA',
    'actualElectricalConsumption',
    'calculatedConsumption(KWH)',
    'routineAdjustment(KWH)',
    'adjustedBaseline',
    'actualSavings(KWH)',
    'actualSavings(AED)',
    'forecastAccuracy',
  ],
  'customViews':[
    {
      'isDisabledForNew':true,
      'isDisabled':true,
      'columnName':'Month',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'Baseline (Electrical)',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'Forecast (kWh)',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'CDD Baseline (23.5)',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'Forecast Savings (AED)',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'MDB 01',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'MDB 02',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'CDD Actual (23.5)',
      'mask':' ',
    },
    {
      'isDisabledForNew':true,
      'isDisabled':true,
      'columnName':'Month-String',
      'mask':' ',
    },
    {
      'isDisabledForNew':true,
      'isDisabled':true,
      'columnName':'Month',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'Baseline (Electrical)',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'Forecast (kWh)',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'CDD Baseline (23.5)',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'Forecast Savings (AED)',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'MDB 01',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'MDB 02',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'CDD Actual (23.5)',
      'mask':' ',
    },
    {
      'isDisabledForNew':true,
      'isDisabled':true,
      'columnName':'Month-String',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'fuelRateDEWA',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'actualElectricalConsumption',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'calculatedConsumption(KWH)',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'routineAdjustment(KWH)',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'adjustedBaseline',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'actualSavings(KWH)',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'actualSavings(AED)',
      'mask':' ',
    },
    {
      'isDisabledForNew':false,
      'isDisabled':false,
      'columnName':'forecastSavingsAccuracy',
      'mask':' ',
    },
  ],
  'siteEquation':[
    {
      'equationName':'fuelRateDEWA',
      'equationVariables':[
        0.445,
      ],
    },
    {
      'equationName':'actualElectricalConsumption',
      'equationVariables':[
        'MDB 01',
        '+',
        'MDB 02',
      ],
    },
    {
      'equationName':'calculatedConsumption(KWH)',
      'equationVariables':[
        797,
        '*',
        'CDD Baseline (23.5)',
        '+',
        107872,
      ],
    },
    {
      'equationName':'routineAdjustment(KWH)',
      'equationVariables':[
        'calculatedConsumption(KWH)',
        '-',
        'Baseline (Electrical)',
      ],
    },
    {
      'equationName':'adjustedBaseline',
      'equationVariables':[
        'Baseline (Electrical)',
        '+',
        'routineAdjustment(KWH)',
      ],
    },
    {
      'equationName':'actualSavings(KWH)',
      'equationVariables':[
        'adjustedBaseline',
        '-',
        'actualElectricalConsumption',
      ],
    },
    {
      'equationName':'actualSavings(AED)',
      'equationVariables':[
        'actualSavings(KWH)',
        '*',
        'fuelRateDEWA',
      ],
    },
    {
      'equationName':'forecastAccuracy',
      'equationVariables':[
        '(',
        'actualSavings(AED)',
        '/',
        'Forecast Savings (AED)',
        ')',
        '*',
        100,
      ],
    },
  ],
}

export default (state = initialState, action) => {
  switch(action.type) {


  default: return state
  }
}


export const getSiteEquation = (state) => state.equations && state.equations.siteEquation