import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import {  getFormValues , reset } from 'redux-form'

import { updateCompany, createCompany } from '../../../redux/reducers/companies'
import CustomerSelectForm from '../../forms/projects/CustomerSelectForm'


const EditCustomerContainer = ({ 
  company = {},
  isNew,
  actualValues, 
  update,
  create,
}) => {
  const customer = {
    ...company,
    __isNew__: isNew,
    label: company.name,
    value: company.id, 
  }

  useEffect(() => {
    return () => reset('projectCreateProcess')
  }, [isNew])

  const handleSubmit = useCallback((data) => {
    console.log(data, 'asasdasdd')
    isNew 
      ? create(data)
      : update(data)
  })
  return (
    <CustomerSelectForm
      editing={true}
      submitLabel={(<span>{isNew ? 'create' : 'upadte'}</span>)} 
      showPrevBtn={false}
      isLastStep={true}
      onPrev={() => {}}
      onSubmit={handleSubmit}
      initialValues={{ customer }}
      actualValues={actualValues}
    />
  )
}

export default connect(
  (state) => ({
    company: state.companies.selectedCompany,
    actualValues: getFormValues('projectCreateProcess')(state),
  }),
  (dispatch) => ({
    update: ({ customer }) => dispatch(updateCompany(customer)),
    create: ({ customer }) => dispatch(createCompany(customer)),
  })
)(EditCustomerContainer)