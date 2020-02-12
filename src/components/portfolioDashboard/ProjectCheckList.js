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
  >
    {label}
  </FormCheckbox>
)

const renderSelect = (member, index, fields) => {
  const data = fields.get(index)
  return (
    <Field
      id={data.value}
      key={data.value}
      name={`${member}.selected`}
      component={renderSelectField}
      value={data.value}
      label={data.label}
    />
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
    <CardBody className="p-0">        
      <ListGroup flush key="all">
        <ListGroupItem className="px-3 pb-2">
          <FormCheckbox 
            className="mb-1"
            defaultChecked
            onChange={handleSelectAll}
          >
            {'Select All'}
          </FormCheckbox>
        </ListGroupItem>
      </ListGroup>    
      <ListGroup flush key="list">
        <ListGroupItem className="px-3 pb-2">
          {fields.map(renderSelect)}
        </ListGroupItem>
      </ListGroup>
    </CardBody>
  )
}

const ProjectCheckList = ({ title, subTitle, handleSubmit, buildings = [], change }) => {
  
  const handleToggle = (member, checked = false) => {
    change(member, checked)
  }

  return (
    <form onSubmit={handleSubmit} className="h-100">
      <Card small className="mb-3 h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
          <h6 className="m-0">{subTitle}</h6>
        </CardHeader>
        
        <div
          className="overflow-auto"
          style={{
            flex: '1',
          }}
        >
          <FieldArray 
            name="buildings"
            component={renderSelects}
            onToggle={handleToggle}
          />
        </div>
      </Card>
    </form>
  )
}

ProjectCheckList.defaultProps = {
  title: 'Projects',
}

export default reduxForm({
  form: 'projectCheckList',
  destroyOnUnmount: false,
  enableReinitialize: false,
})(ProjectCheckList)