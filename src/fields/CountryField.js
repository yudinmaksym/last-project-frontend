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
import { CountryDropdown } from 'react-country-region-selector'
 

export default class CountryField extends React.Component {

  handleCountryChange = (country) => {
    if (country === '') {
      country = null
    }

    this.props.input.onChange(country)

    window.requestAnimationFrame(() => {
      this.props.input.onBlur(country)
    })
  }

  handleBlur = () => {
    this.props.input.onBlur(this.props.input.value)
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
      meta: { touched, valid, invalid, error },
      ...rest
    } = this.props

    return (
      <FormGroup>
        <label htmlFor={name}>{label}</label>
        <CountryDropdown
          {...rest}
          {...inputRest}
          id={name}
          value={value}
          classes={cn(className, 
            'form-control',
            'custom-select',
            {
              'is-valid': touched && valid, 
              'is-invalid': touched && invalid,
            })
          }
          onChange={this.handleCountryChange} 
          onBlur={this.handleBlur}
          priorityOptions={['AE']}
        />
        <FormFeedback 
          valid={valid}
        >{error}</FormFeedback>
      </FormGroup>
    )
  }
}