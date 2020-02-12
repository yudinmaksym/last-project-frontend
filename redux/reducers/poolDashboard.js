import { showStickLoader } from './loaders'
import agentDaily from '../../agentDaily'

export const LOAD_PUMP_TEMP_SUCCESS = "POOL//LOAD_PUMP_TEMP_SUCCESS";
export const LOAD_WATER_INLET_SUCCESS = "POOL//LOAD_WATER_INLET_SUCCESS";
export const LOAD_WATER_OUTLET_SUCCESS = "POOL//LOAD_WATER_OUTLET_SUCCESS";
export const LOAD_TEMPERATURE_SUCCESS = "POOL//LOAD_TEMPERATURE_SUCCESS";
export const CLEAR_STATE = "WEATHER//CLEAR_STATE";
export const LOAD_WINDSPEED_SUCCESS = 'POOL//LOAD_WINDSPEED_SUCCESS';

const initialState = {
    degrees: [],
    weatherHistory: [],
}

export default (state = initialState, action) => {
    switch(action.type) {
        case LOAD_PUMP_TEMP_SUCCESS: 
            return {
                ...state,
                pumpTemp: action.payload
            }
        case LOAD_WATER_INLET_SUCCESS: 
            return {
                ...state,
                waterInlet: action.payload
            }
        case LOAD_WATER_OUTLET_SUCCESS: 
            return {
                ...state,
                waterOutlet: action.payload
            }
        case LOAD_TEMPERATURE_SUCCESS: 
            return {
                ...state,
                temperature: action.payload
            }
        case LOAD_WINDSPEED_SUCCESS: 
            return {
                ...state,
                windspeed: action.payload
            }
        default: return state
    }
}

export const loadAllData = (start, end) => async dispatch => {
    dispatch(showStickLoader(true))
    await Promise.all([
        dispatch(loadPumpTemp(start, end)),
        dispatch(loadWaterInlet(start, end)),
        dispatch(loadWaterOutlet(start, end)),
        dispatch(loadTemperature(start, end)),
        dispatch(loadWindSpeed(start, end)),
    ])
    dispatch(showStickLoader(false))
}

const requestBody = (start, end, measurement) => {
    return `from(bucket: "taka-iot-data") 
    |> range(start:${start}T00:00:00+04:00, stop: ${end}T00:00:00+04:00) 
    |> filter(fn: (r) => r.site == "Oceana_1407") 
    |> filter(fn: (r) => r.equip == "Heat_Pump_01") 
    |> drop(columns: ["pointStatus"]) 
    |> filter(fn: (r) => (r._measurement == "${measurement}") and r._field == "value") 
    |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"]) 
    |> keep(columns: ["_time", "_measurement", "_value"]) 
    |> aggregateWindow(every: 15m, timeSrc: "_start", fn: mean, createEmpty: false)`
}

export const loadPumpTemp = (start, end) => dispatch => {
    const body = requestBody(start, end, "Pool_Water_Temp")
    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_PUMP_TEMP_SUCCESS,
                payload: result
            })
        })
}

export const loadWaterInlet = (start, end) => dispatch => {
    const body = requestBody(start, end, "Water_Inlet_Temp")
    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_WATER_INLET_SUCCESS,
                payload: result
            })
        })
}

export const loadWaterOutlet = (start, end) => dispatch => {
    const body = requestBody(start, end, "Water_Outlet_Temp")
    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_WATER_OUTLET_SUCCESS,
                payload: result
            })
        })
}

export const loadTemperature = (start, end, city = "Dubai") => dispatch => {
    const body = `from(bucket: "taka-weather")
        |> range(start: ${start}T00:00:00+04:00, stop: ${end}T00:00:00+04:00)
        |> filter(fn: (r) => r.city == "${city}")
        |> filter(fn: (r) => r._measurement == "temp" and r._field == "value")
        |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])
        |> aggregateWindow(every: 15m, timeSrc: "_start", fn: mean, createEmpty: false)`

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_TEMPERATURE_SUCCESS,
                payload: result
            })
        })
}

export const loadWindSpeed = (start, end, city = "Dubai") => dispatch => {
    const body = `from(bucket: "taka-weather")
        |> range(start: ${start}T00:00:00+04:00, stop: ${end}T00:00:00+04:00)
        |> filter(fn: (r) => r.city == "${city}")
        |> filter(fn: (r) => r._measurement == "wind_speed" and r._field == "value")
        |> timeShift(duration: 4h, columns: ["_start", "_stop", "_time"])
        |> aggregateWindow(every: 15m, timeSrc: "_start", fn: mean, createEmpty: false)
        `

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_WINDSPEED_SUCCESS,
                payload: result
            })
        })
}

export const getPumpTemp = (state) => state.poolDashboard && state.poolDashboard.pumpTemp
export const getWaterInlet = (state) => state.poolDashboard && state.poolDashboard.waterInlet
export const getWaterOutlet = (state) => state.poolDashboard && state.poolDashboard.waterOutlet
export const getTemperature = (state) => state.poolDashboard && state.poolDashboard.temperature
export const getWindSpeed = (state) => state.poolDashboard && state.poolDashboard.windspeed