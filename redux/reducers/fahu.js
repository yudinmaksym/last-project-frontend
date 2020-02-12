import { showStickLoader } from './loaders'
import agentDaily from '../../agentDaily'
var moment = require('moment');

//CONSTANTS
export const LOAD_ALL_PROJECTS_SUCCESS = "FAHU//LOAD_ALL_PROJECTS_SUCCESS";
export const LOAD_ALL_EQUIPMENTS_SUCCESS = "FAHU//LOAD_ALL_EQUIPMENTS_SUCCESS";

export const LOAD_CHW_VALVE_TEMP_REQUEST = "FAHU//LOAD_CHW_VALVE_TEMP_REQUEST";
export const LOAD_CHW_VALVE_TEMP_SUCCESS = "FAHU//LOAD_CHW_VALVE_TEMP_SUCCESS";
export const LOAD_CHW_VALVE_TEMP_FAILED = "FAHU//LOAD_CHW_VALVE_TEMP_FAILED";

export const LOAD_TEMP_TRENDS_REQUEST = "FAHU//LOAD_TEMP_TRENDS_REQUEST";
export const LOAD_TEMP_TRENDS_SUCCESS = "FAHU//LOAD_TEMP_TRENDS_SUCCESS";
export const LOAD_TEMP_TRENDS_FAILED = "FAHU//LOAD_TEMP_TRENDS_FAILED";

export const LOAD_VFD_SPEED_REQUEST = "FAHU//LOAD_VFD_SPEED_REQUEST";
export const LOAD_VFD_SPEED_SUCCESS = "FAHU//LOAD_VFD_SPEED_SUCCESS";
export const LOAD_VFD_SPEED_FAILED = "FAHU//LOAD_VFD_SPEED_FAILED";

export const LOAD_EXHAUS_VFD_SPEED_REQUEST = "FAHU//LOAD_EXHAUS_VFD_SPEED_REQUEST";
export const LOAD_EXHAUS_VFD_SPEED_SUCCESS = "FAHU//LOAD_EXHAUS_VFD_SPEED_SUCCESS";
export const LOAD_EXHAUS_VFD_SPEED_FAILED = "FAHU//LOAD_EXHAUS_VFD_SPEED_FAILED";

export const LOAD_COOLING_VALVE_REQUEST = "FAHU//LOAD_COOLING_VALVE_REQUEST";
export const LOAD_COOLING_VALVE_SUCCESS = "FAHU//LOAD_COOLING_VALVE_SUCCESS";
export const LOAD_COOLING_VALVE_FAILED = "FAHU//LOAD_COOLING_VALVE_FAILED";

export const LOAD_CO2_REQUEST = "FAHU//LOAD_CO2_REQUEST";
export const LOAD_CO2_SUCCESS = "FAHU//LOAD_CO2_SUCCESS";
export const LOAD_CO2_FAILED = "FAHU//LOAD_CO2_FAILED";

export const LOAD_FLOW_SUCCESS = "FAHU//LOAD_FLOW_SUCCESS";

export const LOAD_STS_REQUEST = "FAHU//LOAD_STS_REQUEST";
export const LOAD_STS_SUCCESS = "FAHU//LOAD_STS_SUCCESS";
export const LOAD_STS_FAILED = "FAHU//LOAD_STS_FAILED";

export const LOAD_HOA_STS_SUCCESS = "FAHU//LOAD_HOA_STS_SUCCESS";

export const LOAD_SF_EF_ENERGY_SUCCESS = "FAHU//LOAD_SF_EF_ENERGY_SUCCESS";
export const LOAD_ENERGY_CONS_DIST_SUCCESS = "FAHU//LOAD_ENERGY_CONS_DIST_SUCCESS";
export const LOAD_ENTHAPLY_SUCCESS = "FAHU//LOAD_ENTHAPLY_SUCCESS";

export const SAVE_SELECTED_PROJECT_AND_EQUIP = "FAHU//SAVE_SELECTED_PROJECT_AND_EQUIP";

export const CLEAR_STATE = "FAHU//CLEAR_STATE"

const initialState = {}

//REDUCERS
export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ALL_PROJECTS_SUCCESS:
            return {
                ...state,
                projects: action.payload.result.items
            }
        case LOAD_ALL_EQUIPMENTS_SUCCESS:
            return {
                ...state,
                fahuList: action.payload.result.items
            }
        case LOAD_CHW_VALVE_TEMP_SUCCESS:
            return {
                ...state,
                chwValveTemp: action.payload.result
            }
        case LOAD_TEMP_TRENDS_SUCCESS:
            return {
                ...state,
                tempTrends: action.payload.result
            }
        case LOAD_VFD_SPEED_SUCCESS:
            return {
                ...state,
                vfdSpeed: action.payload.result
            }
        case LOAD_EXHAUS_VFD_SPEED_SUCCESS:
            return {
                ...state,
                exhausVfdSpeed: action.payload.result
            }
        case LOAD_COOLING_VALVE_SUCCESS:
            return {
                ...state,
                cooling: action.payload.result
            }
        case LOAD_CO2_SUCCESS:
            return {
                ...state,
                co2: action.payload.result
            }
        case LOAD_FLOW_SUCCESS:
            return {
                ...state,
                flow: action.payload.result
            }
        case LOAD_STS_SUCCESS:
            return {
                ...state,
                sts: action.payload.result
            }
        case LOAD_HOA_STS_SUCCESS:
            return {
                ...state,
                hoaSts:action.payload.result
            }
        case LOAD_SF_EF_ENERGY_SUCCESS:
            return {
                ...state,
                sfEfEnergy: action.payload.result
            }
        case LOAD_ENERGY_CONS_DIST_SUCCESS:
            return {
                ...state,
                energyCons: action.payload.result
            }
        case LOAD_ENTHAPLY_SUCCESS:
            return {
                ...state,
                enthalpy: action.payload.result
            }
        case CLEAR_STATE:
            return {
                ...state,
                fahuList: '',
                chwValveTemp: '',
                tempTrends: '',
                vfdSpeed: '',
                cooling: '',
                co2: '',
                sts: '',
                hoaSts: '',
                sfEfEnergy: '',
                energyCons: '',
                enthalpy: '',
                flow: '',
                exhausVfdSpeed: '',
            }
        case SAVE_SELECTED_PROJECT_AND_EQUIP:
            return {
                ...state,
                selectedData: {
                    project: action.payload.data.label,
                    projectId: action.payload.data.value,
                    equip: action.payload.equipment.name,
                    tower: action.payload.equipment.tower,
                    startDate: action.payload.range.startDate,
                    endDate: action.payload.range.endDate
                }
            }
        default: return state
    }
}


//ACTIONS
export const loadAllData = (range, data, equipment, fahuList) => async dispatch => {
    if(equipment.name) {
        dispatch(showStickLoader(true))
        await Promise.all([
            dispatch(saveSelectedData(range, data, equipment)),
            dispatch(loadCHWValveTemp(range, data.label, equipment)),
            dispatch(loadTempTrends(range, data.label, equipment)),
            dispatch(loadVFDSpeed(range, data.label, equipment)),
            dispatch(loadExhausVFDSpeed(range, data.label,equipment)),
            dispatch(loadCoolingValve(range, data.label, equipment)),
            dispatch(loadCO2(range, data.label, equipment)),
            dispatch(loadFlow(range, data.label, equipment)),
            dispatch(loadSTS(range, data.label, equipment)),
            dispatch(loadHoaSTS(range, data.label, equipment)),
            dispatch(loadEnthalpy(range, data.label, equipment)),
            dispatch(loadSFEFEnergy(range, data.label, equipment)),
            dispatch(loadEnergyConsDist(range, data.label, equipment, fahuList))
        ])
        dispatch(showStickLoader(false))
    }
}

const generateReqBody = (startDate, endDate, project, equip, measurement, tower) => {
    const data = 
        ' from(bucket: "taka-iot-data")' +
            ` |> range(start:${moment(startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(endDate).add(1, 'day').format("YYYY-MM-DDT00:00:00+04:00")})` +
            ` |> filter(fn: (r) => r.site == "${project}")` +
            ` |> filter(fn: (r) => r.equip == "${equip}")` +
            `${tower  ? `|> filter(fn: (r) => r.tower == "${tower}")` : ''}` +
            ' |> drop(columns: ["pointStatus"])' +
            ` |> filter(fn: (r) => (${measurement}) and r._field == "value")` +
            ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
            ' |> keep(columns: ["_time", "_measurement", "_value"])' +
            ' |> aggregateWindow(every: 15m, timeSrc: "_start", fn: mean, createEmpty: false)';
    return data
}

export const saveSelectedData = (range, data, equipment = {name: "", tower: ""}) => dispatch => {
    dispatch({
        type: SAVE_SELECTED_PROJECT_AND_EQUIP,
        payload: {
            range,
            data,
            equipment
        }
    })
}

export const loadAllProjects = (start, stop, id, project) => dispatch => {
    return agentDaily.Default.loadAllProjects()
        .then(result => {
            if(id && project) {
                const range = {
                    startDate: start,
                    endDate: stop,
                }
                const data = {
                    value: id,
                    label: project
                }
                dispatch(saveSelectedData(range, data)),
                dispatch(loadFahuList(data,range))
            } else {
                const range = {
                    startDate: start,
                    endDate: stop,
                }
                const data = {
                    value: result.items[0].id,
                    label: result.items[0].iot_name,
                }
                dispatch(saveSelectedData(range, data)),
                dispatch(loadFahuList(data, range))
            }
            dispatch({
                type: LOAD_ALL_PROJECTS_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadFahuList = (data, range) => dispatch => {
    dispatch({type: CLEAR_STATE})
    return agentDaily.Fahu.loadAllFahuEquip(data.value)
        .then(result => {
            if(result.items.length !== 0) {
                const equip = {
                    tower: result.items[0].tower,
                    name: result.items[0].iot_name
                }
                dispatch(loadAllData(range, data, equip, result.items))
                dispatch({
                    type: LOAD_ALL_EQUIPMENTS_SUCCESS,
                    payload: {
                        result
                    }
                })
            }
            
        })
}

export const loadCHWValveTemp = (range, project, equipment) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        project, 
        equipment.name,
        'r._measurement == "OFFCOIL_TEMP" or r._measurement == "ONCOIL_TEMP"',
        equipment.tower
        )
        
    if(equipment.name) {
        return agentDaily.Influx.loadInfluxData(body)
            .then(result => {
                dispatch({
                    type: LOAD_CHW_VALVE_TEMP_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    }
}

export const loadTempTrends = (range, project, equipment) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        project, 
        equipment.name,
        'r._measurement == "SA_TEMP" or r._measurement == "SA_TEMP_SP" or r._measurement == "EA_TEMP" or r._measurement == "FA_TEMP"',
        equipment.tower
        )

    if(equipment.name) {
        return agentDaily.Influx.loadInfluxData(body)
            .then(result => {
                dispatch({
                    type: LOAD_TEMP_TRENDS_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    }
}

export const loadEnthalpy = (range, project, equipment) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        project, 
        equipment.name,
        'r._measurement == "SA_ENTH" or r._measurement == "EA_ENTH" or r._measurement == "ONCOIL_ENTH" or r._measurement == "OFFCOIL_ENTH" or r._measurement == "OA_ENTH" or r._measurement == "FA_ENTH"',
        equipment.tower
        )
    
    if(equipment.name) {
        return agentDaily.Influx.loadInfluxData(body)
            .then(result => {
                dispatch({
                    type: LOAD_ENTHAPLY_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    }    
}

export const loadVFDSpeed = (range, project, equipment) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        project, 
        equipment.name,
        'r._measurement == "VFD_SPD" or r._measurement == "VFD_SS_CMD" or r._measurement == "VFD_SPD_CMD"'
        + ' or r._measurement == "SF_VFD_SPD" or r._measurement == "SF_VFD_SPD_CMD"',
        equipment.tower
        )

    if(equipment.name) {
        return agentDaily.Influx.loadInfluxData(body)
            .then(result => {
                dispatch({
                    type: LOAD_VFD_SPEED_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    }
}

export const loadExhausVFDSpeed = (range, project, equipment) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        project, 
        equipment.name,
        'r._measurement == "EF_VFD_SPD" or r._measurement == "EF_VFD_SPD_CMD"',
        equipment.tower
        )

    if(equipment.name) {
        return agentDaily.Influx.loadInfluxData(body)
            .then(result => {
                dispatch({
                    type: LOAD_EXHAUS_VFD_SPEED_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    }
}

export const loadCoolingValve = (range, project, equipment) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        project, 
        equipment.name,
        'r._measurement == "CLG_VLV_CMD" or r._measurement == "CLG_VLV_POS"',
        equipment.tower
        )

    if(equipment.name) {
        return agentDaily.Influx.loadInfluxData(body)
            .then(result => {
                dispatch({
                    type: LOAD_COOLING_VALVE_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    }
}

export const loadCO2 = (range, project, equipment) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        project, 
        equipment.name,
        'r._measurement == "EA_CO2" or r._measurement == "CO2_SP" or r._measurement == "EA_CO2_01" or '
        + ' r._measurement == "EA_CO2_02"  or r._measurement == "EA_CO2_CMN" or r._measurement == "RA_CO2" or '
        + ' r._measurement == "EA_CO2_SP" or r._measurement == "RA_CO2_SP"',
        equipment.tower
        )

    if(equipment.name) {
        return agentDaily.Influx.loadInfluxData(body)
            .then(result => {
                dispatch({
                    type: LOAD_CO2_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    }
}

export const loadFlow = (range, project, equipment) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        project, 
        equipment.name,
        'r._measurement == "SA_FLOW" or r._measurement == "EA_FLOW" or r._measurement == "RA_FLOW"',
        equipment.tower
        )

    if(equipment.name) {
        return agentDaily.Influx.loadInfluxData(body)
            .then(result => {
                dispatch({
                    type: LOAD_FLOW_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    }
}

export const loadSTS = (range, project, equipment) => dispatch => {

    const data = 
        ' from(bucket: "taka-iot-data")' +
            ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")},` +
            ` stop: ${moment(range.endDate).add(1, 'day').format("YYYY-MM-DDT00:00:00+04:00")})` +
            ` |> filter(fn: (r) => r.site == "${project}")` +
            ` |> filter(fn: (r) => r.equip == "${equipment.name}")` +
            `${equipment.tower ? `|> filter(fn: (r) => r.tower == "${equipment.tower}")` : ''}` +
            ' |> drop(columns: ["pointStatus"])' +
            ` |> filter(fn: (r) => (r._measurement == "SF_RUN_STS" or r._measurement == "EF_RUN_STS" or r._measurement == "HRW_RUN_STS") and r._field == "value")` +
            ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
            ' |> keep(columns: ["equip", "_time", "_measurement", "_value"])' +
            ' |> elapsed(unit: 1s)' +
            ' |> sort(columns: ["_time"])';

    if(equipment.name) {
        return agentDaily.Influx.loadInfluxData(data)
            .then(result => {
                dispatch({
                    type: LOAD_STS_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    }
}

export const loadSFEFEnergy = (range, project, equipment) => dispatch => {
    const data = 
        ' from(bucket: "taka-iot-data")' +
            ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")},` +
            ` stop: ${moment(range.endDate).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})` +
            ` |> filter(fn: (r) => r.site == "${project}")` +
            ` |> filter(fn: (r) => r.equip == "${equipment.name}")` +
            `${equipment.tower ? `|> filter(fn: (r) => r.tower == "${equipment.tower}")` : ''}` +
            ' |> drop(columns: ["pointStatus"])' +
            ' |> filter(fn: (r) => (r._measurement == "SF_ENERGY_TDY" or r._measurement == "EF_ENERGY_TDY") and r._field == "value")' +
            ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
            ' |> keep(columns: ["equip", "_time", "_measurement", "_value"])' +
            ' |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max, createEmpty: false)';

    if(equipment.name) {
        return agentDaily.Influx.loadInfluxData(data)
            .then(result => {
                dispatch({
                    type: LOAD_SF_EF_ENERGY_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    }
}

export const loadEnergyConsDist = (range, project, equipment, fahuList) => dispatch => {
    if(fahuList.length !== 0) {
        const rowLen = fahuList && fahuList.length;
        const fahuData = fahuList && fahuList.map((el, index) => {
            if(el.name === "") {
                return ``
            } else if(rowLen === index + 1) {
                return `r.equip == "${el.name}" or r.equip == "${el.iot_name}" or `
            } else {
                return `r.equip == "${el.name}" or r.equip == "${el.iot_name}" or `
            }
        })

        let string = "";
        fahuData && fahuData.map(el => {
            string += el
        })

        const data = 
            ' from(bucket: "taka-iot-data")' +
                ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(range.endDate).format("YYYY-MM-DDT00:00:00+04:00")})` +
                ` |> filter(fn: (r) => r.site == "${project}")` +
                ` |> filter(fn: (r) => ${string.slice(0, -3)})` +
                ' |> filter(fn: (r) => r._measurement == "ENERGY_TDY" or r._measurement == "EF_ENERGY_TDY" or r._measurement == "SF_ENERGY_TDY" and r._field == "value")' +
                ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
                ' |> keep(columns: ["_time", "tower", "equip", "_value"])' +
                ' |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)' +
                ' |> sum()';
                
        return agentDaily.Influx.loadInfluxData(data)
            .then(result => {
                dispatch({
                    type: LOAD_ENERGY_CONS_DIST_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    }
}

export const loadHoaSTS = (range, project, equipment, equipList) => dispatch => {
    const data = 
        ' from(bucket: "taka-iot-data")' +
            ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(range.endDate).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})` +
            ` |> filter(fn: (r) => r.site == "${project}")` +
            ` |> filter(fn: (r) => r.equip == "${equipment.name}")` +
            `${equipment.tower ? `|> filter(fn: (r) => r.tower == "${equipment.tower}")` : ''}` +
            ' |> drop(columns: ["pointStatus"])' +
            ` |> filter(fn: (r) => (r._measurement == "SF_HOA_STS" or r._measurement == "EF_HOA_STS" or r._measurement == "HRW_HOA_STS" or r._measurement == "RF_HOA_STS") and r._field == "value")` +
            ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
            ' |> keep(columns: ["equip", "_time", "_measurement", "_value"])' +
            ' |> elapsed(unit: 1s)' +
            ' |> sort(columns: ["_time"])';

        return agentDaily.Influx.loadInfluxData(data)
            .then(result => {
                dispatch({
                    type: LOAD_HOA_STS_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
}


// GETTERS
export const getCHWValve = (state) => state.fahu && state.fahu.chwValveTemp
export const getTempTrends = (state) => state.fahu && state.fahu.tempTrends
export const getVFD = (state) => state.fahu && state.fahu.vfdSpeed
export const getExhausVFD = (state) => state.fahu && state.fahu.exhausVfdSpeed
export const getCooling = (state) => state.fahu && state.fahu.cooling
export const getCO2 = (state) => state.fahu && state.fahu.co2
export const getAllProjects = (state) => state.fahu && state.fahu.projects
export const getAllEquipments = (state) => state.fahu && state.fahu.fahuList
export const getSelectedData = (state) => state.fahu && state.fahu.selectedData
export const getSTS = (state) => state.fahu && state.fahu.sts
export const getHoaSTS = (state) => state.fahu && state.fahu.hoaSts
export const getEsEfEnergy = (state) => state.fahu && state.fahu.sfEfEnergy
export const getEnergyCons = (state) => state.fahu && state.fahu.energyCons
export const getEnthalpy = (state) => state.fahu && state.fahu.enthalpy
export const getFlow = (state) => state.fahu && state.fahu.flow