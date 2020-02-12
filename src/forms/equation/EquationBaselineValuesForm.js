import React from 'react'
import _map from 'lodash/map'
import {
  Row,
  Col,
  CardFooter,
  Button,
} from 'shards-react'
import { Field, reduxForm } from 'redux-form'

import BaselineCSVField from '../../fields/BaselineCSVField'
import SectionTitle from '../../components/file-manager-cards/SectionTitle'


const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const EquationBaselineValuesForm = props => {
  const { handleSubmit, onPreviousPage, uploadedBaseline } = props
  return (
    <form onSubmit={handleSubmit}>

      <Row form>
        <Col className="">
          <Field 
            name="baseline"
            component={BaselineCSVField}
          />
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
              {_map(props.uploadedBaseline, (val, topic) =>
                <th 
                  scope="col"
                  className="border-0 baseline-container__col baseline-container__col--meter"
                  key={topic}
                >
                  <span>
                    {topic}
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
                {_map(props.uploadedBaseline, (val, topic) =>
                  <td className="baseline-container__col baseline-container__col--value">
                    <span>{props.uploadedBaseline[topic][m]}</span>
                  </td>
                )} 
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CardFooter className="d-flex justify-content-between border-top">
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
})(EquationBaselineValuesForm)