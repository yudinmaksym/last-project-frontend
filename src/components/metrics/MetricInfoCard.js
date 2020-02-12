import React from 'react'
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardFooter,
} from 'shards-react'

import { formatNumber } from '../../utils/format'


const MetricCard = ({ title, value, metric }) => (
  <Col>
    <Card>
      <CardHeader className="d-flex justify-content-center">
        {title}
      </CardHeader>
      <div className="d-flex justify-content-center">
        <h3>{formatNumber(value) || 0}</h3>
      </div>
      {metric && <CardFooter className="d-flex justify-content-center">
        <h6>{metric}</h6>
      </CardFooter>}
    </Card>
  </Col>
)


export default MetricCard