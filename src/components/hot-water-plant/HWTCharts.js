import React from 'react'
import {connect} from 'react-redux'
import { Row, Col } from 'shards-react' 
import {
    getTemperature, 
    getCndTemp, 
    getEvpTemp, 
    getLoadTemp, 
    getMeterTemp, 
    getOtherTemp,
} from '../../../redux/reducers/hotWaterPlant'

import TimelineChart from '../metrics/TimelineChart'

class CWPCharts extends React.Component {

    formatTimeLineSeries = (line) => {
        const filtered = this.props.formatInfluxData(line)
        const structuredData = this.props.splitDataOnArrays(filtered)

        return structuredData
    }

    render() {
        const {
            temperature,
            cndTemp,
            evpTemp,
            loadTemp,
            meterTemp,
            otherTemp,
        } = this.props

        return (
            <Row className="mt-3">
                {temperature && temperature.trim() !=="" && <Col lg="6" className="mb-4">
                    <TimelineChart 
                        data={this.formatTimeLineSeries(temperature)}
                        title={"HWP Temperatures"}
                    />
                </Col>}  
                {cndTemp && cndTemp.trim() !=="" && <Col lg="6" className="mb-4">
                    <TimelineChart 
                        data={this.formatTimeLineSeries(cndTemp)}
                        title={"CND Temperatures"}
                    />
                </Col>}
                {evpTemp && evpTemp.trim() !=="" && <Col lg="6" className="mb-4">
                    <TimelineChart 
                        data={this.formatTimeLineSeries(evpTemp)}
                        title={"EVP Temperatures"}
                    />
                </Col>}
                {loadTemp && loadTemp.trim() !=="" && <Col lg="6" className="mb-4">
                    <TimelineChart 
                        data={this.formatTimeLineSeries(loadTemp)}
                        title={"LOAD Temperatures"}
                    />
                </Col>}
                {meterTemp && meterTemp.trim() !=="" && <Col lg="6" className="mb-4">
                    <TimelineChart 
                        data={this.formatTimeLineSeries(meterTemp)}
                        title={"Meter Temperatures"}
                    />
                </Col>}
                {otherTemp && otherTemp.trim() !=="" && <Col lg="6" className="mb-4">
                    <TimelineChart 
                        data={this.formatTimeLineSeries(otherTemp)}
                        title={"Other Temperatures"}
                    />
                </Col>}
            </Row>
        )
    }
}



export default connect(
    (state) => ({
        temperature: getTemperature(state),
        cndTemp: getCndTemp(state),
        evpTemp: getEvpTemp(state),
        loadTemp: getLoadTemp(state),
        meterTemp: getMeterTemp(state),
        otherTemp: getOtherTemp(state),
    }),
    (dispatch) => ({
    })
)(CWPCharts);