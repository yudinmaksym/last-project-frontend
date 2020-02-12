import React from 'react'
import {connect} from 'react-redux'
import {
    Row,
    Col,
} from 'shards-react';
import TimelineChart from '../metrics/TimelineChart'
import StackedBarChart from '../metrics/StackedBarChart'
import RunSTSChart from '../metrics/RunSTSChart'
import { 
    getTranscoZone, 
    getRoomTemp,
    getSts,
    getSelectedData,
} from '../../../redux/reducers/fcu';
import {
    formatSTSSeries
} from '../../utils/format'

var moment = require('moment')

class FcuCharts extends React.Component {

    formatTimeLineSeries = (line) => {
        const filtered = this.props.formatInfluxData(line)
        const structuredData = this.props.splitDataForLinechart(filtered)

        return structuredData
    }

    formatSTSSeries = (sts) => {
        const {selectedData} = this.props

        const filtered = this.props.formatInfluxData(sts)
        const structuredData = this.props.splitStsDataToArrays(filtered)
        
        return formatSTSSeries(structuredData, selectedData.endDate)
    }

    formatSTSCategories = () => {
        const {sts} = this.props

        const filtered = this.props.formatInfluxData(sts)
        const structuredData = this.props.splitStsDataToArrays(filtered)

        const categories = []

        structuredData.map(el => {
            categories.push(el[0].meter)
        })

        return categories
    }

    render() {
        const {
            transcoZone,
            roomTemp,
            sts
        } = this.props
        return (
            <Row>
                {transcoZone && transcoZone.trim() !== "" && <Col lg="6" className="mb-4">
                    <TimelineChart 
                        title={"ZONE TEMPERATURE (°C)"}
                        data={this.formatTimeLineSeries(transcoZone)}
                    />
                </Col>}
                {roomTemp && roomTemp.trim() !== "" && <Col lg="6" className="mb-4">
                    <TimelineChart 
                        title={"CHW VALVE POSITION (%)"}
                        data={this.formatTimeLineSeries(roomTemp)}
                    />
                </Col>}
                {sts && sts.trim() !== "" && <Col lg="6" className="mb-4">
                    <RunSTSChart 
                        title={"RUN STATUS (Run/Off)"}
                        categories={this.formatSTSCategories()}
                        data={this.formatSTSSeries(sts)}
                    />
                </Col>}
            </Row>
        )
    }
}

export default connect(
    (state) => ({
        transcoZone: getTranscoZone(state),
        roomTemp: getRoomTemp(state),
        sts: getSts(state),
        selectedData: getSelectedData(state)
    }),
    (dispatch) => ({

    })
)(FcuCharts)