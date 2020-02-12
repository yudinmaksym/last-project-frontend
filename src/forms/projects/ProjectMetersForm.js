import React from 'react'
import uuid from 'uuid/v4'
import omit from 'lodash/omit'
import { Field, FieldArray, reduxForm } from 'redux-form'
import {
  CardFooter,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Button,
} from 'shards-react'

import FormSectionTitle from '../../components/common/FormSectionTitle'
import MetersDataField from '../../fields/MetersDataField'

import validate from './validate'
import {
  renderField,
  renderSelectField,
  renderTextField,
  renderNumberField,
} from './renderField'
import { FORM_KEY } from './ProjectZoneSelectForm'


const required = value => (value || typeof value === 'number' ? undefined : 'Required')


const METER_FUEL_OPTIONS = [
  { value: 'Electricity', label: 'Electricity' },
  { value: 'Chilled Water', label: 'Chilled Water' },
  { value: 'Water', label: 'Water' },
  { value: 'LPG (Gas)', label: 'LPG (Gas)' },
  { value: 'Other', label: 'Other' },
]

const renderMeter = (member, index, props) => props.__isDeleted__ ? null : (
  <ListGroupItem className="p-3 pt-2" key={props.id}>
    <Row>
      <Col className="text-right">
        <Button theme="white" type="button" onClick={props.onRemove}>
          <span className="text-danger">
            <i className="material-icons">clear</i>
          </span>{' '}
          Remove
        </Button>
      </Col>
    </Row>

    <Row form>
      <Col className="mb-3">
        <Field 
          name={`${member}.meter_number`}
          label={'Meter Number'}
          component={renderTextField}
          validate={required}
        />
      </Col>
      
      <Col className="mb-3">
        <Field 
          name={`${member}.account_number`}
          label="Account Number"
          component={renderTextField}
          validate={required}
        />
      </Col>

      <Col className="mb-3">
        <Field 
          name={`${member}.premise_number`}
          label="Premise Number"
          component={renderTextField}
          validate={required}
        />
      </Col>

      <Col className="mb-3">
        <Field 
          name={`${member}.meter_name`}
          label="Meter Name"
          component={renderTextField}
          validate={required}
        />
      </Col>
         
      <Col className="mb-3">
        <Field 
          name={`${member}.fuel_type`}
          label="Fuel Type"
          component={renderSelectField}
          validate={required}
          options={METER_FUEL_OPTIONS}
        />
      </Col>

      <Col>
        <Field 
          name={`${member}.utility`}
          label="Utility Provider Name"
          component={renderTextField}
          validate={required}
        />
      </Col>
    </Row>
  </ListGroupItem>
)

const renderMeters = ({ deleteMember, fields, meta: { error, submitFailed } }) => (
  <ListGroup flush>
    {fields.map((member, index) => 
      renderMeter(member, index, {
        onRemove: () => fields.get(index).__isNew__ ? fields.remove(index) : deleteMember(member),
        id: fields.get(index).id,
        __isNew__: fields.get(index).__isNew__,
        __isDeleted__: fields.get(index).__isDeleted__,
      })
    )}
    <ListGroupItem className="p-3">
      <Row>
        <Col className="text-right">
          <Button type="button" onClick={() => fields.push({
            __isNew__: true,
          })}>
            <span>
              <i className="material-icons">add</i>
            </span>{' '}
            Add Meter
          </Button>
          {submitFailed && error && <span>{error}</span>}
        </Col>
      </Row>
    </ListGroupItem>
  </ListGroup>
)

const validatateWithRole = (values, role = '') => {
  const errors = validate(values)
  return role.startsWith('Taka') 
    ? Object.keys(errors).length
    : Object.keys(omit(errors, 'project')).length
}

const ProjectMetersForm = props => {
  const { 
    handleSubmit,
    showPrevBtn,
    isLastStep,
    onPrev,
    submitLabel,
    submitting,
    invalid,
    change,
    blur,
    currentUser = {},
  } = props

  const deleteMember = (member) => {
    change(`${member}.__isDeleted__`, true)
    window.requestAnimationFrame(() => {
      blur(`${member}.__isDeleted__`, true)
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col className="p-0">
              <FieldArray
                name="meters"
                deleteMember={deleteMember}
                component={renderMeters}
              />
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>

      <CardFooter className="border-top">
        <Row>
          <Col>
            {showPrevBtn && (
              <Button 
                pills
                theme="white"
                type="button"
                onClick={onPrev}
              >
                  &larr; Go Back
              </Button>
            )}
          </Col>

          <Col className="text-right view-report">
            <Button
              pills 
              theme="white"
              type="submit"
              disabled={submitting || invalid || validatateWithRole(props.actualValues, currentUser.role)} 
            >
              {submitLabel}
            </Button>
          </Col>
        </Row>
      </CardFooter>
    </form>
  )
}

export default reduxForm({
  form: FORM_KEY, // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(ProjectMetersForm)
