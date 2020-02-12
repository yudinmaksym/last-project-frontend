import { renderField, renderCheckBox, renderPhoneInput } from '../../fields/fieldSet'


export const registerFields = [
  { name: 'name', label: 'Username', required: true, render: renderField },
  { name: 'email', type: 'email', label: 'Email Address', required: true, render: renderField },
  { name: 'password', label: 'Password', required: true, render: renderField, type: 'password' },
  { name: 'repeatPassword', label: 'Repeat Password', required: true, render: renderField, type: 'password' },
  { name: 'companyName', label: 'Company name', required: true, render: renderField },
  { name: 'phoneNumber', type: 'date', label: 'Phone number', required: true, render: renderPhoneInput },
  { name: 'terms', label: 'I agree with the Terms & Conditions.', required: true, render: renderCheckBox },
]

export const loginFields = [
  { name: 'email', type: 'email', label: 'Email Address', required: true, render: renderField },
  { name: 'password', label: 'Password', required: true, render: renderField, type: 'password' },
]
