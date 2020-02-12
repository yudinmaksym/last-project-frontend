import React, { useCallback, useState } from 'react'
import { Container, Row, Col, Card, CardBody } from 'shards-react'
import { connect } from 'react-redux'

import Link from '../../components/common/Link'
import ForgotPasswordForm from '../../forms/auth/forgotPassword'
import { requestResetPassword } from '../../../redux/reducers/auth'


const ForgotPasswordContainer = ({ requestReset }) => {
  const [showInfo, setShowInfo] = useState(false)
  const handleSubmit = useCallback(async (data) => {
    await requestReset(data)
    setShowInfo(true)
  })
  return (
    <Container fluid className="main-content-container d-flex px-4 vh-100 justify-content-center">
      <Row noGutters>
        <Col lg="3" md="5" className="auth-form mx-auto my-auto">
          <Card>
            <CardBody style={{ overflow: 'unset' }}>
              {showInfo
                ? <div>Check email to see next step</div>
                : <ForgotPasswordForm onSubmit={handleSubmit}/>}
            </CardBody>
          </Card>
          <div className="auth-form__meta d-flex mt-4">
            <Link to="/auth/login">Sing In?</Link>
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
    requestReset: (data) => dispatch(requestResetPassword(data)),
  })
)(ForgotPasswordContainer)
