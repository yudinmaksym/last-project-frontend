import { showStickLoader } from './loaders'
import agentDaily from '../../agentDaily'

export const LOAD_DEGREES_DAILY_SUCCESS = "WEATHER//LOAD_WEATHER_DAILY_SUCCESS";
export const LOAD_WEATHER_SUCCESS = "WEATHER//LOAD_WEATHER_SUCCESS";
export const CLEAR_STATE = "WEATHER//CLEAR_STATE";
export const LOAD_WEATHER_HISTORY = 'WEATHER//LOAD_WEATHER_HISTORY';

const initialState = {
    degrees: [],
    weatherHistory: [],
}

export default (state = initialState, action) => {
    switch(action.type) {
        case LOAD_DEGREES_DAILY_SUCCESS: 
            return {
                ...state,
                degrees: [
                    ...state.degrees,
                    action.payload.result
                ]
            }
        case LOAD_WEATHER_SUCCESS:
            return {
                ...state,
                cityWeather: action.payload.result
            }
        case LOAD_WEATHER_HISTORY:
            return {
                ...state,
                weatherHistory: [
                    ...state.weatherHistory,
                    {
                        data: action.payload.result,
                        title: action.payload.title
                    }
                ]
            }
        case CLEAR_STATE:
            return {
                degrees: [],
                cityWeather: [],
                weatherHistory: []
            }
        default: return state
    }
}

export const loadAllData = (city, start, end) => async dispatch => {
    dispatch({type: CLEAR_STATE})
    dispatch(showStickLoader(true))
    await Promise.all([
        dispatch(loadDegrees(18, city, start, end)),
        dispatch(loadDegrees(20, city, start, end)),
        dispatch(loadDegrees(22, city, start, end)),
        dispatch(loadDegrees(24, city, start, end)),
        dispatch(loadDegrees(26, city, start, end)),
        dispatch(loadDegrees(28, city, start, end)),
        dispatch(loadWeather(city)),
        dispatch(loadWeatherHistory(city, start, end, "temp", "Temperature")),
        dispatch(loadWeatherHistory(city, start, end, "humidity", "Humidity")),
        dispatch(loadWeatherHistory(city, start, end, "pressure", "Pressure")),
        dispatch(loadWeatherHistory(city, start, end, "wind_speed", "Wind Speed")),
        dispatch(loadWeatherHistory(city, start, end, "clouds", "Clouds")),
    ])
    dispatch(showStickLoader(false))
}

export const loadDegrees = (cdd, city, start, end) => dispatch => {
    return agentDaily.Weather.loadDegrees(cdd, city, start, end)
        .then(result => {
            dispatch({
                type: LOAD_DEGREES_DAILY_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadWeather = (city) => dispatch => {
    return agentDaily.Weather.loadCurrentWeather(city)
        .then(result => {
            dispatch({
                type: LOAD_WEATHER_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

export const loadWeatherHistory = (city, start, end, measurement, title) => dispatch => {
    const body = 'from(bucket: "taka-weather")' +
    `|> range(start: ${start}T00:00:00+04:00, stop: ${end}T00:00:00+04:00)` +
    `|> filter(fn: (r) => r.city == "${city}")` +
    `|> filter(fn: (r) => r._measurement == "${measurement}" and r._field == "value")`;

    return agentDaily.Influx.loadInfluxData(body)
        .then(result => {
            dispatch({
                type: LOAD_WEATHER_HISTORY,
                payload: {
                    result,
                    title
                }
            })
        })
}

export const getDegrees = (state) => state.weather && state.weather.degrees
export const getCityWeather = (state) => state.weather && state.weather.cityWeather
export const getWeatherHistory = (state) => state.weather && state.weather.weatherHistory