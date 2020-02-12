import * as React from 'react'
import { Field, FieldArray,reduxForm } from 'redux-form'
import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  FormInput,
  FormFeedback,
  FormSelect,
} from 'shards-react'

import CountryField from '../fields/CountryField'
import RegionField from '../fields/RegionField'
import MetersDataField from '../fields/MetersDataField'


const required = value => (value || typeof value === 'number' ? undefined : 'Required')

export const FORM_KEY = 'createProject'

const OCCUPANCY_OPTIONS = [
  { value: 'Airport', label: 'Airport' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Education', label: 'Education' },
  { value: 'Health', label: 'Health Care' },
  { value: 'Hotel', label: 'Hotel' },
  { value: 'Heavy Industrial', label: 'Heavy Industrial' },
  { value: 'Light Industrial', label: 'Light Industrial' },
  { value: 'Labor', label: 'Labor Accommodation' },
  { value: 'Mall', label: 'Mall' },
  { value: 'Mixed', label: 'Mixed Use' },
  { value: 'Residential', label: 'Residential' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Leisure & Entertainment', label: 'Leisure & Entertainment' },
]

const FULE_OPTIONS = [
  { value: 'AC Chillers', label: 'AC Chillers' },   
  { value: 'WC Chillers', label: 'WC Chillers' },
  { value: 'DX Units', label: 'DX Units' },     
  { value: 'District Cooling', label: 'District Cooling' },
  { value: 'Package Unit', label: 'Package Unit' },
]


const METERING_OPTIONS = [
  { value: 'Common Space', label: 'Common Space' },
  { value: 'Full Building', label: 'Full Building' },
  { value: 'Common Space + CHW Submetering', label: 'Common Space + CHW Submetering' },
]

const FormSectionTitle = ({ title, description }) => (
  <Row form className="mx-4">
    <Col className="mb-3">
      <h6 className="form-text m-0">{title}</h6>
      <p className="form-text text-muted m-0">{description}</p>
    </Col>
  </Row>
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

const validate = (values) => {
  const errors = {}

  return errors
}

let CreateProjectForm = props => {
  
  const handleMeterRemove = (member, item, fieldName) => {
    props.change(
      `${member}.deleted`,
      true
    )

    requestAnimationFrame(
      () => {
        props.blur(
          `${member}.deleted`,
          true
        )
      }
    )
  }

  return (
    <form onSubmit={props.handleSubmit}>
      <Card>
        <CardHeader className="border-bottom">
          <Row form className="p-0">
            <Col>
              <h6 className="form-text m-0">{props.title}</h6>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="p-0 py-4">
          <FormSectionTitle
            title="Information"
            description="Fill basic information"
          />

          <Row form className="mx-4">
            <Col className="mb-3">
              <Field 
                name="Name"
                label={'Name'}
                size="lg"
                component={renderTextField}
                validate={required}
              />
            </Col>
          </Row>

          <Row form className="mx-4">
            <Col className="mb-3">
              <Field 
                name="Country"
                label="Country"
                component={CountryField}
                validate={required}
              />
            </Col>
         
            <Col className="mb-3">
              <Field 
                name="Region"
                label="Region"
                country={props.country}
                component={RegionField}
                validate={props.country && required}
              />
            </Col>
          </Row>

          <Row form className="mx-4">
            <Col className="mb-3">
              <Field 
                name="Address"
                label="Address"
                component={renderTextField}
                validate={required}
              />
            </Col>
         
            <Col className="mb-3">
              <Field 
                name="Development"
                label="Neighborhood / Development"
                component={renderTextField}
                validate={required}
              />
            </Col>
          </Row>

          <Row form className="mx-4">
            <Col className="mb-3" md="4">
              <Field 
                name="Occupancy"
                label="Occupancy Type"
                component={renderSelectField}
                validate={required}
                options={OCCUPANCY_OPTIONS}
              />
            </Col>

            <Col className="mb-3" md="4">
              <Field 
                name="FuelType"
                label="Fuel Type"
                component={renderSelectField}
                validate={required}
                options={FULE_OPTIONS}
              />
            </Col>

            <Col className="mb-3" md="4">
              <Field 
                name="MeteringInfrastructure"
                label="Metering Infrastructure"
                component={renderSelectField}
                validate={required}
                options={METERING_OPTIONS}
              />
            </Col>
          </Row>

          <Row form className="mx-4">
            <Col className="mb-3">
              <Field 
                name="BuildingArea"
                label="Building Area m2"
                type="number"
                component={renderNumberField}
                validate={required}
              />
            </Col>
            
            <Col className="mb-3" md="4">
              <Field 
                name="YearBuilt"
                label="Year Built"
                type="number"
                component={renderNumberField}
                validate={required}
              />
            </Col>
       
            <Col className="mb-3" md="4">
              <Field 
                name="Levels"
                label="No. Of levels"
                type="number"
                component={renderNumberField}
                validate={required}
              />
            </Col>
          </Row>

          <Row form className="mx-4">
            <Col>
              <Field 
                name="Owner"
                label="Owner"
                component={renderTextField}
                validate={required}
              />
            </Col>
          </Row>

          <hr />

          <FormSectionTitle
            title="Meter Data"
            description="Define Meter, Fuel Type and Utility Provider"
          />

          <FieldArray
            name="metersData"
            component={MetersDataField}
            onRemove={handleMeterRemove}
          />
          
        </CardBody>

        <hr />
        <CardFooter className="p-0">
          {!props.submitting && props.error && (
            <React.Fragment>
              <Row form className="mx-4">
                <Col className="text-right">
                  <span className="text-danger">{props.error}</span>
                </Col>
              </Row>
            </React.Fragment>
          )}
          <Row form className="p-4">
            <Col className="text-right mb-3">
              <Button 
                type="submit" 
                disabled={props.pristine || props.submitting}
              >
                {props.submitting ? props.submittingMessage : props.submitMessage}
              </Button>
              {'     '}
              <Button 
                type="button" 
                theme="secondary" 
                disabled={props.pristine || props.submitting}
                onClick={props.reset}
              >
              Reset
              </Button> 
            </Col>
          </Row>
          {!props.submitting && props.submitSucceeded && (
            <React.Fragment>
              <Row form className="mx-4 pb-4">
                <Col className="text-right">
                  <span className="text-success">{props.successMessage}.</span>
                </Col>
              </Row>
            </React.Fragment>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}

CreateProjectForm.defaultProps = {
  title: 'Create New Project',
  successMessage: 'Created successfully',
  submittingMessage: 'Creating...',
  submitMessage: 'Create',
}

CreateProjectForm = reduxForm({
  form: FORM_KEY,
  validate,
  fields: [
    'Name',
    'Country',
    'Region',
    'Address',
    'Development',
    'Occupancy',
    'FuelType',
    'MeteringInfrastructure',
    'BuildingArea',
    'YearBuilt',
    'Levels',
    'Owner',
    'metersData',
  ],
})(CreateProjectForm)

export default CreateProjectForm