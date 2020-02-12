import * as React from 'react'
import { connect } from 'react-redux'

import AdvancedSelect from '../common/AdvancedSelect'
import {
  getZonesGroup,
} from '../../../redux/reducers/zones'


const formatOptions = (options) => {
  return options.map(_option => ({
    label: _option.name,
    value: _option.id,
  }))
}

class ZoneSelect extends React.Component {

  static defaultProps = {
    options: [],
  }

  render() {
    const { value, options, className, onChange } = this.props
    return (
      <AdvancedSelect     
        value={value}
        options={options}
        onChange={onChange}
        className={className}
      />
    )	
  }

}

export default connect(
  state => ({
    options: formatOptions(getZonesGroup(state)),
  })
)(ZoneSelect)