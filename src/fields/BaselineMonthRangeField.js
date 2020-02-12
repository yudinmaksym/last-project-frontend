import * as React from 'react'
import moment from 'moment'
import { Field } from 'redux-form'
import {
  Badge,
  DatePicker,
} from 'shards-react'

import DateField from './DateField'



export default class BaselineMonthRangeField extends React.Component {
  
  state = {
    fixedStartMaxDate: moment().subtract(11, 'months').toDate(),
    fixedEndMaxDate: moment().toDate(),

    fixedStartMinDate: moment().subtract(4, 'years').startOf('year').toDate(),
    fixedEndMinDate: moment().subtract(4, 'years').endOf('year').subtract(1, 'months').toDate(),

    maxDate: moment().toDate(),
    minDate: moment().subtract(11, 'months').toDate(),
  }

  setDate = (dates) => {
    const { 
      input: { 
        value: { start, end }, 
        onChange,
      }, 
    } = this.props

    const nextRange = {
      start,
      end,
      ...dates,
    }


    onChange(nextRange)
  }

  handleStartDateChange = (start) => {
    const end = moment(start).add(11, 'months').toDate()
    this.setDate({ start, end })
  }

  handleEndDateChange  = (end) => {
    const start = moment(end).subtract(11, 'months').toDate()
    this.setDate({ start, end })
  }

  render() {
    const {
      input: { value, onChange, onBlur },
      ...rest
    } = this.props

    const {
      fixedStartMinDate,
      fixedEndMinDate,
      fixedStartMaxDate,
      fixedEndMaxDate,
    } = this.state

    const start = new Date(value.start)
    const end =  new Date(value.end)
    
    return (
      <div className="equation-field__date-range">
        {start && <DatePicker
          selectsStart
          selected={start}
          onChange={this.handleStartDateChange}
          selectsStart
          startDate={start}
          endDate={end}
          dateFormat="MMM/yyyy"
          showMonthYearPicker
          minDate={fixedStartMinDate}
          maxDate={fixedStartMaxDate}
        />}
        {' '}
        {end && <DatePicker
          selectsEnd
          selected={end}
          onChange={this.handleEndDateChange}
          selectsEnd
          startDate={start}
          endDate={end}
          dateFormat="MMM/yyyy"
          showMonthYearPicker
          minDate={fixedEndMinDate}
          maxDate={fixedEndMaxDate}
        />}
      </div>
    )
  }
}