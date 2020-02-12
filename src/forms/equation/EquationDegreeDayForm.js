import React from 'react'
import {
  Row,
  Col,
  CardFooter,
  Button,
} from 'shards-react'
import { Field, reduxForm } from 'redux-form'

import DateField from '../../fields/DateField'


const MONTH_DAY_FORMAT = 'MMM/dd'

const EquationDegreeDayForm = props => {
  const { handleSubmit, onPreviousPage } = props
  return (
    <form onSubmit={handleSubmit}>
      <Row form className="mx-0 equations-degree-days" style={{
        maxHeight: '70vh',
        overflow: 'scroll',
      }}>
        <table className="table mb-0">
          <thead className="bg-light">
            <tr>
              <th scope="col" className="border-0">
                Month
              </th>
              <th scope="col" className="border-0">
                Start
              </th>
              <th scope="col" className="border-0">
                End
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jan</td>
              <td>
                <Field 
                  name="dd.jan.start"
                  component={DateField}
                  showMonthYearPicker={false}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
              <td>
                <Field 
                  name="dd.jan.end"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
            </tr>
            <tr>
              <td>Feb</td>
              <td>
                <Field 
                  name="dd.feb.start"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
              <td>
                <Field 
                  name="dd.feb.end"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
            </tr>
            <tr>
              <td>Mar</td>
              <td>
                <Field 
                  name="dd.mar.start"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
              <td>
                <Field 
                  name="dd.mar.end"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
            </tr>
            <tr>
              <td>Apr</td>
              <td>
                <Field 
                  name="dd.apr.start"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
              <td>
                <Field 
                  name="dd.apr.end"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
            </tr>
            <tr>
              <td>May</td>
              <td>
                <Field 
                  name="dd.may.start"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
              <td>
                <Field 
                  name="dd.may.end"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
            </tr>
            <tr>
              <td>Jun</td>
              <td>
                <Field 
                  name="dd.jun.start"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
              <td>
                <Field 
                  name="dd.jun.end"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
            </tr>
            <tr>
              <td>Jul</td>
              <td>
                <Field 
                  name="dd.jul.start"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
              <td>
                <Field 
                  name="dd.jul.end"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
            </tr>
            <tr>
              <td>Aug</td>
              <td>
                <Field 
                  name="dd.aug.start"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
              <td>
                <Field 
                  name="dd.aug.end"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
            </tr>
            <tr>
              <td>Sep</td>
              <td>
                <Field 
                  name="dd.sep.start"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
              <td>
                <Field 
                  name="dd.sep.end"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
            </tr>
            <tr>
              <td>Oct</td>
              <td>
                <Field 
                  name="dd.oct.start"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
              <td>
                <Field 
                  name="dd.oct.end"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
            </tr>
            <tr>
              <td>Nov</td>
              <td>
                <Field 
                  name="dd.nov.start"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
              <td>
                <Field 
                  name="dd.nov.end"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
            </tr>
            <tr>
              <td>Dec</td>
              <td>
                <Field 
                  name="dd.dec.start"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
              <td>
                <Field 
                  name="dd.dec.end"
                  component={DateField}
                  dateFormat={MONTH_DAY_FORMAT}
                />
              </td>
            </tr>
          </tbody>
        </table>
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
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(EquationDegreeDayForm)
