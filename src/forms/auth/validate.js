import { registerFields, loginFields } from './fields'


const emailRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

const validateEmail = ({ email = '' }, errors) => {
  if(!email.match(emailRegexp)) {
    errors.email = 'should be valid email'
  }
}

const validatePasswords = ({ password = '', repeatPassword }, errors) => {
  if(password !== repeatPassword) {
    errors.repeatPassword = 'Confirmation password not mutch'
  }
  if(password.length < 8) {
    errors.password = 'Password should be at least 8 lenght'
  }
}

const validateRequired = (values, errors, fields) => fields.forEach(({ name, required }) => {
  required && !values[name] && (errors[name] = 'Required')
})

const validatePhoneNumber = ({ phoneNumber = '' }, errors) => {
  if(phoneNumber.length < 10) {
    errors.phoneNumber = 'Phone number is invalid'
  }
}

export const validateRegister = (values) => {
  const errors = {};

  [ validateRequired,
    validateEmail, 
    validatePasswords,
    validatePhoneNumber,
  ].forEach((validate) => validate(values, errors, registerFields))


  return errors
}

export const validateLogin = (values) => {
  const errors = {};

  [ validateRequired, validateEmail ].forEach((validate) => validate(values, errors, loginFields))


  return errors
}

export const validateForgotPassword = (values) => {
  const errors = {};

  [ validateRequired, validateEmail ]
    .forEach((validate) => validate(values, errors, loginFields
      .filter(({ name }) => name === 'email')))


  return errors
}

export const validateResetPassword = (values) => {
  const errors = {};

  [ validateRequired, validatePasswords ]
    .forEach((validate) => validate(values, errors, registerFields
      .filter(({ name }) => name === 'password' || name === 'repeatPassword')))


  return errors
}
