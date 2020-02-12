import { showStickLoader } from './loaders'
import agentDaily from '../../agentDaily'
var moment = require('moment');

//CONSTANTS
export const LOAD_ALL_PROJECTS_SUCCESS = "CWP//LOAD_ALL_PROJECTS_SUCCESS";
export const LOAD_ALL_EQUIPMENTS_SUCCESS = "CWP//LOAD_ALL_EQUIPMENTS_SUCCESS";

export const LOAD_CHW_TEMP_SUCCESS = "CWP//LOAD_CHW_TEMP_SUCCESS";
export const LOAD_BTU_METERS_SUCCESS = "CWP//LOAD_BTU_METERS_SUCCESS";
export const LOAD_ENERGY_SUCCESS = "CWP//LOAD_ENERGY_SUCCESS";
export const LOAD_VFD_SPEED_SUCCESS = "CWP//LOAD_VFD_SPEED_SUCCESS";
export const LOAD_TEMPERATURE_SUCCESS = "CWP//LOAD_TEMPERATURE_SUCCESS";
export const LOAD_POWER_SUCCESS = "CWP//LOAD_POWER_SUCCESS";
export const LOAD_STS_SUCCESS = "CWP//LOAD_STS_SUCCESS";
export const LOAD_ENERGY_CONS_DIST_SUCCESS = "CWP//LOAD_ENERGY_CONS_DIST_SUCCESS";
export const LOAD_ENERGY_CONS_DAILY_SUCCESS = "CWP//LOAD_ENERGY_CONS_DAILY_SUCCESS";
export const LOAD_CHW_SYS_SUCCESS = "CWP//LOAD_CHW_SYS_SUCCESS";

export const SAVE_SELECTED_PROJECT_AND_EQUIP = "CWP//SAVE_SELECTED_PROJECT_AND_EQUIP";

export const CLEAR_CONSUMPTION = "CWP//CLEAR_CONSUMPTION";
export const CLEAR_STATE = "CWP//CLEAR_STATE"

const initialState = {
    energyCons: [],
    energyConsDaily: []
}

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
        case LOAD_CHW_TEMP_SUCCESS:
            return {
                ...state,
                chwTemp: action.payload.result
            }
        case LOAD_ENERGY_SUCCESS:
            return {
                ...state,
                energy: action.payload.result
            }
        case LOAD_VFD_SPEED_SUCCESS:
            return {
                ...state,
                vfdSpeed: action.payload.result
            }
        case LOAD_TEMPERATURE_SUCCESS:
            return {
                ...state,
                temperature: action.payload.result
            }
        case LOAD_POWER_SUCCESS:
            return {
                ...state,
                power: action.payload.result
            }
        case LOAD_STS_SUCCESS:
            return {
                ...state,
                sts: action.payload.result
            }
        case LOAD_ENERGY_CONS_DIST_SUCCESS:
            return {
                ...state,
                energyCons: [
                    ...state.energyCons,
                    action.payload.result
                ]
            }
        case LOAD_ENERGY_CONS_DAILY_SUCCESS:
            return {
                ...state,
                energyConsDaily: [
                    ...state.energyConsDaily,
                    action.payload.result
                ]
            }
        case LOAD_CHW_SYS_SUCCESS:
            return {
                ...state,
                energyConsDaily: action.payload.result
            }
        case CLEAR_STATE:
            return {
                ...state,
                equipList: '',
                chwTemp: '',
                energy: '',
                vfdSpeed: '',
                temperature: '',
                power: '',
                sts: '',
                energyCons: [],
                energyConsDaily: [],
            }
        case CLEAR_CONSUMPTION:
            return {
                ...state,
                energyCons: [],
                energyConsDaily: [],
            }
        case SAVE_SELECTED_PROJECT_AND_EQUIP:
            return {
                ...state,
                selectedData: {
                    project: action.payload.data.label,
                    projectId: action.payload.data.value,
                    equip: action.payload.equip.name,
                    tower: action.payload.equip.tower,
                    startDate: action.payload.range.startDate,
                    endDate: action.payload.range.endDate,
                }
            }
        default: return state
    }
}


//ACTIONS
export const loadAllData = (range, data, equip, equipList) => async dispatch => {
    dispatch({type: CLEAR_CONSUMPTION})
    dispatch(showStickLoader(true))
    await Promise.all([
        dispatch(saveSelectedData(range, data, equip)),
        dispatch(loadCHWTemp(range, data, equip)),
        dispatch(loadEnergy(range, data, equip)),
        dispatch(loadVFDSpeed(range, data, equip)),
        dispatch(loadPressure(range, data, equip)),
        dispatch(loadPower(range, data, equip)),
        dispatch(loadEnergyConsDist(range, data, equip, equipList)),
        dispatch(loadEnergyConsDaily(range, data, equip, equipList)),
        dispatch(loadSTS(range, data, equip)),
    ])
    dispatch(showStickLoader(false))
}

export const clearSelectedProject = () => dispatch => {
    dispatch({type: CLEAR_CONSUMPTION})
}

export const saveSelectedData = (range, data, equip = {name: "", tower: ""}) => dispatch => {
    dispatch({
        type: SAVE_SELECTED_PROJECT_AND_EQUIP,
        payload: {
            data,
            equip,
            range,
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
                dispatch(loadCWPEquipList(range, data))
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
                dispatch(loadCWPEquipList(range,data))
            }
            dispatch({
                type: LOAD_ALL_PROJECTS_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadCWPEquipList = (range, data) => dispatch => {
    dispatch({type: CLEAR_STATE})
    return agentDaily.ChilledWaterPlant.loadCWPEquipList(data.value)
        .then(result => {
            if(result.items.length !== 0) {
                const filteredEquip = result.items.filter(el => 
                    el.asset_type.type === result.items[0].asset_type.type && el.tower === result.items[0].tower
                )
                const equip = {
                    tower: result.items[0].tower,
                    name: filteredEquip
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
            if(rowLen === index + 1) {
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
    const string = generateEquipReqString(equip)

    const data = 
        ' from(bucket: "taka-iot-data")' +
            ` |> range(start:${moment(startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(endDate).add(1, 'day').format("YYYY-MM-DDT00:00:00+04:00")})` +
            ` |> filter(fn: (r) => r.site == "${project}")` +
            ` |> filter(fn: (r) => ${string})` +
            `${tower  ? `|> filter(fn: (r) => r.tower == "${tower}")` : ''}` +
            ' |> drop(columns: ["pointStatus"])' +
            ` |> filter(fn: (r) => (${measurement}) and r._field == "value")` +
            ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
            ' |> keep(columns: ["_time", "_measurement", "_value", "equip"])' +
            ' |> aggregateWindow(every: 15m, timeSrc: "_start", fn: mean, createEmpty: false)';

    return data
}

export const loadCHWTemp = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label, 
        "CHW_SYS",
        'r._measurement == "EW_TEMP" or r._measurement == "LW_TEMP" or r._measurement == "DELTA_TEMP"',
        equip.tower
        )
    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_CHW_TEMP_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadEnergy = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label, 
        equip.name,
        'r._measurement == "ENERGY_TDY"',
        equip.tower
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_ENERGY_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadVFDSpeed = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label, 
        equip.name,
        'r._measurement == "VFD_SPD"', // or r._measurement == "VFD_SPD_SP" or r._measurement == "VFD_SPD_CMD"',
        equip.tower
        )

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

export const loadPressure = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label, 
        "CHW_SYS",
        'r._measurement == "CHW_PR_DELTA" or r._measurement == "CHW_PR_DELTA_SP"',
        equip.tower
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_TEMPERATURE_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadPower = (range, data, equip) => dispatch => {
    const body = generateReqBody(
        range.startDate, 
        range.endDate, 
        data.label, 
        equip.name,
        'r._measurement == "PWR"',
        equip.tower
        )

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_POWER_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadSTS = (range, data, equip) => dispatch => {
    const string = generateEquipReqString(equip.name)

    const body = 
        ' from(bucket: "taka-iot-data")'
        + ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")},`
        + ` stop: ${moment(range.endDate).add(1, 'day').format("YYYY-MM-DDT00:00:00+04:00")})`
        + ` |> filter(fn: (r) => r.site == "${data.label}")`
        + ` |> filter(fn: (r) => ${string})`
        + `${equip.tower ? `|> filter(fn: (r) => r.tower == "${equip.tower}")` : ''}`
        + ' |> drop(columns: ["pointStatus"])'
        + ` |> filter(fn: (r) => (r._measurement == "RUN_STS") and r._field == "value")`
        + ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])'
        + ' |> keep(columns: ["equip", "_time", "_measurement", "_value"])'
        + ' |> elapsed(unit: 1s)'
        + ' |> sort(columns: ["_time"])';

    if(equip.name) {
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

export const loadEnergyConsDist = (range, data, equip, equipList) => dispatch => {

    const group = equipList.map(el => {
        return el.asset_type.type
    })
    let unique = [...new Set(group)]

    unique.map(uniqueEl => {
        let string = ""

        const filteredList = equipList.filter(el => el.asset_type.type === uniqueEl)
        filteredList.map((filtered,index) => {
            const rowLen = filteredList.length;
            if(filtered.iot_name === "") {
                return ``
            } else if(rowLen === index + 1) {
                string += `r.equip == "${filtered.iot_name}" or`
            } else {
                string += `r.equip == "${filtered.iot_name}" or `
            }
        })
        
        const body = 
            ' from(bucket: "taka-iot-data")' +
                ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(range.endDate).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})` +
                ` |> filter(fn: (r) => r.site == "${data.label}")` +
                ` ${string ? `|> filter(fn: (r) => ${string.slice(0, -3)})` : ''}` +
                ` ${equip.tower ? `|> filter(fn: (r) => r.tower == "${equip.tower}")` : ''}` +
                ' |> filter(fn: (r) => r._measurement == "ENERGY_TDY" and r._field == "value")' +
                ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
                ' |> keep(columns: ["_time", "equip", "_value"])' +
                ' |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)' +
                ` |> set(key: "equip", value: "${uniqueEl}")` +
                ' |> rename(columns: {equip: "group"})' +
                ' |> sum()' ;

        return agentDaily.Influx.loadInfluxData(body)
            .then(result => {
                dispatch({
                    type: LOAD_ENERGY_CONS_DIST_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    })
}

export const loadEnergyConsDaily = (range, data, equip, equipList) => dispatch => {
    const group = equipList.map(el => {
        return el.asset_type.type
    })
    let unique = [...new Set(group)]

    unique.map(uniqueEl => {
        let string = ""

        const filteredList = equipList.filter(el => el.asset_type.type === uniqueEl)
        filteredList.map((filtered,index) => {
            const rowLen = filteredList.length;
            if(filtered.iot_name === "") {
                return ``
            } else if(rowLen === index + 1) {
                string += `r.equip == "${filtered.iot_name}" or`
            } else {
                string += `r.equip == "${filtered.iot_name}" or `
            }
        })
        
        const body = 
            ' from(bucket: "taka-iot-data")' +
                ` |> range(start:${moment(range.startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(range.endDate).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})` +
                ` |> filter(fn: (r) => r.site == "${data.label}")` +
                ` ${string ? `|> filter(fn: (r) => ${string.slice(0, -3)})` : ''}` +
                ` ${equip.tower ? `|> filter(fn: (r) => r.tower == "${equip.tower}")` : ''}` +
                ' |> filter(fn: (r) => r._measurement == "ENERGY_TDY" and r._field == "value")' +
                ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
                ' |> keep(columns: ["_time", "equip", "_value"])' +
                ` |> sort(columns: ["equip", "_time"])` +
                ' |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)' +
                ` |> set(key: "equip", value: "${uniqueEl}")` +
                ' |> rename(columns: {equip: "group"})' +
                ' |> aggregateWindow(every: 1d, timeSrc: "_start", fn: sum)' ;
                
        return agentDaily.Influx.loadInfluxData(body)
            .then(result => {
                dispatch({
                    type: LOAD_ENERGY_CONS_DAILY_SUCCESS,
                    payload: {
                        result
                    }
                })
            })
    })
}


// GETTERS
export const getAllProjects = (state) => state.chilledWaterPlant && state.chilledWaterPlant.projects
export const getAllEquipments = (state) => state.chilledWaterPlant && state.chilledWaterPlant.equipList
export const getSelectedData = (state) => state.chilledWaterPlant && state.chilledWaterPlant.selectedData

export const getCHW = (state) => state.chilledWaterPlant && state.chilledWaterPlant.chwTemp
export const getBTUList = (state) => state.chilledWaterPlant && state.chilledWaterPlant.btuList
export const getEnergy = (state) => state.chilledWaterPlant && state.chilledWaterPlant.energy
export const getVFDSpeed = (state) => state.chilledWaterPlant && state.chilledWaterPlant.vfdSpeed
export const getTemperature = (state) => state.chilledWaterPlant && state.chilledWaterPlant.temperature
export const getPower = (state) => state.chilledWaterPlant && state.chilledWaterPlant.power
export const getSTS = (state) => state.chilledWaterPlant && state.chilledWaterPlant.sts
export const getEnergyCons = (state) => state.chilledWaterPlant && state.chilledWaterPlant.energyCons
export const getEnergyConsDaily = (state) => state.chilledWaterPlant && state.chilledWaterPlant.energyConsDaily