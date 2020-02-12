import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'shards-react' 
import EnergyStatsItem from './EnergyStatsItem'
import { 
    getCurrentWeather,
    getTotal
} from '../../../redux/reducers/lobby'
import {
    formatInfluxData
} from '../../utils/format'
import Temp from '../../images/lobby-dashboard/temp.svg'
import Rain from '../../images/lobby-dashboard/rain.svg'
import Humidity from '../../images/lobby-dashboard/humidity.svg'
import Wind from '../../images/lobby-dashboard/send.svg'


var moment = require("moment")

class SidebarStats extends React.Component {

    formatEnergySavings = (day) => {
        // props.day = all, yesterday, today
        
        const { total } = this.props
        if(total.energyConsumption[day].trim() !== "") {
            var filtered = formatInfluxData(total.energyConsumption[day])

            let totalEnergyFilteredData = [];
            filtered.forEach((el) => {
                if(el[0] !== "") {
                    const splited = el.split(',');
                    totalEnergyFilteredData.push({
                        value: Number(splited[3])
                    })
                }
            })

            let energySavings = 0

            total.baseline.forEach(_base => {
                energySavings += Number(_base[day].toFixed(0))
            })
            energySavings = energySavings - totalEnergyFilteredData[0].value

            return Number(energySavings.toFixed(0))
        }
        
    }

    render() {
        const {
            total,
            currentWeather
        } = this.props

        return (
            <div>
                <div className="lobby_stats-item px-4">
                    <h1 className="text-center lobby_stats-item_title mb-4"><b>{moment().format("MMMM DD, YYYY")}</b></h1>
                    <Row>
                        <Col>
                            <div className="d-flex align-items-center mb-3">
                                <div className="lobby_stats-item_icon-block">
                                    <img src={Temp} alt="temperature" title="" width="50" />
                                </div>
                                {currentWeather && currentWeather.main && currentWeather.main.temp &&
                                    <h1 className="lobby_stats-item_desc weather-value mb-0">{currentWeather.main.temp.toFixed(1) + ' °C'}</h1>
                                }
                            </div>
                        </Col>
                        <Col>
                            <div className="d-flex align-items-center mb-3">
                                <div className="lobby_stats-item_icon-block">
                                    <img src={Rain} alt="temperature" title="" width="50" />
                                </div>
                                {currentWeather &&
                                    <h1 className="lobby_stats-item_desc weather-value mb-0">{currentWeather.clouds.all + " %"}</h1>
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="d-flex align-items-center mb-3">
                                <div className="lobby_stats-item_icon-block">
                                    <img src={Humidity} alt="temperature" title="" width="50" />
                                </div>
                                {currentWeather && currentWeather.main && currentWeather.main.humidity &&
                                    <h1 className="lobby_stats-item_desc weather-value mb-0">{currentWeather.main.humidity + ' %'}</h1>
                                }
                            </div>
                        </Col>
                        <Col>
                            <div className="d-flex align-items-center mb-3">
                                <div className="lobby_stats-item_icon-block">
                                    <img src={Wind} alt="temperature" title="" width="50" />
                                </div>
                                {currentWeather && currentWeather.wind && currentWeather.wind.speed &&
                                    <h1 className="lobby_stats-item_desc weather-value mb-0">{currentWeather.wind.speed + '  km/h'}</h1>
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
                <div>
                    <Row className="lobby_stats-item mx-0" style={{marginBottom: 23, paddingTop: 39, paddingBottom: 39}}>
                        <Col className="text-center">
                            {total && total.energyConsumption && total.energyConsumption.all && total.baseline.length !== 0 &&
                                <EnergyStatsItem 
                                    title="Total Savings (AED)"
                                    value={(this.formatEnergySavings("all") * 0.38).toLocaleString("en")}
                                />
                            }
                        </Col>
                    </Row>
                    <Row className="mx-0">
                        <Col className="text-center lobby_stats-item mr-2 mb-0" style={{paddingTop: 39, paddingBottom: 39}}>
                            {total && total.energyConsumption 
                            && total.energyConsumption.yesterday 
                            && total.baseline.length !== 0 
                            &&
                                <EnergyStatsItem 
                                    title="Yesterday's Savings (kWh)"
                                    value={(this.formatEnergySavings("yesterday")).toLocaleString("en")}
                                />
                            }
                        </Col>
                        <Col className="text-center lobby_stats-item ml-2 mb-0" style={{paddingTop: 39, paddingBottom: 39}}>
                        {total && total.energyConsumption 
                        && total.energyConsumption.yesterday 
                        && total.baseline.length !== 0 
                        &&
                                <EnergyStatsItem 
                                    title="Yesterday's Savings (AED)"
                                    value={(this.formatEnergySavings("yesterday") * 0.38).toLocaleString("en")}
                                />
                            }
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        total: getTotal(state),
        currentWeather: getCurrentWeather(state),
    }),
    (dispatch) => ({
    })
)(SidebarStats);