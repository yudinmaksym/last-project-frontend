import * as React from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { create } from '../../redux/reducers/projects'
import CreateProjectForm, { FORM_KEY as CREATE_PROJECT_FORM_KEY } from '../forms/CreateProjectForm'


class CreateProjectContainer extends React.Component {

  handleSubmit = (data) => {
    return this.props.create(data)
  }

  render() {
    return (
      <div className="create-project mb-4">
        <CreateProjectForm 
          country={this.props.country}
          onSubmit={this.handleSubmit}
        />
      </div>
    )
  }

}

const selector = formValueSelector(CREATE_PROJECT_FORM_KEY)

export default connect(
  (state) => ({
    country: selector(state, 'country'),
  }),
  (dispatch) => ({
    create: (data) => dispatch(create(data)),
  })
)(CreateProjectContainer)