import * as React from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import { formValueSelector, submit } from 'redux-form'
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Button,
} from 'shards-react'

import {
  setActiveOption,
  setModels,
  setProfits,
  getMaxYears,
  getLoading,
  getProfits,
  getInputs,
  getYearSavings,
  getModels,
  getActiveOption,
  getActiveProject,
  getOptionsList,
  loadProjectInfo,
} from '../../redux/reducers/cd'
import Formula, {
  Project as ProjectFormula,
  ESCO as ESCOFormula,
  Customer as CustomerFormula,
  Profits as ProfitsFormula,
} from '../utils/cd'
import colors from '../utils/colors'
import { formatNegativeNumber, formatPercent } from '../utils/format'
import { getColor, getSystemColor } from '../utils/theme'
import CircleLoader from '../components/preloadrers/circle-loader'
import CDInputParams, { FORM_KEY as CD_INPUT_FORM_KEY } from '../components/cd/CDInputParams'
import CDProfitStats from '../components/cd/CDProfitStats'
import CDYearSavingsChart from '../components/cd/CDYearSavingsChart'
import CDResultsCard from '../components/cd/CDResultsCard'
import ProjectsSelect from '../components/projects/ProjectsSelect'


const getDataSourceColorsAndParams = (source) => {
  if (source === 'Customer Cash Flow') {
    return {
      fill: true,
      type: 'bar',
      backgroundColor: getColor(0, 3).toHex(),
      borderColor: getColor(0, 3).toHex(),
      pointBackgroundColor: colors.white.toHex(),
      pointHoverBackgroundColor: getColor(0, 3).toRGBA(1),
      borderWidth: 1,
    }
  }

  return {
    fill: false,
    type: 'line',
    borderColor: getSystemColor('Baseline').toRGBA(1),
    backgroundColor: getSystemColor('Baseline').toRGBA(0.1),
    pointHoverBackgroundColor: getSystemColor('Baseline').toRGBA(1),
    pointBackgroundColor: colors.white.toHex(),
    borderWidth: 1.5,
  }
}

const formatTableNumber = (number) => formatNegativeNumber(number, true)

const formatTablePercent = (percent) => formatPercent(percent)

const formatPercentStringToFloat = (str) => (Number(str.replace('%', '')) / 100)

class CDToolContainer extends React.Component {

  formatYearSavingsLabels = () => {
    const years = []
    for (let _year=0;_year<=this.props.maxYears;_year++) {
      years.push(`${_year}`)
    }

    return years
  }

  formatYearSavingsDataset = () => {
    const {
      models: {
        customerCashFlow: {         
          NetCashFlow = [0,0,0,0,0,0,0,0,0,0],
          Profit = [0,0,0,0,0,0,0,0,0,0],
        }, 
      } = {},
    } = this.props

    return [
      {
        label: 'Customer Cash Flow',
        data: [ ...NetCashFlow ],
        ...getDataSourceColorsAndParams('Customer Cash Flow'),
      },
      {
        label: 'Customer Profit',
        data: [ ...Profit ],
        ...getDataSourceColorsAndParams('Customer Profit'),
      },
    ]
  }

  formatProjectCashFlowLabels = () => {
    return [
      'Annual Savings on Customers Bill',
      'Project Revenue',
      'CapEx',
      'OpEx',
      'Project Net Cash Flow',
      'Cumulative Cash Flow',
    ]
  }

  formatProjectCashFlowDataset = () => {
    const {
      models: {
        projectCashFlow: {
          AnnualSavingsOnCustomersBill,
          Revenue,
          CaPex,
          OpEx,
          NetCashFlow,
          CumulativeCashFlow,
        } = {}, 
      },
    } = this.props
    

    return [
      AnnualSavingsOnCustomersBill.map(formatTableNumber),
      Revenue.map(formatTableNumber),
      CaPex.map(formatTableNumber),
      OpEx.map(formatTableNumber),
      NetCashFlow.map(formatTableNumber),
      CumulativeCashFlow.map(formatTableNumber),
    ]
  }

  formatESCOCashFlowLabels = () => {
    return [
      'Annual Savings on Customers Bill',
      '% savings accrued to ESCO',
      'ESCO Savings Revenues',
      'ESCO Service Payments',
      'ESCO Investment',
      'OpEx Costs',
      'Finance Costs',
      'Equipment Guarantees',
      'Savings Insurance',
      'Customer Management',
      'Partner Savings Share',
      'ESCO Net Cash Flow',
      'Cumulative Cash Flow',
    ]
  }

  formatESCOashFlowDataset = () => {
    const {
      models: {
        ESCOCashFlow: {
          AnnualSavingsOnCustomersBill,
          PercentSavingsAccrued,
          SavingsRevenues,
          ServicePayments,
          Investment,
          OpExCosts,
          FinanceCosts,
          EquipmentGuarantees,
          SavingsInsurance,
          CustomerManagement,
          PartnerSavingsShare,
          NetCashFlow,
          CumulativeCashFlow,
        }, 
      } = {},
    } = this.props

    return [
      AnnualSavingsOnCustomersBill.map(formatTableNumber),
      PercentSavingsAccrued.map(formatTablePercent),
      SavingsRevenues.map(formatTableNumber),
      ServicePayments.map(formatTableNumber),
      Investment.map(formatTableNumber),
      OpExCosts.map(formatTableNumber),
      FinanceCosts.map(formatTableNumber),
      EquipmentGuarantees.map(formatTableNumber),
      SavingsInsurance.map(formatTableNumber),
      CustomerManagement.map(formatTableNumber),
      PartnerSavingsShare.map(formatTableNumber),
      NetCashFlow.map(formatTableNumber),
      CumulativeCashFlow.map(formatTableNumber),
    ]
  }

  formatCustomerCashFlowLabels = () => {
    return [
      'Annual Savings on Customers Bill',
      '% savings accrued to Customer',
      'Customer Gross Savings',
      'Customer Investment',
      'Savings Insurance',
      'Customer CapEx Payment',
      'Customer OpEx Payment',
      'Customer Cash Flow',
      'Customer Profit',
    ]
  }

  formatCustomerCashFlowDataset = () => {
    const {
      models: {
        customerCashFlow: {
          AnnualSavingsOnCustomersBill,
          PercentSavingsAccruedToCustomer,
          GrossSavings,
          Investment,
          SavingsInsurance,
          CapExPayment,
          OpExPayment,
          NetCashFlow,
          Profit,
        }, 
      } = {},
    } = this.props

    return [
      AnnualSavingsOnCustomersBill.map(formatTableNumber),
      PercentSavingsAccruedToCustomer.map(formatTablePercent),
      GrossSavings.map(formatTableNumber),
      Investment.map(formatTableNumber),
      SavingsInsurance.map(formatTableNumber),
      CapExPayment.map(formatTableNumber),
      OpExPayment.map(formatTableNumber),
      NetCashFlow.map(formatTableNumber),
      Profit.map(formatTableNumber),
    ]
  }

  handleProjectChange = ({ label, value }) => {
    const nextRoute = Router.pathname + `?projectId=${value}`
    this.props.loadProjectInfo(value, label)
    Router.push(nextRoute, nextRoute, { shallow: true })
  }

  handleOption = (option) => () => {
    this.props.setActiveOption(option)

    window.requestAnimationFrame(
      () => {
        this.props.pingForm()
      }
    )
  }

  handleInputParamsChange = (values) => {
    const {
      activeOption,
      options,
      maxYears,
    } = this.props

    // remove options based input
    const {
      customerDeploymentPaymentBondsAndInsuranceValue,
      customerDeploymentPaymentConstructionBondCost,
      customerDeploymentPaymentEquipmentGuarantees,
      customerDeploymentPaymentAnnualSavingsInsurance,
      riskFactor,
    } = values[activeOption]

    // remove extra data from the source
    options.forEach(_option => {
      delete values[_option]
    })

    // data computing
    const v = {
      ...values,
      customerDeploymentPaymentBondsAndInsuranceValue,
      customerDeploymentPaymentConstructionBondCost,
      customerDeploymentPaymentEquipmentGuarantees,
      customerDeploymentPaymentAnnualSavingsInsurance,
      riskFactor,
      capex: (
        values.engineeringCosts
        + values.customerDeploymentPaymentTotalConstructionCosts
        + values.subcontractorCosts
      ),
      maxYears,
    }

    const inputs = {}

    // TODO: temp fix
    Object.keys(v).map(_var => inputs[_var] = Number(v[_var]))

    this.caclculateFormulas(inputs)
  }

  caclculateFormulas = (inputs) => {
    // Models
    const projectCashFlow = {
      AnnualSavingsOnCustomersBill: Formula(inputs, ProjectFormula.AnnualSavingsOnCustomersBill),
      Revenue: Formula(inputs, ProjectFormula.Revenue),
      CaPex: Formula(inputs, ProjectFormula.CaPex), 
      OpEx: Formula(inputs, ProjectFormula.OpEx), 
      NetCashFlow: Formula(inputs, ProjectFormula.NetCashFlow), 
      CumulativeCashFlow: Formula(inputs, ProjectFormula.CumulativeCashFlow), 
    }

    const ESCOCashFlow = {
      AnnualSavingsOnCustomersBill: Formula(inputs, ESCOFormula.AnnualSavingsOnCustomersBill),
      PercentSavingsAccrued: Formula(inputs, ESCOFormula.PercentSavingsAccrued),
      SavingsRevenues: Formula(inputs, ESCOFormula.SavingsRevenues),
      ServicePayments: Formula(inputs, ESCOFormula.ServicePayments),
      Investment: Formula(inputs, ESCOFormula.Investment),
      OpExCosts: Formula(inputs, ESCOFormula.OpExCosts),
      FinanceCosts: Formula(inputs, ESCOFormula.FinanceCosts),
      EquipmentGuarantees: Formula(inputs, ESCOFormula.EquipmentGuarantees),
      SavingsInsurance: Formula(inputs, ESCOFormula.SavingsInsurance),
      CustomerManagement: Formula(inputs, ESCOFormula.CustomerManagement),
      PartnerSavingsShare: Formula(inputs, ESCOFormula.PartnerSavingsShare),
      NetCashFlow: Formula(inputs, ESCOFormula.NetCashFlow),
      CumulativeCashFlow: Formula(inputs, ESCOFormula.CumulativeCashFlow),
    }

    const customerCashFlow = {
      AnnualSavingsOnCustomersBill: Formula(inputs, CustomerFormula.AnnualSavingsOnCustomersBill),
      PercentSavingsAccruedToCustomer: Formula(inputs, CustomerFormula.PercentSavingsAccruedToCustomer),
      GrossSavings: Formula(inputs, CustomerFormula.GrossSavings),
      Investment: Formula(inputs, CustomerFormula.Investment),
      SavingsInsurance: Formula(inputs, CustomerFormula.SavingsInsurance),
      CapExPayment: Formula(inputs, CustomerFormula.CapExPayment),
      OpExPayment: Formula(inputs, CustomerFormula.OpExPayment),
      NetCashFlow: Formula(inputs, CustomerFormula.NetCashFlow),
      Profit: Formula(inputs, CustomerFormula.Profit),
    }

    const models = {
      projectCashFlow,
      ESCOCashFlow,
      customerCashFlow,
    }

    this.props.setModels(models)

    // Profits
    const customerProfits = {
      TenYearProfit: ProfitsFormula.Customer.TenYearProfit(models),
      NPV: ProfitsFormula.Customer.NPV(models),
      ROI: ProfitsFormula.Customer.ROI(models),
      IRR: ProfitsFormula.Customer.IRR(models),
      TenYearSavingsShare: ProfitsFormula.Customer.TenYearSavingsShare(models),
    }

    const escoProfits = {
      NPV: ProfitsFormula.ESCO.NPV(models),
      ROI: ProfitsFormula.ESCO.ROI(models),
      IRR: ProfitsFormula.ESCO.IRR(models),
      TenYearSavingsShare: ProfitsFormula.ESCO.TenYearSavingsShare(models),
    }

    this.props.setProfits({
      customer: customerProfits,
      esco: escoProfits,
    })
  }

  renderOptions = () => {
    const {
      activeOption,
      options,
    } = this.props

    const isActiveOption = (option) => option === activeOption

    return (
      <ButtonGroup className="float-right cd-options">    
        {options.map(_option => (
          <Button 
            key={`option_${_option}`}
            theme={isActiveOption(_option) ? 'primary' : 'white'}
            onClick={this.handleOption(_option)}
          >{_option}</Button>
        ))}
      </ButtonGroup>
    )
  }

  render() {
	  const { 
      loading,
      maxYears,
      activeOption,
      activeProject,
      contractLengthYears,
      // 
	    inputs,
      profits,
      yearSavings,
	  } = this.props

    return (
      <>
        <CircleLoader
          show={loading}
        />

        <Row noGutters className="page-header pt-4 mb-3">
          <Col sm="8" className={'text-sm-left'}>
            <h3 className="page-title mb-3">{'Project Finance Summary'}</h3>
            <ProjectsSelect 
              value={activeProject}
              onChange={this.handleProjectChange}
              className="cd-project-select mt-1"
            />
          </Col>

          <Col sm="4" className="ml-auto mt-auto pt-2">
            {this.renderOptions()}
          </Col>
        </Row>
        <Row>
          <Col md="3" lg="3" className="mb-4">
            <CDInputParams 
              title={'Input'}
              inputs={{
                ...inputs.project,
              }}
              onChange={this.handleInputParamsChange}
              activeOption={activeOption}
            />
          </Col>
          <Col md="9" lg="9" className="mb-4 px-0">
            <Container fluid>
              <CDProfitStats 
                profits={profits}
                version={1}
              />

              <CDYearSavingsChart 
                className="mb-4"
                title={'Savings (AED)'}
                subTitle="By Years"
                dataId={`${yearSavings.dataId}${contractLengthYears}`}
                chartData={{
                  labels: this.formatYearSavingsLabels(),
                  datasets: this.formatYearSavingsDataset(),
                }}
              />

              <CDResultsCard 
                title={'Customer Cash Flow Model'}
                years={maxYears}
                labels={this.formatCustomerCashFlowLabels()}
                data={this.formatCustomerCashFlowDataset()}
              />

              <CDResultsCard 
                title={'ESCO Cash Flow Model'}
                years={maxYears}
                labels={this.formatESCOCashFlowLabels()}
                data={this.formatESCOashFlowDataset()}
              />

              <CDResultsCard 
                title={'Project Cash Flow Model'}
                years={maxYears}
                labels={this.formatProjectCashFlowLabels()}
                data={this.formatProjectCashFlowDataset()}
              /> 

              {/* <CDResultsCard 
                title={'Financier Cash Flow Model'}
                years={contractLengthYears}
                labels={projectCashFlow.labels}
                data={projectCashFlow.data}
              />  */}
            </Container>
          </Col> 
        </Row>
      </>
	  )
  }

}

const inputFormSelector = formValueSelector(CD_INPUT_FORM_KEY)
export default connect(
  (state) => {
    const contractLengthYears = inputFormSelector(state, 'contractLengthYears')
    
    return ({
      contractLengthYears,
      loading: getLoading(state),
      maxYears: getMaxYears(state),
      activeOption: getActiveOption(state), 
      activeProject: getActiveProject(state), 
      options: getOptionsList(state),
      profits: getProfits(state),
      inputs: getInputs(state),
      yearSavings: getYearSavings(state),
      models: getModels(state),
    })
  },
  (dispatch) => ({
    setActiveOption: (option) => dispatch(setActiveOption(option)),
    setModels: (models) => dispatch(setModels(models)),
    setProfits: (profits) => dispatch(setProfits(profits)),
    pingForm: () => dispatch(submit(CD_INPUT_FORM_KEY)),
    loadProjectInfo: (id, label) => dispatch(loadProjectInfo(id, label)),
  })
)(CDToolContainer)