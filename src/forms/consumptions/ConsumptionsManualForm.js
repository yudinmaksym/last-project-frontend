import * as React from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
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
import NumberField from '../../fields/NumberField'
import CostField from '../../fields/CostField'


const required = value => (value || typeof value === 'number' ? undefined : 'Missing')

export const FORM_KEY = 'consumptionsManual'

const formatYearsOptions = (years) => years.map(y => ({
  value: y,
  label: y,
}))

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


const renderMonthField = (field) => (
  <div className="input-row">
    <label>{field.label}</label>
    <input {...field.input} type="text"/>
    {field.meta.touched && field.meta.error
     && <span className="error">{field.meta.error}</span>}
  </div>
)

const validate = (values) => {
  const errors = {}

  return errors
}

const renderField = (field) => (
  <div className="input-row">
    <input {...field.input} type="text"/>
    {field.meta.touched && field.meta.erro
     &&  <span className="error">{field.meta.error}</span>}
  </div>
)

const renderSubFields = (member, index, fields) => (
  <li key={index}>
    <h4>{fields.get(index).label}[{fields.get(index).fuel_type}]</h4>
    
    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
      m => (
        <Field 
          name={`${member}.${m}`}
          label={m}
          component={renderMonthField}
        />
      )
    )}
  </li>
)
const formatFuelAppend = fuelType => {
  switch (fuelType) {
  case 'Water':
    return 'Gallons'
  case 'Chilled Water':
    return 'RTH'
  case 'LPG (Gas)':
    return 'M3'
  case 'Electricity':
  default:
    return 'kWh'
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

let ConsumptionsManualForm = props => {
  return (
    <form onSubmit={props.handleSubmit} className="baseline-container baseline-container--manual"> 
      <Card className="p-0">
        
        <CardHeader className="border-bottom">
          <Row form className="md-4">
            <Col md="6" lg="6">
              <Field
                name="projectId"
                component={ProjectField}
                onChange={props.onProjectChange}
              />
            </Col>
            <Col md="6" lg="6">
              <Field
                name="year"
                component={renderSelectField}
                options={formatYearsOptions([2016, 2017, 2018, 2019])}
              />
            </Col>
          </Row>
        </CardHeader>

        <CardBody 
          className="p-0" 
          style={{
            'width': '100%',
            'overflow-x': 'scroll',
          }}
        >   
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0 baseline-container__col baseline-container__col--empty">
                  &nbsp;
                </th>
                {props.meters.map(meter =>
                  <th 
                    scope="col"
                    className="border-0 baseline-container__col baseline-container__col--meter"
                    key={meter.value}
                  >
                    {meter.label}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {MONTHS.map(m => 
                <tr key={m.value}>
                  <td
                    className="baseline-container__col baseline-container__col--month"
                  >
                    <span>
                      {m}
                    </span>
                  </td>
                  {props.meters.map(meter =>
                    <td className="baseline-container__col baseline-container__col--value">
                      <div className={'baseline-container__consumptin'}>
                        <Field 
                        // label="Consumption"
                          name={`values[${meter.value}].${m}.consumption`}
                          component={NumberField}
                          append={formatFuelAppend(meter.fuel_type)}
                          needValidate={false}
                        />
                      </div>
                      <div className={'baseline-container__cost'}>
                        <Field 
                        // label="Consumption (AED)"
                          name={`values[${meter.value}].${m}.consumption_AED`}
                          component={CostField}
                          symbol={'AED'}
                          needValidate={false}
                      
                        />
                      </div>
                    </td>
                  )}
                  {/* {props.meters.map(meter =>
                    <td>
                      <Field 
                        label="Consumption"
                        name={`values[${meter.value}].${m}.consumption`}
                        component={renderField}
                      />
                      <Field 
                        label="Consumption (AED)"
                        name={`values[${meter.value}].${m}.consumption_AED`}
                        component={renderField}
                      />
                    </td>
                  )} */}
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>

        <CardFooter className="border-top">
          <Row>
            <Col className="text-right view-report">
              <Button 
                type="submit" 
                disabled={props.pristine || props.submitting}
              >
              Save
              </Button>
              {'     '}
              <Button 
                type="button" 
                outline
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
                  <span className="text-success">{'Updated successfully'}.</span>
                </Col>
              </Row>
            </React.Fragment>
          )}

        </CardFooter>
      </Card>
    </form>
  )
}

ConsumptionsManualForm = reduxForm({
  form: FORM_KEY,
  validate,
  enableReinitialize: true,
  fields: [
    
  ],
})(ConsumptionsManualForm)

export default ConsumptionsManualForm
