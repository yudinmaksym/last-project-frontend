import * as React from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
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

import MetersField from '../fields/MetersField'


const required = value => (value || typeof value === 'number' ? undefined : 'Required')


const FormSectionTitle = ({ title, description }) => (
  <Row form className="mx-4">
    <Col className="mb-3">
      <h6 className="form-text m-0">{title}</h6>
      <p className="form-text text-muted m-0">{description}</p>
    </Col>
  </Row>
)


export const FORM_KEY = 'manual'

const validate = (values) => {
  const errors = {}

  return errors
}

let ManualInputForm = props => {
  return (
    <form onSubmit={props.handleSubmit}>
      <Card>
        <CardHeader className="border-bottom">
          <Row form className="p-0">
            <Col>
              <h6 className="form-text m-0">Manual Input</h6>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="p-0 pt-4">
          <FormSectionTitle
            title="Manually fill utility field data points"
            description="Used in case utility bill does not exist or illegible"
          />

          <FieldArray
            name="meters"
            component={MetersField}
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
                {props.submitting ? 'Submitting...' : 'Submit'}
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
                  <span className="text-success">Submit success.</span>
                </Col>
              </Row>
            </React.Fragment>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}

ManualInputForm = reduxForm({
  form: FORM_KEY,
  validate,
  fields: [
    'meters',
  ],
})(ManualInputForm)

export default ManualInputForm