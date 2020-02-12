import React from 'react'
import { reduxForm } from 'redux-form'
import {
  Form,
  Button,
  Container,
  FormFeedback,
} from 'shards-react'

import RenderForm from '../renderForm'

import { validateForgotPassword  as validate } from './validate'
import { loginFields as formFields } from './fields'


const ForgotPasswordForm = ({ handleSubmit, pristine, submitting, onSubmit, error }) => (
  <Form onSubmit={handleSubmit(onSubmit)}>
    <Container>
      <RenderForm formFields={formFields.filter(({ name }) => name === 'email')}/>
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
                  Request Reset Password
      </Button>
    </Container>
  </Form>
)

export default reduxForm({
  form: 'forgotPasswordForm',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(ForgotPasswordForm)
