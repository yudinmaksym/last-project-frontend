import * as React from 'react'
import { connect } from 'react-redux'

import AdvancedSelect from '../common/AdvancedSelect'
import {
  getProjectsByZone,
} from '../../../redux/reducers/projects'


const formatOptions = (options) => {
  return options.map(_option => ({
    label: _option.zone,
    options: _option.projects.map(_project => ({
      label: _project.name,
      value: _project.id,
    })),
  }))
}

class ProjectsSelect extends React.Component {

  static defaultProps = {
    options: [],
  }

  render() {
    const { value, options, onChange, className } = this.props
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
    options: formatOptions(getProjectsByZone(state)),
  })
)(ProjectsSelect)