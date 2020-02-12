import React from 'react'
import PropTypes from 'prop-types'
import ReactPhoneInput from 'react-phone-input-2'
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  Button,
  Container,
} from 'shards-react'
import 'react-phone-input-2/lib/style.css'

const roleOptions = ['member', 'admin']


const UserAccountDetails = ({ title, item, setUser, submit, isNew, error, itemMetadata, setUserMetadata, isAdmin, isOwner }) => {
  const handleChange = (e) => {
    setUser({ ...item, [e.target.name]: e.target.value })
  }

  const handleMetadataChange = (e) => {
    setUserMetadata({ ...itemMetadata, [e.target.name]: e.target.value })
  }

  console.log({ isAdmin, isOwner })
  return (
    <Card small className="mb-4">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form autoComplete="off">
                <Row form>
                  {/* First Name */}
                  <Col md="6" className="form-group">
                    <label htmlFor="feFirstName">Name</label>
                    <FormInput
                      id="feFirstName"
                      placeholder="First Name"
                      name="nickname"
                      value={item.nickname}
                      onChange={handleChange}
                    />
                  </Col>
                  {/* Last Name */}
                  <Col md="6" className="form-group">
                    {(!isOwner && isAdmin) && (
                    <>
                      <label htmlFor="feLastName">Role</label>
                      <FormSelect
                        id="feLastName"
                        placeholder="Last Name"
                        name="role"
                        value={itemMetadata.role}
                        onChange={handleMetadataChange}
                        disabled={!isAdmin}
                      >
                        {roleOptions.map((r, i) => (<option value={r} key={i}>{r}</option>))}
                      </FormSelect>
                    </>
                    )}
                    
                  </Col>
                </Row>
                <Row form autoComplete="off">
                  {/* Email */}
                  <Col md="6" className="form-group">
                    <label htmlFor="feEmail">Email</label>
                    <FormInput
                      type="email"
                      id="feEmail"
                      name="email"
                      placeholder="Email Address"
                      value={item.email}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </Col>
                  {/* Password */}
                  <Col md="6" className="form-group">
                    {(isAdmin || isOwner) && (
                    <>
                      <label htmlFor="fePassword">{!isNew && 'Set New'} Password</label>
                      <FormInput
                        type="password"
                        id="fePassword"
                        placeholder="**********"
                        name="password"
                        value={item.password}
                        onChange={handleChange}
                        autoComplete="new-password" 
                      />
                    </>
                    )}
                  </Col>
                </Row>
                {/* <FormGroup>
                <label htmlFor="feAddress">Address</label>
                <FormInput
                  id="feAddress"
                  placeholder="Address"
                  value="1234 Main St."
                  onChange={() => {}}
                />
              </FormGroup> */}
                <Row form>
                  {/* City */}
                  {/* <Col md="6" className="form-group">
                    <label htmlFor="feCity">City</label>
                    <FormInput
                      id="feCity"
                      placeholder="City"
                      onChange={() => {}}
                    />
                  </Col> */}
                  {/* State */}
                  {/* <Col md="4" className="form-group">
                    <label htmlFor="feInputState">State</label>
                    <FormSelect id="feInputState">
                      <option>Choose...</option>
                      <option>...</option>
                    </FormSelect>
                  </Col> */}
                  {/* Zip Code */}
                  {/* <Col md="2" className="form-group">
                    <label htmlFor="feZipCode">Zip</label>
                    <FormInput
                      id="feZipCode"
                      placeholder="Zip"
                      onChange={() => {}}
                    />
                  </Col> */}
                </Row>
                <Row form>
                  {/* Description */}
                  <Col md="6" className="form-group">
                    <label htmlFor="">Phone number</label>
                    <ReactPhoneInput
                      defaultCountry={'ae'}
                      value={itemMetadata.phoneNumber}
                      inputClass='w-100'
                      inputStyle={{ borderColor: '#e1e5eb' }}
                      onChange={(phoneNumber) => setUserMetadata({ ...itemMetadata, phoneNumber })}/>
                  </Col>
                </Row>
                {error && <Container fluid className="d-flex justify-content-center">
                  <h6 className="text-danger"><small>{error.message}</small></h6>
                </Container>}
                <Button onClick={submit} theme="accent">{isNew ? 'Create' : 'Update' } Account</Button>
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Card>
  )
}

UserAccountDetails.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
}

UserAccountDetails.defaultProps = {
  title: 'Account Details',
}

export default UserAccountDetails
