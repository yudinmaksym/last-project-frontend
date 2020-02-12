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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'shards-react'

import CountryField from '../fields/CountryField'
import RegionField from '../fields/RegionField'
import MetersDataField from '../fields/MetersDataField'


const required = value => (value || typeof value === 'number' ? undefined : 'Required')

export const FORM_KEY = 'projectsMeterFilter'

const ATTRIBUTES_OPTONS = [
  {
    label: 'Project Name', 
    value: 'project.name', 
  },
  {
    label: 'Meter Number', 
    value: 'meter_number', 
  },
  {
    label: 'Fuel Type', 
    value: 'fuel_tpe', 
  },
  {
    label: 'Utility Provider', 
    value: 'utility', 
  },
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
  placeholder,
  options = [],
  meta: { touched, error, warning, valid, invalid },
  ...rest
}) => (
  <div className="field">
    <label htmlFor={input.name}>{label}</label>
    
    <FormSelect
      id={input.name} 
      {...rest}
      {...input}
      valid={touched && valid}
      invalid={touched && invalid}
    >
      <option value="" disabled selected>{placeholder}</option>
      {options.map(opt => <option value={opt.value}>{opt.label}</option>)}
    </FormSelect>

  </div>
)

const renderTextField = ({
  input,
  label,
  meta: { touched, error, warning, valid, invalid },
  ...rest
}) => (
  <div className="field">
    <label htmlFor={input.name}>{label}</label>
    <FormInput 
      id={input.name} 
      {...input} 
      {...rest} 
      placeholder={label}
    />
  </div>
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


const renderExpressions = ({ fields, meta: { error } }) => (
  <React.Fragment>

    {(fields.length === 0) && (
      <Row>
        <Col md="2" className="d-flex pb-2">
          <Button 
            block
            theme="white"
            type="button"
            size="sm"
            className={'expression-add'}
            onClick={() => fields.push({ Attribute: null, Value: '' })}
          >
            <span className="text-light">
              <i className="material-icons">add</i>
            </span>{' '}
          </Button>
        </Col>
      </Row>
    )}

    {fields.map((expression, index) => (
      <Row key={index}>
        <Col md="6" className="d-flex">
          <Button 
            theme="white"
            // outline
            type="button"
            size="sm"
            onClick={() => fields.remove(index)}
            className={'expression-remove'}
          >
            <span className="text-danger">
              <i className="material-icons">clear</i>
            </span>{' '}
          </Button>
          <Field 
            name={`${expression}.Attribute`}
            label="Attribute"
            component={renderSelectField}
            options={ATTRIBUTES_OPTONS}
            className={'expression-select'}
          />
          <Field 
            name={`${expression}.Value`}
            label="Value"
            component={renderTextField}
            className={'expression-value-input'}
          />
          {((fields.length -1) === index) && (
            <Button 
              theme="white"
              type="button"
              size="sm"
              className={'expression-add'}
              onClick={() => fields.push({ Attribute: null, Value: '' })}
            >
              <span className="text-light">
                <i className="material-icons">add</i>
              </span>{' '}
            </Button>
          )}
        </Col>
      </Row>
    ))}
  </React.Fragment>
)


{/*  */}

let ProjectsMetersFilterForm = props => {
  return (
    <form onSubmit={props.handleSubmit}>
      
      <FieldArray 
        name="expressions"
        component={renderExpressions}
      />

      <Row>
        <Col className="file-manager__filters__search d-flex" md="6">
          <Button 
            type="submit" 
            size="sm"
            disabled={props.submitting}
          >
            <i className="material-icons">waves</i>
            {' '}
            Filter
          </Button>
          {(
            <Button 
              type="button" 
              theme="danger"
              outline 
              size="sm"
              className="ml-2"
              disabled={props.submitting}
              onClick={ async () => {
                await props.reset()
                props.submit()
              }}
            >
              Clear all filters
            </Button>
          )}
        </Col>
      </Row>
    </form>
  )
}



ProjectsMetersFilterForm = reduxForm({
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
  initialValues: {
    expressions: [
      // { Attribute: null, Value: '' },
    ],
  },
})(ProjectsMetersFilterForm)

export default ProjectsMetersFilterForm