import React, { useCallback } from 'react'
import {
  Row,
  Col,
} from 'shards-react'


const formatDate = (dateStr) => {
  // const date = new Date(dateStr)
  // console.log(dateStr)
  // const month = date.toLocaleString('default', { month: 'long' })
  return dateStr
}
export default ({ items = [] }) => {
  return (
    <div>
      <div className='h6'>You are trying to upload duplicated consumptions</div>
      <div className='h6'>Do you want to continue anyway?</div>
      {items.map(i => (
        <Row className='mb-3'>
          <Col>
            <p className='m-0'>Invoice type:</p>
            <span>{i.invoice_type}</span>
          </Col>
          <Col>
            <p className='m-0'>Account number:</p>
            <span>{i.account_number}</span>
          </Col>
          <Col>
            <p className='m-0'>Meter number:</p>
            <span>{i.meter_number}</span>
          </Col>
          <Col>
            <p className='m-0'>Month:</p>
            <span>{formatDate(i.month)}</span>
          </Col>
        </Row>
      ))}
    </div>
  )
}