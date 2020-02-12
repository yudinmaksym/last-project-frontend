import * as React from 'react'
import cn from 'classnames'
import {
  FormInput,
} from 'shards-react'

import { formatNegativeNumber, formatPercent } from '../utils/format'


export default class EditableField extends React.Component {

  state = {
    focus: false,
  }

  handleChange = (e) => {		
    const value = e.target.value
    
    if (value != '') {
      this.props.input.onChange(value)
    }
  }

  handleBlur = () => {
    this.setState({ focus: false })

    let value = this.props.input.value
    if (value === '') {
      value = this.state.prevValue
    }

    this.props.input.onBlur(value)
  }

  handleFocus = () => {
    this.setState({ focus: true, prevValue: this.props.input.value })
  }

  renderFormattedNumber = () => {
    const {
      input: {
        value,
      },
      percent,
    } = this.props

    return percent 
      ? formatPercent(value, 1) 
      : formatNegativeNumber(value)
  }

  render() {
    const {
      input: {
        name,
        onChange,
        onBlur,
        value,
      },
      className,
      meta: { touched, valid, invalid, error },
      editable = true,
      percent = false,
      ...rest
    } = this.props

    const adjustedProps = {
      ...rest,
    }

    // only for dev
    if (!editable) {
      return (
        <span className="editable-field">
          <span className={cn('editable-field__control', className)}>
            {this.renderFormattedNumber()}
          </span>
        </span>
      )
    }

    return (
      <span className={cn(
        'editable-field', 
        'editable-field--input',
        {
          'editable-field--focus': this.state.focus,
          'editable-field--nofocus': !this.state.focus,
        }
      )}>
        <FormInput
          {...adjustedProps}
          autoComplete={'off'}
          size="sm"
          name={name}
          value={value}
          onChange={onChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className={cn(
            'editable-field__control', 
            className,
            {
              'editable-field__control--editable': editable,
              'editable-field__control--focs': this.state.hasFocuse,
            }
          )}
        />
        <i className="fas fa-pencil-alt editable-field__icon"></i>
      </span>
    )
  }
}