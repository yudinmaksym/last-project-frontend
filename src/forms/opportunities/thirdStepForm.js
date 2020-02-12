import React from 'react'
import { reduxForm } from 'redux-form'
import {
  Form,
  Button,
  Card,
  Container,
  CardHeader,
} from 'shards-react'

import RenderForm from '../renderForm'

import validate from './validate'
import { thirdStepFields, timeframeAndSchedule } from './fields'


const fieldsForExclude = ['productOfferingDetails', 'productLumpSum', 'eem']

const formFilter = (values) => ({ name }) => {
  if(fieldsForExclude.includes(name)) {
    if(values.productOfferingCategory === 'EPC') {
      return false
    }
  }
  return true
}

const WizardFormThirdPage = props => {
  
  const { handleSubmit, previousPage, formValues } = props
  console.log(formValues)
  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <Container className='mt-4'>
          <RenderForm formFields={thirdStepFields.filter(formFilter(formValues))} perRow={3}/>
        </Container>
      </Card>
      <Card className='mt-2'>
        <CardHeader className='text-center'>Timeframe and Schedule</CardHeader>
        <Container >
          <RenderForm formFields={timeframeAndSchedule} perRow={3}/>
        </Container>
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
})(WizardFormThirdPage)
