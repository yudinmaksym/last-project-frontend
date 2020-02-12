import { showStickLoader } from './loaders'
import agentDaily from '../../agentDaily'
var moment = require('moment');

//CONSTANTS
export const SAVE_DATE_RANGE_SUCCESS = "LOBBY//SAVE_DATE_RANGE_SUCCESS";

export const LOAD_TOTAL_ENERGY_CONSUMPTION_SUCCESS = "LOBBY//LOAD_TOTAL_ENERGY_CONSUMPTION_SUCCESS";
export const LOAD_DAILY_ENERGY_CONSUMPTION_SUCCESS = "LOBBY//LOAD_DAILY_ENERGY_CONSUMPTION_SUCCESS";

export const LOAD_TOTAL_CONSUMPTION_BASELINE = "LOBBY//LOAD_TOTAL_CONSUMPTION_BASELINE";
export const LOAD_DAILY_CONSUMPTION_BASELINE = "LOBBY//LOAD_DAILY_CONSUMPTION_BASELINE";
export const LOAD_DAILY_FORECAST = "LOBBY//LOAD_DAILY_FORECAST";

// DATE RANGE
export const LOAD_YESTERDAY_TOTAL_CONSUMPTION_SUCCESS = "LOBBY//LOAD_YESTERDAY_TOTAL_CONSUMPTION_SUCCESS";

// WEATHER
export const LOAD_CURRENT_WEATHER_SUCCESS = "LOBBY//LOAD_CURRENT_WEATHER_SUCCESS";

export const CLEAR_STATE = "LOBBY//CLEAR_STATE"

const initialState = {
    daily: {
        baseline: [],
        forecast: [],
    },
    total: {
        baseline: [],
        forecast: {},
    }
}

// REDUCERS
export default (state = initialState, action) => {
    switch (action.type) {
        case SAVE_DATE_RANGE_SUCCESS: {
            return {
                ...state,
                selectedData: {
                    startDate: action.payload.range.startDate,
                    endDate: action.payload.range.endDate,
                    project: action.payload.project
                }
            }
        }
        case LOAD_TOTAL_ENERGY_CONSUMPTION_SUCCESS: {
            return {
                ...state,
                total: {
                    ...state.total,
                    energyConsumption: {
                        ...state.total.energyConsumption,
                        all: action.payload.result 
                    }
                }
            }
        }
        case LOAD_YESTERDAY_TOTAL_CONSUMPTION_SUCCESS: {
            return {
                ...state,
                total: {
                    ...state.total,
                    energyConsumption: {
                        ...state.total.energyConsumption,
                        yesterday: action.payload.result 
                    }
                }
            }
        }

        case LOAD_TOTAL_CONSUMPTION_BASELINE: {
            return {
                ...state,
                total: {
                    ...state.total,
                    baseline: [
                        ...state.total.baseline,
                        action.payload.result
                    ]
                }
            }
        }

        case LOAD_DAILY_CONSUMPTION_BASELINE: {
            return {
                ...state,
                daily: {
                    ...state.daily,
                    baseline: [
                        ...state.daily.baseline,
                        action.payload.items
                    ]
                }
            }
        }

        case LOAD_DAILY_FORECAST: {
            return {
                ...state,
                daily: {
                    ...state.daily,
                    forecast: [
                        ...state.daily.forecast,
                        action.payload.items
                    ]
                }
            }
        }
        case LOAD_DAILY_ENERGY_CONSUMPTION_SUCCESS: {
            return {
                ...state,
                daily: {
                    ...state.daily,
                    energyConsumption: action.payload.result
                }
            }
        }
        case LOAD_CURRENT_WEATHER_SUCCESS: {
            return {
                ...state,
                currentWeather: action.payload.result
            }
        }
        case CLEAR_STATE: {
            return {
                ...state,
                daily: {
                    baseline: [],
                    forecast: [],
                },
                total: {
                    baseline: [],
                    forecast: {},
                }
            }
        }
        default: return state;
    }
}

// ACTIONS
export const loadAllData = (range, project, mdbList) => async dispatch => {
    dispatch({type: CLEAR_STATE})
    dispatch(showStickLoader(true))
    await Promise.all(
        project.map(_proj => {
            dispatch(getTotalConsumptionBaseline(_proj.id, range.startDate, range.endDate))
            dispatch(loadDailyConsumptionBaseline(_proj.id, range.startDate, range.endDate))
            dispatch(loadDailyForecast(_proj.id, range.startDate, range.endDate))
        }),
        dispatch(saveDateRange(range, project)),
        dispatch(loadTotalEnergyConsumption(range, project, mdbList)),
        dispatch(loadDailyEnergyConsumption(range, project, mdbList)),
        dispatch(loadYesterdayTotalConsumption(range.endDate, project, mdbList)),
        dispatch(loadCurrentWeather()),
    )
    dispatch(showStickLoader(false))
}

export const saveDateRange = (range, project) => dispatch => {
    dispatch({
        type: SAVE_DATE_RANGE_SUCCESS,
        payload: {
            range,
            project
        }
    })
}

const generateQueryString = (mdbList, projectList) => {
    let equip = ''
    let project = ''
    projectList.map(_site => project += `r.site == "${_site.iot_name}" or `)
    mdbList.map(_item => _item.length !== 0 
        ? 
            _item.map(_i => {
                equip += `r.equip == "${_i.iot_name}" or `
            })

        :   equip += `r.equip == ""`
    )

    return {project: project.slice(0, -3), equip: equip.slice(0, -3)}
}

const generateTotalEnergyConsumptionBody = (queryString, start, end) => {
    const body = 
        'from(bucket: "taka-iot-data-energy")' +
        `|> range(start: ${start}T00:16:00+04:00, stop: ${end}T00:00:00+04:00)` +
        `|> filter(fn: (r) => ${queryString.project})` +
        `|> filter(fn: (r) => ${queryString.equip})` +
        '|> filter(fn: (r) => r._measurement == "ENERGY_TDY" or r._measurement == "ENERGY_TOT_TDY" and r._field == "value")' +
        '|> keep(columns: ["_time", "equip", "_value"])' +
        '|> timeShift(duration: 3h, columns: ["_start", "_stop", "_time"])' + 
        '|> timeShift(duration: 44m, columns: ["_start", "_stop", "_time"])' +
        '|> aggregateWindow(every: 15m, timeSrc: "_start", fn: min)' +
        '|> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)' +
        '|> group(columns: ["_time"], mode:"by")' +
        '|> sum()' +
        '|> group()' +
        '|> sum()' ;

    return body
}

export const loadMdbList = (range, project) => async dispatch => {
    const mdbList = await Promise.all(project.map(_proj => {
        return agentDaily.Daily.loadAllMdbListForCurrentProject(_proj.id)
            .then(mdb => mdb.items)
    }))
    dispatch(loadAllData(range, project, mdbList))
}

export const loadTotalEnergyConsumption = (range, project, mdbList, type) => dispatch => {
    const queryString = generateQueryString(mdbList, project)
    const body = generateTotalEnergyConsumptionBody(
        queryString, 
        moment("2019-09-01").format('YYYY-MM-DD'), 
        moment(range.endDate).format('YYYY-MM-DD')
    )

    return agentDaily.Lobby.loadTotalEnergyConsumption(body)
        .then(result => {
            dispatch({
                type: LOAD_TOTAL_ENERGY_CONSUMPTION_SUCCESS,
                payload: {
                    result,
                    type
                }
            })
        })
}

export const loadDailyEnergyConsumption = (range, project, mdbList) => dispatch => {
    const queryString = generateQueryString(mdbList, project)

    const body = 
        'from(bucket: "taka-iot-data-energy")' +
        `|> range(start: ${moment(range.startDate).format("YYYY-MM-DDT00:16:00+04:00")}, stop: ${moment(range.endDate).add(1, "day").format("YYYY-MM-DDT00:00:00+04:00")})` +
        `|> filter(fn: (r) => ${queryString.project})` +
        `|> filter(fn: (r) => ${queryString.equip})` +
        '|> filter(fn: (r) => r._measurement == "ENERGY_TDY" or r._measurement == "ENERGY_TOT_TDY" and r._field == "value")' +
        '|> keep(columns: ["_time", "equip", "_value"])' +
        '|> timeShift(duration: 3h, columns: ["_start", "_stop", "_time"])' + 
        '|> timeShift(duration: 44m, columns: ["_start", "_stop", "_time"])' +
        '|> aggregateWindow(every: 15m, timeSrc: "_start", fn: min)' +
        '|> aggregateWindow(every: 1d, timeSrc: "_start", fn: max)' +
        '|> group(columns: ["_time"], mode:"by")' +
        '|> sum()' +
        '|> group()';

    return agentDaily.Lobby.loadDailyEnergyConsumption(body)
        .then(result => {
            if(result !== null) {
                dispatch({
                    type: LOAD_DAILY_ENERGY_CONSUMPTION_SUCCESS,
                    payload: {
                        result
                    }
                })
            }
        })
}

export const loadTotalConsumptionBaseline = (id, start, end) => {
    return agentDaily.Lobby.loadTotalConsumptionBaseline(id, start, end)
        .then(result => result.items[0].value)
}

export const getTotalConsumptionBaseline = (id, start, end) => async dispatch => {
    const together = await Promise.all([
        loadTotalConsumptionBaseline(
            id, 
            moment("2019-09-01").subtract(1, 'year').format('YYYY-MM-DD'),
            moment(end).subtract(1, 'year').format('YYYY-MM-DD')
        ),
        loadTotalConsumptionBaseline(
            id, 
            moment(end).subtract(1, 'year').format('YYYY-MM-DD'), 
            moment(end).subtract(1, 'year').format('YYYY-MM-DD')
        ),
    ])

    dispatch({
        type: LOAD_TOTAL_CONSUMPTION_BASELINE,
        payload: {
            result: {
                all: together[0],
                yesterday: together[1]
            }
        }
    })
}

export const loadDailyConsumptionBaseline = (id, start, end) => dispatch => {
    const newStart = moment(start).subtract(1, 'year').format('YYYY-MM-DD')
    const newEnd = moment(end).subtract(1, 'year').format('YYYY-MM-DD')
    return agentDaily.Lobby.loadDailyConsumptionBaseline(id, newStart, newEnd)
        .then(result => {
            dispatch({
                type: LOAD_DAILY_CONSUMPTION_BASELINE,
                payload: result
            })
        })
}

export const loadDailyForecast = (id, start, end) => dispatch => {
    const newStart = moment(start).subtract(1, 'year').format('YYYY-MM-DD')
    const newEnd = moment(end).subtract(1, 'year').format('YYYY-MM-DD')
    return agentDaily.Lobby.loadDailyForecast(id, newStart, newEnd)
        .then(result => {
            dispatch({
                type: LOAD_DAILY_FORECAST,
                payload: result
            })
        })
}

export const loadCurrentWeather = () => dispatch => {

    return agentDaily.Lobby.loadCurrentWeather()
        .then(result => {
            dispatch({
                type: LOAD_CURRENT_WEATHER_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

// DATE RANGE ACTIONS
export const loadYesterdayTotalConsumption = (endDate, project, mdbList) => dispatch => {
    const startDate = moment(endDate).format("YYYY-MM-DD")
    const stopDate = moment(endDate).add(1, 'day').format("YYYY-MM-DD")

    const queryString = generateQueryString(mdbList, project)
    const body = generateTotalEnergyConsumptionBody(queryString, startDate, stopDate)

    return agentDaily.Lobby.loadTotalEnergyConsumption(body)
        .then(result => {
            dispatch({
                type: LOAD_YESTERDAY_TOTAL_CONSUMPTION_SUCCESS,
                payload: {
                    result
                }
            })
        })
}

// GETTERS
export const getTotalConsumption = (state) => state.lobby && state.lobby.totalEnergyConsumption
export const getDailyConsumption = (state) => state.lobby && state.lobby.dailyEnergyConsumption

export const getTotal = (state) => state.lobby && state.lobby.total
export const getDaily = (state) => state.lobby && state.lobby.daily

export const getSelectedData = (state) => state.lobby && state.lobby.selectedData
export const getCurrentWeather = (state) => state.lobby && state.lobby.currentWeather