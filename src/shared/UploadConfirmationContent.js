import React, { useCallback } from 'react'
import {
  Row,
  Col,
} from 'shards-react'


const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const month = date.toLocaleString('default', { month: 'long' })
  return `${month}, ${date.getFullYear()}`
}
export default ({ items = [] }) => {
  return (
    <div>
      <div className='h6'>Consumptions records already exists and will be overrided</div>
      {items.map(i => (
        <Row className='mb-3'>
          <Col>
            <p className='m-0'>Account number:</p>
            <span>{i.account_number}</span>
          </Col>
          <Col>
            <p className='m-0'>Month:</p>
            <span>{formatDate(i.month)}</span>
          </Col>
          <Col>
            <p className='m-0'>Fuel type:</p>
            <span>{i.invoice_type}</span>
          </Col>
        </Row>
      ))}
    </div>
  )
}