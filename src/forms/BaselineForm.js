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
} from 'shards-react'

import ProjectField from '../fields/ProjectField'
import NumberField from '../fields/NumberField'



const required = value => (value || typeof value === 'number' ? undefined : 'Missing')

export const FORM_KEY = 'baseline'

const renderMonthField = (field) => (
  <div className="input-row">
    <label>{field.label}</label>
    <input {...field.input} type="text"/>
    {field.meta.touched && field.meta.error
     && <span className="error">{field.meta.error}</span>}
  </div>
)

const validate = (values) => {
  const errors = {}

  return errors
}

const renderField = (field) => (
  <div className="input-row">
    <input {...field.input} type="text"/>
    {field.meta.touched && field.meta.erro
     &&  <span className="error">{field.meta.error}</span>}
  </div>
)

const renderSubFields = (member, index, fields) => (
  <li key={index}>
    <h4>{fields.get(index).label}[{fields.get(index).fuel_type}]</h4>
    
    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
      m => (
        <Field 
          name={`${member}.${m}`}
          label={m}
          component={renderMonthField}
        />
      )
    )}
  </li>
)

const renderMeters = ({ fields }) => (
  <ul>
    {fields.map(renderSubFields)}
  </ul>
)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

let BaselineForm = props => {
  return (
    <form onSubmit={props.handleSubmit} className="baseline-container"> 
      <Card className="p-0">
      
        <CardHeader className="border-bottom">
          <Field
            name="projectId"
            component={ProjectField}
            onChange={props.onProjectChange}
          />
        </CardHeader>

        <CardBody 
          className="p-0" 
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
                {props.meters.map(meter =>
                  <th 
                    scope="col"
                    className="border-0 baseline-container__col baseline-container__col--meter"
                    key={meter.value}
                  >
                    <span>
                      {meter.label}
                    </span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {MONTHS.map(m => 
                <tr key={m}>
                  <td
                    className="baseline-container__col baseline-container__col--month"
                  >
                    <span>
                      {m}
                    </span>
                  </td>
                  {props.meters.map(meter =>
                    <td className="baseline-container__col baseline-container__col--value">
                      <Field 
                        className="baseline-container__field"
                        name={`meters[${meter.value}]${m}`}
                        component={NumberField}
                        needValidate={false}
                      />
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>

        <CardFooter className="border-top">
          <Row>
            <Col className="text-right view-report">
              <Button 
                type="submit" 
                disabled={props.pristine || props.submitting}
              >
              Save
              </Button>
              {'     '}
              <Button 
                type="button" 
                outline
                theme="secondary" 
                disabled={props.pristine || props.submitting}
                onClick={props.reset}
              >
              Reset
              </Button> 
            </Col>
          </Row>

          {!props.submitting && props.submitSucceeded && (
            <React.Fragment>
              <Row form className="mx-4 pb-4">
                <Col className="text-right">
                  <span className="text-success">{'Updated successfully'}.</span>
                </Col>
              </Row>
            </React.Fragment>
          )}

        </CardFooter>
      </Card>
    </form>
  )
}

BaselineForm = reduxForm({
  form: FORM_KEY,
  validate,
  enableReinitialize: true,
  fields: [
    
  ],
})(BaselineForm)

export default BaselineForm