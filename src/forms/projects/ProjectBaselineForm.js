
/* eslint-disable camelcase */
import React from 'react'
import moment from 'moment'
import omit from 'lodash/omit'
import _map from 'lodash/map'
import { Field, FieldArray, reduxForm } from 'redux-form'
import {
  CardFooter,
  ListGroup,
  ListGroupItem,
  FormGroup,
  Row,
  Col,
  Button,
  FormCheckbox,
} from 'shards-react'
 
import FormSectionTitle from '../../components/common/FormSectionTitle'
import MetersDataField from '../../fields/MetersDataField'
import SelectField from '../../fields/SelectField'
import NumberField from '../../fields/NumberField'
import { renderCheckBox } from '../../fields/fieldSet'
import BaselineMonthRangeField from '../../fields/BaselineMonthRangeField'
 
import validate from './validate'
import {
  renderField,
  renderSelectField,
  renderTextField,
  renderNumberField,
} from './renderField'
import { FORM_KEY } from './ProjectZoneSelectForm'
 
 
const required = value => (value || typeof value === 'number' ? undefined : 'Required')
 
const METER_FUEL_OPTION_ALL = { value: 'All', label: 'All' }
const METER_FUEL_OPTION_ELECTRICITY = { value: 'Electricity', label: 'Electricity' }
const METER_FUEL_OPTION_CHILLED_WATER = { value: 'Chilled Water', label: 'Chilled Water' }
const METER_FUEL_OPTION_WATER = { value: 'Water', label: 'Water' }
const METER_FUEL_OPTION_GAS = { value: 'LPG (Gas)', label: 'LPG (Gas)' }
const METER_FUEL_OPTION_OTHER = { value: 'Other', label: 'Other' }
 
const getProjectFuelOptions = ({
  hasChilledWaterMeters,
  hasElectricityMeters,
  hasGasMeters,
  hasWaterMeters,
}) => {
  const options = [
    METER_FUEL_OPTION_ALL,
  ]
 
  if (hasChilledWaterMeters) {
    options.push(METER_FUEL_OPTION_CHILLED_WATER)
  }
   
  if (hasElectricityMeters) {
    options.push(METER_FUEL_OPTION_ELECTRICITY)
  }
   
  if (hasGasMeters) {
    options.push(METER_FUEL_OPTION_GAS)
  }
   
  if (hasWaterMeters) {
    options.push(METER_FUEL_OPTION_WATER)
  }
   
  return options
}
 
const renderMeter = (member, index, props) => props.__isDeleted__ ? null : (
  <ListGroupItem className="p-3 pt-2" key={props.id}>
    <Row>
      <Col className="text-right">
        <Button theme="white" type="button" onClick={props.onRemove}>
          <span className="text-danger">
            <i className="material-icons">clear</i>
          </span>{' '}
           Remove
        </Button>
      </Col>
    </Row>
 
    <Row form>
      <Col className="mb-3">
        <Field 
          name={`${member}.meter_number`}
          label={'Meter Number'}
          component={renderTextField}
          validate={required}
        />
      </Col>
       
      <Col className="mb-3">
        <Field 
          name={`${member}.account_number`}
          label="Account Number"
          component={renderTextField}
          validate={required}
        />
      </Col>
 
      <Col className="mb-3">
        <Field 
          name={`${member}.premise_number`}
          label="Premise Number"
          component={renderTextField}
          validate={required}
        />
      </Col>
 
      <Col className="mb-3">
        <Field 
          name={`${member}.meter_name`}
          label="Meter Name"
          component={renderTextField}
          validate={required}
        />
      </Col>
          
      <Col className="mb-3">
        <Field 
          name={`${member}.fuel_type`}
          label="Fuel Type"
          component={renderSelectField}
          validate={required}
          options={METER_FUEL_OPTIONS}
        />
      </Col>
 
      <Col>
        <Field 
          name={`${member}.utility`}
          label="Utility Provider Name"
          component={renderTextField}
          validate={required}
        />
      </Col>
    </Row>
  </ListGroupItem>
)
 
const renderMeters = ({ deleteMember, fields, meta: { error, submitFailed } }) => (
  <ListGroup flush>
    {fields.map((member, index) => 
      renderMeter(member, index, {
        onRemove: () => fields.get(index).__isNew__ ? fields.remove(index) : deleteMember(member),
        id: fields.get(index).id,
        __isNew__: fields.get(index).__isNew__,
        __isDeleted__: fields.get(index).__isDeleted__,
      })
    )}
    <ListGroupItem className="p-3">
      <Row>
        <Col className="text-right">
          <Button type="button" onClick={() => fields.push({
            __isNew__: true,
          })}>
            <span>
              <i className="material-icons">add</i>
            </span>{' '}
             Add Meter
          </Button>
          {submitFailed && error && <span>{error}</span>}
        </Col>
      </Row>
    </ListGroupItem>
  </ListGroup>
)
 
const validatateWithRole = (values, role = '') => {
  const errors = validate(values)
  return role.startsWith('Taka') 
    ? Object.keys(errors).length
    : Object.keys(omit(errors, 'project')).length
}
 
const filterMeters = (meters, fuel) => fuel === 'All' 
  ? meters 
  : meters.filter(({ fuel_type }) => fuel_type === fuel)
 
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
 
const sortMonths = (a, b) => {
  const aMonth = a.format('MMM')
  const bMonth = b.format('MMM')
 
  return MONTHS.indexOf(aMonth) - MONTHS.indexOf(bMonth)
}
 
const monthsRanges = (start, end) => {
  const datesRanges = []
 
  let currentDate = moment(start)
  // datesRanges.push(currentDate.clone())
 
  while (currentDate <= moment(end)) {
    datesRanges.push(currentDate.clone())
    currentDate.add(1, 'months')
  }
 
  return datesRanges.sort(sortMonths)
}
 
const extractYearMonth = (date) => {
  const d = moment(date)
 
  return ({
    year: d.year(),
    month: d.format('MMM'),
  })
}
 
const ProjectBaselineForm = props => {
  const { 
    handleSubmit,
    showPrevBtn,
    isLastStep,
    onPrev,
    onResetValues,
    submitLabel,
    submitting,
    invalid,
    change,
    blur,
    currentUser = {},
    uploadedBaseline = {},
    actualValues = {},
    selectedFuel = 'All',
    monthRange: {
      start,
      end,
    },
    hasChilledWaterMeters,
    hasElectricityMeters,
    hasGasMeters,
    hasWaterMeters,
  } = props
 
  const { meters = [] } = actualValues
 
  const filteredMeters = filterMeters(meters, selectedFuel) 
 
  const dates = monthsRanges(start, end)
 
  const fuelsTypes = getProjectFuelOptions({
    hasChilledWaterMeters,
    hasElectricityMeters,
    hasGasMeters,
    hasWaterMeters,
  })
 
  return (
    <form onSubmit={handleSubmit}>
      <Row className="m-0 mb-2 pt-4 border-top">
        <Col md="6" className="">
          <FormGroup>
            <label htmlFor={'baseline.monthRange'}>Month Range</label>
     
            <Field 
              name="baseline.monthRange"
              component={BaselineMonthRangeField}
            />
          </FormGroup>
        </Col>
        <Col md="4" className="">
          <Field 
            name="baseline.fuel"
            label="Fuel"
            defaultValue={METER_FUEL_OPTION_ALL}
            options={fuelsTypes}
            component={renderSelectField}
          />
        </Col>
        <Col md="2" className="">
          <label>&nbsp;</label>
          <Button
            pills 
            theme="white"
            type="button"
            className="w-100"
            onClick={onResetValues}
            // onClick={onPrev}
          >
            Reset Values
          </Button>
        </Col>
      </Row>
 
      <div 
        className="baseline-container baseline-container--equations" 
        style={{
          'width': '100%',
          'overflow-x': 'scroll',
        }}
      >
        <table className="table mb-0">
          <thead className="bg-light">
            <tr>
              <th scope="col" className="border-0 baseline-container__col baseline-container__col--empty">
                   &nbsp;
              </th>
              {_map(filteredMeters, ({ meter_name }) =>
                <th 
                  scope="col"
                  className="border-0 baseline-container__col baseline-container__col--meter"
                  key={meter_name}
                >
                  <span>
                    {meter_name}
                  </span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {dates.map((d) => {
              const { year, month } = extractYearMonth(d)
              const key = `y_${year}_${month}`
               
              return (
                <tr key={key}>
                  <td
                    className="baseline-container__col baseline-container__col--month"
                  >
                    <span>
                      {month}
                      {/* {' '}{year} */}
                    </span>
                  </td>
                  {_map(filteredMeters, ({ id, meter_name, fuel_type }) =>
                    <td className="baseline-container__col baseline-container__col--value">
                      <Field 
                        name={`baseline.values[i_${id}][y_${year}][${month}]`}
                        component={NumberField}
                        needValidate={false}
                        defaultValue={0}
                      />
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <CardFooter className="border-top">
        <Row>
          <Col>
            {showPrevBtn && (
              <Button 
                pills
                theme="white"
                type="button"
                onClick={onPrev}
              >
                   &larr; Go Back
              </Button>
            )}
          </Col>
 
          <Col className="text-right view-report">
            <Button
              pills 
              theme="white"
              type="submit"
              disabled={submitting || invalid || validatateWithRole(props.actualValues, currentUser.role)} 
            >
              {submitLabel}
            </Button>
          </Col>
        </Row>
      </CardFooter>
    </form>
  )
}
 
export default reduxForm({
  form: FORM_KEY, // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(ProjectBaselineForm)