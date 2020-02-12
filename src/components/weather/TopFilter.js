import React from 'react'
import {
    Row,
    Col,
    Container,
} from 'shards-react';
import {connect} from 'react-redux';
import {
    loadAllData,
} from '../../../redux/reducers/weather'
import DatePicker from '../daily/General/DatePicker'

var moment = require('moment');

class TopFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            city: "Dubai",
        }
    }
        
    handleChangeCity = (event) => {
        const {startDate, endDate} = this.state
        const city = event.target.value
        this.props.loadAllData(city, startDate, endDate)
        this.setState({city: city})
    }

    handleDateRange = (startDate, endDate) => {
        this.props.loadAllData(this.state.city, startDate, endDate)

        this.setState({
            startDate: startDate,
            endDate: endDate,
        })
    }

    render() {
        return(
            <Container className="filterBar">
                <Row className="pl-3">
                    <h3>Weather Dashboard</h3>
                </Row>
                <Row className="pb-3 pt-2 row">
                    <Col lg="2">
                        <p className="mb-1"><small>City</small></p>
                        <select 
                            className="form-control my-0"
                            onChange={e => this.handleChangeCity(e)}
                        >
                            {["Dubai", "Abu Dhabi", "Sharjah"].map((el,index) => {
                                return <option value={el} key={index}>{el}</option>
                            })}
                        </select>
                    </Col>
                    <Col lg="2">
                        <DatePicker 
                            label={"Date Range"}
                            onApply={(startDate, endDate) => 
                                    this.handleDateRange(moment(startDate).format("YYYY-MM-DD"), moment(endDate).format("YYYY-MM-DD"))
                            } 
                        >
                            <input 
                                type="text" 
                                value={`${this.state.startDate} / ${this.state.endDate}`} 
                                className="daily_pick-date-input my-0" 
                                readOnly={true} 
                            />
                        </DatePicker>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default connect(
    (state) => ({
    }),
    (dispatch) => ({
        loadAllData: (city, start, end) => dispatch(loadAllData(city, start, end))
    })
)(TopFilter)