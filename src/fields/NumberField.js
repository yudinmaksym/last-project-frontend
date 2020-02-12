import * as React from 'react'
import cn from 'classnames'
import {
  FormGroup,
  FormInput,
  FormFeedback,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'shards-react'


export default class Number extends React.Component {

  static defaultProps = {
    needValidate: true,
    append: null,
  }

  handleChange = (e) => {		
    this.props.input.onChange(e.target.value)
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
      },
      needValidate,
      className,
      label,
      append,
      meta: { touched, valid, invalid, error },
      ...rest
    } = this.props

    const adjustedProps = {
      ...rest,
    }

    if (needValidate) {
      adjustedProps.valid = valid
    }

    return (
      <FormGroup>
        {label && (
          <label htmlFor={name}>{label}</label>
        )}
        <InputGroup>
          <FormInput
            {...adjustedProps}
            name={name}
            value={value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            className={cn(className)}
          />
          {append && (
            <InputGroupAddon type="append">
              <InputGroupText>{append}</InputGroupText>
            </InputGroupAddon>
          )}
        </InputGroup>
        {error && (
          <FormFeedback 
            valid={valid}
          >{error}</FormFeedback>
        )}
      </FormGroup>
    )
  }
}