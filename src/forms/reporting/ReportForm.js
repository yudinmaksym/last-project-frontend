import * as React from 'react'
import moment from 'moment'
import { Field, reduxForm } from 'redux-form'
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  FormGroup,
  FormSelect,
  FormFeedback,
} from 'shards-react'

import ProjectField from '../../fields/ProjectField'
import ZonesSelect from '../../components/zones/ZonesSelect'


const ranges = [3, 6, 12, 18, 24]
const types = [{
  label: 'Portfolio',
  value: 'portfolio',
},{
  label: 'Zones',
  value: 'zone',
},{
  label: 'Projects',
  value: 'project',
}]

const getPastYears = (delta = 4) => {
  const currentYear = moment().year()

  let years = []

  for (let i=0; i<delta; i++) {
    years.push(currentYear - i)
  }

  return years
}

const years = getPastYears().map(_year => ({
  value: _year,
  label: _year,
}))

const getMonths = () => moment.months()

const months = getMonths().map(_month => ({
  value: _month,
  label: _month,
}))

const required = value => (value || typeof value === 'number' ? undefined : 'Missing')

export const FORM_KEY = 'reportForm'


const renderSelectField = ({
  input,
  label,
  type,
  placeholder = 'Select your option',
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
      <option value="" disabled selected>{placeholder}</option>
      {options.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
    </FormSelect>

    <FormFeedback 
      valid={touched && valid}
    >{error}</FormFeedback>
  </FormGroup>
)

const renderZoneSelectField = ({
  input,
  label,
  type,
  placeholder = 'Select your option',
  options = [],
  meta: { touched, error, warning, valid, invalid },
}) => (
  <FormGroup>
    <label htmlFor={input.name}>{label}</label>
    
    <ZonesSelect 
      value={input.value}
      onChange={(value) => input.onChange(value)}
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

let ReportForm = props => {
  return (
    <form onSubmit={props.handleSubmit}> 
      <Card className="p-0">
 
        <CardHeader className="border-bottom">
          Generate Report
        </CardHeader>

        <CardBody className="p-0 pt-4">
          <Row form className="mx-4">
            <Col className="mb-6" md="6">
              <Field
                name="type"
                label="Type"
                placeholder={'Select Type'}
                component={renderSelectField}
                options={types}
              />
            </Col>
          </Row>

          <Row form className="mx-4">
            <Col className="mb-6" md="6">
              <Field
                name="year"
                label="Year"
                placeholder={'Select Year'}
                component={renderSelectField}
                options={years}
              />
            </Col>
            <Col className="mb-6" md="6">
              <Field
                name="month"
                label="Month"
                placeholder={'Select Month'}
                component={renderSelectField}
                options={months}
              />
            </Col>
          </Row>

          {props.type === 'zone' && (
            <Row form className="mx-4">
              <Col className="mb-6" md="6">
                <Field
                  name="zone"
                  label="Type"
                  component={renderZoneSelectField}
                  options={types}
                />
              </Col>
            </Row>
          )}

          {props.type === 'project' && (
            <Row form className="mx-4">
              <Col className="mb-6" md="6">
                <Field
                  name="project"
                  label="Type"
                  component={ProjectField}
                  options={types}
                />
              </Col>
            </Row>
          )}
        </CardBody>

        <CardFooter className="p-0">
          {!props.submitting && props.error && (
            <Row form className="mx-4 my-1">
              <Col className="text-right">
                <span className="text-danger">{props.error}</span>
              </Col>
            </Row>
          )}

          <Row form className="mx-4">
            <Col className="text-right mb-3">
              <Button 
                type="=submit" 
                disabled={props.pristine || props.submitting}
              >
              Download
              </Button>
            </Col>
          </Row>

          {!props.submitting && props.submitSucceeded && (
            <Row form className="mx-4 p-2">
              <Col className="text-right">
                <span className="text-success">Generated successfully.</span>
              </Col>
            </Row>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}

ReportForm = reduxForm({
  form: FORM_KEY,
  validate,
  fields: [
    
  ],
})(ReportForm)

export default ReportForm