import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Container, Row, Col } from 'shards-react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import SyncChart from '../components/metrics/SyncChart'
import DatePicker from '../components/daily/General/DatePicker'
import {
    formatInfluxData
} from '../utils/format'
import {
    getPumpTemp,
    getTemperature,
    getWindSpeed,

    loadAllData,
    getWaterInlet,
    getWaterOutlet,
} from '../../redux/reducers/poolDashboard'
import HighChart from '../utils/highCharts'

class PoolDashboardContainer extends React.Component {
    state = {
        startDate: moment().subtract(1, 'months').endOf('month').format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
    }
    componentDidMount() {
        const { startDate, endDate } = this.state
        this.props.loadAllData(startDate, endDate)
    }

    handleDateRange = (startDate, endDate) => {
        this.props.loadAllData(startDate, endDate)
        this.setState({
            startDate: startDate,
            endDate: endDate,
        })
    }

    formatWeather = (line) => {
        const filtered = formatInfluxData(line)
        const finalData = []
        const data = []
        let name = ""
        filtered.map(el => {
            const splited = el.split(',');
            data.push({
                x: Number(moment(splited[10], "YYYY-MM-DDTHH:mm:ssZ").format('x')),
                y: +Number(splited[9]).toFixed(2)
            })
            name = splited[6]
        })

        finalData.push({
            data: data,
            name: name,
            title: name,
            showInLegend: true,
            turboThreshold: 5000,
        })

        return finalData
    }

    formatPumpAndTemp = (dataArray) => {
        const filtered = formatInfluxData(dataArray[0])
        const finalData = []
        const data = []
        let name = ""
        filtered.map(el => {
            const splited = el.split(',');
            data.push({
                x: Number(moment(splited[7], "YYYY-MM-DDTHH:mm:ssZ").format('x')),
                y: +Number(splited[6]).toFixed(2)
            })
            name = splited[3]
        })

        finalData.push({
            data: data,
            name: name,
            title: name,
            showInLegend: true,
            turboThreshold: 5000,
        })

        if (dataArray[1]) {
            const temperature = this.formatWeather(dataArray[1])
            finalData.push({
                data: temperature[0].data,
                name: temperature[0].name,
                title: temperature[0].name,
                showInLegend: true,
                turboThreshold: 5000,
            })
        }

        return finalData
    }

    formatPumpTemp = (line) => {
        const filtered = formatInfluxData(line)
        const finalData = []
        const data = []
        let name = ""
        filtered.map(el => {
            const splited = el.split(',');
            data.push({
                x: Number(moment(splited[7], "YYYY-MM-DDTHH:mm:ssZ").format('x')),
                y: +Number(splited[6]).toFixed(2)
            })
            name = splited[3]
        })

        finalData.push({
            data: data,
            name: name,
            title: name,
            showInLegend: true,
            turboThreshold: 5000,
        })

        return finalData
    }

    options(data, title, formatFunc, height = 200) {
        let options = {
            chart: {
                height: height,
                type: 'line',
                marginLeft: 50
            },
            yAxis: {
                title: {
                    text: '',
                },
            },
            title: {
                text: title,
                align: 'left'
            },
            legend: {
                layout: 'horizontal',
                align: 'left',
                verticalAlign: 'top',
                itemStyle: { "fontSize": "14px", "fontWeight": "500" }
            },
            xAxis: [{
                type: 'datetime',
                events: {
                    setExtremes: function (e) {
                        Highcharts.syncExtremes(e);
                    }
                }
            }],
            series: formatFunc(data),
        }

        const hightChart = new HighChart(options)

        return hightChart.initOptions()
    }

    render() {
        const { title, pumpTemp, waterOutlet, waterInlet, temperature, windspeed } = this.props
        return (
            <Container fluid>
                <h1>{title}</h1>
                <Row className="mb-4">
                    <Col lg="2">
                        <DatePicker
                            label={"Date Range"}
                            onApply={(startDate, endDate) =>
                                this.handleDateRange(moment(startDate).format("YYYY-MM-DD"), moment(endDate).format("YYYY-MM-DD"))
                            }
                        >
                            <input
                                type="text"
                                value={`${this.state.startDate} / ${this.state.endDate}`}
                                className="daily_pick-date-input my-0"
                                readOnly={true}
                            />
                        </DatePicker>
                    </Col>
                </Row>
                <SyncChart>
                    {waterInlet
                        && temperature
                        && <HighchartsReact
                            constructorType={"chart"}
                            highcharts={Highcharts}
                            options={this.options([waterInlet, temperature], "WATER INLET TEMPERATURE (°C)", this.formatPumpAndTemp, 400)}
                        />
                    }
                    {waterOutlet
                        && <HighchartsReact
                            constructorType={"chart"}
                            highcharts={Highcharts}
                            options={this.options(waterOutlet, "WATER OUTLET TEMPERATURE (°C)", this.formatPumpTemp)}
                        />
                    }
                    {pumpTemp
                        && <HighchartsReact
                            constructorType={"chart"}
                            highcharts={Highcharts}
                            options={this.options(pumpTemp, "POOL WATER TEMPERATURE (°C)", this.formatPumpTemp)}
                        />
                    }
                    {windspeed
                        && <HighchartsReact
                            constructorType={"chart"}
                            highcharts={Highcharts}
                            options={this.options(windspeed, "WIND SPEED (m/s)", this.formatWeather)}
                        />
                    }
                </SyncChart>
            </Container>
        )
    }
}

export default connect(
    (state) => ({
        pumpTemp: getPumpTemp(state),
        waterInlet: getWaterInlet(state),
        waterOutlet: getWaterOutlet(state),
        temperature: getTemperature(state),
        windspeed: getWindSpeed(state),
    }),
    (dispatch) => ({
        loadAllData: (start, end) => dispatch(loadAllData(start, end))
    })
)(PoolDashboardContainer)