import * as React from 'react'
import { FieldArray, reduxForm } from 'redux-form'
import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardFooter,
} from 'shards-react'

import InvoicesField from '../fields/InvoicesField'


export const FORM_KEY = 'fileAttributes'


const validate = (values) => {
  const errors = {}

  return errors
}

let FileFieldsForm = props => {
  return (
    <form onSubmit={props.handleSubmit}> 
      <Card className="p-0">
        <FieldArray 
          name='invoices'
          component={InvoicesField}
        />

        <CardFooter>
          <Row>
            <Col>
              <Button outline theme="salmon" size="sm" onClick={props.onRemove}>
                <i className="material-icons">remove_circle</i> Remove File
              </Button>
            </Col>
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
        </CardFooter>
      </Card>
    </form>
  )
}

FileFieldsForm = reduxForm({
  form: FORM_KEY,
  validate,
  fields: [
    'invoices',
  ],
})(FileFieldsForm)

export default FileFieldsForm