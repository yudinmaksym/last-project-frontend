import React from 'react'
import { reduxForm } from 'redux-form'
import {
  Form,
  Button,
  Container,
  FormFeedback,
} from 'shards-react'

import RenderForm from '../renderForm'

import { validateRegister as validate } from './validate'
import { registerFields as formFields } from './fields'


const ResetPasswordForm = props => {
  const { handleSubmit, pristine, submitting, onSubmit, error } = props

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <RenderForm formFields={formFields.filter(({ name }) => name === 'password' || name === 'repeatPassword')}/>
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
                  Reset
        </Button>
      </Container>
    </Form>
  )
}

export default reduxForm({
  form: 'resetPasswordForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(ResetPasswordForm)
