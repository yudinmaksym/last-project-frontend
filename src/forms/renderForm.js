import chunk from 'lodash/chunk'
import range from 'lodash/range'
import { Field } from 'redux-form'
import {
  Row,
  Col,
} from 'shards-react'


export default ({ formFields, perRow = 1, fillEmpty, children }) => (
  <>
    {chunk(formFields, perRow).map((row, i) => (
      <Row key={formFields[i].name}>
        {row.map((field, i) => (
          <Col key={i}>
            <Field name={field.name} type={field.type || 'text'} component={field.render} label={field.label}/>
          </Col>))
        }
        {fillEmpty && row.length < perRow && range(Math.abs(perRow - row.length)).map((v) => <Col key={100 - v}/>)}
      </Row>
    ))}
    {children}
  </>
)