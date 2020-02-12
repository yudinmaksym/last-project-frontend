import React from 'react'
import {
  Row,
  Col,
  CardFooter,
  Button,
  FormGroup,
  FormSelect,
  FormFeedback,
} from 'shards-react'
import compact from 'lodash/compact'
import Select from 'react-select'
import { Field, reduxForm } from 'redux-form'


const formatYearsOptions = (years) => years.map(y => ({
  value: y,
  label: y,
}))

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

const renderField = (field) => (
  <div className="input-row">
    <input {...field.input} type="text"/>
    {field.meta.touched && field.meta.erro
     &&  <span className="error">{field.meta.error}</span>}
  </div>
)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const EquationIndependentVariablesValuesForm = props => {
  const { handleSubmit, onPreviousPage } = props
  const variablesArr = props.variables ? props.variables.split(', ') : []
  return (
    <form onSubmit={handleSubmit}>
      <Row className="mt-4 mx-1">       
        <Col md="12" lg="12">
          <Field
            name="independentVariablesYear"
            component={renderSelectField}
            options={formatYearsOptions([2016, 2017, 2018, 2019])}
          />
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0">
              &nbsp;
                </th>
                {variablesArr.map((variable, index) =>
                  <th scope="col" className="border-0" key={index}>
                    {variable}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {MONTHS.map(m => 
                <tr key={m}>
                  <td>{m}</td>
                  {props.currentYear && variablesArr.map((name, index) =>
                    <td key={`${m}_${index}`}>
                      {/* ! */}
                      <Field 
                        label="Consumption"
                        name={`variables[${name}][y_${props.currentYear}][${m}]`}
                        component={renderField}
                      />
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </Col>
      </Row>

      <CardFooter className="border-top d-flex justify-content-between">
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
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount,
  initialValues: {
    
  },
})(EquationIndependentVariablesValuesForm)