/* eslint-disable max-len */
import {
  renderField,
  renderSelect,
  renderTextArea,
  renderCheckBox,
  renderMultipleSelect, 
} from '../../fields/fieldSet'


export const fahuFields = [
  { name: 'fHasFreshAirHandlingUnits', label: 'Are there Fresh Air Handling Units?', render: renderCheckBox },
  { name: 'fRunningAlways', label: 'Are the FAHUs running 24/7/365?' , render: renderCheckBox },
  { name: 'fTypicalDailyRunhours', label: 'What are the typical daily runhours (0-24)?', type: 'number', render: renderField },
  { name: 'fHasVDF', label: 'Do FAHUs have VFDs?', render: renderCheckBox },
  { name: 'fHasCO2Sensors', label: 'Do FAHUs have CO2 sensors?', render: renderCheckBox },
  { name: 'fWinterSP', label: 'SAT SP in winter (10-28)?', type: 'number', render: renderField },
  { name: 'fSummerSP', label: 'SAT SP in summer (10-28)?', type: 'number', render: renderField },
  { name: 'fIsSpConstant', label: 'Is the SAT SP constant throughout the day and night?', render: renderCheckBox },
  { name: 'fHasReheaters', label: 'Are there air reheaters (electric)?', render: renderCheckBox },
]

export const ahuFields = [
  { name: 'aRecirculating', label: 'Are there recirculating AHUs?', render: renderCheckBox },
  { name: 'aRunningAlways', label: 'Are the AHUs running 24/7/365?' , render: renderCheckBox },
  { name: 'aTypicalDailyRunhours', label: 'What are the typical daily runhours (0-24)?', type: 'number', render: renderField },
  { name: 'aHasVDF', label: 'Do AHUs have VFDs?', render: renderCheckBox },
  { name: 'aHasStaticPresure', label: 'Is there static pressure sensor in the duct?', render: renderCheckBox },
  { name: 'aWinterSP', label: 'SAT SP in winter (10-28)?', type: 'number', render: renderField },
  { name: 'aSummerSP', label: 'SAT SP in summer (10-28)?', type: 'number', render: renderField },
  { name: 'aSpConstant', label: 'Is the SAT SP constant throughout the day and night?', render: renderCheckBox },
  { name: 'aHasBypass', label: 'Does the AHU have bypass with a damper?', render: renderCheckBox },
  { name: 'aHasVAVBoxes', label: 'Are there VAV boxes served by the AHU?', render: renderCheckBox },
  { name: 'aVAVIntegrated', label: 'Are VAVs integrated to BMS?', render: renderCheckBox },
  { name: 'aVAVDumpedVisible', label: 'Is the actual VAV damper position and room temp visible on BMS?', render: renderCheckBox },
]

export const coolingFields = [
  { name: 'cCHMain', label: 'Are CHs the main source of cooling?', render: renderCheckBox },
  { name: 'cDCPMain', label: 'Is DCP  the main source of cooling?' , render: renderCheckBox },
  { name: 'cHasDX', label: 'Are there DX units?', type: 'number', render: renderSelect(['Split Unit', 'Package Units', 'VRF']) },
  { name: 'cWCorAC', label: 'Are they WC or AC chillers?', render: renderCheckBox }, /** OPTIONAL ADDITIONAL INFO */
  { name: 'cWinterBuildingDelta', label: 'What is the typical building\'s delta T in winter (0-10)?', type: 'number', render: renderField },
  { name: 'cSummerBuildingDelta', label: 'What is the typical building\'s delta T in summer (0-10)?', type: 'number', render: renderField },
  { name: 'cWinterCHWSupply', label: 'What is the CHW supply water setpoint in winter (4-10)?', type: 'number', render: renderField },
  { name: 'cSummerCHWSupply', label: 'What is the CHW supply water setpoint in summer (4-10)?', type: 'number', render: renderField },
  { name: 'cValvesOff', label: 'Are chiller isolation valves closing when the CH is off?', render: renderCheckBox },
  { name: 'cCHsCount', label: 'How many CHs are there?', type: 'number', render: renderField },
  { name: 'cWetWallsCount', label: 'How many CHs have wet walls?', type: 'number', render: renderField },
  { name: 'cCompressorType', label: 'What type of compressor are the CHs?', render: renderSelect([]) },
  { name: 'cHasSecondaryPumps', label: 'Are there secondary variable pumps?', render: renderCheckBox },
  { name: 'cHasTertiaryPumps', label: 'Are there tertiary pumps?', render: renderCheckBox },
  { name: 'cConstantPumpSpeed', label: 'Are the primary pumps constant speed?', render: renderCheckBox },
  { name: 'cPumpsAge', label: 'How old are the pumps (0-25y)?', type: 'number', render: renderField },
  { name: 'cPumpsEqualCH', label: 'Are the primary pumps running 1 pump - 1 CH?', render: renderCheckBox },
]

export const fcuFields = [
  { name: 'fcHasFCU', label: 'Are there FCUs?', render: renderCheckBox },
  { name: 'fcHasIntegratedBMS', label: 'Are the FCU thermostats integrated in BMS?' , render: renderCheckBox },
  { name: 'fcBMSControlled', label: 'Can they be controlled via BMS?', render: renderCheckBox },
  { name: 'fcHasColdArea', label: 'Are there areas with low room temperatures (<24)?', render: renderCheckBox }, /** OPTIONAL ADDITIONAL INFO */
  { name: 'fcCanTempIncrased', label: 'Can the temp be increased during unocc period?', render: renderCheckBox }, /** OPTIONAL ADDITIONAL INFO */
]

export const bmsFields = [
  { name: 'bHasBMS', label: 'Is there a BMS?', render: renderCheckBox },
  { name: 'bMainComm', label: 'What is the main comm protocol?' , render: renderMultipleSelect(['BACnet', 'ModbusTCP', 'Modbus485', 'LON', 'Other']) },
  { name: 'bHasAMC', label: 'Is there an AMC?', render: renderCheckBox },
  { name: 'bBMSVendor', label: 'What is the BMS vendor?', render: renderTextArea },
  { name: 'bEquipmentTrended', label: 'Is the equipment operation trended?', render: renderCheckBox }, 
  { name: 'bTrendedPeriod', label: 'How long is the trended period in months (0-24)?', type: 'number', render: renderField },
  { name: 'bSATTrended', label: 'Are the FAHU SAT trended?', render: renderCheckBox }, 
  { name: 'bBuildingDeltaTrended', label: 'Is the building delta T trended?', render: renderCheckBox }, 
  { name: 'bBMSAge', label: 'How old is the BMS?', type: 'number', render: renderField },
  { name: 'bBMSPercent', label: '% of BMS readings faulty?', type: 'number', render: renderField },
]

export const plumbingFields = [
  { name: 'pCentralizedDHWPlant', label: 'Is there centralized DHW plant?', render: renderCheckBox },
  { name: 'pMainComm', label: 'What is the main comm protocol?' , render: renderSelect(['Domestic', 'Cold Water', 'Cooling', 'Heat', 'Pump']) },
  { name: 'pHWSetpiont', label: 'What is HW setpoint (40-60)?', type: 'number', render: renderField },
  { name: 'pBMSVendor', label: 'What is the BMS vendor?', render: renderTextArea },
  { name: 'pHasSPSchedule', label: 'Is there above HW SP scheduling?', render: renderCheckBox }, 
  { name: 'pSubmetteredUsers', label: 'Are the users submetered?', render: renderCheckBox }, 
  { name: 'pDomesticCooled', label: 'Is the domestic cold water cooled?', render: renderCheckBox }, 
  { name: 'pTypicalTemperature', label: 'What is the typical cold water cooling temperature SP?', type: 'number', render: renderField },
  { name: 'pSPStaticinYear', label: 'Is the above SP static throughout the year?', render: renderCheckBox }, 
]

export const swimmingpoolFields = [
  { name: 'sOutdoorPool', label: 'Is there an outdoor pool?', render: renderCheckBox },
  { name: 'sPoolHeated', label: 'Is the pool heated?' , render: renderCheckBox },
  { name: 'sMinTemp', label: 'Minimum pool temperature (26-32°C)?', type: 'number', render: renderField },
  { name: 'sSourceHeat', label: 'What is the source of the heat?', render: renderSelect(['Pool', 'Cooling', 'Heat Exchanger']) },
  { name: 'sPoolCooled', label: 'Is the pool cooled?', render: renderCheckBox }, 
  { name: 'sCoolingSource', label: 'What is the source of the cooling?', render: renderSelect([]) }, 
]

export const lightningFields = [
  { name: 'lHalogenLight', label: 'Are there areas with halogen lighting?', render: renderCheckBox }, /** OPTIONAL ADDITIONAL INFO */
  { name: 'lDailyRunhours', label: 'Daily runhours of above areas (0-24)?', type: 'number', render: renderField },
  { name: 'lPrkingFluoLamp', label: 'Are the lights fluorescent type in the parking?', render: renderCheckBox },
  { name: 'lParkingRunhours', label: 'Parking lighting runhours (0-24)?', type: 'number', render: renderField },
  { name: 'lSpecificLoops', label: 'Do they schedule the parking lighting (specific loops)?', render: renderCheckBox }, 
  { name: 'lMotionSersors', label: 'Are there motion sensors in the parking?', render: renderCheckBox }, 
  { name: 'lCFLLight', label: 'Are there CFL lighting?', render: renderCheckBox }, 
  { name: 'lAreasDailyRunhours', label: 'Daily runhours of above areas (0-24)?', type: 'number', render: renderField },
  { name: 'lLandscapeLightning', label: 'Is there irrigation/lanscape lighting?', render: renderCheckBox }, 
  { name: 'lexLightType', label: 'Exterior lighting type?', render: renderTextArea },
  { name: 'lExLightRunhours', label: 'Exterior lighting daily runhours (0-24)?', type: 'number', render: renderField },
]

export const kitchenFields = [
  { name: 'kKithenHoods', label: 'Are there kitchen hoods?', render: renderCheckBox },
  { name: 'kHoodsRunhour', label: 'What are the daily kitchen hood runhours?', type: 'number', render: renderField },
  { name: 'kAirHandlingUnits', label: 'Is there make-up air handling units?', render: renderCheckBox },
  { name: 'kWinterSP', label: 'What is the SAT SP in winter?', type: 'number', render: renderField },
  { name: 'kSummerSP', label: 'What is the SAT SP in summer?', type: 'number', render: renderField },
  { name: 'kAHURunhours', label: 'What are the daily AHU runhours?', type: 'number', render: renderField },
  { name: 'khoodLinked', label: 'Is the hood operation linked to the hood?', render: renderCheckBox }, 
]

export const hotelFields = [
  { name: 'hGRMS', label: 'Is there GRMS?', render: renderCheckBox },
  { name: 'hFCUControlled', label: 'Are the FCU fans controlled based on occupancy?', render: renderCheckBox },
  { name: 'hRoomTempControlled', label: 'Is the room temperature controlled based on occupancy?', render: renderCheckBox }, 
  { name: 'hTempSetback', label: 'Is there a temperature setback for unocc period?', render: renderCheckBox }, 
  { name: 'hWindowSensor', label: 'Is there window/balcony sensor?', render: renderCheckBox }, 
  { name: 'hLoundry', label: 'Is there in-house laundry?', render: renderCheckBox }, 
  { name: 'hLaundryStream', label: 'Is the laundry using steam?', render: renderCheckBox }, 
]

export const waterFields = [
  { name: 'wIrrigationSystem', label: 'Is there irrigation system?', render: renderCheckBox },
  { name: 'wTimeProgramming', label: 'Does it have time-programming?', render: renderCheckBox }, /** OPTIONAL ADDITIONAL INFO */
  { name: 'wIrrigationSensors', label: 'Are there smart irrigation sensors?', render: renderCheckBox },
  { name: 'wLowFlowFixtures', label: 'Are there low-flow fixtures?', render: renderCheckBox }, 
  { name: 'wWCTankSize', label: 'What is the size of toilet flush tank in liters (0-10)?', type: 'number', render: renderField }, 
]

export const otherFields = [
  { name: 'oDataCenter', label: 'Is there a Data Center', render: renderCheckBox },
]

export default {
  fahuFields,
  ahuFields,
  coolingFields,
  fcuFields,
  bmsFields,
  plumbingFields,
  swimmingpoolFields,
  lightningFields,
  kitchenFields,
  hotelFields,
  waterFields,
  otherFields,
}