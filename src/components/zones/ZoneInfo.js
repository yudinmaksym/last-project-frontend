import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
} from 'shards-react'

import InfoIcon from '../common/InfoIcon'


const ZoneInfo = ({ title, info }) => (
  <Card small className="h-100">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
      {/* <div className="block-handle" /> */}
    </CardHeader>

    <CardBody className="p-0">
      <ListGroup small flush className="list-group-small border-bottom">
        {info.map((item, idx) => item.space ? (
          <ListGroupItem 
            key={idx} 
            className="d-flex px-3 p-0 border-top-0" 
            style={{ backgroundColor: 'rgba(242, 243, 245, 0.4)' }}>
            <span className="text-muted d-block my-2">{item.title}</span>
          </ListGroupItem>
        ) : (
          <ListGroupItem key={idx} className="d-flex px-3 py-1">
            <span className="text-semibold text-fiord-blue">{item.title}</span>
            <span className="ml-auto text-right text-semibold text-reagent-gray">
              {item.value}
            </span>
            {item.info && (
              <InfoIcon 
                id={`zone_info_${idx}`}
                message={item.info}
              />
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
    </CardBody>
  </Card>
)

ZoneInfo.defaultProps = {
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
    {
      title: 'Reddit',
      value: '8,281',
    },
    {
      title: 'The Next Web',
      value: '7,128',
    },
    {
      title: 'Tech Crunch',
      value: '6,218',
    },
    {
      title: 'YouTube',
      value: '1,218',
    },
    {
      title: 'Adobe',
      value: '1,171',
    },
  ],
}

export default ZoneInfo
