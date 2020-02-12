import React, { useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Button,
} from 'shards-react'

import { PureStickLoader } from '../../src/components/preloadrers/sticks-loader'
import ListInfoCard from '../../src/shared/ListInfoCard'
import { formatNumber } from '../../src/utils/format'
import agent from '../../agent'

// const ge

const excludeTitles = [
  'Value',
  'Weighted value',
  'Probability',
  'Pipeline',
  'Stage',
  'Deal created',
  'Date of Proposal Sent',
  'Last email received',
  'Upadate time',
  'Won time',
  'Lost time',
  'Lost Reason',
  'Last stage change',
  'Next activity date',
  'Last activity date',
  'Last email sent',
  'Deal closed on',
  'Visible to',
  'Total activies',
  'Done activies',
  'Activities to do',
  'Email messages count',
  'Expected close date',
  'Source Lead',
  'Specific Lead Source',
  'Country',
  'State/Emirate',
  'Community',
]

const getInfo = (info, fields) => {

  const values = Object.entries(info).map(([k, v]) => {
    const encoded = fields.find(({ key }) => key == k)
    if(encoded) {
      if(excludeTitles.includes(encoded.name)) return
      const data = {
        title: encoded.name,
      }
      if(encoded.field_type === 'set') {
        console.log((encoded.options.find(({ id }) => id == v) || {}).label)
        return Object.assign(data, {
          value: (encoded.options.find(({ id }) => id == v) || {}).label,
        })
      } else if(['people', 'user', 'org'].includes(encoded.field_type)) {
        return Object.assign(data, {
          value: (v && v.name) || v,
        })
      } else {
        return Object.assign(data, {
          value: v,
        })
      }
    }
    
  }).filter((k) => k)

  console.log(values)
  return values
  return [
    // {
    //   title: 'Title',
    //   value: info.title,
    // },
    // {
    //   title: 'Contract type',
    //   value: formatNumber(info['daf6db46aea1559f29ce8510f42ad15bf6bc0051']),
    // },
    // {
    //   title: 'Annual Electrical (AED)',
    //   value: formatNumber(info.annualElectricalAED),
    // },
    // {
    //   title: 'Annual Chilled Water (AED)',
    //   value: formatNumber(info.annualChilledWaterAED),
    // },
    // {
    //   title: 'Annual LPG (L) Consumption',
    //   value: formatNumber(info.annualLPGSngkWh),
    // },
    // {
    //   title: 'Annual LPG (AED) Consumption',
    //   value: formatNumber(info.annualLPGSngAED),
    // },
    // {
    //   title: 'Annual Total Cost (AED)',
    //   value: formatNumber(info.annualEnergyCost),
    // },
    // {
    //   title: <span>EUI (kWh / m<sup>2</sup>)</span>,
    //   value: formatNumber(info.averageEUI),
    // },
    // {
    //   title: <span>Total Area (m<sup>2</sup>)</span>,
    //   value: formatNumber(info.totalArea),
    // },
  ]
}

const PipedriveContainer = ({ projects = [], loadInfo }) => {
  // const [showLoader, setShowLoader] = useState(false)
  // const [loadindPid, setLoadindPid] = useState(null)
  // const loadProject = useCallback(async (id, date) => {
  //   setShowLoader(true)
  //   setLoadindPid(id)
  //   await loadInfo(id, date)
  //   setShowLoader(false)
  //   setLoadindPid(null)
  // }, [])
  const [loader, showLoader] = useState(false)
  const [paginator, setPaginator] = useState({ 
    start: 0,
    limit: 50,
    more_items_in_collection: true,
    next_start: 50,
  })
  const [list, setList] = useState([])
  const [additionalPaginator, setAdditionalPaginator] = useState([])
  const [fields, setFields] = useState([])
  const handleChangePage = useCallback(async (value) => {
    console.log(paginator)
    if(value > 0) {
      setPaginator({
        ...additionalPaginator,
        start: additionalPaginator.next_start,
      })
    } else {
      setPaginator({
        ...additionalPaginator,
        start: additionalPaginator.start - additionalPaginator.limit,
      })
    }
  }, [additionalPaginator])
  useEffect(() => {
    const fetchData = async () => {
      showLoader(true)
      // eslint-disable-next-line camelcase
      const { data, additional_data }  = await agent.pipdrive.list(paginator)
      setAdditionalPaginator(additional_data.pagination)
      const { data: listFields }  = await agent.pipdrive.fields()
      console.log(data, listFields)
      setList(data)
      setFields(listFields)
      getInfo(data[0], listFields)
      showLoader(false)
    }
    fetchData()
  }, [paginator])
  return (
    <Container>
      <Row>
        <Button onClick={() => handleChangePage(-1)} disabled={additionalPaginator.start == 0}>Back</Button>
        <Button onClick={() => handleChangePage(1)} disabled={!additionalPaginator.more_items_in_collection}>Next</Button>
      </Row>
      <Row className='m-1'>
        {list.map(p => (
          <div key={p.id} className='m-2' style={{ minWidth: '300px', maxWidth: '300px', position: 'relative' }}>
            {/* <code>{JSON.stringify(p)}</code> */}
            <ListInfoCard title={p.name} info={getInfo(p, fields)}>
            </ListInfoCard>
          </div>
        ))}
      </Row>
      <Row>
        <Button onClick={() => handleChangePage(-1)} disabled={additionalPaginator.start == 0}>Back</Button>
        <Button onClick={() => handleChangePage(1)} disabled={!additionalPaginator.more_items_in_collection}>Next</Button>
      </Row>
      <PureStickLoader showStickLoader={loader} />
    </Container>
  )
}

export default connect(
  ({ projects }) => ({
    projects: projects.projectsInfo,
  }),
  (dispatch) => ({
    loadInfo: (id, startDate) => dispatch(loadProjectInfo(id, startDate)),
  })
)(PipedriveContainer)
