import React from 'react'
import cn from 'classnames'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
} from 'shards-react'
	
	
import CDResultsTable from './CDResultsTable'


const CDResultsCard = props => {
  const {
    title,
    subTitle,
    labels,
    data,
    years,
  } = props

  return (
    <Card small className="mb-4">
      <CardHeader>
        <Row>
          <Col>
            <h6 className="m-0">{title}</h6>
            <h6 className="m-0">{subTitle}</h6>
          </Col>
        </Row>
      </CardHeader>
      <CardBody className="p-0">
        <CDResultsTable
          years={years}
          labels={labels}
          data={data}
        />
      </CardBody>
    </Card>
  )
}

CDResultsCard.defaultProps = {
  title: 'Results',
}

export default CDResultsCard
