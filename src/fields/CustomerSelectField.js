import * as React from 'react'
import get from 'lodash/get'
import { connect } from 'react-redux'
import {
  FormGroup,
} from 'shards-react'

import CreatableSelect from '../components/common/CreatableSelect'
import SimpleSelect from '../components/common/SimpleSelect'


const formatOptions = (options) => {
  return options.map(_option => ({
    label: _option.name,
    value: _option.id,
  }))
}

class ProjectZoneSelectField extends React.Component {

  static defaultProps = {
    options: [],
  }

  render() {
    const { 
      options,
      label,
      input: {
        name,
        value,
        onChange,
        onBlur,
      },
    } = this.props
    const isTakaAdmin = get(this, 'props.currentUser.role', '').startsWith('TakaAdmin')
    const Select = isTakaAdmin ? CreatableSelect : SimpleSelect
    return (
      <FormGroup className="m-0">
        <label htmlFor={name}>{label}</label>
      
        <Select     
          value={value}
          options={options}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormGroup>
    )
  }
}

export default connect(
  state => ({
    currentUser: state.users.currentUser,
    options: formatOptions(state.companies.list),
  })
)(ProjectZoneSelectField)