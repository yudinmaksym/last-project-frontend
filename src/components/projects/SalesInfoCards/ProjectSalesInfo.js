/* eslint-disable camelcase */
import React, { useMemo, useEffect, useState } from 'react'
import flatten from 'lodash/flatten'
// import uniqBy from 'lodash/uniqBy'
import groupBy from 'lodash/groupBy'


import agent from '../../../../agent'
import CircleLoader from '../../../components/preloadrers/circle-loader'
import CommentInfoCard from '../../../shared/CommentInfoCard'
import { formatNumber } from '../../../utils/format'


const ProjectSalesInfo = ({ project = {}, projectFuels = [], specificProjectInfo = {} } = {}) => {
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState([])
  const salesInfo = useMemo(() => {
    const fuelMetrics = projectFuels.map(fuel => {
      switch (fuel) {
      case 'Electricity': return [{
        title: <span>Annual Electricity Cost (AED)</span>,
        value: specificProjectInfo && specificProjectInfo.annualElectricalAED
          ? formatNumber(specificProjectInfo.annualElectricalAED) : 0,
        key: 'projects_annualElectricalAED',
        highlighted: comments.find(({ key }) => key === 'projects_annualElectricalAED'),
      },
      {
        title: <span>Annual Electricity Consumption (kWh)</span>,
        value: specificProjectInfo && specificProjectInfo.annualElectricalkWh
          ? formatNumber(specificProjectInfo.annualElectricalkWh) : 0,
        key: 'projects_annualElectricalkWh',
        highlighted: comments.find(({ key }) => key === 'projects_annualElectricalkWh'),
      }]
      case 'LPG (GAS)': return [{
        title: <span>'Annual LPG (L) Consumption'</span>,
        value: specificProjectInfo && specificProjectInfo.annualLPGSngkWh
          ? formatNumber(specificProjectInfo.annualLPGSngkWh) : 0,
        key: 'projects_annualLPGSngkWh',
        highlighted: comments.find(({ key }) => key === 'project_sannualLPGSngkWh'),
      },
      {
        title: <span>Annual LPG (AED) Consumption</span>,
        value: specificProjectInfo && specificProjectInfo.annualLPGSngAED
          ? formatNumber(specificProjectInfo.annualLPGSngAED) : 0,
        key: 'projects_annualLPGSngAED',
        highlighted: comments.find(({ key }) => key === 'projects_annualLPGSngAED'),
      }]
      case 'Chilled Water': return [{
        title: <span>Annual CHW Cost (AED)</span>,
        value: specificProjectInfo && specificProjectInfo.annualChilledWaterAED
          ? formatNumber(specificProjectInfo.annualChilledWaterAED) : 0,
        key: 'projects_annualChilledWaterAED',
        highlighted: comments.find(({ key }) => key === 'projects_annualChilledWaterAED'),
      },
      {
        title: <span>Annual CHW Consumption (kWh)</span>,
        value: specificProjectInfo && specificProjectInfo.annualChilledWaterkWh
          ? formatNumber(specificProjectInfo.annualChilledWaterkWh) : 0,
        key: 'projects_annualChilledWaterkWh',
        highlighted: comments.find(({ key }) => key === 'projects_annualChilledWaterkWh'),
      },
      ]
      case 'Water': return [{
        title: <span>Annual Water Cost (AED)</span>,
        value: specificProjectInfo && specificProjectInfo.annualWaterAED
          ? formatNumber(specificProjectInfo.annualWaterAED) : 0,
        key: 'projects_annualWaterAED',
        highlighted: comments.find(({ key }) => key === 'projects_annualWaterAED'),
      },
      {
        title: <span>Annual Water Consumption (kWh)</span>,
        value: specificProjectInfo && specificProjectInfo.annualWaterkWh
          ? formatNumber(specificProjectInfo.annualWaterkWh) : 0,
        key: 'projects_annualWaterkWh',
        highlighted: comments.find(({ key }) => key === 'projects_annualWaterkWh'),
      }]
      default: return []
      }
    })

    return [
      {
        title: 'Strategic Importance',
        value: project.project.strategicImportance,
        key: 'projects_strategicImportance',
        highlighted: comments.find(({ key }) => key === 'projects_strategicImportance'),
      },
      {
        title: 'Budget Details (AED)',
        value: project.project.budgetDetailsAED,
        key: 'projects_budgetDetailsAED',
        highlighted: comments.find(({ key }) => key === 'projects_budgetDetailsAED'),
      },
      {
        title: 'Product Offering',
        value: project.project.productOfferingCategory,
        key: 'projects_productOfferingCategory',
        highlighted: comments.find(({ key }) => key === 'projects_productOfferingCategory'),
      },
      {
        title: 'Fuels',
        value: projectFuels.length === 0 ? 'N/A' : projectFuels.join(', '),
        key: 'projects_fuels',
        highlighted: comments.find(({ key }) => key === 'projects_fuels'),
      },
      {
        title: 'Buildings count',
        value: project['buildings'] ? formatNumber(project['buildings'].length) : 0,
        key: 'projects_buildings_count',
        highlighted: comments.find(({ key }) => key === 'projects_buildings_count'),
        additionalInfo: {
          header: 'Building Names',
          list: project['buildings'] ? project['buildings'].map(({ name: value }) => ({ value })) : [],
        },
      },
      {
        title: 'Meters count',
        value: project['meters'] ? formatNumber(project['meters'].length) : 0,
        key: 'projects_meters_count',
        highlighted: comments.find(({ key }) => key === 'projects_meters_count'),
        additionalInfo: {
          header: 'Account Numbers',
          list: project['meters'] 
            ? Object.entries(
              groupBy(project['meters'], 'account_number')
            ).map(([k, v]) => ({ value: `${k} - ${v.map(({ fuel_type }) => fuel_type).join(', ')}` }))
            : [],
        },
      },
      ...flatten(fuelMetrics),
      {
        title: <span>BUA (m<sup>2</sup>)</span>,
        value: project.project.bua ? formatNumber(project.project.bua) : 0,
        key: 'projects_bua',
        highlighted: comments.find(({ key }) => key === 'projects_bua'),
      },
      {
        title: <span>GFA (m<sup>2</sup>)</span>,
        value: project.project.gfa ? formatNumber(project.project.gfa) : 0,
        key: 'projects_gfa',
        highlighted: comments.find(({ key }) => key === 'projects_gfa'),
      },
      {
        title: <span>Common Space (m<sup>2</sup>)</span>,
        value: project.project.commonSpace ? formatNumber(project.project.commonSpace) : 0,
        key: 'projects_commonSpace',
        highlighted: comments.find(({ key }) => key === 'projects_commonSpace'),
      },
      {
        title: <span>Tenant Space (m<sup>2</sup>)</span>,
        value: project.project.tenantArea ? formatNumber(project.project.tenantArea) : 0,
        key: 'projects_tenatArea',
        highlighted: comments.find(({ key }) => key === 'projects_tenatArea'),
      },
      {
        title: 'Additional Notes',
        value: project.project.notes,
        key: 'projects_notes',
        highlighted: comments.find(({ key }) => key === 'projects_notes'),
      },
    ]
  }, [comments])

  useEffect(() => {
    (async () => {
      setLoading(true)
      const { data: { rows = [] } } = await agent.FieldComments.get(`?entityId=${project.project.id}`)
      setComments(rows)
      setLoading(false)
    })()
  }, [project, specificProjectInfo])
  return (
    <>
      <CircleLoader show={loading}/>

      <CommentInfoCard title='Project Information 2' info={salesInfo} id={project.project.id}/>
    </>
  )
}

export default ProjectSalesInfo
