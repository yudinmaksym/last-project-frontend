import React from 'react'
import uuid from 'uuid/v4'
import { Field, FieldArray, reduxForm } from 'redux-form'
import {
  Card,
  CardHeader,
  CardFooter,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormFeedback,
  FormTextarea,
  Button,
  Container,
} from 'shards-react'

import FormSectionTitle from '../../components/common/FormSectionTitle'
import CountryField from '../../fields/CountryField'
import RegionField from '../../fields/RegionField'
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

const OCCUPANCY_OPTIONS = [
  { value: 'Airport', label: 'Airport' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Education', label: 'Education' },
  { value: 'Health', label: 'Health Care' },
  { value: 'Hotel', label: 'Hotel' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Labor', label: 'Labor Accommodation' },
  { value: 'Mall', label: 'Mall' },
  { value: 'Mixed', label: 'Mixed Use' },
  { value: 'Residential', label: 'Residential' },
  { value: 'Retail', label: 'Retail' },
]

const CONDITION_OPTIONS = [
  { value: 'AC Chillers', label: 'AC Chillers' },   
  { value: 'WC Chillers', label: 'WC Chillers' },
  { value: 'DX Units', label: 'DX Units' },     
  { value: 'District Cooling', label: 'District Cooling' },
]


const METERING_OPTIONS = [
  { value: 'Common Space', label: 'Common Space' },
  { value: 'Full Building', label: 'Full Building' },
  { value: 'Common Space + CHW Submetering', label: 'Common Space + CHW Submetering' },
]

export const renderBuilding = (member, index, props) => props.__isDeleted__ ? null : (
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
          name={`${member}.name`}
          label={'Name'}
          size="lg"
          component={renderTextField}
          validate={required}
        />
      </Col>
    </Row>

    <Row form>
      <Col className="mb-3">
        <Field 
          name={`${member}.country`}
          label="Country"
          component={CountryField}
          validate={required}
        />
      </Col>
         
      <Col className="mb-3">
        <Field 
          name={`${member}.city`}
          label="Region"
          country={props.country}
          component={RegionField}
          validate={props.country && required}
        />
      </Col>
    </Row>

    <Row form>
      <Col className="mb-3">
        <Field 
          name={`${member}.address`}
          label="Address"
          component={renderTextField}
          validate={required}
        />
      </Col>
         
      <Col className="mb-3">
        <Field 
          name={`${member}.neighborhood`}
          label="Neighborhood / Development"
          component={renderTextField}
          validate={required}
        />
      </Col>
    </Row>

    <Row form>
      <Col className="mb-3">
        <Field 
          name={`${member}.latitude`}
          type={'number'}
          label="Latitude"
          component={renderNumberField}
        />
      </Col>
         
      <Col className="mb-3">
        <Field 
          name={`${member}.longitude`}
          type={'number'}
          label="Longitude"
          component={renderNumberField}
        />
      </Col>
    </Row>

    <Row form>
      <Col className="mb-3" md="4">
        <Field 
          name={`${member}.occupancy_type`}
          label="Occupancy Type"
          component={renderSelectField}
          validate={required}
          options={OCCUPANCY_OPTIONS}
        />
      </Col>

      <Col className="mb-3" md="4">
        <Field 
          name={`${member}.cooling_type`}
          label="Cooling Type"
          component={renderSelectField}
          validate={required}
          options={CONDITION_OPTIONS}
        />
      </Col>

      <Col className="mb-3" md="4">
        <Field 
          name={`${member}.metering_infrastructure`}
          label="Metering Infrastructure"
          component={renderSelectField}
          validate={required}
          options={METERING_OPTIONS}
        />
      </Col>
    </Row>

    <Row form>
      <Col className="mb-3">
        <Field 
          name={`${member}.bua`}
          label="BUA (m2)"
          type="number"
          component={renderNumberField}
        />
      </Col>

      <Col className="mb-3">
        <Field 
          name={`${member}.gfa`}
          label="GFA (m2)"
          type="number"
          component={renderNumberField}
          validate={required}
        />
      </Col>

      <Col className="mb-3">
        <Field 
          name={`${member}.common_space`}
          label="CommonSpace Area (m2)"
          type="number"
          component={renderNumberField}
          validate={required}
        />
      </Col>

    </Row>

    <Row form>
     
      <Col className="mb-3" md="4">
        <Field 
          name={`${member}.year_built`}
          label="Year Built"
          type="number"
          component={renderNumberField}
          validate={required}
        />
      </Col>
       
      <Col className="mb-3" md="4">
        <Field 
          name={`${member}.floor_levels`}
          label="No. Of levels"
          type="number"
          component={renderNumberField}
          validate={required}
        />
      </Col>
    </Row>
  </ListGroupItem>
)

const renderBuildings = ({ deleteMember, fields, meta: { error, submitFailed } }) => (
  <ListGroup flush>
    {fields.map((member, index) => 
      renderBuilding(member, index, {
        id: fields.get(index).id,
        country: fields.get(index).country,
        onRemove: () => fields.get(index).__isNew__ ? fields.remove(index) : deleteMember(member),
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
            Add Building
          </Button>
          {submitFailed && error && <span>{error}</span>}
        </Col>
      </Row>
    </ListGroupItem>
  </ListGroup>
)

const ProjectBuildingsSelect = props => {
  const { 
    handleSubmit,
    showPrevBtn,
    submitLabel,
    onPrev,
    submitting,
    invalid,
    change,
    hideFooter,
  } = props

  const deleteMember = (member) => {
    change(`${member}.__isDeleted__`, true)
    window.requestAnimationFrame(() => {
      blur(`${member}.__isDeleted__`, true)
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldArray 
        name="buildings"
        deleteMember={deleteMember}
        component={renderBuildings}
      />

      { !hideFooter && <CardFooter className="border-top">
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

          <Col className="text-right">
            <Button
              pills 
              theme="white"
              type="submit"
              disabled={submitting || invalid}
            >
              {submitLabel}
            </Button>
          </Col>
        </Row>
      </CardFooter>}
    </form>
  )
}

export default reduxForm({
  form: FORM_KEY, // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(ProjectBuildingsSelect)
