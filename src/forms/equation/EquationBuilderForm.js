import React from 'react'
import {
  Row,
  Col,
  CardFooter,
  Button,
  ListGroup,
  ListGroupItem,
  FormGroup,
  FormSelect,
} from 'shards-react'
import { Field, FieldArray, reduxForm } from 'redux-form'

import FormulaField from '../../fields/FormulaField'
import SelectField from '../../fields/SelectField'


const DEFAULT_EQUATIONS_FORMULAS = [
  {
    'value': [
      {
        'type': 'const',
        'value': '',
      },
      {
        'type': 'operation',
        'value': '*',
      },
      {
        'type': 'var',
        'value': 48,
      },
      {
        'type': 'operation',
        'value': '+',
      },
      {
        'type': 'const',
        'value': '',
      },
    ],
    'variable': 56,
  },
  {
    'value': [
      {
        'type': 'var',
        'value': 56,
      },
      {
        'type': 'operation',
        'value': '-',
      },
      {
        'type': 'var',
        'value': 44,
      },
    ],
    'variable': 72,
  },
  {
    'value': [
      {
        'type': 'var',
        'value': 44,
      },
      {
        'type': 'operation',
        'value': '+',
      },
      {
        'type': 'var',
        'value': 72,
      },
      {
        'type': 'operation',
        'value': '+',
      },
      {
        'type': 'var',
        'value': 68,
      },
    ],
    'variable': 57,
  },
  {
    'value': [
      {
        'type': 'var',
        'value': 57,
      },
      {
        'type': 'operation',
        'value': '-',
      },
      {
        'type': 'var',
        'value': 51,
      },
    ],
    'variable': 61,
  },
  {
    'value': [
      {
        'type': 'var',
        'value': 61,
      },
      {
        'type': 'operation',
        'value': '*',
      },
      {
        'type': 'var',
        'value': 42,
      },
    ],
    'variable': 63,
  },
  {
    'value': [
      {
        'type': 'var',
        'value': 63,
      },
      {
        'type': 'operation',
        'value': '/',
      },
      {
        'type': 'var',
        'value': 76,
      },
      {
        'type': 'operation',
        'value': '*',
      },
      {
        'type': 'const',
        'value': '',
      },
    ],
    'variable': 71,
  },
  {
    'value': [
      {
        'type': 'var',
        'value': 61,
      },
    ],
    'variable': 163,
  },
  {
    'value': [
      {
        'type': 'var',
        'value': 63,
      },
    ],
    'variable': 164,
  },
]

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

const renderSelect = ({ input, options, onRemove }) => {
  const handleSelectChange = (item) => {
    const value = item ? item.value : ''

    input.onChange(value)
  }
  
  const handleSelectBlur = (e) => {
    input.onBlur(input.value)
  }

  return (
    <SelectField 
      {...input}
      value={valueFromId(options, input.value)}
      onChange={handleSelectChange}
      onBlur={handleSelectBlur}
      options={groupOptions(options)}
      isClearable={true}
    />
  )
}

const renderEquations = ({ adjustedOptions, variables, fields, meta: { error, submitFailed } }) => (
  <ListGroup small flush className="list-group-small equations-list">
    {fields.map((member, index) => (
      <ListGroupItem key={index} className="d-flex px-0">
        <Button 
          outline 
          theme="secondary" 
          size="sm"
          type="button"
          className="equations-list__item__remove" 
          onClick={() => fields.remove(index)}
        >
          <span className="text-danger"><i className="material-icons">clear</i></span>
        </Button>
        <Col md="3" className="d-flex align-items-start">
          <b>{index+1}</b>
          <Field
            name={`${member}.variable`}
            options={variables}
            component={renderSelect}
          />
          {' '}
          <Button size="sm" theme="light" className="mt-1 mb-2 ml-1" type="button">
             =
          </Button>
        </Col>
        <Col md="9">
          <FieldArray
            name={`${member}.value`}
            adjustedOptions={adjustedOptions}
            variables={variables}
            component={FormulaField}
          />
        </Col>
      </ListGroupItem>
    ))}
    <ListGroupItem className="d-flex px-4">
      <Button type="button" onClick={() => fields.push({})}>
        Add
      </Button>
    </ListGroupItem>
  </ListGroup>
)

const EquationBuilderForm = props => {
  const { handleSubmit, onPreviousPage, change, variables } = props

  const handleTable = () => change('equations', DEFAULT_EQUATIONS_FORMULAS)

  return (
    <form onSubmit={handleSubmit}>
      <Button
        size="sm"
        theme="accent"
        outline
        type="button"
        onClick={handleTable}
      >
          Template
      </Button>

      <Row form className="mx-0 equations-builder" style={{
        maxHeight: '70vh',
        overflow: 'scroll',
      }}>
        <FieldArray
          name="equations"
          component={renderEquations}
          variables={variables}
          adjustedOptions={props.adjustedOptions}
        />
      </Row>

      <CardFooter className="border-top d-flex justify-content-end">
        <Button
          size="sm"
          theme="accent"
          outline
          type="button"
          className="d-table mr-3"
          onClick={onPreviousPage}
        >
          Previous
        </Button>

        <Button
          size="sm"
          theme="accent"
          type="submit"
          className="d-table mr-3"
        >
          Save
        </Button>
      </CardFooter>
    </form>
  )
}

export default reduxForm({
  form: 'equation', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(EquationBuilderForm)