import React, { useCallback } from 'react'
import { Container, Row, Col, Card, CardBody } from 'shards-react'
import { connect } from 'react-redux'

import Link from '../../components/common/Link'
import ResetPasswordForm from '../../forms/auth/resetPassword'
import { resetPassword } from '../../../redux/reducers/auth'


function getQuery (querystring) {
  // remove any preceding url and split
  querystring = querystring.substring(querystring.indexOf('?')+1).split('&')
  var params = {}, pair, d = decodeURIComponent
  // march and parse
  for (var i = querystring.length - 1; i >= 0; i--) {
    pair = querystring[i].split('=')
    params[d(pair[0])] = d(pair[1] || '')
  }

  return params
};

const ResetPasswordContainer = ({ reset }) => {

  const handleSubmit = useCallback((data) => {
    return reset({ ...data, ...getQuery(window.location.search) })
  })

  return (
    <Container fluid className="main-content-container d-flex px-4 vh-100 justify-content-center">
      <Row noGutters>
        <Col lg="3" md="5" className="auth-form mx-auto my-auto">
          <Card>
            <CardBody style={{ overflow: 'unset' }}>
              <ResetPasswordForm onSubmit={handleSubmit}/>
            </CardBody>
          </Card>
          <div className="auth-form__meta d-flex mt-4">
            <Link to="/auth/login">Sing in?</Link>
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
    reset: (data) => dispatch(resetPassword(data)),
  })
)(ResetPasswordContainer)
