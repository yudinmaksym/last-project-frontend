import { showStickLoader } from './loaders'
import agentDaily from '../../agentDaily'
import {formatInfluxData} from '../../src/utils/format'
var moment = require('moment');


//CONSTANTS
export const LOAD_ALL_PROJECTS_SUCCESS = "SUMMARYHEATMAP//LOAD_ALL_PROJECTS_SUCCESS";
export const LOAD_MDB_SUCCESS = "SUMMARYHEATMAP//LOAD_MDB_SUCCESS";
export const LOAD_CONSUMPTION = "SUMMARYHEATMAP//LOAD_CONSUMPTION";
export const CLEAR_STATE = "SUMMARYHEATMAP//CLEAR_STATE";

const initialState = {
    projects: [],
    mdbList: [],
    consumption: []
}

// REDUCERS
export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ALL_PROJECTS_SUCCESS:
            return {
                ...state,
                projects: action.payload.items
            }
        case LOAD_MDB_SUCCESS:
            return {
                ...state,
                mdbList: action.payload
            }
        case LOAD_CONSUMPTION:
            return {
                ...state,
                consumption: action.payload
            }    
        case CLEAR_STATE:
            return {
                ...state,
                mdbList: [],
                consumption: []
            }
        default: return state
    }
}

export const loadData = (name, mdb) => async dispatch => {
    dispatch(showStickLoader(true))
    await Promise.all([
        dispatch(getHourlyConsumption(mdb, name))
    ])
    dispatch(showStickLoader(false))
}

export const loadAllProjects = (id, name) => dispatch => {
    // dispatch({type: CLEAR_STATE})
    return agentDaily.Default.loadAllProjects()
        .then(result => {
            if(result.count !== 0) {
                if(id && name) {
                    dispatch(loadMdbList(id, name))
                    dispatch({
                        type: LOAD_ALL_PROJECTS_SUCCESS,
                        payload: result
                    })
                } else {
                    dispatch(loadMdbList(result.items[0].id, result.items[0].iot_name))
                    dispatch({
                        type: LOAD_ALL_PROJECTS_SUCCESS,
                        payload: result
                    })
                }
            }
        })
}

export const loadMdbList = (id, name) => dispatch => {
    dispatch({type: CLEAR_STATE})
    return agentDaily.Daily.loadAllMdbListForCurrentProject(id)
        .then(result => {
            const res = result.items
            res.push({iot_name: 'Whole building'})
            if(result.count !== 0) {
                dispatch({
                    type: LOAD_MDB_SUCCESS,
                    payload: res
                })
            
                dispatch(loadData(name, result.items[0].iot_name))
            }
        })
}

const generateEquipQuery = (equips) => {
    let string = ""
    const rowLen = equips.length;
    equips.map((el, index) => {
        if(el.iot_name === "") {
            string += ``
        } else if(rowLen === index + 1 || el.iot_name !== "") {
            string += `r.equip == "${el.iot_name}" or `
        }
    })

    return string
}

export const getHourlyConsumption = (mdb, project) => dispatch => {
    const start = moment().subtract(90, 'days').format("YYYY-MM-DDT00:00:00+04:00")
    const end = moment().format("YYYY-MM-DDT00:00:00+04:00")
    const data = `
    from(bucket: "taka-iot-data")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r.site == "${project}")
        |> filter(fn: (r) => ${typeof mdb !== "object" ? `r.equip == "${mdb}"` : `${generateEquipQuery(mdb).slice(0, -3)}`})
        |> filter(fn: (r) => r._measurement == "ENERGY_TOT" and r._field == "value")
        |> filter(fn: (r) => (exists r.result) == false)
        |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])
        |> difference(nonNegative: true, columns: ["_value"])
        |> aggregateWindow(every: 1h, timeSrc: "_start", fn: sum)
        ${typeof mdb !== "object"
        ? `|> keep(columns: ["site", "equip", "_measurement", "_value", "_time"])`
        : `|> group(columns: ["_time"])
        |> sum()
        |> keep(columns: ["site", "equip", "_measurement", "_value", "_time"])
        |> group()`
        }`

    return agentDaily.Influx.loadInfluxData(data)
        .then(result => {
            const filtered = formatInfluxData(result)
            filtered.shift()
            dispatch({
                type: LOAD_CONSUMPTION,
                payload: filtered 
            })
        })
}

export const getProjects = (state) => state.summaryHeatmap && state.summaryHeatmap.projects
export const getMdbList = (state) => state.summaryHeatmap && state.summaryHeatmap.mdbList
export const getConsumption = (state) => state.summaryHeatmap && state.summaryHeatmap.consumption