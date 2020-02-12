import * as React from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { 
  update,
  getSingleData,
  getSingleLoading,
} from '../../redux/reducers/projectsMeters'
import ProjectMeterForm, { FORM_KEY } from '../forms/ProjectMeterForm'


class EditProjectMeterContainer extends React.Component {

  handleSubmit = (data) => {
    delete data.id
    
    return this.props.update(this.props.id, data)
  }

  render() {
    return (
      <div className="edit-meter mb-4">
        {!this.props.loading && (
          <ProjectMeterForm 
            initialValues={this.props.data}
            onSubmit={this.handleSubmit}
          />
        )}
      </div>
    )
  }

}

export default connect(
  (state) => ({
    data: getSingleData(state),
    loading: getSingleLoading(state),
  }), 
  (dispatch) => ({
    update: (id, data) => dispatch(update(id, data)),
  })
)(EditProjectMeterContainer)