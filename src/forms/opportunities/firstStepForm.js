import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Row,
  Col,
  Form,
  Button,
  Card,
  Container,
} from 'shards-react'
import { chunk, range } from 'lodash'
import { connect } from 'react-redux'

import RenderForm from '../renderForm'

import validate from './validate'
import { firstStepFields } from './fields'


const WizardFormFirstPage = props => {
  const { handleSubmit } = props

  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <Container className='mt-4'>
          <RenderForm formFields={firstStepFields} perRow={3}/> 
        </Container>
      </Card>
      <Container className='mt-4'>
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
})(WizardFormFirstPage)
