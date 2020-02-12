import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  Button,
  InputGroup,
  InputGroupAddon,
  FormCheckbox,
  FormInput,
} from 'shards-react'
import { Field, FieldArray, reduxForm } from 'redux-form'


const renderSelectField = ({ input, label, id }) => (
  <FormCheckbox
    {...input}
    key={id}
    checked={input.value}
    className="m-0"
  >
    {label}
  </FormCheckbox>
)

const renderSelect = (member, index, fields) => {
  const data = fields.get(index)
  return (
    <ListGroupItem className="" key={data.id}>
      <Field
        id={data.value}
        key={data.value}
        name={`${member}.selected`}
        component={renderSelectField}
        value={data.value}
        label={data.label}
      />
    </ListGroupItem>
  )
}

const renderSelects = ({ fields, onToggle }) => {

  const handleSelectAll = (e) => {
    const checked = e.target.checked

    fields.forEach(_field => 
      onToggle(`${_field}.selected`, checked)
    )
  }

  return (
    <CardBody className="p-0" className="project-meters-list">        
      <ListGroup flush key="all">
        <ListGroupItem className="">
          <FormCheckbox 
            className="mb-1"
            defaultChecked
            onChange={handleSelectAll}
          >
            {'Select All'}
          </FormCheckbox>
        </ListGroupItem>
      </ListGroup>    
      <ListGroup 
        flush 
        key="list"
        className="project-meters-list__items overflow-auto"
        style={{
          position: 'absolute',
          width: '100%',
          top: '44px',
          bottom: '22px',
        }}
      >
        {fields.map(renderSelect)}
        {/* </ListGroupItem> */}
      </ListGroup>
    </CardBody>
  )
}

const ProjectMetersSelect = ({ title, subTitle, handleSubmit, initiaValues, change }) => {
  
  const handleToggle = (member, checked = false) => {
    change(member, checked)
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        height: '100%', 
        width: '100%', 
        position: 'relative',
      }}
    >    
      <FieldArray 
        name="options"
        component={renderSelects}
        onToggle={handleToggle}
      />
    </form>
  )
}

ProjectMetersSelect.defaultProps = {
  title: 'Meters',
}

export default reduxForm({
  form: 'projectMetersSelectForm',
  keepDirtyOnReinitialize: true,
  enableReinitialize: true,
})(ProjectMetersSelect)