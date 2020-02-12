import * as React from 'react'
import { connect } from 'react-redux'
import {
  FormGroup,
  FormFeedback,
} from 'shards-react'

import {
  getZonesGroup,
} from '../../redux/reducers/zones'
import { getSelectedZone, setZoneId } from '../../redux/reducers/heatmap'

import SelectField from './SelectField'


const formatOptions = (options) => {
  return options.map(_option => ({
    label: _option.name,
    value: _option.id,
  }))
}

const valueFromId = (opts = [], id) => opts.filter(o => o.value === id)[0]

const zoneField = ({
  page,
  input,
  label,
  type,
  options = [],
  meta: { touched, error, valid },
  setZoneId,
  activeZoneId,
}) => {
  const selectedValue = valueFromId(options, input.value)

  const handleChange = async (item) => {
    const value = item ? item.value : ''
    await setZoneId(value)
    input.onChange(value)
  }

  const handleBlur = (e) => {
    input.onBlur(input.value)
  }


  return (
    <FormGroup className="m-0">
      <label htmlFor={input.name}>{label}</label>

      <SelectField
        {...input}
        idValue
        isClearable={false}
        value={activeZoneId!==-1?selectedValue:null}
        options={options}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={'Select Zone...'}
      />

      <FormFeedback
        valid={touched && valid}
      >{error}</FormFeedback>
    </FormGroup>
  )
}

export default connect(
  (state) => ({
    options: formatOptions(getZonesGroup(state)),
    activeZoneId: getSelectedZone(state) || -1,
  }),
  (dispatch) => ({
    setZoneId: (id) => dispatch(setZoneId(id)),
  })
)(zoneField)

