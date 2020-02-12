import * as React from 'react'
import { connect } from 'react-redux'
import {
  FormGroup,
} from 'shards-react'

import CreatableSelect from '../components/common/CreatableSelect'


const formatOptions = ({ zones = [] } = {}) => {
  return zones.map((_option) => ({
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
      label,
      companyId,
      companies,
      input: {
        name,
        value,
        onChange,
        onBlur,
      },
    } = this.props
    const options = formatOptions(companies.find(({ id }) => id === companyId))
    return (
      <FormGroup className="m-0">
        <label htmlFor={name}>{label}</label>
      
        <CreatableSelect     
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
    companies: state.companies.list,
  })
)(ProjectZoneSelectField)