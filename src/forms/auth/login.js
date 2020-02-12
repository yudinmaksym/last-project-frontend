import React from 'react'
import { reduxForm } from 'redux-form'
import {
  Form,
  Button,
  Container,
  FormFeedback,
  FormGroup,
} from 'shards-react'

import RenderForm from '../renderForm'

import { validateLogin as validate } from './validate'
import { loginFields as formFields } from './fields'


const LoginForm = ({ handleSubmit, pristine, submitting, onSubmit, error }) => (
  <Form onSubmit={handleSubmit(onSubmit)}>
    <Container>
      <RenderForm formFields={formFields}/>
      {error && <FormFeedback style={{ display: 'block' }}>{error}</FormFeedback>}
    </Container>
    <Container>
      <Button
        pill
        type='submit'
        theme="accent"
        className="d-table mx-auto"
        disabled={pristine || submitting}
      >
                  Sign In
      </Button>
    </Container>
  </Form>
)

export default reduxForm({
  form: 'login',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(LoginForm)
