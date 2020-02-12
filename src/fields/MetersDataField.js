import * as React from 'react'
import change, { Field } from 'redux-form'
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  FormGroup,
  FormInput,
  FormFeedback,
  FormSelect,
  Button,
} from 'shards-react'
import connect from 'react-redux'



const required = value => (value || typeof value === 'number' ? undefined : 'Missing')

const METER_FUEL_OPTIONS = [
  { value: 'Electricity', label: 'Electricity' },
  { value: 'Chilled Water', label: 'Chilled Water' },
  { value: 'Water', label: 'Water' },
  { value: 'LPG (Gas)', label: 'LPG (Gas)' },
  { value: 'Other', label: 'Other' },
]

const renderSelectField = ({
  input,
  label,
  type,
  options = [],
  meta: { touched, error, warning, valid, invalid },
}) => (
  <FormGroup>
    <label htmlFor={input.name}>{label}</label>
    
    <FormSelect
      id={input.name} 
      {...input}
      valid={touched && valid}
      invalid={touched && invalid}
    >
      <option value="" disabled selected>Select your option</option>
      {options.map(opt => <option value={opt.value}>{opt.label}</option>)}
    </FormSelect>

    <FormFeedback 
      valid={touched && valid}
    >{error}</FormFeedback>
  </FormGroup>
)

const renderTextField = ({
  input,
  label,
  meta: { touched, error, warning, valid, invalid },
  ...rest
}) => (
 
  <FormGroup>
    <label htmlFor={input.name}>{label}</label>
    <FormInput 
      id={input.name} 
      {...input} 
      {...rest} 
      placeholder={label}
      valid={touched && valid}
      invalid={touched && invalid}
    />
    <FormFeedback 
      valid={touched && valid}
    >{error}</FormFeedback>
  </FormGroup>
)

export default class MetersDataField extends React.Component {

  removeItem = (member, index) => (e) => {
    const item = this.props.fields.get(index)

    const isExisting = !!item.id

    if (isExisting) {
      this.props.onRemove && this.props.onRemove(
        member, 
        item,
        this.props.fields.name
      )

      return 
    }

    this.props.fields.remove(index)
  }

  renderMetersFields = (member, index, fields) => {
    const isDeleted = fields.get(index).deleted
    const id = fields.get(index).id
    const isExisting = !!id

    if (isDeleted) {
      return <div key={`meter-${index}`} />
    }

    return (
      <ListGroupItem className="py-4 p-0 border-bottom" key={`meter-${index}`}>
        <Row form>
          <Button theme="white" size="sm" className="remove-btn" onClick={this.removeItem(member, index)}>
            <span className="text-danger">
              <i className="material-icons">clear</i>
            </span>
          </Button>
          <Col className="mb-3" md="4">
            <Field 
              name={`${member}.Number`}
              label="Meter # (Same as Utility Bill)"
              component={renderTextField}
              validate={required}
            />
          </Col>
          <Col className="mb-3" md="4">
            <Field 
              name={`${member}.FuelType`}
              label="Fuel Type"
              component={renderSelectField}
              validate={required}
              options={METER_FUEL_OPTIONS}
            />
          </Col>
          <Col className="mb-3" md="4">
            <Field 
              name={`${member}.UtilityProviderName`}
              label="Utility Provider Name"
              component={renderTextField}
              validate={required}
            />
          </Col>
        </Row>
      </ListGroupItem>
    )
  }

  render() {
    const {
      fields,
    } = this.props

    return (
      <div className="p-0 meters-data-field">
        <ListGroup flush className="p-0">
          {fields.map(this.renderMetersFields)}
        </ListGroup>

        {/* <hr /> */}
        <Row className="text-right" form>
          <Col>
            <Button theme="white" type="button" onClick={() => fields.push({})}>
              <i className="material-icons">add_circle</i>{' '}Add Meter
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}
