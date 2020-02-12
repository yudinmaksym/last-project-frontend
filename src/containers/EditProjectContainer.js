import * as React from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { 
  update,
  getProjectData, 
  getProjectLoading,
} from '../../redux/reducers/projects'

import ProjectCreateProcessContainer from './ProjectCreateProcessContainer'


class EditProjectContainer extends React.Component {

  handleSubmit = (data) => {
    delete data.id
    
    return this.props.update(this.props.id, data)
  }

  render() {
    return (
      !this.props.loading && (
        <ProjectCreateProcessContainer 
          tab={this.props.tab}
          editing={true}
          id={this.props.id}
          initialValues={this.props.data}
          onSubmit={this.handleSubmit}
        />
      )
    )
  }

}

export default connect(
  (state) => ({
    data: getProjectData(state),
  }), 
  (dispatch) => ({
    // update: (id, data) => dispatch(update(id, data)),
  })
)(EditProjectContainer)