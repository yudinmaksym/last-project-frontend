import React from 'react'
import { reduxForm } from 'redux-form'
import {
  Form,
  Button,
  Container,
} from 'shards-react'

import RenderForm from '../renderForm'

import { validateRegister as validate } from './validate'
import { registerFields as formFields } from './fields'


const RegisterForm = props => {
  const { handleSubmit, pristine, submitting, onSubmit, error } = props

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <RenderForm formFields={formFields}/>
      </Container>
      <Container>
        <Button
          pill
          type='submit'
          theme="accent"
          className="d-table mx-auto"
          disabled={pristine || submitting}
        >
                  Create Account
        </Button>
      </Container>
    </Form>
  )
}

export default reduxForm({
  form: 'register',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(RegisterForm)
