import * as React from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  FormGroup,
  FormInput,
  FormFeedback,
  FormSelect,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from 'shards-react'

import AdvancedSelect from '../components/common/AdvancedSelect'


const selectField = ({
  name,
  value,
  onChange,
  onBlur,
  options,
  ...rest
}) => (
  <AdvancedSelect
    {...rest}
    id={name}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    options={options}
  />
)

selectField.defaultProps = {
  options: [],
}

export default selectField