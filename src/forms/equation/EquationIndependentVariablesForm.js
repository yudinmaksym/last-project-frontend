import React from 'react'
import {
  Row,
  Col,
  CardFooter,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput,
  FormSelect,
  FormGroup,
} from 'shards-react'
import compact from 'lodash/compact'
import Select from 'react-select'
import { Field, reduxForm } from 'redux-form'

import DateField from '../../fields/DateField'


const TYPES_OPTIONS = [
  'Option A',
  'Option B',
  'Option C',
  'Option D',
].map(v => ({ value: v, label: v }))

const INDEPENDENT_VARIABLES_OPTIONS = [
  'RoomNights',
  'BedNights',
  'FoodCovers',
  'TenantChillerConsumption',
  'RamadanFactorActual',
  'Occupancy',
  'DegreeDay',
  'WetbulbTemperature',
  'Other',
  'electricityNonRoutineAdjustment',
  'chwNonRoutineAdjustment',
].map(v => ({ value: v, label: v }))

const TOPIC_TYPES = [
  'CDD',
  'HDD',
].map(v => ({ value: v, label: v }))

const CURRENCY_OPTIONS = [
  'AED',
  'USD',
].map(v => ({ value: v, label: v }))

const renderInput = ({ options, input, label, type, meta: { valid, invalid, touched, error } }) => (
  <FormGroup>
    {label && (<label>{label}</label>)}
    <FormInput 
      id={input.name} 
      {...input}
      placeholder={label}
      valid={touched && valid}
      invalid={touched && invalid}
    />
    {touched && error && <span>{error}</span>}
  </FormGroup>
)

const renderSelect = ({ options, input, label, type, meta: { touched, error } }) => (
  <FormGroup>
    {label && (<label>{label}</label>)}
    <FormSelect
      {...input}
      type={type}
      valid={touched && !error}
      invalid={touched && !!error}
      // placeholder={label}
    ><option>Select...</option>
      {options.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
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

const renderMultipleSelect = ({ options, input, label, type, meta: { touched, error } }) => (
  <FormGroup>
    {label && (<label>{label}</label>)}
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
)

const EquationIndependentVariablesForm = props => {
  const { handleSubmit, onUpdate } = props
  return (
    <form onSubmit={handleSubmit}>

      <Row form className="mt-4 mx-4">
        <Col className="mb-3" md="6">
          <Field 
            name="mv_type"
            label={'M&V Type'}
            component={renderSelect}
            options={TYPES_OPTIONS}
          />
        </Col>
        <Col className="mb-3" md="6">
          <Field 
            name="operations_date"
            label={'Operations Date'}
            component={DateField}
          />
        </Col>
      </Row>

      <Row form className="mx-4">
        <Col className="mb-3" md="12">
          <Field 
            name="independent_variables"
            label={'Independent Variables'}
            component={renderMultipleSelect}
            options={INDEPENDENT_VARIABLES_OPTIONS}
          />
        </Col>
      </Row>
       
      <Row form className="mx-4">
        <Col className="mb-3">
          <h6 className="form-text m-0">{'Degree Days'}</h6>
        </Col>
      </Row>

      <Row form className="mx-4">
        <Col md="2" className="form-group d-flex align-items-center">
          <label>Common</label>
        </Col>

        <Col md="5" className="form-group">
          <Field 
            name="dd_common_value"
            component={renderInput}
          />
        </Col>

        <Col md="5" className="form-group">
          <Field 
            name="dd_common_topic"
            component={renderSelect}
            options={TOPIC_TYPES}
          />
        </Col>
      </Row>

      <Row form className="mx-4">
        <Col md="2" className="form-group d-flex align-items-center">
          <label>Tenant</label>
        </Col>

        <Col md="5" className="form-group">
          <Field 
            name="dd_tenant_value"
            component={renderInput}
          />
        </Col>

        <Col md="5" className="form-group">
          <Field 
            name="dd_tenant_topic"
            component={renderSelect}
            options={TOPIC_TYPES}
          />
        </Col>
      </Row>
        
      <Row form className="mt-4 mx-4">
        <Col className="mb-3">
          <h6 className="form-text m-0">{'Contracted Utility Rates'}</h6>
        </Col>
      </Row>
     
      <Row form className="mx-4">
        <Col md="2" className="form-group d-flex align-items-center">
          <label>Electricity</label>
        </Col>

        <Col md="5" className="form-group">
          <Field 
            name="utility_rate_electricity_value"
            component={renderInput}
          />
        </Col>

        <Col md="5" className="form-group">
          <Field 
            name="utility_rate_electricity_currency"
            component={renderSelect}
            options={CURRENCY_OPTIONS}
          />
        </Col>
      </Row>

      <Row form className="mx-4">
        <Col md="2" className="form-group d-flex align-items-center">
          <label>Chilled Water</label>
        </Col>

        <Col md="5" className="form-group">
          <Field 
            name="utility_rate_chw_value"
            component={renderInput}
          />
        </Col>

        <Col md="5" className="form-group">
          <Field 
            name="utility_rate_chw_currency"
            component={renderSelect}
            options={CURRENCY_OPTIONS}
          />
        </Col>
      </Row>

      <CardFooter className="mt-4 border-top d-flex justify-content-end">
        <Button
          size="sm"
          theme="accent"
          type="submit"
          className="d-table mr-3"
        >
          Next
        </Button>
      </CardFooter>
    </form>
  )
}

export default reduxForm({
  form: 'equation', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount,
  initialValues: {
    
  },
})(EquationIndependentVariablesForm)