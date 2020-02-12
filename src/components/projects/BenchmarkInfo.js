import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
} from 'shards-react'


const BenckmarkInfo = ({ title,subtitle, info }) => (
  <Card small className="h-100">
    <CardHeader className="border-bottom">
      <div>
        <h5 className="m-0 mb-2">{title}</h5>
        <div><h6 className="m-0 text-left">{subtitle}</h6></div>
      </div>
    </CardHeader>

    <CardBody className="p-0">
      <ListGroup small flush className="list-group-small border-bottom">
        {info.map((item, idx) => (
          <ListGroupItem key={idx} className="d-flex px-3 py-1">
            <span className="text-semibold text-fiord-blue">{item.title}</span>
            <span className="ml-auto text-right text-semibold text-reagent-gray">
              {item.value}
            </span>
          </ListGroupItem>
        ))}
      </ListGroup>
    </CardBody>
  </Card>
)

BenckmarkInfo.defaultProps = {
  title: 'Top Referrals',
  info: [
    {
      title: 'GitHub',
      value: '19,291',
    },
    {
      title: 'Stack Overflow',
      value: '11,201',
    },
    {
      title: 'Hacker News',
      value: '9,291',
    },
  ],
}

export default BenckmarkInfo
