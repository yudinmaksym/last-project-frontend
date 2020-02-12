import React from 'react'
import {connect} from 'react-redux'
import {
    Card,
    CardBody,
    Col,
} from 'shards-react';
import {
    getSelectedData,
} from '../../../redux/reducers/fahu'
import EnergyConsPieChart from '../metrics/EnergyConsPieChart'

class Sidebar extends React.Component {

    formatEnergyConsumptionDist = (energyCons) => {
        const {selectedData} = this.props
        const filtered = this.props.formatInfluxData(energyCons)
        const finalData = []
        let other = 0
        filtered.forEach((el,index) => {
            const splited = el.split(',')
            if(index >= 10) {
                other += Number(Number(splited[6]).toFixed(0))
            } else {
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
            }
        })

        if(other !== 0) {
            finalData.push({
                name: `Other`,
                y: other
            })
        }

        return finalData
    }

    render() {
        return(
            <Card className="rounded-0">
                <CardBody className="px-0">
                    <Col className="mb-4" md="12">
                        {this.props.energyCons && this.props.energyCons.trim() !== "" && <EnergyConsPieChart
                            title={"Energy Consumption Distribution"}
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
    }),
    (dispatch) => ({
    })
)(Sidebar)