import * as React from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  FormGroup,
  FormSelect,
  FormFeedback,
  ListGroup,
  ListGroupItem,
} from 'shards-react'

import FormulaField from '../../fields/FormulaField'
import SelectField from '../../fields/SelectField'


const FORM_KEY = 'equation'

const VARIABLES_LIST = [
  'electricityMeterCommonConsumption_kWh',
  'electricityMeterTenantConsumption_kWh',
  'electricityMeterTotalConsumption_kWh',
  'electricityBldgCommonConsumption_kWh',
  'electricityBldgTenantConsumption_kWh',
  'electricityBldgTotalConsumption_kWh',
  'electricityMVConsumption_kWh',
  'chwMeterCommonConsumption_RTH',
  'chwMeterTenantConsumption_RTH',
  'chwMeterTotalConsumption_RTH',
  'chwBldgCommonConsumption_RTH',
  'chwBldgTenantConsumption_RTH',
  'chwBldgTotalConsumption_RTH',
  'chwMVConsumption_kWh',
  'chwMeterCommonConsumption_kWh',
  'chwMeterTenantConsumption_kWh',
  'chwMeterTotalConsumption_kWh',
  'chwBldgCommonConsumption_kWh',
  'chwBldgTenantConsumption_kWh',
  'chwBldgTotalConsumption_kWh',
  'chwBldgMVConsumption_RTH',
  'electricityMeterCommonCost_AED',
  'electricityMeterTenantCost_AED',
  'electricityMeterTotalCost_AED',
  'electricityBldgCommonCost_AED',
  'electricityBldgTenantCost_AED',
  'electricityBldgTotalCost_AED',
  'chwMeterCommonCost_AED',
  'chwMeterTenantCost_AED',
  'chwMeterTotalCost_AED',
  'chwBldgCommonCost_AED',
  'chwBldgTenantCost_AED',
  'chwBldgTotalCost_AED',
  'chwBldgMVCost_AED',
  'electricityMeterCommonConsumptionBaseline_kWh',
  'electricityMeterTenantConsumptionBaseline_kWh',
  'electricityMeterTotalConsumptionBaseline_kWh',
  'electricityBldgCommonConsumptionBaseline_kWh',
  'electricityBldgTenantConsumptionBaseline_kWh',
  'electricityBldgTotalConsumptionBaseline_kWh',
  'electricityMeterCommonConsumptionBaseline_AED',
  'electricityMeterTenantConsumptionBaseline_AED',
  'electricityMeterTotalConsumptionBaseline_AED',
  'electricityBldgCommonConsumptionBaseline_AED',
  'electricityBldgTenantConsumptionBaseline_AED',
  'electricityBldgTotalConsumptionBaseline_AED',
  'chwMeterCommonCostBaseline_AED',
  'chwMeterTenantCostBaseline_AED',
  'chwMeterTotalCostBaseline_AED',
  'chwBldgCommonCostBaseline_AED',
  'chwBldgTenantCostBaseline_AED',
  'chwBldgTotalCostBaseline_AED',
  'chwMeterCommonConsumptionBaseline_RTH',
  'chwMeterTenantConsumptionBaseline_RTH',
  'chwMeterTotalConsumptionBaseline_RTH',
  'chwBldgCommonConsumptionBaseline_RTH',
  'chwBldgTenantConsumptionBaseline_RTH',
  'chwBldgTotalConsumptionBaseline_RTH',
  'electricityMeterCommonConsumptionAdjustedBaseline_kWh',
  'electricityMeterTenantConsumptionAdjustedBaseline_kWh',
  'electricityMeterTotalConsumptionAdjustedBaseline_kWh',
  'electricityBldgCommonConsumptionAdjustedBaseline_kWh',
  'electricityBldgTenantConsumptionAdjustedBaseline_kWh',
  'electricityBldgTotalConsumptionAdjustedBaseline_kWh',
  'chwMeterCommonConsumptionAdjustedBaseline_RTH',
  'chwMeterTenantConsumptionAdjustedBaseline_RTH',
  'chwMeterTotalConsumptionAdjustedBaseline_RTH',
  'chwBldgCommonConsumptionAdjustedBaseline_RTH',
  'chwBldgTenantConsumptionAdjustedBaseline_RTH',
  'chwBldgTotalConsumptionAdjustedBaseline_RTH',
  'electricityMeterCommonConsumptionForecast_kWh',
  'electricityMeterTenantConsumptionForecast_kWh',
  'electricityMeterTotalConsumptionForecast_kWh',
  'electricityBldgCommonConsumptionForecast_kWh',
  'electricityBldgTenantConsumptionForecast_kWh',
  'electricityBldgTotalConsumptionForecast_kWh',
  'chwMeterCommonConsumptionForecast_RTH',
  'chwMeterTenantConsumptionForecast_RTH',
  'chwMeterTotalConsumptionForecast_RTH',
  'chwBldgCommonConsumptionForecast_RTH',
  'chwBldgTenantConsumptionForecast_RTH',
  'chwBldgTotalConsumptionForecast_RTH',
  'chwMeterCommonConsumptionRoutineAdjustment_RTH',
  'chwMeterTenantConsumptionRoutineAdjustment_RTH',
  'chwMeterTotalConsumptionRoutineAdjustment_RTH',
  'chwBldgCommonConsumptionRoutineAdjustment_RTH',
  'chwBldgTenantConsumptionRoutineAdjustment_RTH',
  'chwBldgTotalConsumptionRoutineAdjustment_RTH',
  'electricityMeterCommonConsumptionRoutineAdjustment_kWh',
  'electricityMeterTenantConsumptionRoutineAdjustment_kWh',
  'electricityMeterTotalConsumptionRoutineAdjustment_kWh',
  'electricityBldgCommonConsumptionRoutineAdjustment_kWh',
  'electricityBldgTenantConsumptionRoutineAdjustment_kWh',
  'electricityBldgTotalConsumptionRoutineAdjustment_kWh',
  'chwBldgMVConsumptionRoutineAdjustment_kWhT'
]
  
const formatVariablesOptions = () => VARIABLES_LIST.map(value => ({
  label: value,
  value,
}))

const validate = (values) => {
  const errors = {}

  return errors
}

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <input {...input} type={type} placeholder={label} />
)

const renderEquations = ({ adjustedOptions, fields, meta: { error, submitFailed } }) => (
  <ListGroup small flush className="list-group-small equations-list">
    {fields.map((member, index) => (
      <ListGroupItem key={index} className="d-flex px-0">
        <Col md="2">
          <Field
            name={`${member}.name`}
            type="text"
            options={formatVariablesOptions()}
            component={SelectField}
          />
        </Col>
        <Col md="1">
          <Button size="sm" theme="light" className="mb-2 mr-1">
             =
          </Button>
        </Col>
        <Col md="9">
          <FieldArray
            name={`${member}.value`}
            adjustedOptions={adjustedOptions}
            component={FormulaField}
          />
        </Col>
      </ListGroupItem>
    ))}
    <ListGroupItem className="d-flex px-0">
      <button type="button" onClick={() => fields.push({})}>
        Add
      </button>
    </ListGroupItem>
  </ListGroup>
)

const formatMeters = (meters) => meters.map(m => ({
  value: m.meter_name,
  label: m.meter_name,
}))

let EquationForm = props => {
  return (
    <form onSubmit={props.handleSubmit}> 
      <FieldArray
        name="equations"
        component={renderEquations}
        adjustedOptions={formatMeters(props.projectMeters)}
      />
    </form>
  )
}

EquationForm = reduxForm({
  form: FORM_KEY,
  validate,
  fields: [
    'equations',
  ],
  initialValues: {
    'equations': [
      { value: [] },
    ],
  },
})(EquationForm)

export default EquationForm