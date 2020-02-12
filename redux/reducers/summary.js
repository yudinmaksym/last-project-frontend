import { showStickLoader } from './loaders'
import agentDaily from '../../agentDaily'
var moment = require('moment');
//CONSTANTS
export const LOAD_ALL_PROJECTS_SUCCESS = "SUMMARY//LOAD_ALL_PROJECTS_SUCCESS";
export const LOAD_ENERGY_TOTAL_REQUEST = "SUMMARY//LOAD_ENERGY_TOTAL_REQUEST";
export const LOAD_ENERGY_TOTAL_SUCCESS = "SUMMARY//LOAD_ENERGY_TOTAL_SUCCESS";
export const LOAD_ENERGY_TOTAL_FAILED = "SUMMARY//LOAD_ENERGY_TOTAL_FAILED";
export const LOAD_SAVING_TOTAL_REQUEST = "SUMMARY//LOAD_SAVING_TOTAL_REQUEST";
export const LOAD_SAVING_TOTAL_SUCCESS = "SUMMARY//LOAD_SAVING_TOTAL_SUCCESS";
export const LOAD_SAVING_TOTAL_FAILED = "SUMMARY//LOAD_SAVING_TOTAL_FAILED";
export const LOAD_ACTUAL_CONS_DAILY_REQUEST = "SUMMARY//LOAD_ACTUAL_CONS_DAILY_REQUEST";
export const LOAD_ACTUAL_CONS_DAILY_SUCCESS = "SUMMARY//LOAD_ACTUAL_CONS_DAILY_SUCCESS";
export const LOAD_ACTUAL_CONS_WHOLE_BUILDING_SUCCESS = "SUMMARY//LOAD_ACTUAL_CONS_WHOLE_BUILDING_SUCCESS";
export const LOAD_ACTUAL_CONS_DAILY_FAILED = "SUMMARY//LOAD_ACTUAL_CONS_DAILY_FAILED";
export const LOAD_BASELINE_REQUEST = "SUMMARY//LOAD_BASELINE_REQUEST";
export const LOAD_BASELINE_SUCCESS = "SUMMARY//LOAD_BASELINE_SUCCESS";
export const LOAD_BASELINE_FAILED = "SUMMARY//LOAD_BASELINE_FAILED";
export const CLEAR_ALL_STATE_REQUEST = "SUMMARY//CLEAR_ALL_STATE_REQUEST";
export const CLEAR_ALL_STATE_SUCCESS = "SUMMARY//CLEAR_ALL_STATE_SUCCESS";
export const CLEAR_ALL_STATE_FAILED = "SUMMARY//CLEAR_ALL_STATE_FAILED";
export const LOAD_POWER_DAILY_REQUEST = "SUMMARY//LOAD_POWER_DAILY_REQUEST";
export const LOAD_POWER_DAILY_SUCCESS = "SUMMARY//LOAD_POWER_DAILY_SUCCESS";
export const LOAD_POWER_DAILY_FAILED = "SUMMARY//LOAD_POWER_DAILY_FAILED";
export const LOAD_MDB_LIST_FOR_CURR_PROJECT = "SUMMARY//LOAD_MDB_LIST_FOR_CURR_PROJECT";
export const SAVE_SELECTED_PROJECT = "SUMMARY//SAVE_SELECTED_PROJECT";
export const GET_EQUIP_BY_METER = "SUMMARY//GET_EQUIP_BY_METER";
export const GET_FULL_EQUIP_LIST = "SUMMARY//GET_FULL_EQUIP_LIST";
export const LOAD_ENERGY_CONS_DIST_SUCCESS = "SUMMARY//LOAD_ENERGY_CONS_DIST_SUCCESS";
export const LOAD_HOURLY_CONSUMPTION_SUCCESS = "SUMMARY//LOAD_HOURLY_CONSUMPTION_SUCCESS";
export const LOAD_HOURLY_CONSUMPTION_WHOLE_BUILDING_SUCCESS = "SUMMARY//LOAD_HOURLY_CONSUMPTION_WHOLE_BUILDING_SUCCESS";

const initialState = {
    // energyTotal: [],
    savingTotal: [],
    // actualConsumption: [],
    // baseLine: [],
    selectedProject: {
        startDate: '2019-10-31',
        endDate: '2019-11-15'
    },
    mdbList: []
}

// REDUCERS
export default (state = initialState, action) => {
    switch (action.type) {
        case SAVE_SELECTED_PROJECT:
            return {
                ...state,
                selectedProject: {
                    project: action.payload.data.label,
                    projectId: action.payload.data.value,
                    region: action.payload.data.region,
                    cdd: action.payload.data.cdd,
                    category: action.payload.data.category,
                    startDate: action.payload.range.startDate,
                    endDate: action.payload.range.endDate,
                }
            }
        case LOAD_ALL_PROJECTS_SUCCESS:
            return {
                ...state,
                projects: action.payload.result.items
            }
        case LOAD_ENERGY_TOTAL_SUCCESS: {
            return {
                ...state,
                energyTotal: action.payload.result
            }
        }
        case LOAD_SAVING_TOTAL_SUCCESS: {
            return {
                ...state,
                savingTotal: action.payload.result
            }
        }
        case LOAD_ACTUAL_CONS_DAILY_SUCCESS: {
            return {
                ...state,
                actualConsumption: action.payload.result
            }
        }
        case LOAD_ACTUAL_CONS_WHOLE_BUILDING_SUCCESS: {
            return {
                ...state,
                actualConsWholeBuilding: action.payload.result
            }
        }
        case LOAD_BASELINE_SUCCESS: {
            return {
                ...state,
                baseLine: action.payload.result
            }
        }
        case LOAD_POWER_DAILY_SUCCESS: {
            return {
                ...state,
                power: action.payload.result
            }
        }
        case LOAD_MDB_LIST_FOR_CURR_PROJECT: {
            return {
                ...state,
                mdbList: action.payload.result.items
            }
        }
        case GET_FULL_EQUIP_LIST: {
            return {
                ...state,
                equipList: action.payload.items
            }
        }
        case LOAD_HOURLY_CONSUMPTION_SUCCESS: {
            return {
                ...state,
                hourlyConsumption: action.payload
            }
        }
        case LOAD_HOURLY_CONSUMPTION_WHOLE_BUILDING_SUCCESS: {
            return {
                ...state,
                hourlyConsWholeBuilding: action.payload
            }
        }
        case LOAD_ENERGY_CONS_DIST_SUCCESS:
            return {
                ...state,
                energyConsDist: action.payload
            }
        case CLEAR_ALL_STATE_SUCCESS: {
            return {
                ...state,
                savingTotal: [],
                mdbList: [],
                actualConsumption: '',
                energyTotal: '',
                power: '',
                baseLine: [],
                energyConsDist: '',
                hourlyConsumption: '',
                hourlyConsWholeBuilding: '',
            }
        }

        default: return state;
    }
}

export const loadAllMdbSummaryData = (range, data, mdb, mdbList) => async dispatch => {
    dispatch(showStickLoader(true))
    await Promise.all([
        dispatch(saveSelectedProject(range, data)),
        dispatch(loadMdbTotalEnergy(range.startDate, range.endDate, data.label, mdb.iot_name)),
        dispatch(loadMdbSavingTotal(range.startDate, range.endDate, data.label, mdb.iot_name)),
        dispatch(loadMdbActualConsumption(range.startDate, range.endDate, data.label, mdb.iot_name)),
        dispatch(loadActualConsWholeBuilding(mdbList, data.label, range.startDate, range.endDate)),
        dispatch(loadMdbBaseline(range.startDate, range.endDate, data.label, mdb.iot_name)),
        dispatch(loadMdbPowerDaily(range.startDate, range.endDate, data.label, mdb.iot_name)),
        dispatch(getEquipListByMeterName(data.value, mdb.iot_name, data.label, range.startDate, range.endDate)),
        dispatch(getFullEquipList(data.value, data.label, range.startDate, range.endDate)),
        dispatch(getHourlyConsumption(mdb.iot_name, data.label, range.startDate, range.endDate)),
        dispatch(getHourlyConsumptionWholeBuilding(mdbList, data.label, range.startDate, range.endDate)),
    ])
    dispatch(showStickLoader(false))
    
}

export const saveSelectedProject = (range, data) => dispatch => {
    dispatch({
      type: SAVE_SELECTED_PROJECT,
      payload: {
        data,
        range,
      }
    })
  }

export const clearAllState = () => dispatch => {
    dispatch({type: CLEAR_ALL_STATE_SUCCESS}) 
}

export const loadAllProjects = (start, stop, id, project) => dispatch => {
    return agentDaily.Default.loadAllProjects()
        .then(result => {
            if(result.items !== 0) {
                if(id && project) {
                    const range = {
                        startDate: start,
                        endDate: stop,
                    }
                    const data = {
                        value: id,
                        label: project
                    }
                    dispatch(saveSelectedProject(range, data)),
                    dispatch(loadAllMdbListForCurrentProject(data,range))
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
                    dispatch(loadAllMdbListForCurrentProject(data, range))
                }
                dispatch({
                    type: LOAD_ALL_PROJECTS_SUCCESS,
                    payload: {
                        result
                    }
                })
            }
        })
}

export const loadAllMdbListForCurrentProject = (data, range) => dispatch => {
    dispatch({type: CLEAR_ALL_STATE_SUCCESS})
    return agentDaily.Daily.loadAllMdbListForCurrentProject(data.value)
        .then(result => {
            dispatch({
                type: LOAD_MDB_LIST_FOR_CURR_PROJECT,
                payload: { result }
            })
            if(result.count !== 0) {
                dispatch(loadAllMdbSummaryData(range, data, result.items[0], result.items))
            }
        })
}

export const loadMdbTotalEnergy = (startDate, endDate, site, mdbName) => dispatch => {

    dispatch({
        type: LOAD_ENERGY_TOTAL_REQUEST
    })

    const data = 
    ' from(bucket: "taka-iot-data-energy")'
        + ` |> range(start:${moment(startDate).format("YYYY-MM-DDT00:16:00+04:00")}, stop: ${moment(endDate).add(1, 'day').format("YYYY-MM-DDT00:00:00+04:00")})`
        + ` |> filter(fn: (r) => r.site == "${site}")`
        + ` |> filter(fn: (r) => r.equip == "${mdbName}")`
        + ' |> filter(fn: (r) => r._measurement == "ENERGY_TDY" or r._measurement == "ENERGY_TOT_TDY" and r._field == "value")'
        + ' |> timeShift(duration: 3h, columns: ["_start", "_stop", "_time"])'
        + ' |> timeShift(duration: 59m, columns: ["_start", "_stop", "_time"])'
        + ' |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)'
        + ' |> keep(columns: ["_time", "equip", "_value"])'
        + ' |> fill(usePrevious: true) '
        + ' |> sum()';

    return agentDaily.Summary.loadMdbTotalEnergy(data)
        .then(result => {
            dispatch({
                type: LOAD_ENERGY_TOTAL_SUCCESS,
                payload: {
                    result,
                }
            })
        })
}

export const loadMdbSavingTotal = (startDate, endDate, site, mdbName) => dispatch => {
    const today = moment(new Date())

    let newEndDate = endDate
    if(moment(endDate) > moment(today)) {
        newEndDate=moment(today).format('YYYY-MM-DD')
    }
    
    const start = moment(startDate).subtract(1, 'year').format('YYYY-MM-DD')
    const end = moment(newEndDate).subtract(1, 'year').format('YYYY-MM-DD')

    dispatch({
        type: LOAD_SAVING_TOTAL_REQUEST
    })
    

    return agentDaily.Summary.loadMdbSavingTotal(start, end, site, mdbName)
        .then(result => {
            if(site === "FalconTower_1602") {
                const baselineData = []
                result.map(el => {
                    if(el.subject !== "MDB_02") {
                        baselineData.push(el)
                    }
                })
                
                dispatch({
                    type: LOAD_SAVING_TOTAL_SUCCESS,
                    payload: {
                        result: baselineData
                    }
                })
            } else {
                dispatch({
                    type: LOAD_SAVING_TOTAL_SUCCESS,
                    payload: {
                        result
                    }
                })
            }
        })
        .catch(error => {
            console.log(error);
            dispatch({
                type: LOAD_SAVING_TOTAL_FAILED,
                payload: {
                    error
                }
            })
        })
}

const actualConsumption = (mdb, project, start, end) => {
    return `
        from(bucket: "taka-iot-data-energy")
        |> range(start:${moment(start).format("YYYY-MM-DDT00:16:00+04:00")}, stop: ${moment(end).add(1,'day').format("YYYY-MM-DDT00:00:00+04:00")})
        |> filter(fn: (r) => r.site == "${project}")
        |> filter(fn: (r) => ${typeof mdb !== "object" ? `r.equip == "${mdb}"` : `${generateEquipQuery(mdb).slice(0, -3)}`})
        |> filter(fn: (r) => r._measurement == "ENERGY_TDY" or r._measurement == "ENERGY_TOT_TDY" and r._field == "value")
        |> timeShift(duration: 3h, columns: ["_start", "_stop", "_time"])
        |> timeShift(duration: 44m, columns: ["_start", "_stop", "_time"])
        |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)
        ${typeof mdb !== "object"
        ? `|> keep(columns: ["_time", "equip", "_value"])`
        : `|> group(columns: ["_time"])
           |> sum()
           |> keep(columns: ["_time", "equip", "_value"])
           |> group()`
        }
    `
}

export const loadMdbActualConsumption = (start, end, site, mdb) => dispatch => {
    dispatch({
        type: LOAD_ACTUAL_CONS_DAILY_REQUEST
    })

    const data = actualConsumption(mdb, site, start, end)
    return agentDaily.Summary.loadMdbActualConsumption(data)
        .then(result => {
            dispatch({
                type: LOAD_ACTUAL_CONS_DAILY_SUCCESS,
                payload: {
                    result
                }
            })
        })
        .catch(error => {
            console.log(error);
            dispatch({
                type: LOAD_ACTUAL_CONS_DAILY_FAILED,
                payload: {
                    error
                }
            })
        })
}

export const loadActualConsWholeBuilding = (mdbList, site, start, end) => dispatch => {
    const data = actualConsumption(mdbList, site, start, end)
    return agentDaily.Summary.loadMdbActualConsumption(data)
        .then(result => {
            dispatch({
                type: LOAD_ACTUAL_CONS_WHOLE_BUILDING_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadMdbBaseline = (startDate, endDate, site, mdbName) => dispatch => {
    dispatch({
        type: LOAD_BASELINE_REQUEST
    })

    const today = moment(new Date())

    let newEndDate = endDate
    if(moment(endDate) > moment(today)) {
        newEndDate=moment(today).format('YYYY-MM-DD')
    }
    
    const start = moment(startDate).subtract(1, 'year').format('YYYY-MM-DD')
    const end = moment(newEndDate).subtract(1, 'year').format('YYYY-MM-DD')

    return agentDaily.Summary.loadMdbBaseline(start, end, site, mdbName)
        .then(result => {
            if(site === "FalconTower_1602") {
                const baselineData = []
                result.map(el => {
                    if(el.subject !== "MDB_02") {
                        baselineData.push(el)
                    }
                })

                dispatch({
                    type: LOAD_BASELINE_SUCCESS,
                    payload: {
                        result: baselineData
                    }
                })

                
            } else {
                dispatch({
                    type: LOAD_BASELINE_SUCCESS,
                    payload: {
                        result
                    }
                })
            }
        })
        .catch(error => {
            console.log(error);
            dispatch({
                type: LOAD_BASELINE_FAILED,
                payload: {
                    error
                }
            })
        })
}

export const loadMdbPowerDaily = (startDate, endDate, site, mdbName) => dispatch => {
    dispatch({
        type: LOAD_ENERGY_TOTAL_REQUEST
    })
    const body = 
            ' from(bucket: "taka-iot-data")' +
                ` |> range(start:${moment(startDate).format("YYYY-MM-DDT00:00:00+04:00")}, stop: ${moment(endDate).add(1, 'day').format("YYYY-MM-DDT00:00:00+04:00")})` +
                ` |> filter(fn: (r) => r.site == "${site}")` +
                ` |> filter(fn: (r) => r.equip == "${mdbName}")` +
                ' |> drop(columns: ["pointStatus"])' +
                ' |> filter(fn: (r) => r._measurement == "PWR" and r._field == "value")' +
                ' |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])' +
                ' |> sort(columns: ["_time"], desc: false)' +
                ' |> keep(columns: ["_time", "equip", "_value"])';

    return agentDaily.Summary.loadMdbPower(body)
        .then(result => {
            dispatch({
                type: LOAD_POWER_DAILY_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const getEquipListByMeterName = (id, meter, site, start, end) => dispatch => {
    return agentDaily.Summary.getEquipListByMeterName(id, meter)
        .then(result => {
            dispatch(getEnergyPieChart(result.items, site, start, end))
            dispatch({
                type: GET_EQUIP_BY_METER,
                payload: result
            })
        })
}

export const getFullEquipList = (id, site, start, end) => dispatch => {
    return agentDaily.Summary.getFullEquipListForProject(id)
        .then(result => {
            dispatch({
                type: GET_FULL_EQUIP_LIST,
                payload: result
            })
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

export const getEnergyPieChart = (equipList, project, start, end) => dispatch => {
    if(equipList.length !== 0) {
        const equipQuery = generateEquipQuery(equipList)
        const data = 
            ' from(bucket: "taka-iot-data-energy")'
            + ` |> range(start:${moment(start).format("YYYY-MM-DDT00:16:00+04:00")}, stop: ${moment(end).format("YYYY-MM-DDT00:00:00+04:00")})`
            + ` |> filter(fn: (r) => r.site == "${project}")`
            + ` |> filter(fn: (r) => ${equipQuery.slice(0, -3)})`
            + ' |> filter(fn: (r) => r._measurement == "ENERGY_TDY" or r._measurement == "ENERGY_TOT_TDY" or'
            + ' r._measurement == "EF_ENERGY_TDY" or r._measurement == "SF_ENERGY_TDY" and r._field == "value")'
            + ' |> timeShift(duration: 3h, columns: ["_start", "_stop", "_time"])'
            + ' |> timeShift(duration: 44m, columns: ["_start", "_stop", "_time"])'
            + ' |> keep(columns: ["_time", "equip", "_value"])'
            + ' |> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)'
            + ' |> sum()';
                
        return agentDaily.Influx.loadInfluxData(data)
            .then(result => {
                dispatch({
                    type: LOAD_ENERGY_CONS_DIST_SUCCESS,
                    payload: result 
                })
            })
    }
}

const hourlyConsumption = (mdb, project, start, end) => {
    return `
        from(bucket: "taka-iot-data")
        |> range(start:${moment(start).subtract(1, 'day').format("YYYY-MM-DDT23:45:00+04:00")}, stop: ${moment(end).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})
        |> filter(fn: (r) => r.site == "${project}")
        |> filter(fn: (r) => ${typeof mdb !== "object" ? `r.equip == "${mdb}"` : `${generateEquipQuery(mdb).slice(0, -3)}`})
        |> filter(fn: (r) => r._measurement == "ENERGY_TOT" or r._measurement == "ENERGY_TOT_TDY" and r._field == "value")
        |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])
        |> difference(nonNegative: true, columns: ["_value"])
        |> aggregateWindow(every: 1h, timeSrc: "_start", fn: sum)
        ${typeof mdb !== "object"
        ? `|> keep(columns: ["site", "equip", "_measurement", "_value", "_time"])`
        : `|> group(columns: ["_time"])
        |> sum()
        |> keep(columns: ["site", "equip", "_measurement", "_value", "_time"])
        |> group()`
        }
    `
}

export const getHourlyConsumption = (mdb, project, start, end) => dispatch => {
    const data = hourlyConsumption(mdb, project, start, end)
    return agentDaily.Influx.loadInfluxData(data)
        .then(result => {
            dispatch({
                type: LOAD_HOURLY_CONSUMPTION_SUCCESS,
                payload: result 
            })
        })
}

export const getHourlyConsumptionWholeBuilding = (mdbList, project, start, end) => dispatch => {
    const data = hourlyConsumption(mdbList, project, start, end)
    return agentDaily.Influx.loadInfluxData(data)
        .then(result => {
            dispatch({
                type: LOAD_HOURLY_CONSUMPTION_WHOLE_BUILDING_SUCCESS,
                payload: result 
            })
        })
}








// GET STATE
export const getAllProjects = (state) => state.summary && state.summary.projects
export const getSelectedProject = (state) => state.summary && state.summary.selectedProject
export const getTotalyEnergy = (state) => state.summary && state.summary.energyTotal
export const getTotalySavings = (state) => state.summary && state.summary.savingTotal
export const getActualConsumption = (state) => state.summary && state.summary.actualConsumption
export const getActualConsWholeBuilding = (state) => state.summary && state.summary.actualConsWholeBuilding
export const getBaseline = (state) => state.summary && state.summary.baseLine
export const getMdbPower = (state) => state.summary && state.summary.power
export const getMdbList = (state) => state.summary && state.summary.mdbList
export const getEquipList = (state) => state.summary && state.summary.equipList
export const getEnergyConsDist = (state) => state.summary && state.summary.energyConsDist
export const getHourlyCons = (state) => state.summary && state.summary.hourlyConsumption
export const getHourlyConsWholeBuilding = (state) => state.summary && state.summary.hourlyConsWholeBuilding
