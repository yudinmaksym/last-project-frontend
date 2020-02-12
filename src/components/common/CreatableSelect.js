import * as React from 'react'
import cn from 'classnames'
import Select from 'react-select/creatable'


export default class CreatableSelect extends React.Component {
  state = {
    selectedOption: this.props.value,
  };
  
  static defaultProps = {
    options: [],
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.handleValue(nextProps.value)
    }
  }
  
  handleChange = selectedOption => {
    this.handleValue(selectedOption)
    this.props.onChange && this.props.onChange(selectedOption)
  };

  handleValue = (selectedOption) => this.setState({ selectedOption })
  
  render() {
    const {
      options,
      className,
    } = this.props

    return (
      <Select
        isClearable
        className={cn('advanced-select')}
        value={this.state.selectedOption}
        onChange={this.handleChange}
        options={options}
      />
    )
  }
}