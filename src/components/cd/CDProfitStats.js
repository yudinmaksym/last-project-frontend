import * as React from 'react'
import {
  Card,
  CardBody,
  Row,
  Col,
} from 'shards-react'

import { formatNumber, formatPercent } from '../../utils/format'
import MetricBox from '../../components/metrics/MetricBox'


const CDProfitStats = ({ 
  version,
  profits,
}) => { 
  const stats = [
    {
      title: '10 Year Profit', 
      value: formatNumber(profits.customer.TenYearProfit),
    },
    {
      title: 'NPV', 
      value: formatNumber(profits.customer.NPV),
    },
    {
      title: 'ROI', 
      value: formatPercent(profits.customer.ROI),
    },
  ]


  const w = (12 / stats.length)

  if (version === 2) {
    return (
      <Row>
        <Col md="4" lg="4" className="mb-4">
          <MetricBox 
            label={'10 Years Profit'}
            value={profits.customer.TenYearProfit}
            variation="1"
          />
        </Col>
        <Col md="4" lg="4" className="mb-4">
          <MetricBox 
            label={'NPV'}
            value={profits.customer.NPV}
            variation="1"
          />
        </Col>
        <Col md="4" lg="4" className="mb-4">
          <MetricBox 
            label={'ROI'}
            value={profits.customer.ROI}
            variation="1"
          />
        </Col>
      </Row>
    )
  }


  // only for dev
  // return <code>{JSON.stringify(profits)}</code>

  return (
    <Card small className="cd-profit-stats mb-4">
      <CardBody className="py-0 px-3">
        <Row>
          {stats.map((stat, idx) => (
            <Col key={idx} lg={w} md="6" sm={w} className="text-center cd-profit-stats__item py-5">
              <h4 className="m-0">{stat.value}</h4>
              <span className="text-light text-uppercase">{stat.title}</span>
            </Col>
          ))}
        </Row>
      </CardBody>
    </Card>
  )
}

CDProfitStats.defaultProps = {
  version: 1,
  profits: {
    tenYearProfit: 0,
    npv: 0,
    roi: 0,
    irr: 0,
    tenYearSavingsShare: 0,
  },
}

export default CDProfitStats
