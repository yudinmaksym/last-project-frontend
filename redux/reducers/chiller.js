import { showStickLoader } from './loaders'
import agentDaily from '../../agentDaily'
var moment = require('moment');

//CONSTANTS
export const LOAD_ALL_PROJECTS_SUCCESS = "CWP//LOAD_ALL_PROJECTS_SUCCESS";
export const LOAD_ALL_EQUIPMENTS_SUCCESS = "CWP//LOAD_ALL_EQUIPMENTS_SUCCESS";

export const LOAD_CHILLER_TEMP_SUCCESS = "CWP//LOAD_CHILLER_TEMP_SUCCESS";
export const LOAD_CAP_TOT_SUCCESS = "CWP//LOAD_CAP_TOT_SUCCESS";
export const LOAD_DELTA_TEMP_SUCCESS = "CWP//LOAD_DELTA_TEMP_SUCCESS";
export const LOAD_BTU_METERS_SUCCESS = "CWP//LOAD_BTU_METERS_SUCCESS";
export const LOAD_STS_SUCCESS = "CWP//LOAD_STS_SUCCESS";
export const LOAD_HOA_STS_SUCCESS = "CWP//LOAD_HOA_STS_SUCCESS";
export const LOAD_ENERGY_CONS_DIST_SUCCESS = "CWP//LOAD_ENERGY_CONS_DIST_SUCCESS";
export const LOAD_ENERGY_CONS_DAILY_SUCCESS = "CWP//LOAD_ENERGY_CONS_DAILY_SUCCESS";

export const FILTER_EQUIP_BY_TOWER = "CWP//FILTER_EQUIP_BY_TOWER";

export const SAVE_SELECTED_PROJECT_AND_EQUIP = "CWP//SAVE_SELECTED_PROJECT_AND_EQUIP";

export const CLEAR_STATE = "CWP//CLEAR_STATE"

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
        case FILTER_EQUIP_BY_TOWER:
            return {
                ...state,
                filteredEquipList: action.payload.result
            }
        case LOAD_CHILLER_TEMP_SUCCESS:
            return {
                ...state,
                chillerTemp: action.payload.result
            }
        case LOAD_CAP_TOT_SUCCESS:
            return {
                ...state,
                capTot: action.payload.result
            }
        case LOAD_DELTA_TEMP_SUCCESS:
            return {
                ...state,
                deltaTemp: action.payload.result
        }
        case LOAD_STS_SUCCESS:
            return {
                ...state,
                sts: action.payload.result
            }
        case LOAD_HOA_STS_SUCCESS:
            return {
                ...state,
                hoaSts: action.payload.result
            }
        case LOAD_ENERGY_CONS_DIST_SUCCESS:
            return {
                ...state,
                energyCons: action.payload.result
            }
        case LOAD_ENERGY_CONS_DAILY_SUCCESS:
            return {
                ...state,
                energyConsDaily: action.payload.result
            }
        case CLEAR_STATE:
            return {
                ...state,
                chillerTemp: '',
                capTot: '',
                sts: '',
                energyCons: '',
                energyConsDaily: '',
                deltaTemp: '',
                hoaSts: '',
            }
        case SAVE_SELECTED_PROJECT_AND_EQUIP:
            return {
                ...state,
                selectedData: {
                    project: action.payload.data.label,
                    projectId: action.payload.data.value,
                    equip: action.payload.equip.label,
                    tower: action.payload.equip.tower,
                    startDate: action.payload.range.startDate,
                    endDate: action.payload.range.endDate
                }
            }
        default: return state
    }
}


//ACTIONS
export const loadAllData = (range, data, equip, equipList) => async dispatch => {
    dispatch(showStickLoader(true))
    await Promise.all([
        dispatch(saveSelectedData(range, data, equip)),
        dispatch(equipFilteredByTower(equip.tower, equipList)),
        dispatch(loadChillerTemp(range, data, equip)),
        dispatch(loadCapTot(range, data, equip)),
        dispatch(loaDeltaTemp(range, data, equip)),
        dispatch(loadEnergyConsDist(range, data, equip, equipList)),
        dispatch(loadEnergyConsDaily(range, data, equip, equipList)),
        dispatch(loadSTS(range, data, equip, equipList)),
        dispatch(loadHoaSTS(range, data, equip, equipList)),
    ])
    dispatch(showStickLoader(false))
}

export const saveSelectedData = (range, data, equip = {label: "", tower: ""}) => dispatch => {
    dispatch({
        type: SAVE_SELECTED_PROJECT_AND_EQUIP,
        payload: {
            range,
            data,
            equip,
        }
    })
}

export const equipFilteredByTower = (towerName, equipList) => dispatch => {
    if(towerName) {
        const result = equipList.filter(el => el.tower === towerName)
        dispatch({
            type: FILTER_EQUIP_BY_TOWER,
            payload: {
                result
            }
        })
    } else {
        const result = equipList
        dispatch({
            type: FILTER_EQUIP_BY_TOWER,
            payload: {
                result
            }
        })
    }
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
                dispatch(loadChillerEquipList(range, data))
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
                dispatch(loadChillerEquipList(range,data))
            }
            dispatch({
                type: LOAD_ALL_PROJECTS_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadChillerEquipList = (range, data) => dispatch => {
    dispatch({type: CLEAR_STATE})
    return agentDaily.Chiller.loadCWPEquipList(data.value)
        .then(result => {
            if(result.items.length !== 0) {
                const equip = {
                    tower: result.items[0].tower,
                    name: result.items[0].iot_name,
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

const generateEquipReqString = (equip) => {
    let string = "";
    if(typeof(equip) !== 'string') {
        const rowLen = equip && equip.length;
        const endUse = equip && equip.map((el, index) => {
            if(el.iot_name === "") {
                return ''
            }else if(rowLen === index + 1) {
                return `r.equip == "${el.iot_name}"`
            } else {
                return `r.equip == "${el.iot_name}" or `
            }
        })

        endUse && endUse.map(el => {
            string += el
        })
    } else {
        string = `r.equip == "${equip}"`
    }
    

    return string
}

const generateReqBody = (startDate, endDate, project, equip, measurement, tower) => {
    const data = 
        ' from(bucket: "taka-iot-data")' +
            ` |> range(start:${moment(startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(endDate).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})` +
            ` |> filter(fn: (r) => r.site == "${project}")` +
            `${equip  ? `|> filter(fn: (r) => ${equip})`: ''}` +
            `${tower  ? `|> filter(fn: (r) => r.tower == "${tower}")` : ''}` +
            ' |> drop(columns: ["pointStatus"])' +
            ` |> filter(fn: (r) => (${measurement}) and r._field == "value")` +
            ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
            ' |> keep(columns: ["_time", "_measurement", "_value"])' +
            ' |> aggregateWindow(every: 15m, timeSrc: "_start", fn: mean, createEmpty: false)';
    return data
}

export const loadChillerTemp = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label, 
        `r.equip == "${equip.label}"`,
        'r._measurement == "EVAP_EW_TEMP" or r._measurement == "EVAP_LW_TEMP" or r._measurement == "LW_TEMP_SP"' 
        +' or r._measurement == "DELTA_TEMP" or r._measurement == "EVAP_DELTA_TEMP"',
        equip.tower
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_CHILLER_TEMP_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadCapTot = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label, 
        `r.equip == "${equip.label}"`,
        'r._measurement == "CAP_TOT" or r._measurement == "CIRC_A_CAP_TOT" or r._measurement == "CIRC_B_CAP_TOT"',
        equip.tower
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_CAP_TOT_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loaDeltaTemp = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label, 
        `r.equip == "${equip.label}"`,
        'r._measurement == "COND_EW_TEMP" or r._measurement == "COND_LW_TEMP"',
        equip.tower
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_DELTA_TEMP_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadSTS = (range, data, equip, equipList) => dispatch => {
    const filterEquipByTower = equipList.filter(el => el.tower === equip.tower)
    const equipReq = generateEquipReqString(filterEquipByTower)
    const body = 
        ' from(bucket: "taka-iot-data")' +
            ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(range.endDate).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})` +
            ` |> filter(fn: (r) => r.site == "${data.label}")` +
            `${equipReq  ? `|> filter(fn: (r) => ${equipReq})`: ''}` +
            `${equip.tower ? `|> filter(fn: (r) => r.tower == "${equip.tower}")` : ''}` +
            ' |> drop(columns: ["pointStatus"])' +
            ` |> filter(fn: (r) => (r._measurement == "RUN_STS") and r._field == "value")` +
            ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
            ' |> keep(columns: ["equip", "_time", "_measurement", "_value"])' +
            ' |> elapsed(unit: 1s)' +
            ' |> sort(columns: ["_time"])';

    if(equip.label) {
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
}

export const loadHoaSTS = (range, data, equip, equipList) => dispatch => {
    const filterEquipByTower = equipList.filter(el => el.tower === equip.tower)
    const equipReq = generateEquipReqString(filterEquipByTower)
    const body = 
        ' from(bucket: "taka-iot-data")' +
            ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(range.endDate).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})` +
            ` |> filter(fn: (r) => r.site == "${data.label}")` +
            `${equipReq  ? `|> filter(fn: (r) => ${equipReq})`: ''}` +
            `${equip.tower ? `|> filter(fn: (r) => r.tower == "${equip.tower}")` : ''}` +
            ' |> drop(columns: ["pointStatus"])' +
            ` |> filter(fn: (r) => (r._measurement == "HOA") and r._field == "value")` +
            ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
            ' |> keep(columns: ["equip", "_time", "_measurement", "_value"])' +
            ' |> elapsed(unit: 1s)' +
            ' |> sort(columns: ["_time"])';

    if(equip.label) {
        return agentDaily.Influx.loadInfluxData(body)
            .then(result => {
                dispatch({
                    type: LOAD_HOA_STS_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    }
}

export const loadEnergyConsDist = (range, data, equip, equipList) => dispatch => {
    const filterEquipByTower = equipList.filter(el => el.tower === equip.tower)
    const equipReq = generateEquipReqString(filterEquipByTower)
        const body = 
            ' from(bucket: "taka-iot-data")' +
                ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(range.endDate).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})` +
                ` |> filter(fn: (r) => r.site == "${data.label}")` +
                `${equipReq  ? `|> filter(fn: (r) => ${equipReq})`: ''}` +
                `${equip.tower ? `|> filter(fn: (r) => r.tower == "${equip.tower}")` : ''}` +
                ' |> filter(fn: (r) => r._measurement == "ENERGY_TDY" and r._field == "value")' +
                ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
                ' |> keep(columns: ["_time", "tower", "equip", "_value"])' +
                ' |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)'+
                ' |> sum()';

        return agentDaily.Influx.loadInfluxData(body)
            .then(result => {
                dispatch({
                    type: LOAD_ENERGY_CONS_DIST_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
}

export const loadEnergyConsDaily = (range, data, equip, equipList) => dispatch => {
        const filterEquipByTower = equipList.filter(el => el.tower === equip.tower)
        const equipReq = generateEquipReqString(filterEquipByTower)
        const body = 
            ' from(bucket: "taka-iot-data")' +
                ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(range.endDate).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})` +
                ` |> filter(fn: (r) => r.site == "${data.label}")` +
                `${equipReq  ? `|> filter(fn: (r) => ${equipReq})`: ''}` +
                `${equip.tower ? `|> filter(fn: (r) => r.tower == "${equip.tower}")` : ''}` +
                ' |> filter(fn: (r) => r._measurement == "ENERGY_TDY" and r._field == "value")' +
                ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
                ' |> keep(columns: ["_time", "equip", "_value"])' +
                ` |> sort(columns: ["equip", "_time"])` +
                ' |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)'+
                ' |> aggregateWindow(every: 1d, timeSrc: "_start", fn: sum)';

        return agentDaily.Influx.loadInfluxData(body)
            .then(result => {
                dispatch({
                    type: LOAD_ENERGY_CONS_DAILY_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
}


// GETTERS
export const getAllProjects = (state) => state.chiller && state.chiller.projects
export const getAllEquipments = (state) => state.chiller && state.chiller.equipList
export const getSelectedData = (state) => state.chiller && state.chiller.selectedData

export const getChillerTemp = (state) => state.chiller && state.chiller.chillerTemp
export const getCapTot = (state) => state.chiller && state.chiller.capTot
export const getDeltaTemp = (state) => state.chiller && state.chiller.deltaTemp
export const getSTS = (state) => state.chiller && state.chiller.sts
export const getHoaSTS = (state) => state.chiller && state.chiller.hoaSts
export const getEnergyCons = (state) => state.chiller && state.chiller.energyCons
export const getEnergyConsDaily = (state) => state.chiller && state.chiller.energyConsDaily
export const getFilteredEquipList = (state) => state.chiller && state.chiller.filteredEquipList