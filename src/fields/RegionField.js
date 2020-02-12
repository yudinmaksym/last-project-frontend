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
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector'
 


const valToDate = (val) => val ? moment(val).toDate() : undefined 

export default class CountryField extends React.Component {

  handleRegionChange = (region) => {
    if (region === '') {
      region = null
    }

    this.props.input.onChange(region)
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
      country,
      ...rest
    } = this.props

    return (
      <FormGroup>
        <label htmlFor={name}>{label}</label>
        <RegionDropdown
          {...rest}
          {...inputRest}
          country={country}
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
          onChange={this.handleRegionChange} 
          onBlur={this.handleBlur}
          disableWhenEmpty
        />
        <FormFeedback 
          valid={valid}
        >{error}</FormFeedback>
      </FormGroup>
    )
  }
}