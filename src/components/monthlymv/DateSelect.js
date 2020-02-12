import * as React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { FormSelect } from 'shards-react'

import AdvancedSelect from '../common/AdvancedSelect'
import {
  getProjectsByZone,
} from '../../../redux/reducers/projects'


class DateSelect extends React.Component {

  static defaultProps = {
    value: moment(),
    minYear: moment().year() - 5,
    maxYear: moment().year(),
  }

  getMonthValue = () => moment(this.props.value).format('MMM')
  
  getYearValue = () => +moment(this.props.value).format('YYYY')

  handlePrevYear = () => {
    const nextDate = moment(this.props.value).subtract('1', 'year')

    this.handleChange(nextDate)
  }

  handleNextYear = () => {
    const nextDate = moment(this.props.value).add('1', 'year')

    this.handleChange(nextDate)
  }

  handlePrevMonth = () => {
    const nextDate = moment(this.props.value).subtract('1', 'month')

    this.handleChange(nextDate)
  }

  handleNextMonth = () => {
    const nextDate = moment(this.props.value).add('1', 'month')

    this.handleChange(nextDate)
  }

  handleChange = (val) => {
    const { minYear, maxYear } = this.props
    const nextYear = val.year()
    
    if (nextYear >= minYear && nextYear <= maxYear) {
      this.props.onChange(val)
    }
  }

  handleYearSelectChange = (e) => {
    const year = e.target.value
    const nextValue = moment(this.props.value).year(year)

    this.handleChange(nextValue)
  }

  handleMonthSelectChange = (e) => {
    const month = e.target.value
    const nextValue = moment(this.props.value).month(month)

    this.handleChange(nextValue)
  }

  renderYearSelect = () => {
    const years = []
    for (let _year=this.props.minYear;_year<=this.props.maxYear; _year++) {
      years.push(_year)
    }

    const selectedYear = this.getYearValue()

    return (
      <FormSelect onChange={this.handleYearSelectChange} className="date-selector__value">
        {years.map(year => 
          <option value={year} key={year} selected={year === selectedYear}>
            {year}
          </option>  
        )}
      </FormSelect>
    )
  }
  
  renderMonthSelect = () => {
    const months = moment.monthsShort()
    const selectedMonth = this.getMonthValue()

    return (
      <FormSelect onChange={this.handleMonthSelectChange} className="date-selector__value">
        {months.map(month => 
          <option value={month} key={month} selected={month === selectedMonth}>
            {month}
          </option>  
        )}
      </FormSelect>
    )
  }
  

  render() {
    return (
      <div
        className="month-year-selector"
      >
        <div 
          className="date-selector month-selector"
        >
          <button 
            type="button" 
            className="date-selector__prev"
            onClick={this.handlePrevMonth}
          >
            Previous Month
          </button>
          {this.renderMonthSelect()}
          <button 
            type="button" 
            className="date-selector__next"
            onClick={this.handleNextMonth}
          >
            Next Month
          </button>
        </div>
        <div 
          className="date-selector year-selector"
        >
          <button
            type="button" 
            className="date-selector__prev"
            onClick={this.handlePrevYear}
          >
            Previous Year
          </button>
          {this.renderYearSelect()}
          <button
            type="button" 
            className="date-selector__next"
            onClick={this.handleNextYear}
          >
            Next Year
          </button>
        </div>
      </div>
    )	
  }

}

export default connect(
  state => ({
    
  })
)(DateSelect)