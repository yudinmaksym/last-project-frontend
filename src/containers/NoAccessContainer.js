import React from 'react'
import Router from 'next/router'
import { Container, Row, Button } from 'shards-react'


const NoAcessContainer = (props) => (
  <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <h2><i class="fas fa-lock" /></h2>
        <h3>{props.title}</h3>
        <p>{props.message}</p>
      </div>
    </div>
  </Container>
)

NoAcessContainer.defaultProps = {
  title: 'Permission Denied',
  message: 'You have to subscribe enterprise plan for access',
}

export default NoAcessContainer
