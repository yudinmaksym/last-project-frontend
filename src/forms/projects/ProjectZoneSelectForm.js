import React from 'react'
import { Field, reduxForm } from 'redux-form'
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
  FormTextarea,
  Button,
  Container,
} from 'shards-react'

import ProjectZoneSelectField from '../../fields/ProjectZoneSelectField'

import validate from './validate'


export const FORM_KEY = 'projectCreateProcess'

const ProjectZoneSelectForm = props => {
  const { 
    handleSubmit,
    showPrevBtn,
    isLastStep,
    onPrev,
    pristine,
    submitting,
    invalid,
    submitLabel,
    actualValues,
  } = props
  return (
    <form onSubmit={handleSubmit}>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Field
                name="zone"
                label="Zone"
                companyId={actualValues.customer.value}
                component={ProjectZoneSelectField}
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
              disabled={submitting || invalid} 
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
})(ProjectZoneSelectForm)
