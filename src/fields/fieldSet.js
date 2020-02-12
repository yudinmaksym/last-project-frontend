import 'react-phone-input-2/lib/style.css'
import React from 'react'
import { 
  FormInput,
  FormGroup,
  FormSelect,
  FormTextarea,
  FormCheckbox,
  FormFeedback,
} from 'shards-react'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { compact } from 'lodash'
import ReactPhoneInput from 'react-phone-input-2'

import SilpleFileField from './SilpleFileField'


const renderField = ({ input, label, type, meta: { touched, error }, min, max }) => (
  <FormGroup>
    <label>{label}</label>
    <FormInput
      {...input}
      minValue={min || -Number.MAX_SAFE_INTEGER}
      maxValue={max || Number.MAX_SAFE_INTEGER}
      type={type}
      valid={touched && !error}
      invalid={touched && !!error}
      placeholder={label}
      autoComplete="new-password"
    />
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
)

const renderSelect = (options = []) => ({ input, label, type, meta: { touched, error } }) => (
  <FormGroup>
    <label>{label}</label>
    <FormSelect
      {...input}
      type={type}
      valid={touched && !error}
      invalid={touched && !!error}
      // placeholder={label}
    ><option value="" disabled selected>Select...</option>
      {options.map(v => <option key={v}>{v}</option>)}
    </FormSelect>
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
)

const multiselectStyles = (touched, error) => {
  const border =  touched && !error
    ? '1px solid #17c671'
    :  touched && !!error
      ? '1px solid #c4183c'
      : (!(touched && !error) && !(touched && !!error))
        ? '1px solid  #e1e5eb' 
        : '1px solid blue'
  return {
    control: styles => ({ ...styles, border }),
  }
}

const renderMultipleSelect = (options = []) => ({ input, label, type, meta: { touched, error } }) => {
  return (
    <FormGroup>
      <label>{label}</label>
      <Select 
        {...input}
        options={options}
        value={compact(input.value.split(', ')).map(v => ({ value: v, label: v }))}
        isMulti={true}
        onChange={(value) => {
          value ? input.onChange(value.map(({ value }) => value).join(', ')) : input.onChange('')
        } }
        onBlur={(value) => {}}
        styles={multiselectStyles(touched, error) }
      />
      {touched && error && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  )}

const renderMultipleSelectOptions = (options = []) => ({ input, label, type, meta: { touched, error } }) => {
  return (
    <FormGroup>
      <label>{label}</label>
      <Select 
        {...input}
        options={options}
        isMulti={true}
        onChange={(value) => {
          value ? input.onChange(value) : input.onChange([])
        } }
        onBlur={(value) => {}}
        styles={multiselectStyles(touched, error) }
      />
      {touched && error && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  )}

const renderCreatableSelect = (options = []) => ({ input, label, type, meta: { touched, error } }) => {
  return  (
    <FormGroup>
      <label>{label}</label>
      <CreatableSelect
        {...input}
        value={{ value: input.value , label: input.value }}
        onBlur={(value) => { 
          value ? input.onBlur(value.value) : input.onBlur(void 0)
        }}
        onChange={(value) => {
          value ? input.onChange(value.value) : input.onChange(void 0)
        }}
        isClearable={true}
        options={options}
        styles={multiselectStyles(touched, error) }
      ></CreatableSelect>
      {touched && error && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>)
}
  

const renderFilesField = (files = []) => ({ input, label, type, meta: { touched, error } }) => (
  <FormGroup>
    <label>{label}</label>
    <SilpleFileField {...input} meta={{ touched, error }}/>
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
)

const renderTextArea = ({ input, label, type, meta: { touched, error } }) => (
  <FormGroup>
    <label>{label}</label>
    <FormTextarea
      {...input}
      type={type}
      valid={touched && !error}
      invalid={touched && !!error}
      placeholder={label}
    />
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
)

const renderCheckBox = ({ input, label, checkedLabel, type, meta: { touched, error } }) => (
  <FormGroup>
    <FormCheckbox
      {...input}
      checked={!!input.value}
      type={type}
      // placeholder={label}
      invalid={touched && !!error}
    >
      {checkedLabel ? (
        !!input.value ? checkedLabel : label
      ): label}
    </FormCheckbox>
    {touched && !!error && <FormFeedback style={{ display: 'inline' }}>{error}</FormFeedback>}
  </FormGroup>
)

const renderPhoneInput = ({ input, label, type, meta: { touched, error } }) => (
  <FormGroup>
    <label>{label}</label>
    <ReactPhoneInput
      {...input}
      defaultCountry={'ae'}
      inputClass='w-100'
      inputStyle={{ borderColor: '#e1e5eb' }}
      invalid={touched && !!error}
      onChange={(phoneNumber) => input.onChange(phoneNumber)}/>
    {touched && !!error && <FormFeedback style={{ display: 'inline' }}>{error}</FormFeedback>}
  </FormGroup>
)
export {
  renderField,
  renderSelect,
  renderFilesField,
  renderTextArea,
  renderCheckBox,
  renderMultipleSelect,
  renderPhoneInput,
  renderMultipleSelectOptions,
  renderCreatableSelect
}