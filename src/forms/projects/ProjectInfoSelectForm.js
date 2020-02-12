import React from 'react'
import get from 'lodash/get'
import { Field, reduxForm } from 'redux-form'
import {
  CardFooter,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  FormFeedback,
  Button,
} from 'shards-react'

import RenderForm from '../renderForm'
import { firstStepFields, thirdStepFields, timeframeAndSchedule } from '../opportunities/fields.js'

import validate from './validate'
import { FORM_KEY } from './ProjectZoneSelectForm'


const fieldsForExclude = ['project.productOfferingDetails', 'project.productLumpSum', 'project.eem']

const formFilter = ({ project = {} } = {}) => ({ name }) => {
  if(fieldsForExclude.includes(name)) {
    if(project.productOfferingCategory === 'EPC') {
      return false
    }
  }
  return true
}

function formatInputBindings(fields, binding) {
  fields.forEach((f) => {
    if(!f.name.startsWith(`${binding}.`)) {
      f.name = `${binding}.${f.name}`
    }
  })
  return fields
}

const renderNameField = ({ 
  input,
  placeholder,
  label, 
  type,
  className,
  meta: { touched, error, valid }, 
}) => (
  <div>
    <label>{label}</label>
    <div className="form-group">
      <input {...input} placeholder={placeholder} type={type} className={className} />
      {touched && error && <FormFeedback valid={valid}>{error}</FormFeedback>}
    </div>
  </div>
)

const ProjectInfoSelectForm = props => {
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
    currentUser,
  } = props

  const renderExtraInputs = get(currentUser, 'role', '').startsWith('Taka')
  return (
    <form onSubmit={handleSubmit}>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Field
                name="project.name"
                label="Name"
                placeholder={'Project Name'}
                className="mb-3 form-control form-control-lg"
                component={renderNameField}
              />
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
      {renderExtraInputs && (
        <>
          <ListGroup flush>
            <ListGroupItem className="p-3">
              <RenderForm formFields={formatInputBindings(firstStepFields, 'project')} perRow={3} />
            </ListGroupItem>
          </ListGroup>
          <ListGroup flush>
            <ListGroupItem className="p-3">
              <RenderForm
                formFields={formatInputBindings(thirdStepFields.filter(formFilter(actualValues)), 'project')}
                perRow={3} />
            </ListGroupItem>
          </ListGroup>
          <ListGroup flush>
            <ListGroupItem className="p-3">
              <RenderForm formFields={formatInputBindings(timeframeAndSchedule, 'project')} perRow={3} />
            </ListGroupItem>
          </ListGroup>
        </>
      )}
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
              disabled={submitting} 
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
})(ProjectInfoSelectForm)
