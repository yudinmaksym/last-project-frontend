import React, { useState } from 'react'
import {
  Container,
  FormGroup,
  FormSelect,
} from 'shards-react'

import UploadContainer from './UploadContainer'
import CSVImportContainer from './CSVImportContainer'
import EditManualConsumptionsContainer from './EditManualConsumptionsContainer'


const importTypes = ['pdf', 'csv', 'manual']

const GeneralUploadContainer = () => {
  const [importType, setImportType] = useState('pdf')
  return (
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
      {importType === 'manual' && <EditManualConsumptionsContainer />}
      {importType === 'csv' && <CSVImportContainer />}
    </Container>
  )
}

export default GeneralUploadContainer