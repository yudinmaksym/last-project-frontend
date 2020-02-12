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
} from '../../../redux/reducers/chiller'
import {
    formatInfluxData,
} from '../../utils/format'
import EnergyConsPieChart from '../metrics/EnergyConsPieChart'

class Sidebar extends React.Component {

    formatEnergyConsumptionDist = (energyCons) => {
        const {selectedData} = this.props
        const filtered = formatInfluxData(energyCons)
        const finalData = []
        filtered.forEach(el => {
            const splited = el.split(',')
            if(selectedData.tower) {
                finalData.push({
                    name: `${splited[3] + '-' + splited[4]}`,
                    y: Number(Number(splited[7]).toFixed(2))
                })
            } else {
                finalData.push({
                    name: `${splited[3]}`,
                    y: Number(Number(splited[6]).toFixed(2))
                })
            }
            
        })

        return finalData
    }

    render() {
        const {
            energyCons,
        } = this.props

        return(
            <Card className="rounded-0">
                <CardBody className="px-0">
                    <Col className="mb-4" md="12">
                        {energyCons && energyCons.trim() !== "" && <EnergyConsPieChart
                            title={"ENERGY CONSUMPTION DISTRIBUTION"}
                            data={this.formatEnergyConsumptionDist(this.props.energyCons)}
                        />}
                    </Col>
                </CardBody>
            </Card>
        )
    }
}

export default connect(
    (state) => ({
        selectedData: getSelectedData(state),
        energyCons: getEnergyCons(state),
    }),
    (dispatch) => ({
    })
)(Sidebar)