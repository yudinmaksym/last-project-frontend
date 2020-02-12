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
} from 'shards-react'

import {
  DEWA_ELECTRIC,
  DEWA_WATER,
  CHILLED_WATER,
} from '../types/files'

import TypeField from './TypeField'
import DateField from './DateField'


const required = value => (value || typeof value === 'number' ? undefined : 'Missing')

export function validate(values) {
  const errors = {}
  
  return errors
}

export const renderTextField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
}) => (
  <FormGroup>
    <label htmlFor={input.name}>{label}</label>
    <FormInput 
      id={input.name} 
      {...input} 
      placeholder={label} 
      type={type}
      invalid={!!error}
      valid={!error}
    />
    <FormFeedback 
      valid={!error}
    >{error}</FormFeedback>
  </FormGroup>
)

export const renderNumberField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
}) => (
  <FormGroup>
    <label htmlFor={input.name}>{label}</label>
    <FormInput 
      id={input.name} 
      {...input} 
      placeholder={label} 
      type={type}
      invalid={!!error}
      valid={!error}
    />
    <FormFeedback 
      valid={!error}
    >{error}</FormFeedback>
  </FormGroup>
)

export const renderDateField = ({
  input,
  label,
  type,
  meta: { touched, error, warning, valid },
}) => (
  <FormGroup>
    <label htmlFor={input.name}>{label}</label>
    <FormInput 
      id={input.name} 
      {...input} 
      placeholder={label} 
      type={type}
      invalid={!!error}
      valid={!error}
    />
    <FormFeedback 
      valid={!error}
    >{error}</FormFeedback>
  </FormGroup>
)


// `id` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
// `project_id` char(36) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
// `meter_num` varchar(250) DEFAULT NULL,
// `invoice_number` varchar(250) DEFAULT NULL,
// `month` date DEFAULT NULL,
// `start_date` date DEFAULT NULL,
// `end_date` date DEFAULT NULL,
// `current_reading` int(11) DEFAULT NULL,
// `previous_reading` int(11) DEFAULT NULL,
// `consumption_kWh` float DEFAULT NULL,
// `consumption_AED` float DEFAULT NULL,
// `sub_tenant_consumption_kWh` float DEFAULT NULL,
// `sub_tenant_consumption_AED` float DEFAULT NULL,
// `source` varchar(250) DEFAULT NULL,
// `mdb_number` varchar(250) DEFAULT NULL,
// `consumption_rate_AED` float DEFAULT NULL,
// `invoice_type` varchar(250) DEFAULT NULL,
// `created_at` datetime NOT NULL,
// `updated_at` datetime NOT NULL,
// `customer_id` varchar(250) DEFAULT NULL,
// `project_name` varchar(250) DEFAULT NULL,
// `import_id` varchar(250) DEFAULT NULL,
// `invoice_number_meter_id` varchar(250) DEFAULT NULL,

const renderEmicoolFields = (fieldPrefix) => (
  <React.Fragment>
    
    <Row form className="mx-4">
      <Col className="mb-3" md="3">
        <Field
          name={`${fieldPrefix}invoice_number`}
          label={'Invoice Number'}
          validate={required}
          component={renderTextField}
        />
      </Col>

      <Col className="mb-3" md="3">
        <Field
          name={`${fieldPrefix}customer_id`}
          label={'Customer ID'}
          validate={required}
          component={renderTextField}
        />
      </Col>
      
      <Col className="mb-3" md="3">
        <Field
          name={`${fieldPrefix}account_num`}
          label={'Account #'}
          validate={required}
          component={renderTextField}
        />
      </Col>

      <Col className="mb-3" md="3">
        <Field
          name={`${fieldPrefix}meter_num`}
          label={'Meter #'}
          validate={required}
          component={renderTextField}
        />
      </Col>
    </Row>

    <Row form className="mx-4">
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}month`}
          label={'Tax Invoice Month'}
          type="date"
          validate={required}
          component={DateField}
          showMonthYearPicker
          dateFormat="MM/yyyy"
        />
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}start_date`}
          label={'Start Date'}
          validate={required}
          component={DateField}
        />
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}end_date`}
          label={'End Date'}
          validate={required}
          component={DateField}
        />
      </Col>
    </Row>

    <Row form className="mx-4">
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}total_current_consumption_MWH`}
          label={'Total Current Consumption (MWH)'}
          validate={required}
          component={renderTextField}
        />  
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}current_reading`}
          label={'Current Reading'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}previous_reading`}
          label={'Previous Reading'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
    </Row>

    <Row form className="mx-4">
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}consumption_AED`}
          label={'Consumption (AED)'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}consumption_rate_AED`}
          label={'Consumption Rate (AED)'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}fuel_surcharge_rate_AED`}
          label={'Fuel Surcharge Rate (AED)'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
    </Row>
  </React.Fragment>
)

const renderElectricityFields = (fieldPrefix) => (
  <React.Fragment>
    <Row form className="mx-4">
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}invoice_number`}
          label={'Invoice Number'}
          validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}account_num`}
          label={'Account #'}
          validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}meter_num`}
          label={'Meter #'}
          validate={required}
          component={renderTextField}
        />
      </Col>
    </Row>

    <Row form className="mx-4">
      <Col className="mb-3" md="6">
        <Field
          name={`${fieldPrefix}start_date`}
          label={'Start Date'}
          validate={required}
          component={DateField}
        />
      </Col>

      <Col className="mb-3" md="6">
        <Field
          name={`${fieldPrefix}end_date`}
          label={'End Date'}
          validate={required}
          component={DateField}
        />
      </Col>
    </Row>

    <Row form className="mx-4">
      <Col className="mb-3" md="6">
        <Field
          name={`${fieldPrefix}consumption`}
          label={'Consumption (kWh)'}
          validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="6">
        <Field
          name={`${fieldPrefix}consumption_AED`}
          label={'Consumption (AED)'}
          validate={required}
          component={renderTextField}
        />
      </Col>
    </Row>

    <Row form className="mx-4">
      <Col className="mb-3" md="6">
        <Field
          name={`${fieldPrefix}current_reading`}
          label={'Current Reading'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="6">
        <Field
          name={`${fieldPrefix}previous_reading`}
          label={'Previous Reading'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
    </Row>

    <Row form className="mx-4">
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}submeter_consumption`}
          label={'SubMeter Consumption'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}consumption_rate_AED`}
          label={'Consumption Rate (AED)'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}fuel_surcharge_rate_AED`}
          label={'Fuel Surcharge Rate (AED)'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
    </Row>
  </React.Fragment>
)

const renderWaterFields = (fieldPrefix) => (
  <React.Fragment>
    <Row form className="mx-4">
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}invoice_number`}
          label={'Invoice Number'}
          validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}account_num`}
          label={'Account #'}
          validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}meter_num`}
          label={'Meter #'}
          validate={required}
          component={renderTextField}
        />
      </Col>
    </Row>

    <Row form className="mx-4">
      <Col className="mb-3" md="6">
        <Field
          name={`${fieldPrefix}start_date`}
          label={'Start Date'}
          validate={required}
          component={DateField}
        />
      </Col>

      <Col className="mb-3" md="6">
        <Field
          name={`${fieldPrefix}end_date`}
          label={'End Date'}
          validate={required}
          component={DateField}
        />
      </Col>
    </Row>

    <Row form className="mx-4">
      <Col className="mb-3" md="6">
        <Field
          name={`${fieldPrefix}consumption`}
          label={'Consumption'}
          validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="6">
        <Field
          name={`${fieldPrefix}consumption_AED`}
          label={'Consumption (AED)'}
          validate={required}
          component={renderTextField}
        />
      </Col>
    </Row>

    <Row form className="mx-4">
      <Col className="mb-3" md="6">
        <Field
          name={`${fieldPrefix}current_reading`}
          label={'Current Reading'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="6">
        <Field
          name={`${fieldPrefix}previous_reading`}
          label={'Previous Reading'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
    </Row>

    <Row form className="mx-4">
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}submeter_consumption`}
          label={'SubMeter Consumption'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}consumption_rate_AED`}
          label={'Consumption Rate (AED)'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
      <Col className="mb-3" md="4">
        <Field
          name={`${fieldPrefix}fuel_surcharge_rate_AED`}
          label={'Fuel Surcharge Rate (AED)'}
          // validate={required}
          component={renderTextField}
        />
      </Col>
    </Row>
  </React.Fragment>
)

export const renderFields = (Type, member) => {
  const fieldPrefix = member ? `${member}.` : ''

  switch (Type) {
  case DEWA_ELECTRIC:
    return renderElectricityFields(fieldPrefix)

  case DEWA_WATER:
    return renderWaterFields(fieldPrefix)
  
  case CHILLED_WATER:
    return renderWaterFields(fieldPrefix)

  default:
    return renderElectricityFields(fieldPrefix)
  }
}

export default class InvoicesField extends React.Component {


  renderInvoiceFields = (member, index, fields) => {
    const Type = fields.get(index)['invoice_type']

    return (
      <ListGroupItem className="py-4 p-0 border-bottom" key={`invoice-${index}`}>
        <Row form className="mx-4">
          <Col>
            <h6>Meter #{index+1}</h6>
          </Col>
        </Row>

        <Row form className="mx-4">
          <Col>
            <Field
              name={`${member}.invoice_type`}
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
          {fields.map(this.renderInvoiceFields)}
        </ListGroup>
      </CardBody>
    )
  }
}