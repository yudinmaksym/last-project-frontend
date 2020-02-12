import React from 'react'
import { reduxForm } from 'redux-form'
import {
  Form,
  Button,
  Container,
} from 'shards-react'
import remove from 'lodash/remove'
import uniqBy from 'lodash/uniqBy'

import RenderForm from '../renderForm'
import { renderSelect, renderMultipleSelectOptions } from '../../fields/fieldSet'

import { validateUserAccount as validate } from './validate.js'
import { userAccountFields as formFields } from './fields'


const adminRoles = ['TakaAdmin', 'Admin']
const userRoles = ['User', 'TakaUser']
const CustomerRoles = ['Admin', 'User']
const userPermissions = ['READ', 'WRITE']


const getFormFields = ({ 
  formValues = {},
  isAdmin,
  isOwner,
  role,
  isNew,
  projects,
}) => {
  if(isAdmin && !isOwner) {
    if(!formFields.some(({ name }) => name === 'role')) {
      formFields.push({
        name: 'role',
        label: 'Role',
        required: true,
        render: renderSelect(CustomerRoles), 
      })
    }
  } else {
    remove(formFields, ({ name }) => name === 'role')
  }
  if(userRoles.includes(formValues.role)) {
    if(!formFields.some(({ name }) => name === 'permission')) {
      formFields.push({
        name: 'permission',
        label: 'Permission',
        required: true,
        render: renderSelect(userPermissions), 
      })
    }
  } else {
    remove(formFields, ({ name }) => name === 'permission')
  }

  if(!adminRoles.includes(formValues.role)) {
    remove(formFields, ({ name }) => name === 'projects')
    // if(!formFields.some(({ name }) => name === 'projects')) {
    formFields.push({
      name: 'projects',
      label: 'Assigned projects',
      render: renderMultipleSelectOptions(uniqBy(projects, 'value')), 
    })
    // } 
  } else {
    remove(formFields, ({ name }) => name === 'projects')
  }

  if(isNew) {
    formFields.filter(({ name }) => name !== ['projects'],).forEach((item) => {
      item.required = true 
    })
  } else {
    formFields.filter(({ name }) => name === 'role',).forEach((item) => {
      console.log(item)
      item.disabled = true 
    })
  }

  return formFields
}


const UserDetailsForm = ({
  handleSubmit,
  pristine,
  submitting,
  onSubmit,
  isNew,
  currentUser,
  initialValues,
  formValues,
  projectList,
  userProject,
  ...rest
}) => {
  console.log(rest)
  const role = currentUser.role
  const isAdmin = adminRoles.includes(role)
  const isOwner = currentUser.id === initialValues.id
  const displayFields = getFormFields({
    role,
    isAdmin,
    isOwner,
    formValues,
    isNew,
    projects: [ ...userProject, ...projectList.map((project) => ({
      label: project.project,
      value: project.project_id,
    }))],
  })
  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="new-password"> 
      <Container>
        <RenderForm formFields={displayFields} perRow={3} fillEmpty={true}/>
      </Container>
      <Container>
        <Button
          pill
          type='submit'
          theme="accent"
          className="d-table"
          disabled={pristine || submitting}
        >
          {isNew ? 'Create' : 'Update'}
        </Button>
      </Container>
    </Form>
  )
}

export default reduxForm({
  form: 'userDetails',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(UserDetailsForm)
