import * as React from 'react'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Button,
  FormSelect,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ListGroup,
  ListGroupItem,
} from 'shards-react'
import cn from 'classnames'
import { reset, formValueSelector } from 'redux-form'

import {
  updateEquation,
} from '../../redux/reducers/projects'
import EquationBaselineValuesForm from '../forms/equation/EquationBaselineValuesForm'
import EquationBuilderForm from '../forms/equation/EquationBuilderForm'
import EquationConsumptionMetersForm from '../forms/equation/EquationConsumptionMetersForm'
import EquationDegreeDayForm from '../forms/equation/EquationDegreeDayForm'
import EquationIndependentVariablesForm from '../forms/equation/EquationIndependentVariablesForm'
import EquationIndependentVariablesValuesForm from '../forms/equation/EquationIndependentVariablesValuesForm'


const formatMeters = (meters = []) => meters.map(m => ({
  value: m.meter_name,
  label: m.meter_name,
  group: 'Meter',
}))

const formatIndependentVariables = (variables = '') => {
  if (!variables) {
    variables = ''
  }

  return variables.split(', ').map(_variable => ({
    value: _variable,
    label: _variable,
    group: 'Independent Variables',
  }))
}

const removeIndex = (array, index) => array.filter((v, i) => i!== index)

class EquationModalContainer extends React.Component {
  
  static defaultProps = {
    title: 'Equation',
    pages: [
      { 
        name: 'Values', 
        step: 1,
        icon: 'settings_input_component',
      },
      { 
        name: 'Independet Variables', 
        step: 2,
        icon: 'label',
      },
      { 
        name: 'Degree Days', 
        step: 3,
        icon: 'date_range',
      },
      { 
        name: 'Meters', 
        step: 4,
        icon: 'view_carousel',
      },
      { 
        name: 'Baseline', 
        step: 5,
        icon: 'timeline',
      },
      { 
        name: 'Builder', 
        step: 6,
        icon: 'functions',
      },
    ],
  }

  state = {
    page: 1,
  }

  getNextStep = (page) => {
    if (page === 1) {
      if (this.haveIndependentVariables()) {
        return page + 1
      }

      return page + 2
    }

    return page + 1
  }

  getPrevStep = (page) => {
    if (page === 3) {
      if (this.haveIndependentVariables()) {
        return page - 1
      }

      return page - 2
    }

    return page - 1
  }

  handleNextPage = () => this.setState(prevState => ({ page: this.getNextStep(prevState.page) }))

  handlePreviousPage = () => this.setState(prevState => ({ page: this.getPrevStep(prevState.page) }))

  handleJumpTo = (page) => () => this.setState({ page })

  handleToggle = () => {
    this.setState({
      page: 1,
    })

    this.props.onToggle && this.props.onToggle()
  }

  handleSubmit = async (data) => {
    await this.props.updateEquation(
      this.props.projectId, data
    )

    this.handleToggle()
    this.props.onUpdate()
  }

  haveIndependentVariables = () => {
    return this.props.independentVariables && this.props.independentVariables.length > 0
  }

  renderPage = () => {
    const { page } = this.state

    if (page === 6) {
      const adjustedOptions = [
        ...formatMeters(this.props.projectMeters),
        ...formatIndependentVariables(this.props.independentVariables),
      ]

      return (
        <EquationBuilderForm
          onSubmit={this.handleSubmit}
          onPreviousPage={this.handlePreviousPage}
          adjustedOptions={adjustedOptions}
          variables={this.props.variables}
        />
      )
    }

    if (page === 5) {
      return (
        <EquationBaselineValuesForm
          onPreviousPage={this.handlePreviousPage}
          onSubmit={this.handleNextPage}
          uploadedBaseline={this.props.mv.uploadedBaseline}
        />
      )
    }

    if (page === 4) {
      return (
        <EquationConsumptionMetersForm
          onPreviousPage={this.handlePreviousPage}
          onSubmit={this.handleNextPage}
          projectMeters={this.props.projectMeters}
        />
      )
    }

    if (page === 3) {
      return (
        <EquationDegreeDayForm
          onPreviousPage={this.handlePreviousPage}
          onSubmit={this.handleNextPage}
        />
      )
    }

    if (page === 2) {
      return (
        <EquationIndependentVariablesValuesForm
          onPreviousPage={this.handlePreviousPage}
          onSubmit={this.handleNextPage}
          variables={this.props.independentVariables}
          currentYear={this.props.independentVariablesYear}
        />
      )
    }

    // page === 1
    return (
      <EquationIndependentVariablesForm
        onPreviousPage={this.handlePreviousPage}
        onSubmit={this.handleNextPage}
        initialValues={this.props.mv}
      />
    )
  }

  render() {
    const { 
      title,
      open,
    } = this.props

    const activePages = (
      this.haveIndependentVariables()
        ? [...this.props.pages]
        : removeIndex(this.props.pages, 1)
    )

    return (
      <Modal 
        open={open} 
        toggle={this.handleToggle} 
        className="equations-modal"
      >
        <ModalHeader>
          <div className="equations-modal__header mx-auto">
            {activePages.map((page, index) => 
              (
                <div 
                  key={page.step} 
                  onClick={this.handleJumpTo(page.step)}
                  className={cn(
                    'equations-modal__header--step',
                    {
                      'equations-modal__header--step--active': page.step === this.state.page,
                    }
                  )}>
                  <span className="equations-modal__header--step__circle">
                    <i className="equations-modal__header--step__circle--icon material-icons">
                      {page.icon}
                    </i>
                  </span>
                  <span className="equations-modal__header--step__name">{page.name}</span>
                </div>
              )
            )}
          </div>
        </ModalHeader>
        <ModalBody className="p-0">
          {this.renderPage()}
        </ModalBody>
      </Modal>
    )
  }
}

const selector = formValueSelector('equation')

export default connect(
  (state) => ({
    independentVariables: selector(state, 'independent_variables'),
    independentVariablesYear: selector(state, 'independentVariablesYear'),
  }),
  (dispatch) => ({
    updateEquation: (id, data) => dispatch(updateEquation(id, data)),
  })
)(EquationModalContainer) 