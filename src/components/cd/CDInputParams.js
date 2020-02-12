import * as React from 'react'

import CDInputForm from '../../forms/cd/CDInputForm'


export { FORM_KEY } from '../../forms/cd/CDInputForm'



class CDInputParams extends React.Component {

  static defaultProps = {
    onChange: (values) => {},
    inputs: {
      //
      baselineCost: 0,
      baselineConsumption: 0,
      energyCostReduction: 0,
      annualCostSavings: 0,
      // 
      opex: 0,
      capex: 0,
      //
      customerDeployment: 0,
      customerSavingShare: 0,
      contractLengthYears: 0,
      //
      annualUtilityInflation: 0.00,
      annualCostInflation: 0.00,
      customerManagementCosts: 0.00,
      ESCODevelopmentFee: 0.00,
      earlyTerminationPenalty: 0.00,
      discountRate: 0.00,
      partnerSharedSavings: 0.00,
      customerDeploymentPayment: 0.00,
    },
  }


  handleValuesChange = (v) => {
    const {
      engineeringCosts,
      customerDeploymentPaymentTotalConstructionCosts,
      subcontractorCosts,
    } = v

    const capex = (
      engineeringCosts
      + customerDeploymentPaymentTotalConstructionCosts
      + subcontractorCosts
    )

    const values = {
      ...v,
      capex,
    }
  
    return this.props.onChange(values)
  }

  handleSubmit = (v) => this.handleValuesChange(v)

  handleChange = (v) => this.handleValuesChange(v)

  render() {
    const { 
      title, 
      className, 
      inputs,
      activeOption,
    } = this.props
    
    return (
      <CDInputForm 
        title={title}
        className={className}
        activeOption={activeOption}
        onSubmit={this.handleSubmit} 
        onChange={this.handleChange}
        initialValues={{
          ...inputs,
        }}
      />
    )
  }
}

export default CDInputParams
