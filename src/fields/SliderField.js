import * as React from 'react'
import cn from 'classnames'
import isNumber from 'lodash/isNumber'
import { 
  Slider,
} from 'shards-react'


const formatIntVal = ({
  from: (v) => parseInt(v, 10),
  to: (v) => parseInt(v, 10),
})

export const formatString = ({ prefix = '', postfix = '', decimal = false }) => ({
  to: (value) => {
    return `${prefix}${value}${postfix}`
  },
  from: function (input) {
    let v = Number(input)

    if (!isNumber(v)) {
      v = Nunmber(
        input.replace(prefix, '').replace(postfix, '')
      )
    }

    return decimal ? v : formatIntVal.from(v)
  },
})


export default class SliderField extends React.Component {

  normalizeValue = value => {
    if (this.props.percent) {
      value /= 100
    }

    return value
  }

  handleChange = (oringial, from, values) => {
    const value = this.normalizeValue(values[0])
    this.props.input.onChange(value)
  }

  handleEnd = (oringial, from, values) => {
    const value = this.normalizeValue(values[0])
    this.props.input.onBlur(value)
  }

  render() {
    const {
      input: {
        name,
        onChange,
        onBlur,
        value,
      },
      meta: { touched, valid, invalid, error },
      step,
      className,
      theme,
      tooltips,
      connect,
      range,
      pips,
      decimal = false,
      percent = false,
      ...rest
    } = this.props

    const adjustedProps = {
      ...rest,
    }

    if (!adjustedProps.format) {
      if (!decimal) {
        adjustedProps.format = formatIntVal
      }

      if (percent) {
        adjustedProps.format = formatString({
          decimal,
          postfix: '%',
        })
      }
    }

    let val = value

    if (percent) {
      val *= 100
    }

    return (
      <>
        <Slider
          {...adjustedProps}
          start={[val]}
          theme={theme}
          tooltips={tooltips}
          connect={connect}
          range={range}
          pips={pips}
          step={step}
          className={cn('slider-field', className)}
          onChange={this.handleChange}
          onEnd={this.handleEnd}
        />
      </>
    )
  }
}