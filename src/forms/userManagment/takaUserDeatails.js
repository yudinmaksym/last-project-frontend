import React from 'react'
import { reduxForm } from 'redux-form'
import {
  Form,
  Button,
  Container,
} from 'shards-react'
import remove from 'lodash/remove'
import uniqBy from 'lodash/uniqBy'
import groupBy from 'lodash/groupBy'
import get from 'lodash/get'

import RenderForm from '../renderForm'
import { renderSelect, renderMultipleSelectOptions } from '../../fields/fieldSet'

import { validateUserAccount as validate } from './validate.js'
import { takaUserAccountFields as formFields } from './fields'


const adminRoles = ['TakaAdmin', 'Admin']
const userRoles = ['User', 'TakaUser']
const TakaRoles = ['TakaAdmin', 'TakaUser']
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
        render: renderSelect(TakaRoles), 
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
    console.log(projects, '***********')
    if(!formFields.some(({ name }) => name === 'projects')) {
      formFields.push({
        name: 'projects',
        label: 'Assigned projects',
        render: renderMultipleSelectOptions(projects), 
      })
    } 
  } else {
    remove(formFields, ({ name }) => name === 'projects')
  }

  if(isNew) {
    formFields.filter(({ name }) => name !== 'projects').forEach((item) => {
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
}) => {
  const role = currentUser.role
  const isAdmin = adminRoles.includes(role)
  const isOwner = currentUser.id === initialValues.id

  const projects = [ ...userProject, ...projectList].map((project) => ({
    label: project.project || project.label,
    value: project.project_id || project.value,
    companyName: get((currentUser.companyMap || [])
      .find(({ company }) => company.id == project.companyId), 'company.name'),
  }))

  const projectsMap = groupBy(uniqBy(projects, 'value'), 'companyName')
  const projectOptions = Object.entries(projectsMap).reduce((acc, [ k, v ]) => {
    return [...acc, {
      label: k,
      options: v,
    }]
  }, [])

  console.log(projectOptions)

  const displayFields = getFormFields({
    role,
    isAdmin,
    isOwner,
    formValues,
    isNew,
    projects: projectOptions,
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
  form: 'takaUserDetails',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(UserDetailsForm)
