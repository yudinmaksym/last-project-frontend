import React from 'react'
import { FormInput, FormGroup, FormSelect, FormTextarea, FormCheckbox } from 'shards-react'
import Select from 'react-select'
import { compact } from 'lodash'

import SilpleFileField from '../../fields/SilpleFileField'


const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <FormGroup>
    <label>{label}</label>
    <FormInput
      {...input}
      type={type}
      valid={touched && !error}
      invalid={touched && !!error}
      placeholder={label}
    />
    {touched && error && <span>{error}</span>}
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
    {touched && error && <span>{error}</span>}
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
      {touched && error && <span>{error}</span>}
    </FormGroup>
  )}

const renderFilesField = (files = []) => ({ input, label, type, meta: { touched, error } }) => (
  <FormGroup>
    <label>{label}</label>
    <SilpleFileField {...input} meta={{ touched, error }}/>
    {touched && error && <span>{error}</span>}
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
    {touched && error && <span>{error}</span>}
  </FormGroup>
)

const renderCheckBox = ({ input, label, type, meta: { touched, error } }) => (
  <FormGroup>
    <FormCheckbox
      {...input}
      checked={!!input.value}
      type={type}
      placeholder={label}
    />
    <label>{label}</label>
    {touched && error && <span>{error}</span>}
  </FormGroup>
)
export { renderField, renderSelect, renderFilesField, renderTextArea, renderCheckBox, renderMultipleSelect }
