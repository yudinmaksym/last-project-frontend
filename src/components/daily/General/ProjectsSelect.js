import * as React from 'react'
import AdvancedSelect from '../../common/AdvancedSelect'

const formatProjects = (options) => {
    const categories = options.map(el => {
        return el.category
    })
    let uniqueCat = [...new Set(categories)];

    const data = uniqueCat.map(_category => ({
        label: _category,
        options: options.filter(_option => _option.category === _category).map(_project => ({
            label: _project.iot_name,
            value: _project.id,
            region:  _project.region,
            cdd:  _project.cdd_base,
            category: _category,
        })),
    }))
    return data
}

const formatEquipment = (options) => {
  return options.map(_option => ({
        label: _option.iot_name,
        iot_name: _option.iot_name,
        value: _option.id,
        tower: _option.tower,
        name:  _option.name,
        meter: _option.meter,
  }))
}

class ProjectsSelect extends React.Component {

  static defaultProps = {
    options: [],
  }

  render() {
    const { value, options, onChange, className, projects, equipments } = this.props
    return (
      <AdvancedSelect     
        // value={value}
        defaultValue={value}
        options={projects && formatProjects(projects) || equipments && formatEquipment(equipments)}
        onChange={onChange}
        className={className}
      />
    )	
  }

}

export default ProjectsSelect