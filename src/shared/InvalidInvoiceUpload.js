import React from 'react'
import {
  Row,
  Col,
} from 'shards-react'


export default ({ items = [] }) => {
  return (
    <div>
      <div className='h6'>Define meters at Missing Consumptions Mapping Page</div>
      {items.map(i => (
        <Row className='mb-3'>
          <Col>
            <p className='m-0'>Account number:</p>
            <span>{i.account_number}</span>
          </Col>
          <Col>
            <p className='m-0'>Fuel type: </p>
            <span>{i.invoice_type}</span>
          </Col>
        </Row>
      ))}
    </div>
  )
}