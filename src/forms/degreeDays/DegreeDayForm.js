import React from 'react'
import {
  Row,
  Col,
  CardFooter,
  Button,
} from 'shards-react'
import moment from 'moment'
import { Field, reduxForm } from 'redux-form'
import { DateRangePicker } from 'react-bootstrap-daterangepicker';


const DegreeDayForm = props => {

  const customRange = {
      'This Week': [moment().startOf('week'), moment().endOf('week')],
      'Last Week': [moment().subtract(1, 'weeks').startOf('week'), moment().subtract(1, 'weeks').endOf('week')],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
  }

  const submit = (values) => {
    props.loadDegrees(values)
  }

  const handleDateChange = (onChange, start, end) => {
      const nextDate = `${moment(start).format("YYYY-MM-DD")}/${moment(end).format("YYYY-MM-DD")}`
      onChange(nextDate)
  }

  const renderDatePicker = ({ input: { onChange, value }}) => {
    return <DateRangePicker 
      onApply={(e, data) => handleDateChange(onChange, data.startDate, data.endDate)}
      alwaysShowCalendars
      showDropdowns
      ranges={customRange}
      style={{flex: 1}}
    >
      <input 
          type="text" 
          value={!value ? null : `${value}`}
          className="daily_pick-date-input my-0" 
          readOnly
      />
    </DateRangePicker>
  }

  const { handleSubmit, submitting } = props
  return (
    <form onSubmit={handleSubmit(submit)}>
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
                Date Range
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jan</td>
              <td>
                <Field 
                  name="dd.jan.start"
                  component={renderDatePicker}
                />
              </td>
            </tr>
            <tr>
              <td>Feb</td>
              <td>
                <Field 
                  name="dd.feb.start"
                  component={renderDatePicker}
                />
              </td>
            </tr>
            <tr>
              <td>Mar</td>
              <td>
                <Field 
                  name="dd.mar.start"
                  component={renderDatePicker}
                />
              </td>
            </tr>
            <tr>
              <td>Apr</td>
              <td>
                <Field 
                  name="dd.apr.start"
                  component={renderDatePicker}
                />
              </td>
            </tr>
            <tr>
              <td>May</td>
              <td>
                <Field 
                  name="dd.may.start"
                  component={renderDatePicker}
                />
              </td>
            </tr>
            <tr>
              <td>Jun</td>
              <td>
                <Field 
                  name="dd.jun.start"
                  component={renderDatePicker}
                />
              </td>
            </tr>
            <tr>
              <td>Jul</td>
              <td>
                <Field 
                  name="dd.jul.start"
                  component={renderDatePicker}
                />
              </td>
            </tr>
            <tr>
              <td>Aug</td>
              <td>
                <Field 
                  name="dd.aug.start"
                  component={renderDatePicker}
                />
              </td>
            </tr>
            <tr>
              <td>Sep</td>
              <td>
                <Field 
                  name="dd.sep.start"
                  component={renderDatePicker}
                />
              </td>
            </tr>
            <tr>
              <td>Oct</td>
              <td>
                <Field 
                  name="dd.oct.start"
                  component={renderDatePicker}
                />
              </td>
            </tr>
            <tr>
              <td>Nov</td>
              <td>
                <Field 
                  name="dd.nov.start"
                  component={renderDatePicker}
                />
              </td>
            </tr>
            <tr>
              <td>Dec</td>
              <td>
                <Field 
                  name="dd.dec.start"
                  component={renderDatePicker}
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
          type="submit"
          className="d-table mr-3"
          disabled={submitting}
        >
          Show
        </Button>
      </CardFooter>
    </form>
  )
}

export default reduxForm({
  form: 'degreeDays', // <------ same form name
  destroyOnUnmount: false,
})(DegreeDayForm)
