import React, { useCallback, useState } from 'react'
import { Container, Row, Col, Card, CardBody, FormSelect, Button, CardFooter } from 'shards-react'
import { connect } from 'react-redux'
import { useCookies } from 'react-cookie'

import { exchange } from '../../../redux/reducers/auth'


const AbminContainer = ({ exchange, availableCompanies }) => {
  const [{ token }, setCookie, destroyCookie] = useCookies()
  const [companyId, setCompanyId] = useState(availableCompanies[0].id)

  const handleClick = useCallback(() => {
    destroyCookie('token', { path: '/' })
    exchange({ companyId, token }, setCookie)
  }, [companyId])

  return (
    <Container fluid className="main-content-container d-flex px-4 vh-100 justify-content-center">
      <Row noGutters>
        <Col lg="3" md="5" className="auth-form mx-auto my-auto">
          <Card>
            <CardBody style={{ overflow: 'unset' }}>
              <h5 className="auth-form__title text-center mb-4">
                  Select company
              </h5>
              <FormSelect onChange={(e) => setCompanyId(e.target.value)}>
                {availableCompanies.map(({ id, name }) => (
                  <option value={+id} key={id}>{name}</option>
                ))}
              </FormSelect>
            </CardBody>
            <CardFooter>
              <Row noGutters className="d-flex justify-content-center">
                <Button onClick={handleClick}>Select</Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default connect(
  ({ companies }) => ({
    availableCompanies: companies.list,
  }),
  (dispatch) => ({
    exchange: (data, setCookie) => dispatch(exchange(data, setCookie)),
  })
)(AbminContainer)
