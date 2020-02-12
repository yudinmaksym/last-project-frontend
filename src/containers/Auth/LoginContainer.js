import React, { useCallback } from 'react'
import { Container, Row, Col, Card, CardBody } from 'shards-react'
import { connect } from 'react-redux'
import { useCookies } from 'react-cookie'

import Link from '../../components/common/Link'
import LoginForm from '../../forms/auth/login'
import { signIn } from '../../../redux/reducers/auth'


const LoginContainer = ({ login }) => {
  const [cookies, setCookie] = useCookies(['token'])

  const handleSubmit = useCallback((data) => {
    return login(data, setCookie)
  })
  return (
    <Container fluid className="main-content-container d-flex px-4 vh-100 justify-content-center">
      <Row noGutters>
        <Col lg="3" md="5" className="auth-form mx-auto my-auto">
          <Card>
            <CardBody style={{ overflow: 'unset' }}>
              <h5 className="auth-form__title text-center mb-4">
                Sign In
              </h5>
              <LoginForm onSubmit={handleSubmit}/>
            </CardBody>
          </Card>
          <div className="auth-form__meta d-flex mt-4">
            <Link to="/auth/forgot-password">Forgot your password?</Link>
            <Link to="/auth/register" className="ml-auto">
              Sign up?
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
    login: (data, setCookie) => dispatch(signIn(data, setCookie)),
  })
)(LoginContainer)
