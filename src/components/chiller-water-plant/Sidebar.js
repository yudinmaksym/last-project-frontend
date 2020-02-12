import React from 'react'
import {connect} from 'react-redux'
import {
    Card,
    CardBody,
    Col,
} from 'shards-react';
import { 
    getEnergyCons,
    getSelectedData,
} from '../../../redux/reducers/chilledWaterPlant'
import EnergyConsPieChart from '../metrics/EnergyConsPieChart'

class Sidebar extends React.Component {

    formatEnergyConsumptionDist = (energyCons) => {
        const finalData = []
        energyCons.map(energy => {
            const filtered = this.props.formatInfluxData(energy)
            filtered.forEach(el => {
                const splited = el.split(',')
                finalData.push({
                    name: splited[3],
                    y: Number(Number(splited[6]).toFixed(2))
                })
            })
        })

        return finalData
    }

    render() {
        const {
            energyCons,
        } = this.props
        return(
            <Col className="mb-4" md="12">
                {energyCons && energyCons.length !==0 && <EnergyConsPieChart
                    title={"ENERGY CONSUMPTION DISTRIBUTION"}
                    data={this.formatEnergyConsumptionDist(energyCons)}
                />}
            </Col>
        )
    }
}

export default connect(
    (state) => ({
        energyCons: getEnergyCons(state),
        selectedData: getSelectedData(state),
    }),
    (dispatch) => ({
    })
)(Sidebar)