import * as React from 'react'
import { Field, reduxForm } from 'redux-form'
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

import ProjectField from '../fields/ProjectField'


const METER_FUEL_OPTIONS = [
  { value: 'Electricity ', label: 'Electricity ' },
  { value: 'Chilled Water', label: 'Chilled Water' },
  { value: 'Water', label: 'Water' },
  { value: 'LPG (Gas)', label: 'LPG (Gas)' },
  { value: 'Other', label: 'Other' },
]

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
      {options.map(opt => <option value={opt.value}>{opt.label}</option>)}
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

const required = value => (value || typeof value === 'number' ? undefined : 'Missing')

export const FORM_KEY = 'projectMeter'


const validate = (values) => {
  const errors = {}

  return errors
}

let MeterEditForm = props => {
  return (
    <form onSubmit={props.handleSubmit}> 
      <Row form className="mx-4">
        <Col className="mb-3" md="4">
          <Field 
            name={'account_number'}
            label="Account Number"
            component={renderTextField}
            validate={required}
          />
        </Col>

        <Col className="mb-3" md="4">
          <Field
            label="Project"
            name="project_id"
            component={ProjectField}
            onChange={props.onProjectChange}
          />
        </Col>

        <Col className="mb-3" md="4">
          <Field 
            name={'meter_number'}
            label={'Meter Number'}
            component={renderTextField}
            validate={required}
          />
        </Col>
      </Row>

      <Row form className="mx-4">
        <Col className="mb-3" md="6">
          <Field 
            name={'fuel_type'}
            label="Fuel Type"
            component={renderSelectField}
            validate={required}
            options={METER_FUEL_OPTIONS}
          />
        </Col>
     
        <Col className="mb-3" md="6">
          <Field 
            name={'utility'}
            label="Utility Provider Name"
            component={renderTextField}
            validate={required}
          />
        </Col>
      </Row>

      <Row form className="mx-4">
        <Col className="mb-3" md="6">
          <Field 
            name={'premise_number'}
            label="Premise Number"
            component={renderTextField}
            validate={required}
          />
        </Col>

        <Col className="mb-3" md="6">
          <Field 
            name={'meter_name'}
            label="Meter Name"
            component={renderTextField}
            validate={required}
          />
        </Col>
      </Row>

      {!props.submitting && props.error && (
        <Row form className="mx-4 my-1">
          <Col className="text-right">
            <span className="text-danger">{props.error}</span>
          </Col>
        </Row>
      )}

      <Row form className="mx-4 py-1">
        <Col className="text-right mb-3">
          <Button 
            type="submit" 
            disabled={props.pristine || props.submitting}
          >
          Save
          </Button>
          {'     '}
          <Button 
            type="button" 
            theme="secondary" 
            disabled={props.submitting}
            onClick={props.onCancel}
          >
          Cancel
          </Button> 
        </Col>
      </Row>
    </form>
  )
}

MeterEditForm = reduxForm({
  form: FORM_KEY,
  validate,
  fields: [
    
  ],
})(MeterEditForm)

export default MeterEditForm
