import React from 'react'

const MetricItem = ({value, img, description, children}) => {
    return(
        <div className="d-flex align-items-start">
            <div className="lobby_stats-item_icon-block">
                <img src={img} alt={description} height="45" />
            </div>
            <div className="ml-2">
                <h4 className="lobby_stats-item_desc mb-1">{value}</h4>
                {children}
            </div>
        </div>
    )
}

export default MetricItem