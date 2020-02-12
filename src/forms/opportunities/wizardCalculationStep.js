import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { chunk, range } from 'lodash'
import {
  Row,
  Col,
  Form,
  Button,
  Card,
  Container,
  CardHeader,
} from 'shards-react'

import RenderForm from '../renderForm'

import validate from './validate'
import {
  fourthStepFields,
  calculationSectionFirst,
  calculationSectionSecond,
  calculationSectionThird,
  calculationSectionFourth,
  drawingsReceived,
} from './fields'


const WizardCalculationStep = props => {
  const { handleSubmit, pristine, previousPage, submitting } = props
  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <Container className='mt-4'>
          <RenderForm formFields={calculationSectionFirst} perRow={3}/> 
          <RenderForm formFields={calculationSectionSecond} perRow={2}/> 
        </Container> 
      </Card>
      <Card className='mt-2'>
        <CardHeader className='text-center'>Calculations</CardHeader>
        <Container className='mt-4'>
          <RenderForm formFields={calculationSectionThird} perRow={2}/> 
          <RenderForm formFields={calculationSectionFourth} perRow={3}/> 
        </ Container>
      </Card>
      <Container className='mt-4'>
        <Button type="button" className="previous" onClick={previousPage}>
          Previous
        </Button>
        <Button type="submit" disabled={pristine || submitting}>
          Submit
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
})(WizardCalculationStep)