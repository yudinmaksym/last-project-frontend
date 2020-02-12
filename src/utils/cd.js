// TODO: add underscore nmemo
import { Finance } from 'financejs'


const finance = new Finance()


export function calculateFormulaForYears(args, formulaFn) {
  const { maxYears } = args

  const result = []
  for (let _year=0;_year <= maxYears;_year++) {
    result[_year] = formulaFn(_year, args)
  }

  return result
}

const calculateTotal = values => values.reduce((a, b) => {
  return (a || 0) + (b || 0)
}, 0.0)

/*
  =============================
    Not sure
  =============================
*/
function calculateEquipmentGuarantee(inputs) {
  const {
    customerDeploymentPaymentEquipmentGuarantees,
    customerDeploymentPaymentTotalConstructionCosts: totalConstructionCost,
  } = inputs

  return totalConstructionCost * customerDeploymentPaymentEquipmentGuarantees
}

/*
  =============================
    Project
  =============================
*/


// Project => Annual Savings on Customers Bill
function projectAnnualSavingsOnCustomersBill(_year, inputs) {
  const {
    annualCostSavings, 
    annualUtilityInflation,
    year0Savings,
    year1RampUp,
  } = inputs

  // Year 0
  if (_year === 0) {
    // (Annual Cost Savings) * (Year 0 Savings)
    return annualCostSavings * year0Savings
  }

  // Year 1
  if (_year === 1) {
    // (Annual Cost Savings * Year 1 Ramp-Up)
    return annualCostSavings * year1RampUp
  }

  // Rest of Years
  const previousYearValue = projectAnnualSavingsOnCustomersBill(
    _year - 1,
    inputs
  )

  return previousYearValue * (1 + annualUtilityInflation)
}

// Project Revenue
function projectRevenue(_year, inputs) {
  const {
    contractLengthYears: projectLength, // Project Length
  } = inputs

  // Year 0
  if (_year === 0) {
    // If Year <= Project Length is true then = Year 0 (Project_Annual Savings Bill) , else 0
    return (_year <= projectLength) 
      ? projectAnnualSavingsOnCustomersBill(0, inputs)
      : 0
  }

  // Year 1
  if (_year === 1) {
    // If Year<= Project Length is true then = Annual Savings of same year, else 0
    return (_year <= projectLength)
      ? projectAnnualSavingsOnCustomersBill(_year, inputs)
      : 0
  }

  // Rest of Years
  // If Year <=  Project Length is true, then =  Current Year (Project_Annual Savings Bill) else 0
  return (_year <= projectLength) 
    ? projectAnnualSavingsOnCustomersBill(_year, inputs)
    : 0
}

// Project => CapEx
function projectCapEx(_year, inputs) {
  const {
    engineeringCosts,
    customerDeploymentPaymentTotalConstructionCosts: totalConstructionCost,  //Total Construction Cost
  } = inputs

  // Year 0
  if (_year === 0) {
    // (Engineering Cost * Total Construction Cost) * -1
    return -(engineeringCosts + totalConstructionCost)
  }

  // Year 1
  if (_year === 1) {
    // N/A
    return null
  }

  // Rest of Years
  // N/A
  return null
}

// Project => OpEx
function projectOpEx(_year, inputs) {
  const {
    contractLengthYears: projectLength, // Project Length
    annualOpExCosts, // Annual OpEx Costs,
    annualCostInflation,
  } = inputs
  
  // Year 0
  if (_year === 0) {
    // N/A
    return null
  }

  // Year 1
  if (_year === 1) {
    // (Annual OpEx Cost) * -1
    return -(annualOpExCosts)
  }
  
  // Rest of Years
  // If Year <= Project Length is true then = ((Current Year - 1) * (1 + Annual Cost Inflation), else 0
  const previousYearValue = projectOpEx(_year - 1, inputs)
  return (_year <= projectLength) 
    ? previousYearValue * (1 + annualCostInflation)
    : 0
}

// Project => Net Cash Flow
function projectNetCashFlow(_year, inputs) {
  const {
  //  
  } = inputs
  
  // Year 0
  if (_year === 0) {
    // Year 0 ((Project_CapEx) + (Project_OpEx))
    const year0ProjectCapEx = projectCapEx(0, inputs)
    const year0ProjectOpEx = projectOpEx(0, inputs)

    return year0ProjectCapEx + year0ProjectOpEx
  }

  const currentYearProjectRevenue = projectRevenue(_year, inputs)
  const currentYearProjectCapEx = projectCapEx(_year, inputs)
  const currentYearProjectOpEx = projectOpEx(_year, inputs) 

  // Year 1
  if (_year === 1) {
    // (Project_Revenue) + CapEx + OpEx
    return (
      currentYearProjectRevenue
      + currentYearProjectCapEx
      + currentYearProjectOpEx
    )
  }

  // Rest of Years
  // (Project_Revenue) + CapEx + OpEx
  return (
    currentYearProjectRevenue
    + currentYearProjectCapEx
    + currentYearProjectOpEx
  )
}

// Project => Cumulative Cash Flow
function projectCumulativeCashFlow(_year, inputs) {
  const {
    //  
  } = inputs
    
  // Year 0
  if (_year === 0) {
    // Year 0 (Project_Net Cash Flow)
    return projectNetCashFlow(0, inputs)
  }
  
  // Year 1
  if (_year === 1) {
    // Year 1 (Project_Net Cash Flow) + Year 0 (Project_Cumulative Cash Flow)
    const year1ProjectNetCashFlow = projectNetCashFlow(1, inputs)
    const year0ProjectCumulativeCashFlow = projectCumulativeCashFlow(0, inputs)
    return (
      year1ProjectNetCashFlow
        + year0ProjectCumulativeCashFlow
    )
  }
  
  // Rest of Years
  // Current Year (Project_Net Cash Flow) + Previous Year (Project_Cumulative Cash Flow)
  const currentYearProjectNetCashFlow = projectNetCashFlow(_year, inputs)
  const currentYearProjectCumulativeCashFlow = projectCumulativeCashFlow(_year -1 , inputs)

  return (
    currentYearProjectNetCashFlow
      + currentYearProjectCumulativeCashFlow
  )
}

/*
  =============================
    ESCO
  =============================
*/

// ESCO => Annual Savings on Customers Bill
function escoAnnualSavingsOnCustomersBill(_year, inputs) {
  const {
    annualCostSavings,
    annualUtilityInflation,
    year0savings,
    year1RampUp,
  } = inputs
    
  // Year 0
  if (_year === 0) {
    // (Annual Cost Savings * Year 0 Savings)
    return (annualCostSavings * year0savings)
  }
  
  // Year 1
  if (_year === 1) {
    // (Annual Cost Savings * Year 1 Ramp-Up)
    return (annualCostSavings * year1RampUp)
  }
  
  // Rest of Years
  // Previous Year (ESCO_Annual Savings on Customers Bill) * (1 * Annual Utility Inflation)
  
  // Rest of Years
  const previousYearValue = escoAnnualSavingsOnCustomersBill(
    _year - 1,
    inputs
  )

  return previousYearValue * (1 + annualUtilityInflation)
}

// ESCO => % savings accrued
function escoPercentSavingsAccrued(_year, inputs) {
  const {
    year0ESCOSavingsAccrued,
    contractLengthYears,
    customerSavingShare: userInput, // User Input - Per Year 0 -10 
  } = inputs

  // 1 - input
  // if input = 100, esco 0

  // Year 0
  if (_year === 0) {
    // userInput 
    return year0ESCOSavingsAccrued
  }
  
  // Year 1
  if (_year === 1) {
    // 1 - User Input
    return 1 - userInput
  }
  
  // Rest of Years
  // 1 - User Input
  // after Contract Length year zero
  return (_year <= contractLengthYears) 
    ? 1 - userInput
    : 0
}

// ESCO => Savings Revenues
function escoSavingsRevenues(_year, inputs) {
  const {
    // 
  } = inputs
    
  // Year 0
  if (_year === 0) {
    // N/A
    return null
  }
  
  // Year 1
  if (_year === 1) {
    // Year 1 (ESCO_Annual Savings Bill) * Year 1 (ESCO_% savings accrued)
    const year1ESCOAnnualSavingsBill = escoAnnualSavingsOnCustomersBill(1, inputs)
    const year1ESCOPercentSavingsAccrued = escoPercentSavingsAccrued(1, inputs)

    return (
      year1ESCOAnnualSavingsBill *
      year1ESCOPercentSavingsAccrued
    )
  }
  
  // Rest of Years
  // Current Year (ESCO_Annual Savings Bill) * Current Year(ESCO_% savings accrued)
  const currentYearESCOAnnualSavingsBill = escoAnnualSavingsOnCustomersBill(_year, inputs)
  const currentYearESCOPercentSavingsAccrued = escoPercentSavingsAccrued(_year, inputs)
    
  return (
    currentYearESCOAnnualSavingsBill *
    currentYearESCOPercentSavingsAccrued
  )
}

// ESCO => Service Payments
function escoServicePayments(_year, inputs) {
  const {
    // 
  } = inputs
    
  const customerSavingsInsuranceValue = customerSavingsInsurance(0, inputs)

  // Year 0
  if (_year === 0) {
    // (Customer_Savings Insurance) * -1
    return -(customerSavingsInsuranceValue)
  }
  
  // Year 1
  if (_year === 1) {
    // (Customer_Savings Insurance) * -1

    return -(customerSavingsInsuranceValue)
  }
  
  // Rest of Years
  // (Customer_Savings Insurance) * -1
  return -(customerSavingsInsuranceValue)
}

// ESCO => Investment
function escoInvestment(_year, inputs) {
  const {
    engineeringCosts,
    customerDeploymentPaymentTotalConstructionCosts: totalConstructionCost,
    customerDeployment,
  } = inputs
    
  // Year 0
  if (_year === 0) {
    // (Engineering Cost * Total Construction Cost) * (1 - Customer Deployment) 
    // + 0 * (Engineering Cost * Total Construction Cost) 
    return (
      -(engineeringCosts + totalConstructionCost) * 
      (1 - customerDeployment) 
      + (
        0 *
        (engineeringCosts + totalConstructionCost)
      )
    )
  }
  
  // Year 1
  if (_year === 1) {
    // N/A
    return null
  }
  
  // Rest of Years
  // N/A
  return null
}

// ESCO => OpEx Costs
function escoOpExCosts(_year, inputs) {
  const {
    contractLengthYears: projectLength, // Project Length
    annualOpExCosts,
    customerDeploymentPaymentAnnualOpExCosts,
    annualCostInflation,
  } = inputs
    
  // Year 0
  if (_year === 0) {
    // N/A
    return null
  }
  
  // Year 1
  if (_year === 1) {
    // If Year 1 <= Project Length is true, then = ((Annual OpEx Costs) * (Annual OpEx Costs (% of revenue))), else 0
    return (_year <= projectLength) 
      ? (annualOpExCosts * -1)  * (customerDeploymentPaymentAnnualOpExCosts)
      : 0
  }
  
  // Rest of Years
  // If Current Year (ESCO_% savings accrued) > 0, 
  // then (Previous Year (ESCO_OpEx Costs) * (1+ Annual Cost Inflation)), Else 0
  const currentYearESCOPercentSavingsAccrued = escoPercentSavingsAccrued(_year, inputs)
  const previousYearESCOOpExCosts = escoOpExCosts(_year - 1, inputs)

  return (currentYearESCOPercentSavingsAccrued > 0)
    ? previousYearESCOOpExCosts * (1 + annualCostInflation)
    : 0
}

// ESCO => Finance Costs
function escoFinanceCosts(_year, inputs) {
  const {
    annualInterestRate,
    engineeringCosts,
    contractLengthYears,
    customerDeploymentPaymentTotalConstructionCosts: totalConstructionCost,
  } = inputs

  // Year 0
  if (_year === 0) {
    // If (Annual Interest Rate) > 0, then 0.05 * Year 0 (ESCO_Investment), else 0 
    const year0ESCOInvestment = escoInvestment(0, inputs)

    return (annualInterestRate > 0)
      ? 0.05 * year0ESCOInvestment
      : 0
  }
  
  // Year 1
  if (_year === 1) {
    // If Year 1 (ESCO_% savings accrued) > 0, 
    // then (-1 *(-0.2*(Engineering Cost + Total Construction Cost) ) / ((Contract Length)) 
    // + (Year 0 (ESCO_Investment)) * (Annual Interest Rate)), 
    // 
    // else 0

    const year1ESCOPercentSavingsAccrued = escoPercentSavingsAccrued(1, inputs)
    const year0ESCOInvestment = escoInvestment(0, inputs)

    return (year1ESCOPercentSavingsAccrued > 0)
      ? (
        (
          -1 * 
          ( (-0.2 * (engineeringCosts + totalConstructionCost)) / contractLengthYears)
        ) / (year0ESCOInvestment * annualInterestRate)
      )
      : 0
  }
  
  // Rest of Years
  // If Current Year (ESCO_% savings accrued) > 0, 
  // then (-1 *(-0.2*(Engineering Cost + Total Construction Cost)) / ((Contract Length) 
  // + ((Year 0(ESCO_Investment)) * (Annual Interest Rate))
  // 
  // , else 0
  const currentYearESCOPercentSavingsAccrued = escoPercentSavingsAccrued(_year, inputs)
  const year0ESCOInvestment = escoInvestment(0, inputs)

  return (currentYearESCOPercentSavingsAccrued > 0)
    ? (
      (
        -1 * 
        ( (-0.2 * (engineeringCosts + totalConstructionCost)) / contractLengthYears)
      ) / (year0ESCOInvestment * annualInterestRate)
    )
    : 0
}

// ESCO => Equipment Guarantees
function escoEquipmentGuarantees(_year, inputs) {
  const {
    riskFactor,
  } = inputs

  const equipmentGuarantee = calculateEquipmentGuarantee(inputs)

  // Year 0
  if (_year === 0) {
    // N/A
    return null
  }
  
  // Year 1
  if (_year === 1) {
    // If Year 1 (ESCO_% savings accrued) > 0, then (-1 * (Equipment Guarantee))
    const year1ESCOPercentSavingsAccrued = escoPercentSavingsAccrued(1, inputs)

    return (year1ESCOPercentSavingsAccrued > 0)
      ? -(equipmentGuarantee)
      : 0
  }
  
  // Rest of Years
  // If Current Year (ESCO_% savings accrued) > 0, then (Previous Year(ESCO_Equipment Guarantees) * ( 1 + (Risk Factor))
  const currentYearESCOPercentSavingsAccrued = escoPercentSavingsAccrued(_year, inputs)
  const previousYearESCOEquipmentGuarantees = escoEquipmentGuarantees(_year - 1, inputs)

  return (currentYearESCOPercentSavingsAccrued > 0)
    ? previousYearESCOEquipmentGuarantees * ( 1 + riskFactor )
    : 0
} 

// ESCO => Savings Insurance
function escoSavingsInsurance(_year, inputs) {
  const {
   
  } = inputs
    
  // Year 0
  if (_year === 0) {
    // Customer Savings Insurance Zero Year
    const year0CustomerSaving = customerSavingsInsurance(_year, inputs)
    return year0CustomerSaving
  }
  
  // Year 1
  if (_year === 1) {
    // If Year 1 (ESCO_% savings accrued) > 0, then (Previous Year (ESCO_Savings Insurance) * 0.2) else 0
    const year1ESCOPercentSavingsAccrued = escoPercentSavingsAccrued(1, inputs)
    const year0ESCOSavingsInsurance = escoSavingsInsurance(0, inputs)

    return (year1ESCOPercentSavingsAccrued > 0)
      ? year0ESCOSavingsInsurance * 0.2
      : 0
  }
  
  // Rest of Years
  // If Current Year (ESCO_% savings accrued) > 0, then (Previous Year (ESCO_Savings Insurance) * 0.2) else 0
  const currentYearESCOPercentSavingsAccrued = escoPercentSavingsAccrued(_year, inputs)
  const prevYearESCOSavingsInsurance = escoSavingsInsurance(_year -1, inputs)

  return (currentYearESCOPercentSavingsAccrued > 0)
    ? prevYearESCOSavingsInsurance * 0.2
    : 0
}

// ESCO => Customer Management
function escoCustomerManagement(_year, inputs) {
  const {
    engineeringCosts,
    customerManagementCosts,
  } = inputs
    
  // Year 0
  if (_year === 0) {
    // (Customer Management Costs (% of TES Rev)) * (Engineering Cost)

    return (
      -customerManagementCosts * 
      engineeringCosts
    )
  }
  
  // Year 1
  if (_year === 1) {
    // (Customer Management Costs (% of TES Rev)) * (Current Year (ESCO_OpEx Costs))
    const year1ESCOOpExCosts = escoOpExCosts(1, inputs)
    return (
      customerManagementCosts * 
      year1ESCOOpExCosts
    )
  }
  
  // Rest of Years
  // (Customer Management Costs (% of TES Rev)) * (Current Year (OpEx Costs))
  const currentYearESCOOpExCosts = escoOpExCosts(_year, inputs)
  return (
    customerManagementCosts * 
    currentYearESCOOpExCosts
  )
}

// ESCO => Partner Savings Share
function escoPartnerSavingsShare(_year, inputs) {
  const {
    partnerSharedSavings,
  } = inputs
    
  // Year 0
  if (_year === 0) {
    // Year 0 (ESCO_Savings Revenues) * (Partner Shared Savings (of Taka Share))
    const year0ESCOSavingsRevenues = escoSavingsRevenues(0, inputs)

    return (
      year0ESCOSavingsRevenues *
      partnerSharedSavings
    )
  }
  
  // Year 1
  if (_year === 1) {
    // Year 1 (ESCO_Savings Revenues) * (Partner Shared Savings (of Taka Share))
    const year1ESCOSavingsRevenues = escoSavingsRevenues(1, inputs)

    return (
      year1ESCOSavingsRevenues *
      partnerSharedSavings
    )
  }
  
  // Rest of Years
  // Current Year (ESCO_Savings Revenues) * (Partner Shared Savings (of Taka Share))
  const currentYearESCOSavingsRevenues = escoSavingsRevenues(_year, inputs)

  return (
    currentYearESCOSavingsRevenues *
    partnerSharedSavings
  )
}

// ESCO => Net Cash Flow
function escoNetCashFlow(_year, inputs) {
  const {
    // 
  } = inputs
    
  // Year 0
  if (_year === 0) {
    // SUM (
    // Year 0 (
    // (ESCO_Savings Revenues) + (ESCO_Service Payments) + (ESCO_Investment) + (ESCO_OpEx Costs) +
    //  (ESCO_Finance Costs) + (ESCO_Equipment Guarantees) + (ESCO_Savings Insurance) + 
    // (ESCO_Customer Management) + (ESCO_Partner Savings Share))
    // )
    const year0ESCOSavingsRevenues = escoSavingsRevenues(0, inputs) || 0
    const year0ESCOServicePayements = escoServicePayments(0, inputs) || 0
    const year0ESCOInvestment = escoInvestment(0, inputs) || 0
    const year0ESCOOpEx = escoOpExCosts(0, inputs) || 0
    const year0ESCOFinanceCosts = escoFinanceCosts(0, inputs) || 0
    const year0ESCOEquipmentGuarantees = escoEquipmentGuarantees(0, inputs) || 0
    const year0ESCOSavingsInsurance = escoSavingsInsurance(0, inputs) || 0
    const year0ESCOCustomerManagement = escoCustomerManagement(0, inputs) || 0
    const year0ESCOPartnerSavingsShare = escoPartnerSavingsShare(0, inputs) || 0

    const sum = [
      year0ESCOInvestment,
      year0ESCOOpEx,
      year0ESCOFinanceCosts,
      year0ESCOEquipmentGuarantees,
      year0ESCOSavingsInsurance,
      year0ESCOCustomerManagement,
      year0ESCOPartnerSavingsShare,
    ].reduce((a,b) => a+b, 0.0)

    return (
      year0ESCOSavingsRevenues
      + year0ESCOServicePayements
      + sum
    )
  }
  
  // Year 1
  if (_year === 1) {
    // SUM (
    // Year 1 (
    // (ESCO_Savings Revenues) + (ESCO_Service Payments) + (ESCO_Investment) + (ESCO_OpEx Costs) +
    //  (ESCO_Finance Costs) + (ESCO_Equipment Guarantees) + (ESCO_Savings Insurance) + 
    // (ESCO_Customer Management) + (ESCO_Partner Savings Share))
    // )
    const year1ESCOSavingsRevenues = escoSavingsRevenues(1, inputs) || 0
    const year1ESCOServicePayements = escoServicePayments(1, inputs) || 0
    const year1ESCOInvestment = escoInvestment(1, inputs) || 0
    const year1ESCOOpEx = escoOpExCosts(1, inputs) || 0
    const year1ESCOFinanceCosts = escoFinanceCosts(1, inputs) || 0
    const year1ESCOEquipmentGuarantees = escoEquipmentGuarantees(1, inputs) || 0
    const year1ESCOSavingsInsurance = escoSavingsInsurance(1, inputs) || 0
    const year1ESCOCustomerManagement = escoCustomerManagement(1, inputs) || 0
    const year1ESCOPartnerSavingsShare = escoPartnerSavingsShare(1, inputs) || 0

    const sum = [
      year1ESCOInvestment,
      year1ESCOOpEx,
      year1ESCOFinanceCosts,
      year1ESCOEquipmentGuarantees,
      year1ESCOSavingsInsurance,
      year1ESCOCustomerManagement,
      year1ESCOPartnerSavingsShare,
    ].reduce((a,b) => a+b, 0.0)

    return (
      year1ESCOSavingsRevenues
      + year1ESCOServicePayements
      + sum
    )
  }
  
  // Rest of Year
  // SUM (
  // Current Year (
  // (ESCO_Savings Revenues) + (ESCO_Service Payments) + (ESCO_Investment) + (ESCO_OpEx Costs) +
  //  (ESCO_Finance Costs) + (ESCO_Equipment Guarantees) + (ESCO_Savings Insurance) + 
  // (ESCO_Customer Management) + (ESCO_Partner Savings Share))
  // )
  const currentYearESCOSavingsRevenues = escoSavingsRevenues(_year, inputs) || 0
  const currentYearESCOServicePayments = escoServicePayments(_year, inputs) || 0
  const currentYearESCOInvestment = escoInvestment(_year, inputs) || 0
  const currentYearESCOOpEx = escoOpExCosts(_year, inputs) || 0
  const currentYearESCOFinanceCosts = escoFinanceCosts(_year, inputs) || 0
  const currentYearESCOEquipmentGuarantees = escoEquipmentGuarantees(_year, inputs) || 0
  const currentYearESCOSavingsInsurance = escoSavingsInsurance(_year, inputs) || 0
  const currentYearESCOCustomerManagement = escoCustomerManagement(_year, inputs) || 0
  const currentYearESCOPartnerSavingsShare = escoPartnerSavingsShare(_year, inputs) || 0

  const sum = [
    currentYearESCOInvestment,
    currentYearESCOOpEx,
    currentYearESCOFinanceCosts,
    currentYearESCOEquipmentGuarantees,
    currentYearESCOSavingsInsurance,
    currentYearESCOCustomerManagement,
    currentYearESCOPartnerSavingsShare,
  ].reduce((a,b) => a+b, 0.0)

  return (
    currentYearESCOSavingsRevenues
    + currentYearESCOServicePayments
    + sum
  )
}

// ESCO => Cumulative Cash Flow
function escoCumulativeCashFlow(_year, inputs) {
  const {
    // 
  } = inputs
    
  // Year 0
  if (_year === 0) {
    // Year 0 (ESCO_Net Cash Flow)
    const year0ESCONetCashFlow = escoNetCashFlow(_year, inputs)
    return year0ESCONetCashFlow
  }
  
  // Year 1
  if (_year === 1) {
    // (Year 0 (ESCO_Cumulative Cash Flow)) + (Year 1 (ESCO_Net Cash Flow))
    const year0ESCOCumulativeCashFlow = escoCumulativeCashFlow(0, inputs)
    const year1ESCONetCashFlow = escoNetCashFlow(1, inputs)

    return (
      year0ESCOCumulativeCashFlow
      + year1ESCONetCashFlow
    )
  }
  
  // Rest of Years
  // (Previous Year (ESCO _Cumulative Cash Flow)) + (Current Year (ESCO_Net Cash Flow))
  const prevYearESCOCumulativeCashFlow = escoCumulativeCashFlow(_year - 1 , inputs)
  const currentYearESCONetCashFlow = escoNetCashFlow(_year, inputs)

  return (
    prevYearESCOCumulativeCashFlow
    + currentYearESCONetCashFlow
  )
}

/*
  =============================
    Customer
  =============================
*/

// Customer => Annual Savings on Customers Bill
function customerAnnualSavingsOnCustomersBill(_year, inputs) {
  const {
  //  
  } = inputs
    
  // Year 0
  if (_year === 0) {
    // Year 0 (ESCO_Annual Savings Bill)
    const year0ESCOAnnualSavingsOnCustomersBill = escoAnnualSavingsOnCustomersBill(0, inputs)
    return year0ESCOAnnualSavingsOnCustomersBill
  }
  
  // Year 1
  if (_year === 1) {
    // Year 1 (ESCO_Annual Savings Bill)
    const year1ESCOAnnualSavingsOnCustomersBill = escoAnnualSavingsOnCustomersBill(1, inputs)
    return year1ESCOAnnualSavingsOnCustomersBill
  }
  
  // Rest of Years
  // Current Year (ESCO _Annual Savings on Customer Bill)
  const currentYearESCOAnnualSavingsOnCustomersBill = escoAnnualSavingsOnCustomersBill(_year, inputs)
  return currentYearESCOAnnualSavingsOnCustomersBill
}

// Customer => % savings accrued to Customer
function customerPercentSavingsAccruedToCustomer(_year, inputs) {
  const {
    // 
  } = inputs
  
  // Year 0
  if (_year === 0) {
    // (1 - (Year 0 (ESCO_% Savings Accrued))
    const year0ESCOSavingsAccrued = escoPercentSavingsAccrued(0, inputs) || 0
    return 1.0 - year0ESCOSavingsAccrued
  }
    
  // Year 1
  if (_year === 1) {
    // (1 - Year 1 (ESCO_% Savings Accrued)
    const year1ESCOSavingsAccrued = escoPercentSavingsAccrued(1, inputs) || 0
    return 1.0 - year1ESCOSavingsAccrued
  }
  
  // Rest of Years
  // (1 - Current Year (ESCO_% Savings Accrued)
  const currentYearESCOSavingsAccrued = escoPercentSavingsAccrued(_year, inputs) || 0
  return 1.0 - currentYearESCOSavingsAccrued
}

// Customer => Gross Savings
function customerGrossSavings(_year, inputs) {
  const {
    //  
  } = inputs
      
  // Year 0
  if (_year === 0) {
    // (Year 0 (Customer_Annual Savings Bill)) * Year 0 (Customer_% Savings accrued) 
    const year0CustomerAnnualSavingsOnCustomersBill = customerAnnualSavingsOnCustomersBill(0, inputs)
    const year0CustomerPercentSavingsAccruedToCustomer = customerPercentSavingsAccruedToCustomer(0, inputs)

    return (
      year0CustomerAnnualSavingsOnCustomersBill *
      year0CustomerPercentSavingsAccruedToCustomer
    )
  }
    
  // Year 1
  if (_year === 1) {
    // (Year 1 (Customer_Annual Savings Bill)) * (Year 1 (Customer_% Savings accrued))
    const year1CustomerAnnualSavingsOnCustomersBill = customerAnnualSavingsOnCustomersBill(1, inputs)
    const year1CustomerPercentSavingsAccruedToCustomer = customerPercentSavingsAccruedToCustomer(1, inputs)
    
    return (
      year1CustomerAnnualSavingsOnCustomersBill *
      year1CustomerPercentSavingsAccruedToCustomer
    )
  }
    
  // Rest of Years
  // (Current Year (Customer_Annual Savings Bill)) * (Year 1 (Customer_% Savings accrued))
  const currentYearCustomerAnnualSavingsOnCustomersBill = customerAnnualSavingsOnCustomersBill(_year, inputs)
  const currentYearCustomerPercentSavingsAccruedToCustomer = customerPercentSavingsAccruedToCustomer(_year, inputs)
    
  return (
    currentYearCustomerAnnualSavingsOnCustomersBill *
    currentYearCustomerPercentSavingsAccruedToCustomer
  )
}

// Customer => Investment
function customerInvestment(_year, inputs) {
  const {
    customerDeploymentPaymentTotalConstructionCosts: totalConstructionCost,
    subcontractorCosts,
    engineeringCosts,
    customerDeployment,
  } = inputs
      
  // Year 0
  if (_year === 0) {
    // (Engineering Costs + Total Construction Cost + Subcontractor Costs) * Customer Deployment
    // todo: convert into numbers
    return -(engineeringCosts + totalConstructionCost + (+subcontractorCosts)) * customerDeployment
  }
    
  // Year 1
  if (_year === 1) {
    // N/A
    return null
  }
  
  // Rest of Years
  // N/A
  return null
}

// Customer => Savings Insurance
function customerSavingsInsurance(_year, inputs) {
  const {
    customerDeploymentPaymentAnnualSavingsInsurance: percentAnnualSavings,
  } = inputs
      
  // Year 0
  if (_year === 0) {
    // todo
    const maxCustomerGrossSavings = 0
    //  If (Annual Savings Insurance (% of Annual Savings) > 0, then (-1 * (MAX(Customer_Gross Savings) * 0 
    return (percentAnnualSavings > 0)
      ? -(maxCustomerGrossSavings * 0)
      : 0 
  }
    
  // Year 1
  if (_year === 1) {
    // N/A
    return null
  }
  
  // Rest of Years
  // N/A
  return null
}

// Customer => CapEx Payment
function customerCapExPayment(_year, inputs) {
  const {
    
  } = inputs
      
  // Year 0
  if (_year === 0) {
    // N/A
    return null
  }
    
  // Year 1
  if (_year === 1) {
    // N/A
    return null
  }
  
  // Rest of Years
  // N/A
  return null
}

// Customer => OpEx Payment
function customerOpExPayment(_year, inputs) {
  const {
    
  } = inputs
      
  // Year 0
  if (_year === 0) {
    // N/A
    return null
  }
    
  // Year 1
  if (_year === 1) {
    // N/A
    return null
  }
  
  // Rest of Years
  // N/A
  return null
}

// Customer => Net Cash Flow
function customerNetCashFlow(_year, inputs) {
  const {
    
  } = inputs
      
  // Year 0
  if (_year === 0) {
    // Year 0 ((Customer_Gross Savings) + (Customer_Investment) + (Customer_Savings Insurance) 
    // + (Customer_CapEx Payment) + (Customer_OpEx Payment))
    const year0CustomerGrossSavings = customerGrossSavings(0, inputs) || 0
    const year0CustomerInvestment = customerInvestment(0, inputs) || 0
    const year0CustomerSavingsInsurance = customerSavingsInsurance(0, inputs) || 0
    const year0CustomerCapExPayment = customerCapExPayment(0, inputs) || 0
    const year0CustomerOpExPayment = customerOpExPayment(0, inputs) || 0

    return (
      year0CustomerGrossSavings
      + year0CustomerInvestment
      + year0CustomerSavingsInsurance
      + year0CustomerCapExPayment
      + year0CustomerOpExPayment
    )
  }
    
  // Year 1
  if (_year === 1) {
    // Year 1 ((Customer_Gross Savings) + (Customer_Investment) + (Customer_Savings Insurance) 
    // + (Customer_CapEx Payment) + (Customer_OpEx Payment))
    const year1CustomerGrossSavings = customerGrossSavings(1, inputs) || 0
    const year1CustomerInvestment = customerInvestment(1, inputs) || 0
    const year1CustomerSavingsInsurance = customerSavingsInsurance(1, inputs) || 0
    const year1CustomerCapExPayment = customerCapExPayment(1, inputs) || 0
    const year1CustomerOpExPayment = customerOpExPayment(1, inputs) || 0
    
    return (
      year1CustomerGrossSavings
      + year1CustomerInvestment
      + year1CustomerSavingsInsurance
      + year1CustomerCapExPayment
      + year1CustomerOpExPayment
    )
  }
  
  // Rest of Years
  // Current Year ((Customer_Gross Savings) + (Customer_Investment) + (Customer_Savings Insurance) 
  // + (Customer_CapEx Payment) + (Customer_OpEx Payment))
  const currentYearCustomerGrossSavings = customerGrossSavings(_year, inputs) || 0
  const currentYearCustomerInvestment = customerInvestment(_year, inputs) || 0
  const currentYearCustomerSavingsInsurance = customerSavingsInsurance(_year, inputs) || 0
  const currentYearCustomerCapExPayment = customerCapExPayment(_year, inputs) || 0
  const currentYearCustomerOpExPayment = customerOpExPayment(_year, inputs) || 0
    
  return (
    currentYearCustomerGrossSavings
      + currentYearCustomerInvestment
      + currentYearCustomerSavingsInsurance
      + currentYearCustomerCapExPayment
      + currentYearCustomerOpExPayment
  )
}

// Customer => Profit
function customerProfit(_year, inputs) {
  const {
    // 
  } = inputs
      
  // Year 0
  if (_year === 0) {
    // = Year 0 (Customer_Net Cash Flow)
    const year0CustomerNetCashFlow = customerNetCashFlow(0, inputs)

    return year0CustomerNetCashFlow
  }
    
  // Year 1
  if (_year === 1) {
    // = (Year 0 (Customer_Profit)) + (Year 1 (Customer_Net Cash Flow))
    const year0CustomerProfit = customerProfit(0, inputs)
    const year1CustomerNetCashFlow = customerNetCashFlow(1, inputs)

    return (
      year0CustomerProfit
      + year1CustomerNetCashFlow
    )
  }
  
  // Rest of Years
  // (Year 1 (Customer_Profit)) + (Current Year (Customer_Cash Flow))
  const prevYearCustomerProfit = customerProfit(_year - 1, inputs)
  const currentYearCustomerNetCashFlow = customerNetCashFlow(_year, inputs)

  return (
    prevYearCustomerProfit
    + currentYearCustomerNetCashFlow
  )
}

/*
  =============================
    Prtofits
  =============================
*/


// Profits => 10 Year Profit
function profitsCustomerTenYearProfit(models) {
  // Total_(Customer_Net Cash Flow)
  const totalCustomerNetCashFlow = calculateTotal(models.customerCashFlow.NetCashFlow)

  return totalCustomerNetCashFlow
}

// Profits => NPV
function profitsCustomerNPV(models) {
  // NPV (10%, (Year 0 - Year 10 (Customer_Net Cash Flow)
  let NPV = 0
  
  try {
    NPV = finance.NPV(
      10,
      0, // initial investment
      ...models.customerCashFlow.NetCashFlow
    )
  } catch (err) {
    console.error(err)
  }

  return NPV
}

// Profits => ROI
function profitsCustomerROI(models) {
  // (-1 *Year 10_(Customer_Profit) / (Total_(Customer_Investment)
  const totalCustomerProfit  = models.customerCashFlow.Profit[10]
  const totalCustomerInvestment = calculateTotal(models.customerCashFlow.Investment)

  return (-totalCustomerProfit) / totalCustomerInvestment
}

// Profits => IRR
function profitsCustomerIRR(models) {
  // IRR  (Year 0 - Year 10 (Customer_Net Cash Flow)
  let IRR = 0
  // return IRR
  
  try {
    IRR =  finance.IRR(
      0,
      ...models.customerCashFlow.NetCashFlow
    )
  } catch (err) {
    console.error(err)
  }

  return IRR
}

// Profits => 10-Year Savings Share
function profitsCustomerTenYearSavingsShare(models) {
  // (Total_(Customer_Gross Savings) / (Total_(Customer_Annual Savings Bill))
  const totalCustomerGrossSavings = calculateTotal(models.customerCashFlow.GrossSavings)
  const totalAnnualSavingsOnCustomersBill = calculateTotal(models.customerCashFlow.AnnualSavingsOnCustomersBill)

  return (
    totalCustomerGrossSavings /totalAnnualSavingsOnCustomersBill
  )
}

// ESCO NPV
function profitsESCONPV(models) {
  //  NPV (10%, (Year 0 - Year 10 (ESCO_Net Cash Flow)
  let NPV = 0
  
  try {
    NPV = finance.NPV(
      10,
      0, // initial investment
      ...models.ESCOCashFlow.NetCashFlow
    )
  } catch (err) {
    console.error(err)
  }

  return NPV
}

// ESCO ROI
function profitsESCOROI(models) {
  //  (-1 *(Total_(ESCO_Net Cash Flow) / (Year 0_(ESCO_Net Cash Flow))
  const totalNetCashFlow = calculateTotal(models.ESCOCashFlow.NetCashFlow)
  const year0NetCashFlow = models.ESCOCashFlow.NetCashFlow[0]
  
  return (-totalNetCashFlow) / year0NetCashFlow
}

// ESCO IRR
function profitsESCOIRR(models) {
  //  IRR  (Year 0 - Year 10 (ESCO_Net Cash Flow)
  let IRR = 0
  // return IRR
  
  try {
    IRR =  finance.IRR(
      0,
      ...models.ESCOCashFlow.NetCashFlow
    )
  } catch (err) {
    console.error(err)
  }

  return IRR
}

// ESCO 10-Year Savings Share
function profitsESCOTenYearSavingsShare(models) {
  //  1 - (Customer_TenYearSavingsShare)
  const tenYearSavingsShare = profitsCustomerTenYearSavingsShare(models)

  return 1.00 - tenYearSavingsShare
}


export const Project = {
  AnnualSavingsOnCustomersBill: projectAnnualSavingsOnCustomersBill,
  Revenue: projectRevenue,
  CaPex: projectCapEx,
  OpEx: projectOpEx,
  NetCashFlow: projectNetCashFlow,
  CumulativeCashFlow: projectCumulativeCashFlow,
}

export const ESCO = {
  AnnualSavingsOnCustomersBill: escoAnnualSavingsOnCustomersBill,
  PercentSavingsAccrued: escoPercentSavingsAccrued,
  SavingsRevenues: escoSavingsRevenues,
  ServicePayments: escoServicePayments,
  Investment: escoInvestment,
  OpExCosts: escoOpExCosts,
  FinanceCosts: escoFinanceCosts,
  EquipmentGuarantees: escoEquipmentGuarantees,
  SavingsInsurance: escoSavingsInsurance,
  CustomerManagement: escoCustomerManagement,
  PartnerSavingsShare: escoPartnerSavingsShare,
  NetCashFlow: escoNetCashFlow,
  CumulativeCashFlow: escoCumulativeCashFlow,
}

export const Customer = {
  AnnualSavingsOnCustomersBill: customerAnnualSavingsOnCustomersBill,
  PercentSavingsAccruedToCustomer: customerPercentSavingsAccruedToCustomer,
  GrossSavings: customerGrossSavings,
  Investment: customerInvestment,
  SavingsInsurance: customerSavingsInsurance,
  CapExPayment: customerCapExPayment,
  OpExPayment: customerOpExPayment,
  NetCashFlow: customerNetCashFlow,
  Profit: customerProfit,
}

export const Profits = {
  Customer: {
    TenYearProfit: profitsCustomerTenYearProfit,
    NPV: profitsCustomerNPV,
    ROI: profitsCustomerROI,
    IRR: profitsCustomerIRR,
    TenYearSavingsShare: profitsCustomerTenYearSavingsShare,
  },
  ESCO: {
    NPV: profitsESCONPV,
    ROI: profitsESCOROI,
    IRR: profitsESCOIRR,
    TenYearSavingsShare: profitsESCOTenYearSavingsShare,
  },
}

export default calculateFormulaForYears