import * as React from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import { startCase } from 'lodash'
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
} from 'shards-react'


const displayCardFields = ['buildingName', 'buildingType', 'owner' ,'address']

const SalesOpportunityCard = ({ item }) => {
  return (
    <Card className='m-1' onClick={() => Router.replace(`/sales-opportunities/edit?id=${item.id}`)}>
      <CardHeader className='h5'>{item.name}</CardHeader>
      <CardBody>
        {Object.keys(item)
          .filter(key => displayCardFields.includes(key))
          .map(key => (
            <div key={item[key]}>
              <label className='mr-2'>{startCase(key)}:</label>
              <span>{item[key]}</span>
            </div>
          ))}
      </CardBody>
    </Card>
  )
}

const SalesOpportunitiesContainer = ({ items }) => {
  return (
    <Container>
      <Row>
        {items.map(i => (
          <Col md={4} sm={6}>
            <SalesOpportunityCard item={i}/>
          </Col>
        ))}
      </Row>
    </Container>
  )
}



export default connect(
  ({ salesOpportunity }) => ({
    page: salesOpportunity.list.page,
    pageSize: salesOpportunity.list.pageSize,
    items: salesOpportunity.list.items,
    pages: salesOpportunity.list.pagesCount,
    loading: salesOpportunity.loading,
    count: salesOpportunity.list.count,
    user: salesOpportunity.currentUser,
  }),
  (dispatch) => ({
    loadNext: (pageSize, page) => dispatch(loadListUsers(pageSize, page)),
    deleteUser: (id) => dispatch(deleteUser(id)),
  })
)(SalesOpportunitiesContainer)