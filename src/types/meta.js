// LOGICAL
const GENERAL = 'General' 
const ENERGY  = 'Energy' 
// FUELS
const ELECTRICITY     = 'Electricity'
const WATER           = 'Water'
const CHILLED_WATER   = 'Chilled Water'
const GAS             = 'Gas'
const LPG             = 'LPG (Gas)'
const OTHER           = 'Other'

// COMPUTED
const ACTUAL            = 'Actual'
const BASELINE          = 'Baseline'
const ADJUSTED_BASELINE = 'Adjusted Baseline'
const FORECAST          = 'Forecast'
const REDUCTION         = 'Reduction'
const AVARAGE           = 'Avarage'

const LOGICAL = {
  GENERAL,
  ENERGY,
}

const FUELS = {
  ELECTRICITY,
  WATER,
  CHILLED_WATER,
  LPG,
  GAS,
  OTHER,
}

const COMPUTED = {
  ACTUAL,
  BASELINE,
  ADJUSTED_BASELINE,
  FORECAST,
  REDUCTION,
  AVARAGE,
}

export const TYPES = {
  ...LOGICAL,
  ...FUELS,
  ...COMPUTED,
}

export const ICONS = {
  // LOGICAL
  [GENERAL]:  'fas fa-building',
  [ENERGY]:  'fas fa-burn',
  // FUELS
  [ELECTRICITY]: 'fas fa-bolt',
  [WATER]: 'fas fa-tint',
  [CHILLED_WATER]: 'fas fa-water',
  [LPG]: 'fas fa-burn',
  [GAS]: 'fas fa-burn',
  // COMPUTED
  [ACTUAL]: 'fas fa-chart-line',
  [BASELINE]: 'fas fa-project-diagram',
  [ADJUSTED_BASELINE]: 'fas fa-chart-area',
  [FORECAST]: 'fas fa-chart-bar',
}