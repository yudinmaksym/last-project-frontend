import * as React from 'react'
import { connect } from 'react-redux'
import {
  FormGroup,
  FormFeedback,
} from 'shards-react'

import {
  setDateRange, getDateRange, getSelectedZone,
} from '../../redux/reducers/heatmap'
import DateRangeFilter from '../components/charts/DateRangeFilter'


const DateRangeField = ({
  range,
  input,
  label,
  meta: { touched, error, warning, valid, invalid },
  setDateRange,
  activeZoneId,
}) => {
  
  const onRangeChange = async (nextRange) => {
    await setDateRange(nextRange)
    activeZoneId !==-1 &&input.onChange(nextRange)
  }
  
  return (
    <FormGroup className="m-0 text-filed">
      <label htmlFor={input.name}>{label}</label>

      <DateRangeFilter
        value={range}
        onChange={onRangeChange}
      />

      <FormFeedback
        valid={touched && valid}
      >{error}</FormFeedback>
    </FormGroup>
  )
}

export default connect(
  (state) => ({
    range:getDateRange(state),
    activeZoneId: getSelectedZone(state) || -1,
  }),
  (dispatch)=>({
    setDateRange: (range) => dispatch(setDateRange(range)),
  })
)(DateRangeField)
