import { range } from 'lodash'


const buildingTypeOptions = [
  'Residential' , 'Commercial', 'Mixed Use', 'Hospitality', 'Healthcare', 'Education', 'Heavy Industrial' , 'Light Industrial' ,  'Other',
]
const emiratesOptions = [
  'Abu Dhabi',
  'Ajman',
  'Dubai',
  'Fujairah',
  'Ras Al Khaimah',
  'Sharjah',
  'Umm Al Quwain',
]
const billTypeOptions = [
  'Total Conditioned',
  'Common Space',
]
const plantTypeOptions = [
  'District Cooling',
  'AC Chillers',
  'AC Chillers + DX Units',
  'AC Chillers + Package Units',
  'WC Chillers',
  'Package Units',
  'Split Units',
  'DX Systems',
  'Electrical',
  'District Cooling Plant',
  'AC / WC Chillers',
  'Split & Package Units',
  'Diesel Pump',
]

const pastEEUpgrades = [
  'None',
  'HVAC--Adiabatic Air Cooling',
  'HVAC--Chiller Staging',
  'HVAC--Chiller Wet Walls',
  'HVAC--DHW Calorifier Upgrade',
  'HVAC--DX Unit Upgrades/Retrofit',
  'HVAC--Insulation Upgrades',
  'HVAC--FAHU/AHU Cooling Management',
  'HVAC--FAHU/AHU EC Fan/Motor Swap',
  'HVAC--FAHU/AHU Demand Control Ventilation',
  'HVAC--FAHU/AHU Fan Static Pressure Reset',
  'HVAC--Heat Pump Retrofit & Replacement ',
  'HVAC--Cooling Tower Retrofit',
  'HVAC--Chilled Water Plant Optimization & Retrofit',
  'HVAC--Chilled Water Pump Optimization & Retrofit',
  'HVAC--Chilled Water Pump Swap/Replacement',
  'HVAC--Chiller Swap/Replacement',
  'HVAC--Chiller Optimization',
  'Control Systems--Smart Metering Upgrade/Installation',
  'Control Systems--BMS Systems Replacement & Upgrades',
  'Control Systems--Energy Control & Management System Upgrade & Installation',
  'Control Systems--BTU Metering',
  'Electrical--Façade Lighting Retrofit',
  'Electrical--Internal Building Lighting Retrofit',
  'Electrical--Parking Lighting Retrofit',
  'Electrical--Back of House Lighting Retrofit',
  'Water--Low-flow Fixtures Upgrade & Replacements',
  'Water--Sensor faucets & Urinals Installation',
  'Water--Greywater Plant',
  'Civil--Overall Furniture & Finishing Replacements',
  'Civil--F&B Equipment Replacements',
  'Civil--In-room Entertainment',
  'Others',
].map(v => ({ value: v, label: v }))

const salesLeadScopeOpts = ['I', 'II', 'III']
const phaseOpts = ['Opportunity', 'Sales', 'Audit', 'Implementation', 'Operations']

const strategicImportanceOptions = range(10).map(v => v + 1)
const productOfferingCategoryOptions = ['EPC', 'Lump Sum']
const productOfferingDetailsOptions = ['Light Retrofit', 'Basic Retrofit', 'Deep Retrofit']
const productLumpSumOptions = [
  'Level I Energy Audit',
  'Level II Energy Audit',
  'Level III Energy Audit',
  'Level III Energy/Investment Grade Audit',
  'Analytics & Dashboard',
  'Mobile Application Development',
  'LEED Certification',
  'Air/Water Quality Analysis', 'Other',
].map(v => ({ value: v, label: v }))

const eemOptions = [
  'Energy Control & Management System',
  'FAHU Demand Control Ventilation',
  'BMS & Controls',
  'FAHU Supply Air Temperature Reset',
  'AHU Demand Control Ventilation',
  'AHU Supply Air Temperature Reset',
  'Chilled Water Pump Dynamic Pressure Reset',
  'Chilled Water Pump Optimization',
  'Chiller Optimization',
  'FCU Thermostat Setback (Common Space)',
  'FCU Cooling Management',
  'Interior Lighting Retrofit',
  'Metering',
  'Kitchen Demand Control Ventilation',
  'Back-of-House Lighting Retrofit',
  'Chiller Plant Optimization',
  'Low Flow Fixtures',
  'Parking Lighting Retrofit',
  'Exterior Lighting Retrofit',
  'BMS & Controls Upgrade',
  'Common Space Lighting Retrofit',
  'Urinal Volume Reduction',
  'Chiller Wet Walls',
  'Chilled Water Plant Optimization',
  'Chiller Plant Swap ',
  'Greywater Plant',
  'Pool Chilled Water Cooling',
  'Spring Loaded Water Fixtures',
  'AHU High Efficiency Fans',
  'AHU Supply Fan Static Pressure Reset',
  'Common Space Thermostat Setback',
  'Corridor Lighting Controls',
  'DX Unit Retrofit',
  'EC Fan / Motor Swap',
  'FAHU High Efficiency Fans',
  'FCU EC Motors',
  'FCU Temperature Setback',
  'Guestroom Cooling Optimization',
  'Pool Heat Pump Retrofit',
  'Swimming Pool Heat Pump Retrofit',
  'Adiabatic pre-cooling system for chiller',
  'AHU Cooling Management',
  'AHU Fan Dynamic Static Pressure Reset',
  'AHU Static Pressure Reset',
  'Basement Lighting Retrofit',
  'Boiler Circulation Pumps',
  'Chilled Water Plant Retrofit',
  'Chilled Water Pool Cooling',
  'Chilled Water Pump Replacement',
  'Chilled Water Pump Retrofit',
  'Chilled Water Pump Swap',
  'Chiller Plant Manager',
  'Chiller Staging',
  'CHWP CU 352 Controllers',
  'Common Space Lighting Controls',
  'Common Space Programmable Thermostats',
  'Cooling Tower Retrofit',
  'DHW Calorifier Upgrade',
  'DHW Plant Heat Pump Retrofit',
  'Door Retrofit',
  'Dry Storage Window',
  'Dry Store Duct Distribution',
  'DX Unit Aircosavers',
  'DX Unit Upgrades',
  'ECM Motors for FCUs',
  'Electric Water Heater Timers',
  'EMC Motor Swap',
  'FAHU Demand based variable flow retrofit',
  'FAHU EC Fan / Motor Swap',
  'FAHU Motor Swap',
  'FAHU Schedule',
  'FAHU Temperature Reset',
  'FCU setpoint Reset',
  'Guestroom Management System',
  'Hot Water Heat Pump Retrofit',
  'Insulation',
  'Kitchen Makeup Air Quantity',
  'Lighting Schedule',
  'Parking Lighting Control',
  'Plantroom Window Film/Board Windows',
  'Pool Cover',
  'Pool Heating and Cooling',
  'Programmable Thermostats',
  'Secondary Pump Optimization',
  'Sensor Faucets',
  'Sensor Urinals',
  'Service Floor Lighting Retrofit',
  'Solar film in atrium',
  'Supply Temperature Reset',
  'Tenant Space Cooling Management',
  'Thermostat Retrofit',
  'Variable Speed AHUs',
].map(v => ({ value: v, label: v }))

const proposalCategoryOptions = [
  'Energy Audit',
  'Energy Performance Contracting',
  'Lump Sum',
]
const contractTypeOptions = [
  'SSEPC',
  'GSEPC',
  'Lump Sum',
]
const salesLeadNameOptions = [
  'Julian Pollmann',
  'Moe Al Husseini',
  'Sai Krisa',
  'Deepak Shahani',
  'Charles Blaschke',
  'James Barrow',
  'Nadir Najjani',
]
const salesLeadScope = [
  'Moe Al Husseini',
  'Sai Krisa',
  'Deepak Shahani',
  'Charles Blaschke',
  'James Barrow',
  'Nadir Najjani',
]
const salesSupportNameOptions = [
  'Julian Pollmann',
  'Phebby Pasturan',
  'Moe Al Husseini',
  'Sai Krishna',
  'Deepak Shahani',
]

const externalBDSupportOptions = ['Yes', 'No']

export {
  buildingTypeOptions,
  emiratesOptions,
  billTypeOptions,
  plantTypeOptions,
  pastEEUpgrades,
  strategicImportanceOptions,
  productOfferingCategoryOptions,
  productOfferingDetailsOptions,
  productLumpSumOptions,
  eemOptions,
  proposalCategoryOptions,
  contractTypeOptions,
  salesLeadNameOptions,
  salesLeadScope,
  salesSupportNameOptions,
  externalBDSupportOptions,
  salesLeadScopeOpts,
  phaseOpts
}