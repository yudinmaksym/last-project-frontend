import * as React from 'react'
import { FieldArray, Field, reduxForm } from 'redux-form'
import {
  Row,
  Col,
  CardBody,
} from 'shards-react'

import FilesField, { validate as ValidateFiles } from '../fields/FilesField'
import ProjectField from '../fields/ProjectField'


export const FORM_KEY = 'upload'

const validate = (values) => {
  const errors = {}
  
  if (!values.files || !values.files.length) {
    errors.files = { _error: 'At least one file must be entered' }
  } else {
    const filesArrayErrors = []
    values.files.forEach((member, memberIndex) => {
      const memberErrors = {}

      if (!member || !member.valid) {
        memberErrors.valid = 'Invalid'
        filesArrayErrors[memberIndex] = memberErrors
      }

    })
    if (filesArrayErrors.length) {
      errors.files = filesArrayErrors
    }
  }

  return errors
}

const FormSectionTitle = ({ title, description }) => (
  <Row form>
    <Col className="mb-3">
      <h6 className="form-text m-0">{title}</h6>
      <p className="form-text text-muted m-0">{description}</p>
    </Col>
  </Row>
)

let UploadForm = props => {
  return (
    <form onSubmit={props.handleSubmit} autoComplete={'off'}>
      <Row form className="mx-4">
        <Col className="mb-3">
          <FormSectionTitle
            title="Files"
            description="Upload .pdf files"
          />
        </Col>
      </Row>

      <Row form className="mx-4">
        <Col className="mb-3">
          <FieldArray 
            name="files" 
            component={FilesField}
            activeField={props.activeField}
            onSelect={props.onSelect}
          />
        </Col>
      </Row>
      
    </form>
  )
}

UploadForm = reduxForm({
  form: FORM_KEY,
  fields: [
    'files',
  ],
  initialValues: {
    'files': [
      // {
      //   'key': 'c9677000-a712-11e9-808b-77791d636e14.pdf',
      //   'name': 'Oct_2020.pdf',
      //   'valid': false,
      // },
    ],
  },
  validate,
})(UploadForm)

export default UploadForm