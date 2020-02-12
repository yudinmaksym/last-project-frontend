import React from 'react'
import {
  Container,
  Row,
  Col,
  CardTitle,
} from 'shards-react'
import { connect } from 'react-redux' 

import {
  getLoading,
  getProjectMeters,
  getSelectedProject,
  getBaselineValues,

  loadProjectMeters,
  loadBaselineValues,
  updateBaseline,
} from '../../redux/reducers/baseline'
import BaselineForm from '../forms/BaselineForm'
import CircleLoader from '../components/preloadrers/circle-loader'


class BaselineContainer extends React.Component {

  handleProjectChange = (projectId) => {
    this.props.loadProjectMeters(
      projectId
    )

    this.props.loadBaselineValues(
      projectId
    )
  }
      
  handleSubmit = (data) => {
    const { projectId, ...rest } = data

    this.props.updateBaseline(
      data.projectId,
      rest
    )
  }

  render() {
    const {
      activeProjectId,
      projectMeters,
      baselineValues,
      loading,
    } = this.props

    const meters = baselineValues.length === 0
      ? projectMeters
      : baselineValues

    return (
      <>
        <CircleLoader 
          show={loading}
        />

        <BaselineForm
          onSubmit={this.handleSubmit}
          onProjectChange={this.handleProjectChange}
          meters={projectMeters}
          initialValues={{
            projectId: activeProjectId,
            meters,
          }}
        />
      </>
    )
  }

}

export default connect(
  (state) => ({
    loading: getLoading(state),
    activeProjectId: getSelectedProject(state) || -1,
    projectMeters: getProjectMeters(state),
    baselineValues: getBaselineValues(state),
  }),
  (dispatch) => ({
    loadProjectMeters: (projectId) =>
      dispatch(loadProjectMeters(projectId)),
    loadBaselineValues: (projectId) =>
      dispatch(loadBaselineValues(projectId)),
    updateBaseline: (projectId, data) =>
      dispatch(updateBaseline(projectId, data)),
  })
)(BaselineContainer)