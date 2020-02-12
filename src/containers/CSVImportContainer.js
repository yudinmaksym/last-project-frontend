import React from 'react'
import isEqual from 'lodash/isEqual'

import ConsumpCsv from '../../pages/files/csvConsump'


const fields = [
  'invoice_type',
  'utility_provider',
  'account_number',
  'meter_number',
  'month',
  'consumption_KWh',
  'cost_AED',
]

const compareArr = (a, b) => {
  return isEqual(a, b)
}

const validateFileFields = (header, fields) => {
  const v = compareArr(header, fields)
  return !header.every(field => fields.includes(field))
}

const downloadCsvTemplate = e => {
  const rows = [
    fields,
  ]
  const csvContent = `data:text/csv;charset=utf-8,${rows
    .map(el => el.join(','))
    .join('\n')}`

  console.log(csvContent)
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'consumption_template.csv')
  document.body.appendChild(link) // Required for FF

  link.click()
}



const CSVImportContainer = () => {
  return (
    <ConsumpCsv
      error
      compareArr={compareArr}
      validateFileFields={validateFileFields}
      downloadCsvTemplate={downloadCsvTemplate}
      fields={fields}
    />
  )
}

export default CSVImportContainer