import React from 'react'
import {
  Container,
  Row,
  Col,
  CardTitle,
} from 'shards-react'
import { connect } from 'react-redux' 

import {
  getSelectedProject,
  getSelectedYear,
  getProjectMeters,
  getConsumptionsValues,

  loadConsumptionsValues,
  updateConsumptions,
} from '../../redux/reducers/consumptions'
import ConsumptionsManualForm from '../forms/consumptions/ConsumptionsManualForm'


class EditManualConsumptionsContainer extends React.Component {

  handleFormChange = (data) => {
    const { year, projectId } = data


    if (
      (projectId && year)
      && (projectId !== this.props.projectId 
        || year !== this.props.year)
    ) {
      this.props.loadConsumptionsValues(
        projectId, 
        year
      )
    }
  }
      
  handleSubmit = (data) => {
    const { projectId, year, ...rest } = data

    this.props.updateConsumptions(
      projectId,
      year,
      rest
    )
  }

  render() {
    const {
      year,
      projectId,
      projectMeters,
      consumptionsValues,
    } = this.props

    const meters = []

    return (
      <ConsumptionsManualForm
        onSubmit={this.handleSubmit}
        meters={projectMeters}
        onChange={this.handleFormChange}
        initialValues={{
          projectId,
          year,
          values: consumptionsValues,
        }}
      />
    )
  }

}

export default connect(
  (state) => ({
    projectId: getSelectedProject(state),
    year: getSelectedYear(state),
    projectMeters: getProjectMeters(state),
    consumptionsValues: getConsumptionsValues(state),
  }),
  (dispatch) => ({
    loadConsumptionsValues: (projectId, year) =>
      dispatch(loadConsumptionsValues(projectId, year)),
    updateConsumptions: (projectId, year, data) =>
      dispatch(updateConsumptions(projectId, year, data)),
  })
)(EditManualConsumptionsContainer)