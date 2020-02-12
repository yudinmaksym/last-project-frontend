import { renderField } from '../../fields/fieldSet'


export const userAccountFields = [
  { name: 'name', label: 'Username', required: true, render: renderField, required: false },
  { name: 'email', type: 'email', label: 'Email Address', render: renderField, required: false },
  { name: 'password', type: 'password', label: 'Password', render: renderField, required: false },
]

export const takaUserAccountFields = [
  { name: 'name', label: 'Username', required: true, render: renderField, required: false },
  { name: 'email', type: 'email', label: 'Email Address', render: renderField, required: false },
  { name: 'password', type: 'password', label: 'Password', render: renderField, required: false },
]

