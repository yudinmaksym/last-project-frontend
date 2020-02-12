import DateField from '../../fields/DateField'
import { renderPhoneInput } from '../../fields/fieldSet'

import {
  buildingTypeOptions,
  emiratesOptions,
  billTypeOptions,
  plantTypeOptions,
  pastEEUpgrades,
  strategicImportanceOptions,
  productOfferingCategoryOptions,
  productOfferingDetailsOptions,
  productLumpSumOptions,
  eemOptions,
  proposalCategoryOptions,
  contractTypeOptions,
  salesLeadNameOptions,
  phaseOpts,
  salesSupportNameOptions,
  externalBDSupportOptions,
  salesLeadScopeOpts,
} from './selectOptions'
import {
  renderField,
  renderSelect,
  renderFilesField,
  renderTextArea,
  renderCheckBox,
  renderMultipleSelect,
} from './renderField'




export const firstStepFields = [
  { name: 'proposalCategory', label: 'Proposal Category', required: true, render: renderSelect(proposalCategoryOptions) },
  { name: 'version', label: 'Version' , render: renderField },
  { name: 'date', type: 'date', label: 'Date (Calendar)', required: true, render: DateField },
  { name: 'contractType', label: 'Contract Type', required: true, render: renderSelect(contractTypeOptions) },
  { name: 'salesLeadName', label: 'Sales Lead Name', required: true, render: renderSelect(salesLeadNameOptions) },
  { name: 'salesLeadScope', label: 'Sales Lead Scope', render: renderSelect(salesLeadScopeOpts) },
  { name: 'externalBDSupport', label: 'External BD Support', render: renderSelect(externalBDSupportOptions) },
  { name: 'exterlalEntity', label: 'External Entity', render: renderField },
  { name: 'salesSupportName', label: 'Sales Support Name', required: true, render: renderSelect(salesSupportNameOptions) },
  { name: 'supportType', label: 'Support Type', render: renderSelect(salesLeadScopeOpts) },
  { name: 'phase', label: 'Phase', required: true,render: renderSelect(phaseOpts) },
]

export const secondStepFields = [
  { name: 'companyInformation', label: 'Company Information', required: true, render: renderTextArea },
  { name: 'poc', label: 'POC(s)', required: true, render: renderTextArea },
  { name: 'annualRevenue', label: 'Annual revenue (AED)', type: 'number', render: renderField },
  { name: 'profitAED', label: 'Profit (AED)', type: 'number', render: renderField },
  { name: 'newsLink', label: 'News Link', render: renderField },
  { name: 'otherInformation', label: 'Other information', render: renderField },
  { name: 'existingRelationToPoc', label: 'Existing Relation to POC', required: true, render: renderSelect(['Personal', 'Professional', 'New Lead']) },
  { name: 'pastExpirience', label: 'Past Experience',required: true,  render: renderSelect(['Project' ,  'Communication', 'None']) },
  { name: 'desitionMaker', label: 'Decision Maker(s) / Authorize Signatory',required: true,  render: renderTextArea },
  { name: 'levelOfInterest', label: 'Level of Interest', required: true, render: renderSelect(['Low', 'Medium', 'High']) },
  { name: 'customerContractPriority', label: 'Customer Contract Priority (%)', type: 'number', required: true,  render: renderField },
  { name: 'logo', label: 'Logo', required: false, render: renderFilesField() },
  { name: 'desitionMakingProcess', label: 'Decision Making Process', required: false, render: renderFilesField() },
  { name: 'organisationStructure', label: 'Organization Structure', required: false, render: renderFilesField() },
]

export const thirdStepFields = [
  { name: 'strategicImportance', label: 'Strategic Importance', required: true, render: renderSelect(strategicImportanceOptions) },
  { name: 'budgetDetailsAED', label: 'Budget Details (AED)', type: 'number', required: true, render: renderField },
  { name: 'lengthOfContractInYears', label: 'Contract Terms(Length of Contract in Years)', type: 'number', required: true,  render: renderField },
  { name: 'paymentTerms', label: 'Contract Terms(Payment Terms)',type: 'number', required: true,  render: renderField },
  { name: 'savingsSplit', label: 'Contract Terms(Savings Split, 0-100)', type: 'number', required: true,  render: renderField },
  { name: 'productOfferingCategory', label: 'Product Offering Category', required: true,  render: renderSelect(productOfferingCategoryOptions) },
  { name: 'productOfferingDetails', label: 'Product Offering Details', required: true,  render: renderSelect(productOfferingDetailsOptions) },
  { name: 'productLumpSum', label: 'Product Lump Sum Add-ons', required: true,  render: renderMultipleSelect(productLumpSumOptions) },
  { name: 'eem', label: 'EEM', required: true,  render: renderMultipleSelect(eemOptions) },
  { name: 'notes', label: 'Notes',  render: renderTextArea },
]

export const timeframeAndSchedule = [
  { name: 'expectedSingDate', label: 'Expected Sign Date (Calendar)', required: false,  render: DateField },
  { name: 'desingDeploymentDate', label: 'Designed Deployment Date (Calendar)', required: false,  render: DateField },
  { name: 'opportunitySheetApproval', label: 'Opportunity Sheet Approval', required: false, render: DateField },
  { name: 'siteSurveySchedule', label: 'Site Survey Schedule', required: false, render: DateField },
  { name: 'proposalSubmission', label: 'Proposal Submission', required: false, render: DateField },
  { name: 'proposalPresentationSignature', label: 'Proposal Presentation & Signature', required: false, render: DateField },
  { name: 'dataGathering', label: 'Deployment of Dell Boxes', required: false, render: DateField },
  { name: 'contractAward', label: 'Contract Award & Signature ',required: false,  render: DateField },
  { name: 'implementationCompleted', label: 'Implementation Completed ',required: false,  render: DateField },
]

export const additionalBuildingFields = [
  { name: 'annualOccupancy', label: 'Annual Occupancy %', type: 'number', required: false,  render: renderField },
  { name: 'conditionedAreaM2', label: 'Conditioned Area (m2)', type: 'number', required: false,  render: renderField },
  { name: 'parkingAreaM2', label: 'Parking Area (m2)', type: 'number', required: false,  render: renderField },
  { name: 'tenantMeteredAreaM2', label: 'Tenant /Metered Area (m2)', type: 'number', required: false,  render: renderField },
  { name: 'numberOfRooms', label: 'Number of Rooms', type: 'number', required: false,  render: renderField },
]

export const fourthStepFields = [
  { name: 'photo', label: 'Photo', render: renderFilesField() },
  { name: 'owner', label: 'Owner', required: true, render: renderField },
  { name: 'operator', label: 'Operator', required: false, render: renderField },
  { name: 'mainContractor', label: 'Main Contractor', render: renderField },
  { name: 'mepContractor', label: 'MEP Contractor', render: renderField },
  { name: 'consultant', label: 'Consultant', render: renderField },
  { name: 'mepConsultant', label: 'MEP Consultant', render: renderField },
  { name: 'fm', label: 'FM', render: renderField },
  { name: 'sector', label: 'Sector' , render: renderField },
  { name: 'pastEEUpgrades', label: 'Past EE Upgrades', required: false,  render: renderMultipleSelect(pastEEUpgrades) },
]

export const fourthStepProjectSection = [
  { name: 'buildingType', label: 'Building Type', required: true, render: renderSelect(buildingTypeOptions) },
  { name: 'address', label: 'Address', required: true, render: renderField },
  { name: 'poBox', label: 'P.O Box', type: 'number', render: renderField },
  { name: 'emirates', label: 'Emirates', required: true, render: renderSelect(emiratesOptions) },
  { name: 'addressCoordinate', label: 'Address Coordinate ', render: renderField },
  { name: 'yearBuilt', label: 'Year built',required: true, type: 'number',  render: renderField },
  { name: 'numberOfStories', label: 'Number of stories', required: true, type: 'number', render: renderField },
  { name: 'grossFroorArea', label: 'Gross Floor Area(m2)', type: 'number', required: true,  render: renderField },
  { name: 'totalConditionedArea', label: 'Total Conditioned Area(m2)', type: 'number',  required: true,  render: renderField },
  { name: 'commonConditionedArea', label: 'Common Conditioned Area(m2)' ,type: 'number', required: true,  render: renderField },
  { name: 'billType', label: 'Bill Type', required: true,  render: renderSelect(billTypeOptions) },
  { name: 'plantType', label: 'Plant Type', required: true,  render: renderSelect(plantTypeOptions) },
]

export const drawingsReceived = [
  { name: 'hvacAsBuilt', label: 'HVAC As-built', render: renderCheckBox },
  { name: 'mechanicalAsBuilt', label: 'Mechanical As-built', render: renderCheckBox },
  { name: 'architecturalAsBuilt', label: 'Architectural As-built', render: renderCheckBox },
  { name: 'electricalAsBuilt', label: 'Electrical As-built', render: renderCheckBox },
  { name: 'chilledWaterVentilationRisers', label: 'Chilled Water and Ventilation Risers', render: renderCheckBox },
  { name: 'bmsRisers', label: 'BMS Risers', render: renderCheckBox },
]

export const calculationSectionFirst = [
  { name: 'annualElectricitySpendAED', label: 'Annual Electricity Spend (AED)', type: 'number', required: true,  render: renderField },
  { name: 'annualWaterSpendAED', label: 'Annual Water Spend (AED)', type: 'number', required: true,  render: renderField },
  { name: 'annualChilledWaterSpendAED', label: 'Annual Chilled Water Spend (AED)', type: 'number', required: true,  render: renderField },
  { name: 'annualLPGSNGSpendAED', label: 'Annual LPG/SNG Spend (AED)', type: 'number', required: true,  render: renderField },
  { name: 'annualAverageTotalAED', label: 'Annual Average Total Spend (AED)', type: 'number', required: true,  render: renderField },
  { name: 'annualEnergyConsumptionkWh', label: 'Annual Energy Consumption (kWh)', type: 'number', required: true,  render: renderField },
]

export const calculationSectionSecond = [
  { name: 'eui', label: 'EUI (kWh/m2/year)', type: 'number', required: true,  render: renderField },
  { name: 'eci', label: 'ECI (AED/m2/year)', type: 'number', required: true,  render: renderField },
]

export const calculationSectionThird = [
  { name: 'estimatedTotalProjectValueAED', label: 'Estimated Total Project Value (AED)', type: 'number', required: true,  render: renderField },
  { name: 'annualReductionPercent', label: 'Annual Reduction %', type: 'number', required: true,  render: renderField },
]

export const calculationSectionFourth = [
  { name: 'annualReductionAED', label: 'Annual Reduction (AED)', type: 'number', required: true,  render: renderField },
  { name: 'annualReductionKWHM2', label: 'Annual Reduction (kwh/m2)', type: 'number', required: true,  render: renderField },
  { name: 'annualReductionAEDM2', label: 'Annual Reduction (AED/m2)', type: 'number', required: true,  render: renderField },
]

export const editCustomerFields = [
  { name: 'label', label: 'Name', required: true,  render: renderField },
  { name: 'state', label: 'State', type: 'number', required: true,  render: renderSelect(['active', 'pending']) },
  { name: 'phoneNumber', label: 'Phone Number', type: 'number', required: true,  render: renderPhoneInput },
]
