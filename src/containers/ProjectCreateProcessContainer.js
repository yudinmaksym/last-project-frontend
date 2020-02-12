import * as React from 'react'
import get from 'lodash/get'
import { connect } from 'react-redux'
import moment from 'moment'
import { reset, initialize, getFormValues } from 'redux-form'
import {
  Card,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
} from 'shards-react'
import cn from 'classnames'

import {
  getZonesGroup,
} from '../../redux/reducers/zones'
import {
  create,
  update,
  loadBaselineValues,
} from '../../redux/reducers/projects'
import ProjectBuildingsSelect from '../forms/projects/ProjectBuildingsSelect'
import ProjectInfoSelectForm from '../forms/projects/ProjectInfoSelectForm'
import ProjectMetersForm from '../forms/projects/ProjectMetersForm'
import CustomerSelectForm from '../forms/projects/CustomerSelectForm'
import ProjectBaselineForm from '../forms/projects/ProjectBaselineForm'
import ProjectZoneSelectForm, { FORM_KEY } from '../forms/projects/ProjectZoneSelectForm'
import validate from '../forms/projects/validate'


class ProjectCreateProcessContainer extends React.Component {
  static defaultProps = {
    initialValues: {
      buildings:[{
        __isNew__: true,
      }], 
      meters:[{
        __isNew__: true,
      }],
      zone: {},
      customer: {},
      project: {},
      baseline: {
        values: {},
        monthRange: {
          start: moment().subtract(1, 'year').startOf('year').toDate(),
          end: moment().subtract(1, 'year').endOf('year').toDate(),
        },
        fuel: 'All',
      },
    },
    pages: [
      {
        title: 'Customer info',
        key: 'customer',
        icon: 'create',
        step: 0,
      },
      {
        title: 'Zone info',
        key: 'zone',
        icon: 'info',
        step: 1,
      },
      {
        title: 'Project info',
        key: 'project',
        icon: 'info',
        step: 2,
      },
      {
        title: 'Buildings info',
        key: 'buildings',
        icon: 'info',
        step: 3,
      },
      {
        title: 'Project Meters',
        key: 'meters',
        icon: 'speed',
        step: 4,
      },
      {
        title: 'Baseline',
        key: 'baseline',
        icon: 'linear_scale',
        step: 5,
      },
    ],
  }

  state = {
    page: 1,
  }

  UNSAFE_componentWillMount() {
    this.props.reset(this.props.initialValues)
  }

  componentDidMount() {
    const page = get(this, 'props.currentUser.role', '').startsWith('Taka')
      ? 0 
      : 1
    this.props.tab === 'baseline' 
      ? this.setState({
        page: 5
      })
      : this.setState({
      page: this.props.editing ? 1 : page,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.actualValues) {
      if (this.props.actualValues.baseline.monthRange !== nextProps.actualValues.baseline.monthRange)  {
        return this.loadBaseline(
          nextProps.actualValues.project.id,
          nextProps.actualValues.baseline.monthRange,
          nextProps.actualValues.baseline.fuel
        )
      }


      if (this.props.actualValues.baseline.fuel !== nextProps.actualValues.baseline.fuel) {
        return this.filterBaseline(
          nextProps.actualValues.baseline.fuel
        )
      }
    }
  }


  loadBaseline = (projectId, monthRange) => {
    const start = moment(new Date(monthRange.start)).format('YYYY-MM-DD')
    const end = moment(new Date(monthRange.end)).format('YYYY-MM-DD')

    return this.props.loadBaselineValues(
      start,
      end,
      projectId,
    )
  }

  loadBaselineActual = () => {
    const projectId = this.props.actualValues.project.id
    const { monthRange } = this.props.actualValues.baseline

    const start = moment(new Date(monthRange.start)).format('YYYY-MM-DD')
    const end = moment(new Date(monthRange.end)).format('YYYY-MM-DD')

    return this.props.loadBaselineValues(
      start,
      end,
      projectId,
      true
    )
  }

  filterBaseline = (fuel) => console.log('filterBaseline')

  isFirstPage = () => this.state.page === 0

  isLastPage = () => this.state.page === (this.props.pages.length - 1)

  getTitle() {
    const page = this.props.pages[this.state.page]
    const { title } = page
    
    return title
  }

  nextPage = () => this.setState(prevState => ({ page: prevState.page + 1 }))
  prevPage = () => this.setState(prevState => ({ page: prevState.page - 1 }))

  handleNext = (data) => {
    if (this.isLastPage()) {
      return this.handleSubmit(data)
    }
    
    this.nextPage()
  }

  handlePrev = () => {
    this.prevPage()
  }

  handleResetValues = () => {
    this.loadBaselineActual()
  }

  setPage = (page) => {
    this.setState({ page: this.props.editing ? page + 1 : page })
  }

  handleSubmit = async (data) => {
    const { editing, id } = this.props
    const { zones, ...body } = data
    
    if (editing) {
      await this.props.update(id, body)
    } else {  
      await this.props.create(body)
    }

    const page = get(this, 'props.currentUser.role', '').startsWith('Taka')
      ? 0 
      : 1

    this.setState({
      page,
    })
  }

  renderForm = () => {
    const { page } = this.state
    const { actualValues = this.props.initialValues } = this.props
    const isLastStep = this.isLastPage()
    const showPrevBtn = (
      !this.isFirstPage()
    )

    const initialValues = this.props.initialValues
    if(!get(this, 'props.currentUser.role', '').startsWith('Taka')) {
      initialValues.customer.value = this.props.currentCustomer.id
      initialValues.customer.label = this.props.currentCustomer.name
    } else {
      initialValues.customer.value = initialValues.customer.id
      initialValues.customer.label = initialValues.customer.name
    }

    const formValues = {
      zones: this.props.zones,
      ...initialValues,
    }

    const submitLabel = isLastStep ? (
      this.props.editing ? <span>Update</span> : <span>Submit</span>
    ) : (
      <span>Next &rarr;</span>
    )

    switch (page) {
    case 5:
      return (
        <ProjectBaselineForm
          submitLabel={submitLabel}
          showPrevBtn={showPrevBtn}
          isLastStep={isLastStep}
          onPrev={this.handlePrev}
          onResetValues={this.handleResetValues}
          onSubmit={this.handleNext}
          actualValues={actualValues}
          initialValues={formValues}
          currentUser={this.props.currentUser}
          selectedFuel={this.props.actualValues && this.props.actualValues.baseline.fuel}
          monthRange={this.props.actualValues && this.props.actualValues.baseline.monthRange}
          hasChilledWaterMeters={this.props.actualValues && this.props.actualValues.project.hasChilledWaterMeters}
          hasElectricityMeters={this.props.actualValues && this.props.actualValues.project.hasElectricityMeters}
          hasGasMeters={this.props.actualValues && this.props.actualValues.project.hasGasMeters}
          hasWaterMeters={this.props.actualValues && this.props.actualValues.project.hasWaterMeters}
        />
      )

    case 4:
      return ( 
        <ProjectMetersForm
          submitLabel={submitLabel}
          showPrevBtn={showPrevBtn}
          isLastStep={isLastStep}
          onPrev={this.handlePrev}
          onSubmit={this.handleNext}
          actualValues={actualValues}
          initialValues={formValues}
          currentUser={this.props.currentUser}
        />
      )

    case 3:
      return ( 
        <ProjectBuildingsSelect
          submitLabel={submitLabel}
          showPrevBtn={showPrevBtn}
          isLastStep={isLastStep}
          onPrev={this.handlePrev}
          onSubmit={this.handleNext}
          initialValues={formValues}
          actualValues={actualValues}
          currentUser={this.props.currentUser}
        />
      )

    case 2:
      return (
        <ProjectInfoSelectForm
          submitLabel={submitLabel} 
          showPrevBtn={showPrevBtn}
          isLastStep={isLastStep}
          onPrev={this.handlePrev}
          onSubmit={this.handleNext}
          initialValues={formValues}
          actualValues={actualValues}
          currentUser={this.props.currentUser}
        />
      )

    case 1:
      return (
        <ProjectZoneSelectForm
          submitLabel={submitLabel} 
          showPrevBtn={!this.props.editing && this.props.currentUser.role.startsWith('Taka')}
          isLastStep={isLastStep}
          onPrev={this.handlePrev}
          onSubmit={this.handleNext}
          initialValues={formValues}
          actualValues={actualValues}
        />
      )
    default:
      return (
        <CustomerSelectForm
          editing={this.props.editing}
          submitLabel={submitLabel} 
          showPrevBtn={showPrevBtn}
          isLastStep={isLastStep}
          onPrev={this.handlePrev}
          onSubmit={this.handleNext}
          initialValues={formValues}
          actualValues={actualValues}
        />
      )
    }
  }
  haveIndependentVariables = () => {
    return this.props.independentVariables && this.props.independentVariables.length > 0
  }
  checkPageActivity = (page, num) => {
    return this.props.editing ? page === num + 1 : page === num
  }

  handleJumpTo = (page) => () => this.setState({ page })

  render() {
    const { 
      currentUser,
      editing,
      pages,
    } = this.props
    const { 
      page: pageNum,
    } = this.state

    const activePages = this.props.pages
    const title = this.getTitle()
    // console.log(validate(this.props.actualValues), '@@@@@@@@@@@@@@@@')
    return (
      <Card small className="mb-4">
        <CardHeader>
          {editing
            ? <div className="equations-modal__header mx-auto">
              {activePages
                .filter(item => editing ? item.title !== 'Customer info' : currentUser.role.startsWith('Taka'))
                .map((page, index) =>
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
                      <span className={
                        !!(Object.keys(validate(this.props.actualValues || {})[page.key] || {}).length) 
                          ?  'badge badge-danger' : 'equations-modal__header--step__circle'
                      }>
                        <i className="equations-modal__header--step__circle--icon material-icons">
                          {page.icon}
                        </i>
                      </span>
                      <span className="equations-modal__header--step__name">{page.title}</span>
                    </div>
                  )
                )}
            </div>
            :            <div className="equations-modal__header mx-auto">
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
                    <span className="equations-modal__header--step__name">{page.title}</span>
                  </div>
                )
              )}
            </div>}
        </CardHeader>

        {this.renderForm()}
      </Card>
    )
  }
}


export default connect(
  (state) => ({
    currentUser: state.users.currentUser,
    currentCustomer: state.companies.currentCompany,
    zones: getZonesGroup(state),
    actualValues: getFormValues(FORM_KEY)(state),
  }),
  (dispatch) => ({  
    create: (data) => dispatch(create(data)),
    update: (id, data) => dispatch(update(id, data)),
    reset: (values) => dispatch(initialize(FORM_KEY, values)),
    loadBaselineValues: (start, end, id, actual = false) => dispatch(loadBaselineValues(start, end, id, actual)),
  })
)(ProjectCreateProcessContainer)
