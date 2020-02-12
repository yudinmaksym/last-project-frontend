import React from 'react'
import Router from 'next/router'
import { Container, Button } from 'shards-react'


const Errors = (props) => (
  <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <h2>{props.code}</h2>
        <h3>{props.title}</h3>
        <p>{props.message}</p>
        <Button pill onClick={() => Router.back()}>&larr; Go Back</Button>
      </div>
    </div>
  </Container>
)

Errors.defaultProps = {
  code: 500,
  title: 'Something went wrong!',
  message: 'There was a problem on our end. Please try again later.',
}

export default Errors
