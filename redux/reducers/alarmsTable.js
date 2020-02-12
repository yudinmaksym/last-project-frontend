import { showStickLoader } from './loaders'
import agentDaily from '../../agentDaily'

//CONSTANTS
export const LOAD_ALL_PROJECTS_SUCCESS = "CWP//LOAD_ALL_PROJECTS_SUCCESS"
export const LOAD_ALARMS_DATA = "ALARMS//LOAD_ALARMS_DATA"
export const LOAD_OVERRIDDEN_DATA = "ALARMS//LOAD_OVERRIDDEN_DATA"
export const LOAD_DISCONNECTED_DATA = "ALARMS//LOAD_DISCONNECTED_DATA"
export const LOAD_CONNECTION_POINTS = "ALARMS//LOAD_CONNECTION_POINTS"
export const LOAD_CONNECTION_POINTS_ALL = "ALARMS//LOAD_CONNECTION_POINTS_ALL"
export const SELECTED_PROJECT = "ALARMS//SELECTED_PROJECT"

const initialState = {
    page: 'alarms'
}

//REDUCERS
export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ALARMS_DATA:
            return {
                ...state,
                data: action.payload.result,
                page: action.payload.table
            }
        case LOAD_OVERRIDDEN_DATA: 
            return {
                ...state,
                data: action.payload.result,
                page: action.payload.table,
            }
        case LOAD_DISCONNECTED_DATA: 
            return {
                ...state,
                data:action.payload.result,
                page: action.payload.table,
            }
        case LOAD_ALL_PROJECTS_SUCCESS:
            return {
                ...state,
                projects: action.payload.result.items
            }
        case SELECTED_PROJECT:
            return {
                ...state,
                selectedProject: action.payload
            }
        case LOAD_CONNECTION_POINTS:
            return {
                ...state,
                connectionPoints: action.payload
            }
        case LOAD_CONNECTION_POINTS_ALL:
            return {
                ...state,
                connectionPointsAll: action.payload
            }
        default: return state
    }
}


//ACTIONS
export const loadAllData = (start, end, project, table = "alarms") => async dispatch => {
    dispatch(showStickLoader(true))
    const promise = []
    promise.push(dispatch(setProject(project)))
    promise.push(dispatch(loadConnectionPoint(start, end)))
    promise.push(dispatch(loadConnectionPointForAllProjects(start, end)))
        if(table === 'alarms') {
            promise.push(dispatch(loadAlarmsData(start, end, project)))
        }
        else if(table === 'overridden') {
            promise.push(dispatch(loadOverriddenData(start, end, project)))
        }
        else if(table === 'disconnected') {
            promise.push(dispatch(loadDisconnectedData(start, end, project)))
        }
    await Promise.all(promise)
    dispatch(showStickLoader(false))
}

export const loadAllProjects = (start, stop, project, type) => dispatch => {
    return agentDaily.Default.loadAllProjects()
        .then(result => {
            if(result.items !== 0) {
                if(project) {
                    dispatch(loadAllData(start, stop, project, type))
                } else {
                    dispatch(loadAllData(start, stop, result.items[0].iot_name, type))
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

export const setProject = (project) => dispatch => {
    dispatch({
        type: SELECTED_PROJECT,
        payload: project
    })
}

export const loadAlarmsData = (start, end, project) => dispatch => {

    const body = `from(bucket: "taka-iot-alarms")
        |> range(start: ${start}T00:00:00+04:00, stop: ${end}T00:00:00+04:00)
        |> filter(fn: (r) => r.site == "${project}")
        |> filter(fn: (r) => r.toState != "normal")
        |> toString()
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> group()
        |> keep(columns: ["site", "class", "_time", "equip", "_measurement", "priority", "count", "alarmValue", "offnormalValue", "presentValue", "point", "source"])
        |> unique(column: "source")`

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_ALARMS_DATA,
                payload: {
                    result,
                    table: 'alarms'
                }
            })
        })
}

export const loadOverriddenData = (start, end, project) => dispatch => {
    const body = `
        import "strings"
        from(bucket: "taka-iot-data")
        |> range(start: ${start}T00:00:00+04:00, stop: ${end}T00:00:00+04:00)
        |> filter(fn: (r) => r.site == "${project}")
        |> last()
        |> filter(fn: (r) => (strings.index(v: r.pointStatus, substr: "overridden") > -1))
        |> keep(columns: ["site", "equip", "_measurement", "_time", "tower"])
        |> group(columns: ["site"], mode:"by")`

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_OVERRIDDEN_DATA,
                payload: {
                    result,
                    table: 'overridden'
                }
            })
        })
}

export const loadDisconnectedData = (start, end, project) => dispatch => {
    const body = `
        from(bucket: "_monitoring")
        |> range(start: ${start}T00:00:00+04:00, stop: ${end}T00:00:00+04:00)
        |> filter(fn: (r) => r.site == "${project}")
        |> filter(fn: (r) => r._field == "dead")
        |> filter(fn: (r) => r._value == true)
        |> last()
        |> keep(columns: ["site", "equip", "_source_measurement", "_time", "tower"])
        |> group(columns: ["site"], mode:"by")
        |> rename(columns: {_source_measurement: "_measurement"})`

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_DISCONNECTED_DATA,
                payload: {
                    result,
                    table: 'disconnected'
                }
            })
        })
}

export const loadConnectionPoint = (start, end) => dispatch => {
    const body = `
        online = from(bucket: "taka-iot-monitor")
            |> range(start: ${start}T00:00:00+04:00, stop: ${end}T00:00:00+04:00)
            |> filter(fn: (r) => r._value == true)
            |> group(columns: ["_measurement"], mode:"by")
            |> aggregateWindow(every: 1h, fn: count, createEmpty: true, timeSrc: "_start")  
            |> drop(columns: ["_start","_stop"])
            |> rename(columns: {_value: "online"})
        offline = from(bucket: "taka-iot-monitor")
            |> range(start: ${start}T00:00:00+04:00, stop: ${end}T00:00:00+04:00)
            |> group(columns: ["_measurement"], mode:"by")
            |> aggregateWindow(every: 1h, fn: count, createEmpty: true, timeSrc: "_start")  
            |> drop(columns: ["_start","_stop"])
            |> rename(columns: {_value: "offline"})
        join(tables: {online:online, offline:offline}, on: ["_measurement", "_time"])
            |> map(fn: (r) => ({ 
            r with percent: 
                if (r.online + r.offline) > 0 then (float(v: r.online) / (float(v: r.online) + float(v: r.offline)) * 100.0)
                else 0.0
            }))`
    
    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_CONNECTION_POINTS,
                payload: result
            })
        })
}

export const loadConnectionPointForAllProjects = (start, end) => dispatch => {
    const body = `
            online = from(bucket: "taka-iot-monitor")
            |> range(start: ${start}T00:00:00+04:00, stop: ${end}T00:00:00+04:00)
            |> filter(fn: (r) => r._value == true)
            |> drop(columns: ["_measurement","status","_field"])
            |> aggregateWindow(every: 1h, fn: count, createEmpty: true, timeSrc: "_start")  
            |> drop(columns: ["_start","_stop"])
            |> rename(columns: {_value: "online"})
            |> group()
        offline = from(bucket: "taka-iot-monitor")
            |> range(start: ${start}T00:00:00+04:00, stop: ${end}T00:00:00+04:00)
            |> filter(fn: (r) => r._value == false)
            |> drop(columns: ["_measurement","status","_field"])
            |> aggregateWindow(every: 1h, fn: count, createEmpty: true, timeSrc: "_start")  
            |> drop(columns: ["_start","_stop"])
            |> rename(columns: {_value: "offline"})
            |> group()
        join(tables: {online:online, offline:offline}, on: ["_time"])
            |> map(fn: (r) => ({ 
            r with percent: 
                if (r.online + r.offline) > 0 then (float(v: r.online) / (float(v: r.online) + float(v: r.offline)) * 100.0)
                else 0.0
            }))`
    
    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_CONNECTION_POINTS_ALL,
                payload: result
            })
        })
}


// GETTERS
export const getAlarmsData = (state) => state.alarmsTable && state.alarmsTable.data
export const getPageState = (state) => state.alarmsTable && state.alarmsTable.page
export const getProjects = (state) => state.alarmsTable && state.alarmsTable.projects
export const getSelectedProject = (state) => state.alarmsTable && state.alarmsTable.selectedProject
export const getConnectionPoints = (state) => state.alarmsTable && state.alarmsTable.connectionPoints
export const getConnectionPointsAll = (state) => state.alarmsTable && state.alarmsTable.connectionPointsAll