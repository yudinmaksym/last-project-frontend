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


export default class CostField extends React.Component {

  static defaultProps = {
    needValidate: true,
    symbol: 'AEDs',
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
      symbol,
      className,
      label,
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
          {symbol && (
            <InputGroupAddon type="append">
              <InputGroupText>{symbol}</InputGroupText>
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