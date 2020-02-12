import React, { useCallback } from 'react'
import { Container, Row, Col, Card, CardBody } from 'shards-react'
import { connect } from 'react-redux'
import { useCookies } from 'react-cookie'

import Link from '../../components/common/Link'
import RegisterForm from '../../forms/auth/register'
import { signUp } from '../../../redux/reducers/auth'


const RegisterContainer = ({ signUp }) => {
  const [cookies, setCookie] = useCookies(['token'])

  const handleSubmit = useCallback((data) => {
    console.log(data)
    return signUp(data, setCookie)
  })
  return (
    <Container fluid className="main-content-container d-flex px-4 vh-100 justify-content-center">
      <Row noGutters>
        <Col lg="3" md="5" className="auth-form mx-auto my-auto">
          <Card>
            <CardBody style={{ overflow: 'unset' }}>
              <h5 className="auth-form__title text-center mb-4">
                Create New Account
              </h5>
              <RegisterForm onSubmit={handleSubmit}/>
            </CardBody>
          </Card>
          <div className="auth-form__meta d-flex mt-4">
            <Link to="/auth/forgot-password">Forgot your password?</Link>
            <Link to="/auth/login" className="ml-auto">
              Sign In?
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default connect(
  () => ({}),
  (dispatch) => ({
    signUp: (...args) => dispatch(signUp(...args)),
  })
)(RegisterContainer)
