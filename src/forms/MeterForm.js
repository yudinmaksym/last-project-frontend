import * as React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from 'shards-react'

import { 
  renderTextField,
} from '../fields/InvoicesField'
import TypeField from '../fields/TypeField'
import DateField from '../fields/DateField'


const required = value => (value || typeof value === 'number' ? undefined : 'Missing')

export const FORM_KEY = 'consumptionEdit'


const validate = (values) => {
  const errors = {}

  return errors
}

let MeterForm = props => {
  return (
    <form onSubmit={props.handleSubmit}> 
      <Card className="p-0">
        
        <CardHeader className="border-bottom">
          <h6 className="m-0">Edit item</h6>
        </CardHeader>

        <CardBody className="p-0">
          <Row form className="mx-4 my-4">
            <Col className="mb-3" md="6">
              <Field
                name={'invoice_type'}
                component={TypeField}
                validate={required}
              />
            </Col>
          </Row>

          <Row form className="mx-4">
            <Col className="mb-6" md="6">
              <Field
                name={'invoice_number'}
                label={'Invoice Number'}
                validate={required}
                component={renderTextField}
              />
            </Col>
            <Col className="mb-6" md="6">
              <Field
                name={'account_number'}
                label={'Account Number'}
                validate={required}
                component={renderTextField}
              />
            </Col>
          </Row>

          <Row form className="mx-4">
            <Col className="mb-3" md="12">
              <Field
                name={'month'}
                label={'Month'}
                component={DateField}
                dateFormat={'MMMM yyyy'}
                showMonthYearPicker={true}
              />
            </Col>
          </Row>

          <Row form className="mx-4">
            <Col className="mb-3" md="6">
              <Field
                name={'start_date'}
                label={'Start Date'}
                component={DateField}
              />
            </Col>

            <Col className="mb-3" md="6">
              <Field
                name={'end_date'}
                label={'End Date'}
                component={DateField}
              />
            </Col>
          </Row>

          <Row form className="mx-4">
            <Col className="mb-3" md="6">
              <Field
                name={'consumption'}
                label={'Consumption (kWh)'}
                validate={required}
                component={renderTextField}
              />
            </Col>
            <Col className="mb-3" md="6">
              <Field
                name={'consumption_AED'}
                label={'Consumption (AED)'}
                validate={required}
                component={renderTextField}
              />
            </Col>
          </Row>

          <Row form className="mx-4">
            <Col className="mb-3" md="6">
              <Field
                name={'current_reading'}
                label={'Current Reading'}
                // validate={required}
                component={renderTextField}
              />
            </Col>
            <Col className="mb-3" md="6">
              <Field
                name={'previous_reading'}
                label={'Previous Reading'}
                // validate={required}
                component={renderTextField}
              />
            </Col>
          </Row>

          <Row form className="mx-4">
            <Col className="mb-3" md="4">
              <Field
                name={'submeter_consumption'}
                label={'SubMeter Consumption'}
                // validate={required}
                component={renderTextField}
              />
            </Col>
            <Col className="mb-3" md="4">
              <Field
                name={'consumption_rate_AED'}
                label={'Consumption Rate (AED)'}
                // validate={required}
                component={renderTextField}
              />
            </Col>
            <Col className="mb-3" md="4">
              <Field
                name={'fuel_surcharge_rate_AED'}
                label={'Fuel Surcharge Rate (AED)'}
                // validate={required}
                component={renderTextField}
              />
            </Col>
          </Row>
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
                type="submit" 
                disabled={props.pristine || props.submitting}
              >
              Update
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
            <Row form className="mx-4 p-2">
              <Col className="text-right">
                <span className="text-success">Updated successfully.</span>
              </Col>
            </Row>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}

MeterForm = reduxForm({
  form: FORM_KEY,
  validate,
  fields: [
    
  ],
})(MeterForm)

export default MeterForm