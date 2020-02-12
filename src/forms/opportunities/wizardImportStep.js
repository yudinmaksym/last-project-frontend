import React, { useState } from 'react'
import { Field, reduxForm } from 'redux-form'
import { chunk, range } from 'lodash'
import {
  Row,
  Col,
  Form,
  Button,
  Card,
  Container,
  CardHeader,
  FormGroup,
  FormSelect,
} from 'shards-react'

import UploadContainer from '../../containers/UploadContainer'
import CSVImportContainer from '../../containers/CSVImportContainer'
import ManualDataInputContainer from '../../containers/ManualDataInputContainer'
import RenderForm from '../renderForm'

import validate from './validate'
import {
  calculationSectionFirst,
  calculationSectionSecond,
  calculationSectionThird,
  calculationSectionFourth,
} from './fields'


const importTypes = ['pdf', 'csv', 'manual']

const WizardImportStep = props => {
  const [importType, setImportType] = useState('pdf')
  const { handleSubmit, pristine, previousPage, submitting } = props
  return (
    <Form onSubmit={handleSubmit}>
      <Container className='mt-4'>
        <FormGroup>
          <label>Select import type</label>
          <FormSelect 
            onChange={(e) => setImportType(e.target.value)}
            type='select'
          >{importTypes.map(type => (<option key={type} value={type}>{type.toUpperCase()}</option>))}
          </FormSelect>
        </FormGroup>
        {importType === 'pdf' && <UploadContainer />}
        {importType === 'manual' && <ManualDataInputContainer />}
        {importType === 'csv' && <CSVImportContainer />}
      </Container>
      <Container className='mt-4'>
        <Button type="button" className="previous" onClick={previousPage}>
        Previous
        </Button>
        <Button type="submit" disabled={pristine || submitting}>
        Submit
        </Button>
      </Container>
    </ Form>


    
  // <Form onSubmit={handleSubmit}>
  //   <Card>
  //     <Container className='mt-4'>
  //       <RenderForm formFields={calculationSectionFirst} perRow={3}/> 
  //       <RenderForm formFields={calculationSectionSecond} perRow={2}/> 
  //     </Container> 
  //   </Card>
  //   <Card className='mt-2'>
  //     <CardHeader className='text-center'>Calculations</CardHeader>
  //     <Container className='mt-4'>
  //       <RenderForm formFields={calculationSectionThird} perRow={2}/> 
  //       <RenderForm formFields={calculationSectionFourth} perRow={3}/> 
  //     </ Container>
  //   </Card>
  //   <Container className='mt-4'>
  //     <Button type="button" className="previous" onClick={previousPage}>
  //       Previous
  //     </Button>
  //     <Button type="submit" disabled={pristine || submitting}>
  //       Submit
  //     </Button>
  //   </Container>
  // </Form>
  )
}

export default reduxForm({
  form: 'wizard',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(WizardImportStep)