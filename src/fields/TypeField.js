import * as React from 'react'
import cn from 'classnames'
import {
  Button,
  ButtonGroup,
} from 'shards-react'

import { TYPES } from '../types/files'


export default class TypeFeld extends React.Component {

    isActive = (type) => this.props.input.value === type

    handleFocus = () => (e) => {
      this.props.input.onFocus(e)
    }

    handleChange = (value) => () => {
      this.props.input.onBlur(value)
    }

    handleBlur = (value) => () => {
      this.props.input.onChange(value)
    }

    renderTypeButton = (type) => {
      const theme = this.isActive(type.value) ? 'primary' : 'white'

      return (
        <Button 
          key={type.value}
          theme={theme}
          onMouseDown={this.handleFocus(type.field)}
          onClick={this.handleChange(type.value)}
          onMouseUp={this.handleBlur(type.value)}
        >{type.label}</Button>
      )
    }

    render() {
      return (
        <ButtonGroup className={cn('mb-3', this.props.className)}>
          {TYPES.map(this.renderTypeButton)}
        </ButtonGroup>
      )
    }
}