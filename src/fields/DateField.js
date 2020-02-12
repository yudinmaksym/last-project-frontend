import * as React from 'react'
import cn from 'classnames'
import moment from 'moment'
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  CardBody,
  FormGroup,
  FormInput,
  FormFeedback,
  DatePicker,
} from 'shards-react'


const valToDate = (val) => { 
  const date = moment(val)

  return date.isValid() ? date.toDate() : undefined
}

export default class DateField extends React.Component {

  static defaultProps = {
    dateFormat: 'yyyy-MM-dd',
    format: 'YYYY-MM-DD',
  }

  state = {
    date: valToDate(this.props.input.value),
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.input.value !== this.props.input.value) {
      const date = valToDate(nextProps.input.value)
      this.setState({ date })
    }
  }

  handleDateChange = (date) => {
    const nextDate = moment(date).format(this.props.format)
    this.props.input.onChange(nextDate)
  }

  render() {
    const {
      input: {
        name,
        onChange,
        onBlur,
        value,
        ...inputRest
      },
      className,
      label,
      meta: { valid, invalid, error },
      dateFormat,
      showMonthYearPicker,
      ...rest
    } = this.props

    return (
      <FormGroup>
        {label && <label htmlFor={name}>{label}</label>}
        <DatePicker
          id={name}
          {...rest}
          {...inputRest}
          selected={this.state.date}
          onChange={this.handleDateChange}
          placeholderText={label}
          dropdownMode="select"
          className={cn(className, {
            'is-valid': valid, 
            'is-invalid': invalid,
          })}
          dateFormat={dateFormat}
          autoComplete={'off'}
          showMonthYearPicker={showMonthYearPicker}
        />
        <FormFeedback 
          valid={valid}
        >{error}</FormFeedback>
      </FormGroup>
    )
  }
}