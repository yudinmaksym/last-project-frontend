import * as React from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  FormGroup,
  FormInput,
  FormFeedback,
  FormSelect,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from 'shards-react'

import {
  getProjectsByZone,
} from '../../redux/reducers/projects'
import ProjectsSelect from '../components/projects/ProjectsSelect'

import SelectField from './SelectField'


const formatOptions = (options) => {
  return options.map(_option => ({
    label: _option.zone,
    options: _option.projects.map(_project => ({
      label: _project.name,
      value: _project.id,
    })),
  })).reduce((acc, val) => [
    ...acc,
    ...val.options,
  ], [])
}

const valueFromId = (opts = [], id) => opts.filter(o => o.value === id)[0]

const projectField = ({
  page,
  input,
  label,
  type,
  options = [],
  meta: { touched, error, warning, valid, invalid },
}) => {
  const selectedValue = valueFromId(options, input.value)

  const handleChange = async (item) => {
    const value = item ? item.value : ''
    input.onChange(value)
  }
  
  const handleBlur = (e) => {
    input.onBlur(input.value)
  }
  

  return (
    <FormGroup className="m-0">
      <label htmlFor={input.name}>{label}</label>
 
      <SelectField 
        {...input}
        idValue
        isClearable={true}
        value={selectedValue}
        options={options}
        onChange={handleChange}
        onBlur={handleBlur}
      />
  
      {/* <FormSelect
      id={input.name}
      value={input.value}
      valid={touched && valid}
      invalid={touched && invalid}
      onChange={input.onChange}
      onBlur={input.onBlur}
    >
      <option value="-1" disabled selected>Select your option</option>
      {options.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
    </FormSelect> */}
  
      <FormFeedback 
        valid={touched && valid}
      >{error}</FormFeedback>
    </FormGroup>
  )
}

export default connect(
  (state) => ({
    options: formatOptions(getProjectsByZone(state)),
  }),
)(projectField)
  
