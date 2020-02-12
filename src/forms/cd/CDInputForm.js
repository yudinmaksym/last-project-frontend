import * as React from 'react'
import cn from 'classnames'
import { Field, reduxForm } from 'redux-form'
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  ListGroup,
  ListGroupItem,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'shards-react'

import {
  normalizePercent,
  normalizeNumber,
} from '../../utils/normalize'
import EditableField from '../../fields/EditableField'
import NumberField from '../../fields/NumberField'
import SliderField from '../../fields/SliderField'
import InfoLabel from '../../components/common/InfoLabel'


const required = value => (value || typeof value === 'number' ? undefined : 'Missing')

export const FORM_KEY = 'cd'


// Customer Deployment Values
const CUSTOMER_DEPLOYMENT_MIN = 0
const CUSTOMER_DEPLOYMENT_MAX = 100
// Customer Savings Share Values
const CUSTOMER_SAVINGS_SHARE_MIN = 0
const CUSTOMER_SAVINGS_SHARE_MAX = 100
// Years Values
const CONTRACT_LENGTH_MIN = 0
const CONTRACT_LENGTH_MAX = 10

const SHARED_SLIDER_PROPS = {
  step: 1,
  className: 'mx-1 my-4',
  theme: 'primary',
  tooltips: true,
}

const SectionTitle = ({ name, title }) => (
  <ListGroupItem 
    key={name} 
    className="d-flex px-3 p-0 border-top-0" 
    style={{ backgroundColor: 'rgba(242, 243, 245, 0.4)' }}>
    <span className="text-muted d-block my-2">{title}</span>
  </ListGroupItem>
)

const renderMetricEditableField = (field) => (
  <ListGroupItem key={field.name} className="d-flex px-3 py-1">
    <span className="text-semibold text-fiord-blue">
      <InfoLabel 
        label={field.label}
        unit={field.unit}
        icon={field.icon}
      />
    </span>
    <span className="ml-auto text-right text-semibold text-reagent-gray">
      <EditableField 
        {...field} 
        className="cd-input ml-auto text-right text-semibold text-reagent-gray"
      />
    </span>
  </ListGroupItem>
)

const renderSliderField = (field) => (
  <ListGroupItem key={field.name} className={cn('px-3 pt-2 pb-4', { 'border-bottom': field.border })}>
    <strong className="text-muted d-block">
      <InfoLabel 
        label={field.label}
        unit={field.unit}
      />
    </strong>
    <SliderField
      {...SHARED_SLIDER_PROPS} 
      {...field}
    />
  </ListGroupItem>
)

const renderTopicEditableField = ({ name, label, input, unit }) => (
  <ListGroupItem key={name} className="d-flex px-3 py-1">
    <span className="text-semibold text-fiord-blue">
      {label}
    </span>
    <InputGroup className="cd-input ml-auto cd-input">
      <FormInput 
        {...input} 
        size="sm"
        className="text-right text-semibold text-reagent-gray"
      />
      <InputGroupAddon type="append">
        <InputGroupText>{unit}</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  </ListGroupItem>
)

const renderOptionAndCostEditableField = ({ name, label, input, unit }) => (
  <ListGroupItem key={name} className="d-flex px-3 py-1">
    <span className="text-semibold text-fiord-blue">
      {label}
    </span>
    <InputGroup className="cd-input ml-auto cd-input">
      <FormInput 
        {...input} 
        size="sm"
        className="text-right text-semibold text-reagent-gray"
      />
      <InputGroupAddon type="append">
        <InputGroupText>{unit}</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  </ListGroupItem>
)

const validate = (values) => {
  const errors = {}

  return errors
}


let CDInputForm = (props) => {
  const {
    title,
    className,
    handleSubmit,
    activeOption,
  } = props

  return (
    <form 
      onSubmit={handleSubmit} 
      className="baseline-container"
      autoComplete="unsupported"
      autoCorrect="false" 
      spellCheck="false"
    > 
      <Card small className={cn(className)}>
        {/* Card Header */}
        {/* <CardHeader className="border-bottom">
          <Row>
            <Col>
              <h6 className="m-0">{title}</h6>
            </Col>
          </Row>
        </CardHeader> *\}

        {/* Inner */}
        <CardBody className="p-0">
          <ListGroup small flush className='list-group-small border-bottom'>
            {/* <Field 
              name="sample"
              label="Sample"
              metric={<></>}
              component={renderMetricEditableField}
            /> */}

            {/* General Input #1 */}
            <SectionTitle 
              name="general"
              title="General"
            />
            <Field 
              name="baselineCost"
              label="Baseline Cost"
              unit={<>AED</>}
              component={renderMetricEditableField}
              editable={true}
            />
          
            <Field 
              name="baselineConsumption"
              label={'Baseline Consumption'}
              unit={<>kWh</>}
              component={renderMetricEditableField}
              editable={true}
            />
            <Field 
              name="energyCostReduction"
              label={'Energy Cost Reduction'}
              unit={<>%</>}
              component={renderMetricEditableField}
              editable={true}
              percent={true}
            />
            <Field 
              name="annualCostSavings"
              label={'Annual Cost Savings'}
              unit={<>AED</>}
              component={renderMetricEditableField}
              editable={true}
            />
            <Field 
              name="capex"
              label={'CAPEX'}
              unit={<>AED</>}
              component={renderMetricEditableField}
              editable={true}
            />
            <Field 
              name="annualOpExCosts"
              label={'OPEX'}
              unit={<>AED</>}
              component={renderMetricEditableField}
              editable={true}
            />
            <Field 
              name="year0Savings"
              label={'Year 0 Savings'}
              unit={<>%</>}
              component={renderMetricEditableField}
              normalize={normalizePercent({
                postfix: true,
              })}
            />
            <Field 
              name="year1RampUp"
              label={'Year 1 Ramp Up'}
              unit={<>%</>}
              component={renderMetricEditableField}
              normalize={normalizePercent({
                postfix: true,
              })}
            />
            <Field 
              name="equipmentGuarantees"
              label={'Equipment Guarantees'}
              unit={<>%</>}
              component={renderMetricEditableField}
              normalize={normalizePercent({
                postfix: true,
              })}
            />

            {/* Sliders */}
            <Field 
              name="customerDeployment"
              label={'Customer Deployment'}
              unit={<>% CAPEX</>}
              component={renderSliderField}
              connect={[true, false]}
              percent={true}
              decimal={true}
              range={{ min: CUSTOMER_DEPLOYMENT_MIN, max: CUSTOMER_DEPLOYMENT_MAX }}
              pips={{
                mode: 'positions',
                values: [
                  0, 
                  25,
                  50,
                  75,
                  100,
                ],
                stepped: true,
                density: 5,
              }}
            />
            <Field 
              name="customerSavingShare"
              label={'Customer Savings Share'}
              unit={<>% Annual Savings</>}
              component={renderSliderField}
              connect={[true, false]}
              percent={true}
              decimal={true}
              range={{ min: CUSTOMER_SAVINGS_SHARE_MIN, max: CUSTOMER_SAVINGS_SHARE_MAX }}
              pips={{
                mode: 'positions',
                values: [
                  0, 
                  25,
                  50,
                  75,
                  100,
                ],
                stepped: true,
                density: 5,
              }} 
            />
            <Field 
              name="contractLengthYears"
              label={'Contract Length'}
              unit={<>Years</>}
              component={renderSliderField}
              border={false}
              connect={[true, false]}
              range={{ min: CONTRACT_LENGTH_MIN, max: CONTRACT_LENGTH_MAX }}
              pips={{
                mode: 'positions',
                values: [
                  0, 
                  50,
                  100,
                ],
                stepped: true,
                density: 5,
              }}
            />

            {/* Topics */}
            <SectionTitle 
              name="topics"
              title="Topic"
            />
            <Field 
              name="annualUtilityInflation"
              label={'Annual Utility Inflation'}
              component={renderTopicEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name="annualCostInflation"
              label={'Annual Cost Inflation'}
              component={renderTopicEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name="year0ESCOSavingsAccrued"
              label={(
                <>ESCO Year 0
                  <br />(% savings accrued)</>
              )}
              component={renderTopicEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name="customerManagementCosts"
              label={(
                <>Customer Management Costs
                  <br />(% of TES Rev)</>
              )}
              component={renderTopicEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name="ESCODevelopmentFee"
              label={'ESCO Development Fee'}
              component={renderTopicEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name="earlyTerminationPenalty"
              label={'Early Termination Penalty'}
              component={renderTopicEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name="discountRate"
              label={'Discount Rate'}
              component={renderTopicEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name="partnerSharedSavings"
              label={'Partner Shared Savings (of Taka Share)'}
              component={renderTopicEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name="customerDeploymentPayment"
              label={'Customer Deployment Payment'}
              component={renderTopicEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />

            {/* Cost Inputs */}
            <SectionTitle 
              name="costs"
              title="Cost"
            />
            <Field 
              name="engineeringCosts"
              label={'Engineering Costs'}
              component={renderOptionAndCostEditableField}
              unit={'AED'}
              normalize={normalizeNumber()}
            />
            <Field 
              name="customerDeploymentPaymentTotalConstructionCosts"
              label={'Total Construction Costs'}
              component={renderOptionAndCostEditableField}
              unit={'AED'}
              normalize={normalizeNumber()}
            />
            <Field 
              name={'subcontractorCosts'}
              label={'Subcontractor Costs'}
              component={renderOptionAndCostEditableField}
              unit={'AED'}
              normalize={normalizeNumber()}
            />
            <Field 
              name={'annualOpExCosts'}
              label={'Annual OpEx Costs'}
              component={renderOptionAndCostEditableField}
              unit={'AED'}
              normalize={normalizeNumber()}
            />

            {/* Option Scope Inputs */}
            <SectionTitle 
              name="optionsScope"
              title={`Option Scope (${activeOption})`}
            />
            <Field 
              name={`${activeOption}.engineeringCosts`}
              label={'Engineering Costs'}
              component={renderOptionAndCostEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name={`${activeOption}.totalConstructionCosts`}
              label={'Total Construction Costs'}
              component={renderOptionAndCostEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name={`${activeOption}.subcontractorCosts`}
              label={'Subcontractor Costs'}
              component={renderOptionAndCostEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name={'customerDeploymentPaymentAnnualOpExCosts'}
              label={'Annual OpEx Costs (% of revenue)'}
              component={renderOptionAndCostEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            {/* Option Based */}
            <Field 
              name={`${activeOption}.customerDeploymentPaymentBondsAndInsuranceValue`}
              label={'Bonds & Insurance Value (% of CapEx)'}
              component={renderOptionAndCostEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name={`${activeOption}.customerDeploymentPaymentConstructionBondCost`}
              label={'Construction Bond Cost (% of bond value)'}
              component={renderOptionAndCostEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name={`${activeOption}.customerDeploymentPaymentEquipmentGuarantees`}
              label={'Equipment Guarantees (% of Equipment)'}
              component={renderOptionAndCostEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name={`${activeOption}.customerDeploymentPaymentAnnualSavingsInsurance`}
              label={'Annual Savings Insurance (% of Annual Savings)'}
              component={renderOptionAndCostEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            <Field 
              name={`${activeOption}.riskFactor`}
              label={'Risk Factor'}
              component={renderOptionAndCostEditableField}
              unit={'%'}
              normalize={normalizePercent()}
            />
            {/* / Option Based */}
          </ListGroup>
        </CardBody>

        {/*  */}
        <CardFooter 
          className="p-0"
          style={{ 
            height: '0.625rem',
            backgroundColor: 'rgba(242, 243, 245, 0.4)',
          }}
        />
      </Card>
    </form>
  )
}

CDInputForm.defaultProps = {
  title: 'CD Input Form',
}

// todo: add all initialized fields to speed up form

const optionFields = (option) => {
  return [
    'engineeringCosts',
    'totalConstructionCosts',
    'subcontractorCosts',
    'customerDeploymentPaymentBondsAndInsuranceValue',
    'customerDeploymentPaymentConstructionBondCost',
    'customerDeploymentPaymentEquipmentGuarantees',
    'customerDeploymentPaymentAnnualSavingsInsurance',
    'riskFactor',
  ].map(_f => `${option}.${_f}`)
}

CDInputForm = reduxForm({
  form: FORM_KEY,
  validate,
  enableReinitialize: false, // !! FALSE
  fields: [
    'baselineCost',
    'baselineConsumption',
    'energyCostReduction',
    'annualCostSavings',
    'year0Savings',
    'year1RampUp',
    'opex',
    'capex',
    'customerDeployment',
    'customerSavingShare',
    'contractLengthYears',
    'annualUtilityInflation',
    'annualCostInflation',
    'year0ESCOSavingsAccrued',
    'customerManagementCosts',
    'ESCODevelopmentFee',
    'earlyTerminationPenalty',
    'discountRate',
    'partnerSharedSavings',
    'customerDeploymentPayment',
    'engineeringCosts',
    'customerDeploymentPaymentTotalConstructionCosts',
    'subcontractorCosts',
    'annualOpExCosts',
    'customerDeploymentPaymentAnnualOpExCosts',
    ...optionFields('A'),
    ...optionFields('B'),
    ...optionFields('C'),
  ],
})(CDInputForm)


export default CDInputForm