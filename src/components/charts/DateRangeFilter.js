import * as React from 'react'
import cn from 'classnames'
import { FormSelect } from 'shards-react'


export default class DateRangeFilter extends React.Component {

  static defaultProps = {
    fromBeginning: false,
    ranges: [3, 6, 12, 18, 24, 60],
    size: 'xs',
    style: { 
      maxWidth: '140px',
      maxHeight: '24px',
    },
    onChange: () => {},
  }

  handleRangeChange = (e) => {
    const nextRange = e.target.value

    this.props.onChange(nextRange)
  }

  render() {
    const { 
      className, 
      style,
      value,
      size,
    } = this.props

    const {
      ranges,
      fromBeginning,
    } = this.props

    return (
      <React.Fragment>

        <FormSelect
          size={size}
          value={value}
          style={style}
          onChange={this.handleRangeChange}
          className={cn('float-right', className)}
        >
          {fromBeginning && (
            <option value="-1">From the beginning</option>
          )}
          {ranges.map(_range => (
            <option key={`${_range}`} value={_range}>Last {_range} Month</option>
          ))}
        </FormSelect>
      </React.Fragment>
    )
  }

}