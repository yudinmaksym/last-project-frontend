import React from 'react'
import { connect } from 'react-redux'
import MetricItem from './MetricItem'
import Emission from '../../images/lobby-dashboard/emission.svg'
import Car from '../../images/lobby-dashboard/car.png'
import Galon from '../../images/lobby-dashboard/galon.png'
import Smart from '../../images/lobby-dashboard/oil.svg'
import Year from '../../images/lobby-dashboard/year.png'
import {
    formatInfluxData
} from '../../utils/format'
import { 
    getTotal
} from '../../../redux/reducers/lobby'

class TopStats extends React.Component {

    formatEnergySavings = () => {
        const { total } = this.props

        if(total.energyConsumption.all.trim() !== "") {
            var filtered = formatInfluxData(total.energyConsumption.all)
        
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
                energySavings += Number(_base.all.toFixed(0))
            })
            energySavings = energySavings - totalEnergyFilteredData[0].value

            return(Number(energySavings))
        }
        
    }

    formatEmissionsFactor = () => {
        const energySavings = this.formatEnergySavings()
        const metricTons = 0.000707 // 1,559 lbs CO2/MWh × (4.536 × 10-4 metric tons/lb) × 0.001 MWh/kWh = 7.07 × 10-4 metric tons CO2/kWh

        const emission = energySavings * metricTons

        return Number(emission.toFixed(0))
    }

    formatLitersGasolineConsumed = () => {
        const emission = this.formatEmissionsFactor()
        const galon = 3.785411 //1 gal = 3.785literes
        const co2PerGallonOfGasoline = 0.008887 //8,887 grams of CO2/gallon of gasoline = 8.887 × 10-3 metric tons CO2/gallon of gasoline

        const litersGasolineConsumed = (emission * galon)/co2PerGallonOfGasoline

        return Number(litersGasolineConsumed.toFixed(0))
    }

    formatMilesDrivenAverageVehicle = () => {
        const emission = this.formatEmissionsFactor()
        const co2PerMile = 0.000409 //8.89 × 10-3 metric tons CO2/gallon gasoline × 1/22.0 
                                    //miles per gallon car/truck average × 1 CO2, CH4, and N2O/0.988 CO2 = 4.09 x 10-4 metric tons CO2E/mile
        const mileDriven = emission/co2PerMile

        return Number(mileDriven.toFixed(0))
    }

    formatBarrelsOfOil = () => {
        const emission = this.formatEmissionsFactor()
        const co2PerBarrel = 0.43 //5.80 mmbtu/barrel × 20.31 kg C/mmbtu × 44 kg CO2/12 kg C × 1 metric ton/1,000 kg = 0.43 metric tons CO2/barrel

        const barrelsOfOil = emission/co2PerBarrel

        return Number(barrelsOfOil.toFixed(0))
    }

    formatAverageHomesEnergyForYear = () => {
        const emission = this.formatEmissionsFactor()
        const co2PerHome = 5.734 //11,764 kWh per home × 998.4 lbs CO2 per megawatt-hour generated 
                                 //× 1/(1-0.071) MWh delivered/MWh generated × 1 MWh/1,000 kWh × 1 metric ton/2,204.6 lb = 5.734 metric tons CO2/home.

        const averageHomesEnergy = emission/co2PerHome

        return Number(averageHomesEnergy.toFixed(0))
    }

    render() {

        const {
            total
        } = this.props

        return(
            <div className="pt-2 top-stats">
                <h2 className="mt-4 text-center lobby_stats-item_desc"><b>Greenhouse gas & CO2 equivalent</b></h2>
                <div className="mt-5 pb-4 d-flex justify-content-around">
                    {total.energyConsumption && total.energyConsumption.all && total.baseline.length !== 0 && 
                        <>
                            <MetricItem 
                                value={this.formatEmissionsFactor().toLocaleString('en')}
                                img={Emission}
                            > 
                                <p className="lobby_stats-item_desc mb-0"><b>Metric Tons CO2 Emissions</b></p>
                            </MetricItem>

                            <MetricItem 
                                value={this.formatLitersGasolineConsumed().toLocaleString('en')}
                                img={Galon}
                            >
                                <p className="lobby_stats-item_desc mb-0"><b>Liters of Gasoline <br />Consumed</b></p>
                            </MetricItem>

                            <MetricItem 
                                value={this.formatMilesDrivenAverageVehicle().toLocaleString('en')}
                                img={Car}
                            >
                                <p className="lobby_stats-item_desc mb-0"><b>Miles Driven by the Average <br />Passenger Vehicle</b></p>
                            </MetricItem>

                            <MetricItem 
                                value={this.formatBarrelsOfOil().toLocaleString('en')}
                                img={Smart}
                            >
                                <p className="lobby_stats-item_desc mb-0"><b>Barrels of Oil</b></p>
                            </MetricItem>

                            <MetricItem 
                                value={this.formatAverageHomesEnergyForYear().toLocaleString('en')}
                                img={Year}
                            >
                                <p className="lobby_stats-item_desc mb-0"><b>Home Electricity <br />for a One Year</b></p>
                            </MetricItem>
                        </>
                    }
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        total: getTotal(state),
    }),
    (dispatch) => ({
    })
)(TopStats);