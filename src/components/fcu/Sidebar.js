import React from 'react'
import {connect} from 'react-redux'
import {
    Card,
    CardBody,
    Col,
} from 'shards-react';
import { 
    loadAllData,
    loadFcuEquipList,
} from '../../../redux/reducers/fcu'
import EnergyConsPieChart from '../metrics/EnergyConsPieChart'

class Sidebar extends React.Component {
    render() {
        const {
            energyCons,
        } = this.props

        return(
            <Card className="rounded-0">
                <CardBody className="px-0">
                    <Col className="mb-4" md="12">
                        {energyCons && energyCons.trim() !== "" && <EnergyConsPieChart
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
    }),
    (dispatch) => ({
        loadAllData: (startDate, endDate, projectId, project, equip) => 
            dispatch(loadAllData(startDate, endDate, projectId, project, equip)),
        loadFcuEquipList: (start, stop, projectId, project) => dispatch(loadFcuEquipList(start, stop, projectId, project)),
    })
)(Sidebar)