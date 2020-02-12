import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  CardHeader,
  CardBody,
} from 'shards-react'

import RenderForm from '../renderForm'
import ProjectZoneSelectField from '../../fields/ProjectZoneSelectField'

import validate from './validate'
import { secondStepFields } from './fields'


const WizardFormSecondPage = props => {
  const { handleSubmit, previousPage, zones, formValues = {} } = props

  const showForm = formValues.Customer
    && formValues.Customer.label
    && !zones.some(({ label }) => label === formValues.Customer.label)
  return (
    <Form onSubmit={handleSubmit}>
      <Card className='pb-4'>
        <CardHeader>Customer infirmation</CardHeader>
        {/* <CardBody> */}
        <Container className='mt-4'>
          <Field name={'Customer'} type={'select'} component={ProjectZoneSelectField} label={'Customer'}/>
          {showForm && <RenderForm formFields={secondStepFields} perRow={3}/>} 
        </Container>
        {/* </CardBody> */}
      </Card>
      
      <Container className='mt-4'>
        <Button type="button" className="previous" onClick={previousPage}>
          Previous
        </Button>
        <Button type="submit" className="next">
          Next
        </Button>
      </Container>
    </Form>
  )
}

export default reduxForm({
  form: 'wizard',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(WizardFormSecondPage)
