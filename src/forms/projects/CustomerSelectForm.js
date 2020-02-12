import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  CardFooter,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Button,
} from 'shards-react'

import CustomerSelectField from '../../fields/CustomerSelectField'
import RenderForm from '../renderForm'
import { secondStepFields, editCustomerFields } from '../opportunities/fields.js'

import validate from './validate'


function formatInputBindings(fields, binding) {
  fields.forEach((f) => {
    if(!f.name.startsWith(`${binding}.`)) {
      f.name = `${binding}.${f.name}`
    }
  })
  return fields
}

export const FORM_KEY = 'projectCreateProcess'

const CustomerSelectForm = props => {
  const { 
    handleSubmit,
    showPrevBtn,
    onPrev,
    pristine,
    submitting,
    submitLabel,
    actualValues,
    editing,
  } = props
  console.log(actualValues)
  return (
    <form onSubmit={handleSubmit}>
      <ListGroup flush>
        {!editing && <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Field
                name="customer"
                label="Customer"
                component={CustomerSelectField}
              />
            </Col>
          </Row>
        </ListGroupItem>}
        {((actualValues
          && actualValues.customer
          && actualValues.customer.__isNew__)
            || (actualValues
            && actualValues.customer
            && actualValues.customer.id))
          && <ListGroupItem className="p-3">
            {editing && <RenderForm formFields={formatInputBindings(editCustomerFields, 'customer')} perRow={3} />}
            <RenderForm formFields={formatInputBindings(secondStepFields, 'customer')} perRow={3} />
          </ListGroupItem>}
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
              disabled={submitting || pristine || !actualValues.customer || !actualValues.customer.label} 
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
  enableReinitialize: true,
})(CustomerSelectForm)
