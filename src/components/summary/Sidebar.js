import React from 'react'
import {connect} from 'react-redux'
import {
    getEnergyConsDist,
    getTotalyEnergy,
} from '../../../redux/reducers/summary'
import {
    formatInfluxData
} from '../../utils/format'
import EnergyConsPieChart from '../metrics/EnergyConsPieChart'

class Sidebar extends React.Component {

    formatEnergyConsumptionDist = (energyCons, energyTotal) => {
        const eCons = formatInfluxData(energyCons)
        const eTotal = formatInfluxData(energyTotal)
        const finalData = []
        let equipSum = 0

        eCons.forEach(el => {
            const splited = el.split(',')
            finalData.push({
                name: `${splited[3]}`,
                y: +(Number(splited[6]).toFixed(2))
            })
            equipSum += +(Number(splited[6]).toFixed(2))
        })
        finalData.push({
            name: "Other",
            y: +(+(eTotal[0].split(',')[4]) - equipSum).toFixed(2)
        })

        return finalData
    }

    render() {
        const {energyTotal, energyConsDist} = this.props
        return(
            <> 
                <EnergyConsPieChart
                    title={"ENERGY CONSUMPTION DISTRIBUTION"}
                    data={this.formatEnergyConsumptionDist(energyConsDist, energyTotal)}
                />
            </>
        )
    }
}

export default connect(
    (state) => ({
        energyTotal: getTotalyEnergy(state),
        energyConsDist: getEnergyConsDist(state),
    }),
    (dispatch) => ({
    })
)(Sidebar)