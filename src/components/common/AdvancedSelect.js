import * as React from 'react'
import cn from 'classnames'
import Select from 'react-select'


export default class AdvancedSelect extends React.Component {
  state = {
    selectedOption: this.props.value,
  };
  
  static defaultProps = {
    options: [],
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
      styles = {},
      ...rest
    } = this.props

    return (
      <Select
        {...rest}
        classNamePrefix={cn('advanced-select')}
        className={cn('advanced-select', className)}
        value={this.state.selectedOption}
        onChange={this.handleChange}
        options={options}
        styles={styles}
      />
    )
  }
}