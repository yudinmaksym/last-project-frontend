import React from 'react'
import {
  Row,
  Col,
  CardFooter,
  Button,
  FormGroup,
  FormCheckbox,
} from 'shards-react'
import { Field, FieldArray, reduxForm } from 'redux-form'


const renderMeterName = (meter) => meter.meter_name || meter.account_name


const renderMeterNameField = ({ input: { value } }) => <b>{value}</b>

const renderCheckBox = ({ input, name, id, label, type, meta: { touched, error } }) => (
  <FormGroup>
    <FormCheckbox
      {...input}
      onChange={() => input.onChange(!input.value)}
      checked={!!input.value}
      type={type}
      invalid={touched && !!error}
    >
      {label}
    </FormCheckbox>
  </FormGroup>
)

const renderProjectMeters = ({ fields, meta: { error } }) => (
  <tbody>
    {fields.map((member, index) => (
      <tr key={index}>
        <td className="text-left">
          <Field 
            name={`${member}.meter_name`}
            component={renderMeterNameField}
          />
        </td>

        <td className="text-center">
          <Field 
            name={`${member}.is_mv_common`}
            component={renderCheckBox}
          />
        </td>

        <td className="text-center">
          <Field 
            name={`${member}.is_mv_tenant`}
            component={renderCheckBox}
          />
        </td>
      </tr>
    ))}
  </tbody>
)

const EquationConsumptionMetersForm = props => {
  const { handleSubmit, onPreviousPage, projectMeters } = props
  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        maxHeight: '70vh',
        overflow: 'scroll',
      }}>
        <table className="table m-0">
          <thead className="bg-light">
            <tr>
              <th scope="col" className="border-0">
                {''}
              </th>
              <th scope="col" className="border-0">
                Common
              </th>
              <th scope="col" className="border-0">
                Tenant
              </th>
            </tr>
          </thead>
          <FieldArray 
            name="meters" 
            component={renderProjectMeters} 
          />
        </table>    

      </div>

      <CardFooter className="mt-0 border-top d-flex justify-content-between">
        <Button
          size="sm"
          theme="accent"
          outline
          type="submit"
          className="d-table mr-3"
          onClick={onPreviousPage}
        >
          Previous
        </Button>

        <Button
          size="sm"
          theme="accent"
          type="submit"
          className="d-table mr-3"
        >
          Next
        </Button>
      </CardFooter>
    </form>
  )
}

export default reduxForm({
  form: 'equation', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(EquationConsumptionMetersForm)
