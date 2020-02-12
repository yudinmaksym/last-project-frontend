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
import ProjectBuildingsSelect from '../projects/ProjectBuildingsSelectTemp'

import validate from './validate'
import { fourthStepFields, drawingsReceived } from './fields'


const WizardFormFourthPage = props => {
  const { handleSubmit, pristine, previousPage, submitting, initialValues } = props
  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <Container className='mt-4'>
          <RenderForm formFields={fourthStepFields} perRow={3}/> 
        </Container> 
      </Card>
      <Card className='mt-2'>
        <ProjectBuildingsSelect
          submitLabel={'next'}
          showPrevBtn={true}
          isLastStep={true}
          onPrev={() => onChangeTab(step - 1)}
          onSubmit={() => onChangeTab(step + 1)}
          initialValues={initialValues}
          hideFooter={true} />
      </Card>
      <Card className='mt-2'>
        <CardHeader className='text-center'>Drawings Received</CardHeader>
        <Container >
          <RenderForm formFields={drawingsReceived} perRow={1}/> 
        </Container> 
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
})(WizardFormFourthPage)