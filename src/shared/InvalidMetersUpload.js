import React from 'react'
import {
  Row,
  Col,
} from 'shards-react'
import uniqBy from 'lodash/uniqBy' 


export default ({ items = [] }) => {
  return (
    <div>
      <div className='h6'>These meters already exist in the system</div>
      {uniqBy(items, (e) => e.account_number && e.fuel_type).map(i => (
        <Row className='mb-3'>
          <Col>
            <p className='m-0'>Account number:</p>
            <span>{i.account_number}</span>
          </Col>
          <Col>
            <p className='m-0'>Fuel type: </p>
            <span>{i.fuel_type}</span>
          </Col>
        </Row>
      ))}
    </div>
  )
}
