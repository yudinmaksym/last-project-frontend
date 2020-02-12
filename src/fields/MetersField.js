import * as React from 'react'
import { Field } from 'redux-form'
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  CardBody,
  FormGroup,
  FormInput,
  FormFeedback,
  Button,
} from 'shards-react'

import {
  DEWA_ELECTRIC,
  DEWA_WATER,
  CHILLED_WATER,
} from '../types/files'

import TypeField from './TypeField'
import { renderFields } from './InvoicesField'


const required = value => (value || typeof value === 'number' ? undefined : 'Missing')


export default class MetersField extends React.Component {


  renderMetersFields = (member, index, fields) => {
    const Type = fields.get(index)['Invoice Type']

    return (
      <ListGroupItem className="py-4 p-0 border-bottom" key={`meter-${index}`}>
        <Row form className="mx-4">
          <Col>
            <h6>Meter #{index+1}</h6>
          </Col>
        </Row>

        <Row form className="mx-4">
          <Col>
            <Field
              name={`${member}.Invoice Type`}
              component={TypeField}
              validate={required}
            />
          </Col>
        </Row>

        {renderFields(Type, member)}
      </ListGroupItem>
    )
  }

  render() {
    const {
      fields,
    } = this.props

    return (
      <CardBody className="p-0">
        <ListGroup flush className="p-0">
          {fields.map(this.renderMetersFields)}
        </ListGroup>

        {/* <hr /> */}
        <Row className="pt-3 mx-4 text-center" form>
          <Col>
            <Button theme="white" type="button" onClick={() => fields.push({})}>
              <i className="material-icons">add_circle</i>{' '}Add Meter
            </Button>
          </Col>
        </Row>
      </CardBody>
    )
  }
}