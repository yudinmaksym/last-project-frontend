import React, { useMemo, useEffect, useState } from 'react'

import agent from '../../../../agent'
import CommentInfoCard from '../../../shared/CommentInfoCard'
import CircleLoader from '../../../components/preloadrers/circle-loader'


const SalesInfo = ({ project } = {}) => {
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState([])
  const salesInfo = useMemo(() => {
    return [
      {
        title: 'Version',
        value: project.version,
        key: 'projects_version',
        highlighted: comments.find(({ key }) => key === 'projects_version'),
      },
      {
        title: 'Date',
        value: project.date,
        key: 'projects_date',
        highlighted: comments.find(({ key }) => key === 'projects_date'),
      },
      {
        title: 'Contract Type',
        value: project.contractType,
        key: 'projects_contractType',
        highlighted: comments.find(({ key }) => key === 'projects_contractType'),
      },
      {
        title: 'Sales Lead Name',
        value: project.salesLeadName,
        key: 'projects_salesLeadName',
        highlighted: comments.find(({ key }) => key === 'projects_salesLeadName'),
      },
      {
        title: 'Sales Lead Scope',
        value: project.salesLeadScope,
        key: 'projects_salesLeadScope',
        highlighted: comments.find(({ key }) => key === 'projects_salesLeadScope'),
      },
      {
        title: 'External DB Support',
        value: project.externalBDSupport,
        key: 'projects_externalBDSupport',
        highlighted: comments.find(({ key }) => key === 'projects_externalBDSupport'),
      },
      {
        title: 'Sale Support Name',
        value: project.salesSupportName,
        key: 'projects_salesSupportName',
        highlighted: comments.find(({ key }) => key === 'projects_salesSupportName'),
      },
      {
        title: 'Support Type',
        value: project.supportType,
        key: 'projects_supportType',
        highlighted: comments.find(({ key }) => key === 'projects_supportType'),
      },
    ]
  }, [comments])

  useEffect(() => {
    (async () => {
      setLoading(true)
      const { data: { rows } } = await agent.FieldComments.get(`?entityId=${project.id}`)
      console.log(rows)
      setComments(rows)
      setLoading(false)
    })()
  }, [project])

  return (
    <>
      <CircleLoader show={loading}/>
      <CommentInfoCard title='Sales Information' info={salesInfo} id={project.id}/>
    </>
  )
}

export default SalesInfo
