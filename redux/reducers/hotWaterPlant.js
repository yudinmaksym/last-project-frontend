import { showStickLoader } from './loaders'
import agentDaily from '../../agentDaily'
var moment = require('moment');

//CONSTANTS
export const LOAD_ALL_PROJECTS_SUCCESS = "HWP//LOAD_ALL_PROJECTS_SUCCESS";
export const LOAD_ALL_EQUIPMENTS_SUCCESS = "HWP//LOAD_ALL_EQUIPMENTS_SUCCESS";

export const LOAD_TEMP_SUCCESS = "HWP//LOAD_TEMP_SUCCESS";
export const LOAD_CND_TEMP_SUCCESS = "HWP//LOAD_CND_TEMP_SUCCESS";
export const LOAD_EVP_TEMP_SUCCESS = "HWP//LOAD_EVP_TEMP_SUCCESS";
export const LOAD_LOAD_TEMP_SUCCESS = "HWP//LOAD_LOAD_TEMP_SUCCESS";
export const LOAD_METER_TEMP_SUCCESS = "HWP//LOAD_METER_TEMP_SUCCESS";
export const LOAD_OTHER_TEMP_SUCCESS = "HWP//LOAD_OTHER_TEMP_SUCCESS";

export const SAVE_SELECTED_PROJECT_AND_EQUIP = "HWP//SAVE_SELECTED_PROJECT_AND_EQUIP";

export const CLEAR_STATE = "HWP//CLEAR_STATE"

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
                equipList: action.payload.result.items
            }
        case LOAD_TEMP_SUCCESS:
            return {
                ...state,
                temperature: action.payload.result
            }
        case LOAD_CND_TEMP_SUCCESS:
            return {
                ...state,
                cndTemp: action.payload.result
            }
        case LOAD_EVP_TEMP_SUCCESS:
            return {
                ...state,
                evpTemp: action.payload.result
            }
        case LOAD_LOAD_TEMP_SUCCESS:
            return {
                ...state,
                loadTemp: action.payload.result
            }
        case LOAD_METER_TEMP_SUCCESS:
            return {
                ...state,
                meterTemp: action.payload.result
            }
        case LOAD_METER_TEMP_SUCCESS:
            return {
                ...state,
                otherTemp: action.payload.result
            }
        case CLEAR_STATE:
            return {
                ...state,
                equipList: [],
                temperature: '',
                cndTemp: '',
                evpTemp: '',
                loadTemp: '',
                meterTemp: '',
                otherTemp: '',
            }
        case SAVE_SELECTED_PROJECT_AND_EQUIP:
            return {
                ...state,
                selectedData: {
                    project: action.payload.data.label,
                    projectId: action.payload.data.value,
                    equip: action.payload.equip.label,
                    // tower: action.payload.tower,
                    startDate: action.payload.range.startDate,
                    endDate: action.payload.range.endDate
                }
            }
        default: return state
    }
}


//ACTIONS
export const loadAllData = (range, data, equip) => async dispatch => {
    dispatch({type: CLEAR_STATE})
    dispatch(showStickLoader(true))
    await Promise.all([
        dispatch(saveSelectedData(range, data, equip)),
        dispatch(loadTemp(range, data, equip)),
        dispatch(loadCndTemp(range, data, equip)),
        dispatch(loadEvpTemp(range, data, equip)),
        dispatch(loadLoadTemp(range, data, equip)),
        dispatch(loadMeterTemp(range, data, equip)),
        dispatch(loadOtherTemp(range, data, equip)),
    ])
    dispatch(showStickLoader(false))
}

export const saveSelectedData = (range, data, equip={label: ""}) => dispatch => {
    dispatch({
        type: SAVE_SELECTED_PROJECT_AND_EQUIP,
        payload: {
            range, 
            data, 
            equip
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
                dispatch(loadHwpEquipList(range, data))
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
                dispatch(loadHwpEquipList(range,data))
            }
            dispatch({
                type: LOAD_ALL_PROJECTS_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadHwpEquipList = (range, data) => dispatch => {
    dispatch({type: CLEAR_STATE})
    return agentDaily.HotWaterPlant.loadEquipList(data.value)
        .then(result => {
            if(result.items.length !== 0) {
                const equip = {
                    label: result.items[0].iot_name
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

const generateReqBody = (startDate, endDate, project, equip, measurement, tower) => {
    const data = 
        ' from(bucket: "taka-iot-data")' +
            ` |> range(start:${moment(startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(endDate).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})` +
            ` |> filter(fn: (r) => r.site == "${project}")` +
            ` |> filter(fn: (r) => ${equip})` +
            ' |> drop(columns: ["pointStatus"])' +
            ` |> filter(fn: (r) => (${measurement}) and r._field == "value")` +
            ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
            ' |> keep(columns: ["_time", "_measurement", "_value"])' +
            ' |> aggregateWindow(every: 15m, timeSrc: "_start", fn: mean, createEmpty: false)';

    return data
}

export const loadTemp = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label, 
        `r.equip == "HWS_TEMP_SENSORS" or r.equip == "CTH"`,
        'r._measurement == "HW_LW_TEMP" or r._measurement == "HW_EW_TEMP" or r._measurement == "LW_TEMP_3" or r._measurement == "LW_TEMP_1" or r._measurement == "LW_TEMP_2"',
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_TEMP_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadCndTemp = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label,
        `r.equip == "HWS_TEMP_SENSORS" or r.equip == "CTH"`,
        'r._measurement == "CND_EW_TEMP" or r._measurement == "CND_LW_TEMP"',
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_CND_TEMP_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadEvpTemp = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label,
        `r.equip == "HWS_TEMP_SENSORS" or r.equip == "CTH"`,
        'r._measurement == "EVP_EW_TEMP" or r._measurement == "EVP_LW_TEMP"',
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_EVP_TEMP_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadLoadTemp = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label,
        `r.equip == "HWS_TEMP_SENSORS" or r.equip == "CTH"`,
        'r._measurement == "LOAD1_TEMP" or r._measurement == "LOAD2_TEMP"',
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_LOAD_TEMP_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadMeterTemp = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label,
        `r.equip == "HWS_TEMP_SENSORS" or r.equip == "CTH"`,
        'r._measurement == "Meter1_Temp1" or r._measurement == "Meter1_Temp2" or r._measurement == "Meter2_Temp1" or r._measurement == "Meter2_Temp2"',
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_METER_TEMP_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadOtherTemp = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label,
        `r.equip == "HWS_TEMP_SENSORS" or r.equip == "CTH"`,
        'r._measurement == "Meter1_Temp1" or r._measurement == "Meter1_Temp2" or r._measurement == "Meter2_Temp1" or r._measurement == "Meter2_Temp2"',
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_OTHER_TEMP_SUCCESS,
                payload: {
                    result
                }
            })
        })
}




// GETTERS
export const getAllProjects = (state) => state.hotWaterPlant && state.hotWaterPlant.projects
export const getEquipList = (state) => state.hotWaterPlant && state.hotWaterPlant.equipList
export const getSelectedData = (state) => state.hotWaterPlant && state.hotWaterPlant.selectedData

export const getTemperature = (state) => state.hotWaterPlant && state.hotWaterPlant.temperature
export const getCndTemp = (state) => state.hotWaterPlant && state.hotWaterPlant.cndTemp
export const getEvpTemp = (state) => state.hotWaterPlant && state.hotWaterPlant.evpTemp
export const getLoadTemp = (state) => state.hotWaterPlant && state.hotWaterPlant.loadTemp
export const getMeterTemp = (state) => state.hotWaterPlant && state.hotWaterPlant.meterTemp
export const getOtherTemp = (state) => state.hotWaterPlant && state.hotWaterPlant.otherTemp