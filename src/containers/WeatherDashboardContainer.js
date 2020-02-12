import * as React from 'react'
import { connect } from 'react-redux'
import { Container, Card, CardBody, Row, Col } from 'shards-react'
import {
    loadAllData,

    getDegrees,
    getCityWeather,
    getWeatherHistory
} from '../../redux/reducers/weather'
import {
    formatInfluxData
} from '../utils/format'
import TimelineChart from '../components/metrics/TimelineChart'
import BuildingEnergyItem from '../components/daily/BuildingEnergyItem'
import TopFilter from '../components/weather/TopFilter'
import SyncChart from '../components/metrics/SyncChart'

var moment = require('moment')

class WeatherDashboardContainer extends React.Component {
    componentDidMount() {
        const start = moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD');
        const end = moment().format('YYYY-MM-DD');
        this.props.loadAllData("Dubai", start, end)
    }

    formatDegreesData = (degrees) => {
        let tempData = []
        const data = []
        degrees.map(degree => {
            degree.items.map(el => {
                tempData.push({
                    x: Number(moment(el.timestamp).format('x')),
                    y: el.value
                })
            })
            data.push({
                data: tempData,
                name: degree.topic
            })
            tempData = []
        })

        return data
    }

    formatWeatherHistory = (line) => {
        const filtered = formatInfluxData(line)
        const finalData = []
        const data = []
        let name = ""
        filtered.map(el => {
            const splited = el.split(',');
            data.push({
                x: Number(moment(splited[5]).format('x')),
                y: Number(splited[6])
            })
            name = splited[8]
        })

        finalData.push({
            data: data,
            name: name,
            title: name.split("_").join(" "),
            showInLegend: true,
            turboThreshold: 5000,
        })
        return finalData
    }

    formatSyncChart = (weatherHistory, condition) => {
        let finalData = []
        weatherHistory.map(weather => {
            if(weather.title === condition) {
                finalData = this.formatWeatherHistory(weather.data)
            }
        })

        return finalData
    }



    render() {
        const {degrees, cityWeather, weatherHistory} = this.props
        return (
            <>
                <TopFilter />
                <Container fluid style={{marginTop: 150}}>
                    <Row>
                        <Col lg="12" className="mb-3">
                            <Row>
                                <Col lg="3">
                                    {cityWeather && cityWeather.main && <BuildingEnergyItem 
                                        value={cityWeather.main.temp}
                                        unit={"°C"}
                                        title={"Temp"}
                                    />}
                                </Col>
                                <Col lg="3">
                                    {cityWeather && cityWeather.main && <BuildingEnergyItem 
                                        value={cityWeather.main.humidity}
                                        unit={"%"}
                                        title={"Humidity"}
                                    />}
                                </Col>
                                <Col lg="3">
                                    {cityWeather && cityWeather.wind && <BuildingEnergyItem 
                                        value={cityWeather.wind.speed}
                                        unit={"km/h"}
                                        title={"Wind Speed"}
                                    />}
                                </Col>
                                <Col lg="3">
                                    {cityWeather && cityWeather.clouds && <BuildingEnergyItem 
                                        value={cityWeather.clouds.all}
                                        unit={"%"}
                                        title={"Clouds"}
                                    />}
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="12">
                            <Row>
                                {degrees && degrees.length !== 0 && <Col lg="6" className="mb-3">
                                    <TimelineChart 
                                        data={this.formatDegreesData(degrees)} 
                                        title={"Degrees days"}
                                    />
                                </Col>}  
                                <Col lg="6" className="mb-3">
                                    <SyncChart 
                                        data={this.formatSyncChart(weatherHistory, "Temperature")}
                                        title={"TEMPERATURE"}
                                        sync={this.formatSyncChart(weatherHistory, "Humidity")}
                                        syncTitle={"HUMIDITY"}
                                    />
                                </Col>
                                {weatherHistory && weatherHistory.length !== 0 && 
                                    weatherHistory.map((weather,index) => {
                                        if(weather.title !== "Temperature" && weather.title !== "Humidity") {
                                            return <Col lg="6" className="mb-3" key={index}>
                                                <TimelineChart  
                                                    data={this.formatWeatherHistory(weather.data)} 
                                                    title={weather.title}
                                                />
                                            </Col>
                                        }
                                    })    
                                }
                            </Row>
                        </Col>
                    </Row>  
                </Container> 
            </>
        )
    }
}

export default connect(
    (state) => ({
        degrees: getDegrees(state),
        cityWeather: getCityWeather(state),
        weatherHistory: getWeatherHistory(state),
    }),
    (dispatch) => ({
        loadAllData: (city, start, end) => dispatch(loadAllData(city, start, end))
    })
)(WeatherDashboardContainer)