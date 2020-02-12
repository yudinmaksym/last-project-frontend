import React from 'react'
import {
  FormGroup,
  FormInput,
  FormSelect,
  FormFeedback,
} from 'shards-react'


const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)


const renderSelectField = ({
  input,
  label,
  type,
  options = [],
  meta: { touched, error, warning, valid, invalid },
}) => (
  <FormGroup>
    <label htmlFor={input.name}>{label}</label>
    
    <FormSelect
      id={input.name} 
      {...input}
      valid={touched && valid}
      invalid={touched && invalid}
    >
      <option value="" disabled selected>Select your option</option>
      {options.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
    </FormSelect>

    <FormFeedback 
      valid={touched && valid}
    >{error}</FormFeedback>
  </FormGroup>
)

const renderTextField = ({
  input,
  label,
  meta: { touched, error, warning, valid, invalid },
  ...rest
}) => (
 
  <FormGroup>
    <label htmlFor={input.name}>{label}</label>
    <FormInput 
      id={input.name} 
      {...input} 
      {...rest} 
      placeholder={label}
      valid={touched && valid}
      invalid={touched && invalid}
    />
    <FormFeedback 
      valid={touched && valid}
    >{error}</FormFeedback>
  </FormGroup>
)

const renderNumberField = ({
  input,
  label,
  meta: { touched, error, warning, valid, invalid },
  type,
  ...rest
}) => (
 
  <FormGroup>
    <label htmlFor={input.name}>{label}</label>
    <FormInput 
      id={input.name} 
      {...input} 
      {...rest} 
      type={type}
      placeholder={label}
      valid={touched && valid}
      invalid={touched && invalid}
    />
    <FormFeedback 
      valid={touched && valid}
    >{error}</FormFeedback>
  </FormGroup>
)


export {
  renderField,
  renderSelectField,
  renderTextField,
  renderNumberField
}