import { showStickLoader } from './loaders'
import agentDaily from '../../agentDaily'
var moment = require('moment');

//CONSTANTS
export const LOAD_ALL_PROJECTS_SUCCESS = "FCU//LOAD_ALL_PROJECTS_SUCCESS";
export const LOAD_ALL_EQUIPMENTS_SUCCESS = "FCU//LOAD_ALL_EQUIPMENTS_SUCCESS";

export const LOAD_TRANSCO_ZONE_TEMP_SUCCESS = "FCU//LOAD_TRANSCO_ZONE_TEMP_SUCCESS";
export const LOAD_ROOM_TEMP_SUCCESS = "FCU//LOAD_ROOM_TEMP_SUCCESS";
export const LOAD_STS_SUCCESS = "FCU//LOAD_STS_SUCCESS";

export const SAVE_SELECTED_PROJECT_AND_EQUIP = "FCU//SAVE_SELECTED_PROJECT_AND_EQUIP";

export const CLEAR_STATE = "FCU//CLEAR_STATE"

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
        case LOAD_TRANSCO_ZONE_TEMP_SUCCESS:
            return {
                ...state,
                transcoZone: action.payload.result
            }
        case LOAD_ROOM_TEMP_SUCCESS:
            return {
                ...state,
                roomTemp: action.payload.result
            }
        case LOAD_STS_SUCCESS:
            return {
                ...state,
                sts: action.payload.result
            }
        case CLEAR_STATE:
            return {
                ...state,
                equipList: '',
                transcoZone: '',
                roomTemp: '',
                sts: '',
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
    dispatch(saveSelectedData(range, data, equip))
    if(equip.label) {
        dispatch(showStickLoader(true))
        await Promise.all([
            dispatch(loadTranscoZoneTemp(range, data, equip)),
            dispatch(loadRoomTemp(range, data, equip)),
            dispatch(loadSts(range, data, equip)),
        ])
        dispatch(showStickLoader(false))
    }
}

export const saveSelectedData = (range, data, equip={label: ""}) => dispatch => {
    dispatch({
        type: SAVE_SELECTED_PROJECT_AND_EQUIP,
        payload: {
            data,
            range,
            equip,
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
                dispatch(loadFcuEquipList(range, data))
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
                dispatch(loadFcuEquipList(range, data))
            }
            dispatch({
                type: LOAD_ALL_PROJECTS_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadFcuEquipList = (range, data) => dispatch => {
    dispatch({type: CLEAR_STATE})
    return agentDaily.FCU.loadFcuList(data.value)
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
            `${tower  ? `|> filter(fn: (r) => r.tower == "${tower}")` : ''}` +
            ' |> drop(columns: ["pointStatus"])' +
            ` |> filter(fn: (r) => (${measurement}) and r._field == "value")` +
            ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
            ' |> keep(columns: ["_time", "_measurement", "_value"])';

    return data
}

export const loadTranscoZoneTemp = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label, 
        `r.equip == "${equip.label}"`,
        'r._measurement == "ZONE_TEMP" or r._measurement == "ROOM_TEMP" or r._measurement == "ROOM_TEMP_SP"' 
        + ' or r._measurement == "ZONE_TEMP_SP" or r._measurement == "ZONE_HUM"',
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_TRANSCO_ZONE_TEMP_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadRoomTemp = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label, 
        `r.equip == "${equip.label}"`,
        'r._measurement == "CHW_VLV_POS" or r._measurement == "CHW_VLV_CMD"',
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_ROOM_TEMP_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadSts = (range, data, equip) => dispatch => {
    const body = 
        ' from(bucket: "taka-iot-data")' +
            ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(range.endDate).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})` +
            ` |> filter(fn: (r) => r.site == "${data.label}")` +
            ` |> filter(fn: (r) => r.equip == "${equip.label}")` +
            ' |> drop(columns: ["pointStatus"])' +
            ` |> filter(fn: (r) => (r._measurement == "RUN_STS" or r._measurement == "FAN_RUN_STS") and r._field == "value")` +
            ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
            ' |> keep(columns: ["equip", "_time", "_measurement", "_value"])' +
            ' |> elapsed(unit: 1s)' +
            ' |> sort(columns: ["_time"])';

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_STS_SUCCESS,
                payload: {
                    result
                }
            })
        })
}



// GETTERS
export const getAllProjects = (state) => state.fcu && state.fcu.projects
export const getEquipList = (state) => state.fcu && state.fcu.equipList
export const getSelectedData = (state) => state.fcu && state.fcu.selectedData
export const getTranscoZone = (state) => state.fcu && state.fcu.transcoZone
export const getRoomTemp = (state) => state.fcu && state.fcu.roomTemp
export const getSts = (state) => state.fcu && state.fcu.sts