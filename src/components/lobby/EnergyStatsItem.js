import React from 'react'
import { Col } from 'shards-react' 

const EnergyStatsItem = ({title, value}) => {
    return(
        <Col>
            <h5 className="mb-1 lobby_stats-item_title">{title}</h5>
            <h1 className="mb-0 lobby_stats-item_desc"><b>{value}</b></h1>
        </Col>
    )
}

export default EnergyStatsItem