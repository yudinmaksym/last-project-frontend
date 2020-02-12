import React from 'react';
import {
    Col,
    Card,
    CardHeader,
} from 'shards-react'
import colors from '../../utils/colors'

const BuildingEnergyItem = ({title, value, unit}) => {
    return (
        <Col>
            <Card>
                <CardHeader className="d-flex justify-content-center">
                    {title}
                </CardHeader>
                <div className="d-flex justify-content-center">
                    <h3>{value}</h3>
                    <span className="ml-3 h3" style={{color: colors.primary.value}}>{unit}</span>
                </div>
            </Card>
        </Col>
    )
}

BuildingEnergyItem.defaultProps = {
    title: 'Energy',
    value: 0,
    unit: 'kWh',
}

export default BuildingEnergyItem;