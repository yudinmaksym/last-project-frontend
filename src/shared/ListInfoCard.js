import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter,
} from 'shards-react'

import Link from '../../src/components/common/Link'


const ListInfoCard = ({ title, info, children, id, className = '', link }) => (
  <Card small className={'h-100 '.concat(className)}>
    <CardHeader className="border-bottom">
      <div className="d-flex justify-content-between">
        <h6 className="m-0">{title}</h6>
        {(id || link) && <Link
          to={link ? link : `/projects/dashboard?id=${id}`}
          className="btn btn-white"
        >
          <i className="material-icons">insert_chart_outlined</i>
        </Link>}    
      </div>
    </CardHeader>

    <CardBody className="p-0">
      <ListGroup small flush className="list-group-small">
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
    {children && <CardFooter>
      {children}
    </CardFooter>}
  </Card>
)

export default ListInfoCard
