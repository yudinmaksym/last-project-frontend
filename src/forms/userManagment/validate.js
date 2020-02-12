import { userAccountFields } from './fields'


const emailRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

const validateEmail = ({ email = '' }, errors) => {
  if(!email.match(emailRegexp)) {
    errors.email = 'should be valid email'
  }
}

const validatePasswords = ({ password = '' }, errors) => {
  if(password && password.length < 8) {
    errors.password = 'Password should be at least 8 lenght'
  }
}

const validateRequired = (values, errors, fields) => fields.forEach(({ name, required }) => {
  required && !values[name] && (errors[name] = 'Required')
})

export const validateUserAccount = (values) => {
  const errors = {};

  [ validateRequired,
    validateEmail,
    validatePasswords ].forEach((validate) => validate(values, errors, userAccountFields))


  return errors
}
