import * as React from 'react'
import cn from 'classnames'
import {
  Button,
  Tooltip,
  Badge,
  FormSelect,
} from 'shards-react'
import { Field } from 'redux-form'

import SelectField from './SelectField'


const renderMathOperation = ({ input, onRemove }) => (
  <div className="equation-field__variables__container mr-2 my-1">
    <Badge
      pill
      theme="light"
      className="equation-field__variables__variable text-light text-uppercase border"
    >
      {input.value.value}
    </Badge>

    <Button 
      outline 
      theme="white" 
      size="sm"
      type="button"
      className="equation-field__variables__container__remove" 
      onClick={onRemove}
    >
      <span class="text-danger"><i class="material-icons">clear</i></span>
    </Button>
  </div>
)

const groupOptions = options => {
  const groups = []
  
  options.filter(({ group }) => {
    if (groups.indexOf(group) == -1) {
      groups.push(group)
    }
  })
  
  return groups.map(_group => ({
    label: _group,
    options: options.filter(({ group }) => group == _group),
  }))
}

const valueFromId = (opts = [], id) => opts.filter(o => o.value === id)[0]

const renderVarOperation = ({ input, options, onRemove }) => {
  const handleVarChange = (item) => {
    const value = item ? item.value : ''

    input.onChange({
      ...input.value,
      value,
    })
  }
  
  const handleVarBlur = (e) => {
    input.onBlur({
      ...input.value,
    })
  }

  const value = valueFromId(options, input.value.value)

  return (
    <div className="equation-field__variables__container mr-2 my-1">
      <Badge
        pill
        theme="light"
        className="equation-field__variables__variable equation-field__variables__variable--field equation-field__variables__variable--field--select text-light border"
      >
        <SelectField 
          {...input}
          idValue
          isClearable={true}
          value={value}
          onChange={handleVarChange}
          onBlur={handleVarBlur}
          options={groupOptions(options)}
        />
        <span className="equation-field__variables__variable--field--select--real-value">{value.label}</span>
      </Badge>

      <Button 
        outline 
        theme="white" 
        size="sm"
        type="button"
        className="equation-field__variables__container__remove" 
        onClick={onRemove}
      >
        <span class="text-danger"><i class="material-icons">clear</i></span>
      </Button>
    </div>
  )
}

const renderConstOperation = ({ input, onRemove, meta: { touched, error } }) => {

  const handleConstChange = (e) => {
    const value = e.target.value

    input.onChange({
      ...input.value,
      value,
    })
  }

  const handleConstBlur = (e) => {
    input.onBlur({
      ...input.value,
    })
  }

  return (
    <div className="equation-field__variables__container mr-2 my-1">
      <Badge
      // pill
        theme="light"
        className="equation-field__variables__variable equation-field__variables__variable--field equation-field__variables__variable--field--input text-light border"
      >
        <input 
          {...input}
          className="equation-field__variables__variable__input badge-pill"
          value={input.value.value}
          onChange={handleConstChange}
          onBlur={handleConstBlur}
        />
      </Badge>
      <Button 
        outline 
        theme="white" 
        size="sm"
        type="button"
        className="equation-field__variables__container__remove" 
        onClick={onRemove}
      >
        <span class="text-danger"><i class="material-icons">clear</i></span>
      </Button>
    </div>
  )
}

export default class FormulaField extends React.Component {

  static defaultProps = {
    supportedOperations: ['+', '-', '*', '/', '%', '(', ')', 'const', 'var'],
  }

  state = {
    open: false,
  }

  isEmpty = () => this.props.fields.length === 0

  handleChange = (nextVal) => {
    this.props.input.onChange(nextVal)
    window.requestAnimationFrame(() => (
      this.props.input.onBlur(nextVal)
    ))
  }

  toggle = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  addOperation = (operation) => {
    let type = 'operation'
    let value = operation

    if (operation === 'var' || operation === 'const') {
      type = operation
      value = ''
    }

    this.props.fields.push({
      type,
      value,
    })
  }

  handleOperationClick = (operation) => (e) => {
    this.addOperation(operation)
    e.stopPropagation()
  }

  handleRemove = idx => () => this.props.fields.remove(idx)

  renderOperation = (member, idx) => {
    const { type } = this.props.fields.get(idx)

    if (type === 'var') {
      let options = [
        ...(this.props.variables),
        ...(this.props.adjustedOptions || []),
      ]
      
      return (
        <Field
          name={member}
          options={options}
          component={renderVarOperation}
          onRemove={this.handleRemove(idx)}
        />
      )
    }
 
    if (type === 'const') {
      return (
        <Field
          name={member}
          component={renderConstOperation}
          onRemove={this.handleRemove(idx)}
        />
      )
    }

    return (
      <Field
        name={member}
        component={renderMathOperation}
        onRemove={this.handleRemove(idx)}
      />
    )
  }

  renderTooltipContent = () => (
    <>
      {this.props.supportedOperations.map((operation, index) => (
        <Button 
          outline
          className="equation-field__tooltip--button"
          type="button"
          onClick={this.handleOperationClick(operation)}
        >
          {operation}
        </Button>
      ))}
    </>
  )

  getTooltipName = () => `addVariable-${this.props.fields.name.replace('[', '').replace(']', '').replace('.value','')}`

  render() {
    const {
      fields,
      name,
    } = this.props

    return (
      <div className={cn(
        'equation-field',
        {
          'equation-field--empty': this.isEmpty(),
        }
      )}>
       
        <div className="equation-field__variables">
          {fields.map(this.renderOperation)}
        </div>
        <div className="equation-field__add">
          <Button 
            className="equation-field__add--button"
            outline
            // onClick={this.handleAdd}
            id={`${this.getTooltipName()}`}
            type="button"
          >
            <i className="material-icons">add_circle</i>
          </Button>
          <Tooltip
            trigger="click"
            open={this.state.open}
            target={`#${this.getTooltipName()}`}
            toggle={this.toggle}
            className="equation-field__tooltip"
          >
            {this.renderTooltipContent()}
          </Tooltip>
        </div>
      </div>
    )
  }
}