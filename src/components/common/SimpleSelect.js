import * as React from 'react'
import cn from 'classnames'
import Select from 'react-select'


export default class SimpleSelect extends React.Component {
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

  handleBlur = () => {
    this.props.onBlur(
      this.props.value
    )
  }

  handleValue = (selectedOption) => this.setState({ selectedOption })
  
  render() {
    const {
      options,
      className,
    } = this.props

    return (
      <Select 
        value={this.state.selectedOption}
        className={cn('simple-select', className)}
        onChange={this.handleChange}
        options={options}
        onBlur={this.handleBlur}
      />
    )
  }
}