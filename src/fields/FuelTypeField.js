import * as React from 'react'
import { connect } from 'react-redux'
import {
  FormGroup,
  FormFeedback, FormSelect,
} from 'shards-react'

import {
  setFuelType, getFuelType, getSelectedZone,
} from '../../redux/reducers/heatmap'

import SelectField from './SelectField'


const valueFromId = (opts = [], id) => opts.filter(o => o.value === id)[0]
const FuelTypeField = ({
  input,
  label,
  meta: { touched, error, warning, valid, invalid },
  setFuelType,
  activeZoneId,
}) => {

  const options = [
    { value: 'Electricity', label: 'Electricity' },
    { value: 'Chilled Water', label: 'Chilled Water' },
    { value: 'Water', label: 'Water' },
    { value: 'LPG (Gas)', label: 'LPG (Gas)' },
    { value: 'Other', label: 'Other' },
  ]

  const selectedValue = valueFromId(options, input.value)

  const handleChange = async (item) => {
    const value = item ? item.value : ''
    await setFuelType(value)
    activeZoneId !==-1 && input.onChange(value)
  }

  const handleBlur = (e) => {
    input.onBlur(input.value)
  }
  return (
    <FormGroup>
      <label htmlFor={input.name}>{label}</label>

      <SelectField
        {...input}
        idValue
        isClearable={false}
        value={activeZoneId!==-1?selectedValue:null}
        options={options}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={'Select Fuel Type...'}
      />

      <FormFeedback
        valid={touched && valid}
      >{error}</FormFeedback>
    </FormGroup>
  )
}

export default connect(
  (state) => ({
    fuel:getFuelType(state),
    activeZoneId: getSelectedZone(state) || -1,
  }),
  (dispatch)=>({
    setFuelType: (fuel) => dispatch(setFuelType(fuel)),
  })
)(FuelTypeField)
