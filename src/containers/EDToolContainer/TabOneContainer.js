import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Container, Row, Col, FormSelect, FormInput, Button } from 'shards-react'
import cn from 'classnames'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import sumBy from 'lodash/sumBy'
import uuid from 'uuid/v4'
import { DebounceInput } from 'react-debounce-input'
import moment from 'moment'

import { 
  getElectricityConsumptionFuelData,
  getChilledWaterConsumptionFuelData,
  getWaterConsumptionFuelData,
  getLpgGasConsumptionFuelData,
  loadElectricityConsumptionFuelByDateRange,
  loadChilledWaterConsumptionFuelByDateRange,
  loadWaterConsumptionFuelByDateRange,
  loadLpgGasConsumptionFuelByDateRange,
} from '../../../redux/reducers/projects'
import ListInfoCard from '../../shared/ListInfoCard'
import { getSystemColor } from '../../utils/theme'
import colors from '../../utils/colors'
import { formatNumber } from '../../utils/format'
import CircleLoader from '../../components/preloadrers/circle-loader'
import agent from '../../../agent'

import CChart from './stackedChart'
import BChart from './barChart'
import EndUseProfilesModal from './EndUseProfilesModal'


const SumFooter = ({ data, sumKey, defaultColor }) => {
  const sum = sumBy(data, sumKey)
  const invalid = isNaN(sum)
  const value = sumKey === 'proportion' ? invalid ? 100 : 100 - sum : invalid ? 0 : sum
  const color = !defaultColor ? value >= 1 ? 'green' : 'red' : defaultColor
  return (
    <div
      className='d-flex justify-content-end'
      style={{ color }}>{ formatNumber(value) } {sumKey === 'proportion' && '%'}
    </div>
  )
}

const endUsesByFuel = {
  // eslint-disable-next-line max-len
  'E':  ['FAHU', 'AHU', 'Fans', 'CHW Pumps', 'Chillers', 'ExteriorLighting', 'Interior Lighting', 'FCUs', 'Pool Cooling', 'Other'],
  'CHW': ['FAHU', 'AHU', ,'FCUs', 'Pool Cooling', 'Other'],
  'H20': ['Potable Water', 'Irrigation', 'Kitchen', 'Other'],
}


const EndUseSelect = ({ foo, endUse, anchor, onChange }) => {
  const awailableEndUses = useMemo(() => [...foo.bar(), endUse], [anchor])
  return (
    <FormSelect
      key={uuid()}
      onChange={(e) => onChange(e)}
      value={endUse}
    >
      <option disabled selected>Select...</option>
      {awailableEndUses.map(value => (
        <option key={value} value={value}>{value}</option>
      ))}
    </FormSelect>
  )
}

const getAvailableFuelTypes = (project) => {
  return Object.keys(project)
    .filter(k => k.startsWith('has'))
    .filter(k => project[k])
    .map(k => {
      switch (k) {
      case 'hasElectricityMeters': return 'E'
      case 'hasChilledWaterMeters': return 'CHW'
      case 'hasGasMeters': return 'LPG'
      case 'hasWaterMeters': return 'H20'
      }
    })
}

const TabOneContainer = ({
  project,
  baselineData,
  loadElectricityConsumptionFuel,
  electricityConsumptionFuel,
  chilledWaterConsumptionFuel,
  waterConsumptionFuel,
  lpgGasConsumptionFuel,
  loadChilledWaterConsumptionFuel,
  loadWaterConsumptionFuel,
  loadLpgGasConsumptionFuel,
}) => {
  const [chartLoading, setChartLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [endUseProfilesOpened, setEndUseProfilesOpened] = useState(false)
  const [endUsesData, setEndUsesData] = useState([])
  const [endUseProfiles, setEndUseProfiles] = useState([])

  useEffect(() => {
    (async() => {
      const { data } = await agent.EndUseProfiles.get('/')
      setEndUseProfiles(data)
    })()
  }, [project])

  const [fuel, setFuel] = useState('E')

  const fuelTypes = useMemo(() => getAvailableFuelTypes(project), [project])
  const baseline = useMemo(() => {
    const baseline = (() => {
      switch (fuel) {
      case 'E':  return baselineData && baselineData.baselineElectricity || {}
      case 'CHW':  return baselineData && baselineData.baselineChilledWater || {}
      case 'H20':  return baselineData && baselineData.baselineWater || {}
      case 'LPG':  return baselineData && baselineData.baselineGAS || {}
      }
    })() 
    return Object.entries(baseline)
      .map(([title, value]) => ({ title, value: formatNumber(value), originalValue: value }))
  }, [fuel, baselineData])
  
  
  const chartData = useMemo(() => {
    switch (fuel) {
    case 'E':  return electricityConsumptionFuel
    case 'CHW':  return chilledWaterConsumptionFuel
    case 'H20':  return waterConsumptionFuel
    case 'LPG':  return lpgGasConsumptionFuel
    }
  }, [
    electricityConsumptionFuel,
    chilledWaterConsumptionFuel,
    waterConsumptionFuel,
    lpgGasConsumptionFuel,
  ])

  useEffect(() => {
    setEndUsesData(endUsesData.map(({ proportion, ...rest  }) => {
      const sumBaseline = sumBy(baseline, 'originalValue')
      
      const calculatedConsumption = sumBaseline * (proportion || 0) / 100
      const displayedConsumption = formatNumber(calculatedConsumption)

      return {
        ...rest,
        proportion: proportion || 0,
        calculatedConsumption,
        displayedConsumption,
      }
    }))
  }, [ baseline ])

  const fuelName = useMemo(() => {
    switch (fuel) {
    case 'E':  return 'Electricity'
    case 'CHW':  return 'Chilled Water'
    case 'H20':  return 'Water'
    case 'LPG':  return 'LPG (Gas)'
    }
  }, [fuel])

  useEffect(() => {
    const fetchMethod = (() => {
      switch (fuel) {
      case 'E':  return loadElectricityConsumptionFuel
      case 'CHW':  return loadChilledWaterConsumptionFuel
      case 'H20':  return loadWaterConsumptionFuel
      case 'LPG':  return loadLpgGasConsumptionFuel
      }
    })()
    setChartLoading(true)
    fetchMethod({
      startDate: baselineData.monthRange.start,
      endDate: baselineData.monthRange.end,
    }, project.id).then(() => {
      setChartLoading(false)
    })
    setTableLoading(true)
    agent.BaselineProfiles.get(`/${project.id}?fuelType=${fuel}`).then(({ data }) => {
      setEndUsesData(data.map(({ proportion, ...rest }) => ({
        ...rest,
        proportion,
        calculatedConsumption: sumBy(baseline, 'originalValue') * proportion / 100,
        displayedConsumption: formatNumber(sumBy(baseline, 'originalValue') * proportion / 100),
      })))
      setTableLoading(false)
    })
  }, [baseline, project])

  const saveBaselineProfile = useCallback(async (arr, index) => {
    if(arr[index].endUse && (sumBy(arr, 'proportion') <= 100)) {
      await agent.BaselineProfiles.post(`/${project.id}`, { 
        ...arr[index],
        fuelType: fuel,
        projectId: project.id,
      })
    }
    setEndUsesData(arr)
  }, [fuel, project])


  const changePropotion = useCallback(async (e, index) => {
    const temp = [...endUsesData.map(({ ...rest }) => ({ ...rest }))]
    const row = temp[index]
    e.stopPropagation()
    e.persist()
    row.proportion = +e.target.value
    const sumBaseline = sumBy(baseline, 'originalValue')
    row.calculatedConsumption = (sumBaseline * e.target.value / 100)
    row.displayedConsumption = formatNumber(row.calculatedConsumption)
    saveBaselineProfile(temp, index)
  }, [endUsesData, baseline, saveBaselineProfile])

  

  const changeEndUseProfile = useCallback((value, index) => {
    const temp = [...endUsesData.map(({ ...rest }) => ({ ...rest }))]
    const row = temp[index]
    const endUse = endUseProfiles.find(({ id }) => id === +value)
    row.endUseProfileId = endUse.id
    saveBaselineProfile(temp, index)
  }, [endUsesData, endUseProfiles, saveBaselineProfile])

  const changeEndUse = useCallback((value, index) => {
    const temp = [...endUsesData.map(({ ...rest }) => ({ ...rest }))]
    const row = temp[index]
    row.endUse = value
    saveBaselineProfile(temp, index)
  }, [endUsesData, saveBaselineProfile])

  const foo = {
    bar: useCallback(() => {
      return endUsesByFuel[fuel].filter(eu => !endUsesData.some(({ endUse }) => endUse == eu))
    }, [endUsesData, fuel]),
  }

  const headerStyle = useMemo(() => ({
    backgroundColor: getSystemColor(fuelName).toRGBA(1),
    color: '#fff',
  }))

  const tableColumns = useMemo(() => {
    return [
      {
        Header: () => <div>System</div>,
        accessor: 'endUse',
        minWidth: 100,
        headerStyle,
        Cell: row => (
          <EndUseSelect
            key={`endUse_${uuid()}`}
            foo={foo}
            endUse={row.original.endUse}
            anchor={`endUse_${uuid()}`}
            onChange={(e) => changeEndUse(e.target.value, row.index)}/>
        ),
      },
      {
        Header: () => <div>Proportion %</div>,
        accessor: 'proportion',
        minWidth: 100,
        headerStyle,
        Cell: row => (
          <DebounceInput
            onClick={(e) => e.stopPropagation()}
            debounceTimeout={1000}
            type='number'
            value={row.original.proportion}
            element={FormInput}
            onChange={(e) => changePropotion(e, row.index)}/>
        ),
        Footer: <SumFooter data={endUsesData} sumKey='proportion'/>,
      },
      {
        Header: () => (
          <>
            <div>
              <span>End Use Profile</span>
              <i onClick={() => setEndUseProfilesOpened(true)} className="material-icons ml-1" style={{ cursor: 'pointer' }}>info</i></div>
          </>
        ),
        accessor: 'endUseProfileId',
        minWidth: 100,
        headerStyle,
        Cell: row => (
          <FormSelect
            value={row.original.endUseProfileId}
            onChange={(e) => changeEndUseProfile(e.target.value, row.index)}
          >
            <option disabled selected>Select...</option>
            {endUseProfiles.map(({ name, id }) => (
              <option selected={id == row.original.endUseProfileId} key={name} value={id}>{name}</option>
            ))}
          </FormSelect>
        ),
      },
      {
        Header: () => <div>Annual Consumptions</div>,
        accessor: 'displayedConsumption',
        minWidth: 100,
        headerStyle,
        Cell: row => (
          <b>{row.original.displayedConsumption} </b>
        ),
        Footer: <SumFooter data={endUsesData} sumKey='calculatedConsumption' defaultColor={getSystemColor(fuelName).toRGBA(1)}/>,
      },
    ]   
  }, [baseline, endUseProfiles, fuel, changeEndUse, changeEndUseProfile, endUsesData])

  const addItem = () => {
    if(endUsesData.length === endUsesByFuel[fuel].length) {
      return
    }
 
    setEndUsesData([...endUsesData.map(({ ...rest }) => ({ ...rest })), {}])
  }

  const { NormalizedConsumptionTableHeaders = [], NormalizedConsumptionTableData = [] } = useMemo(() => {
    return {
      NormalizedConsumptionTableHeaders: [{
        Header: () => <div>Month</div>,
        minWidth: 100,
        headerStyle,
        Cell: row => (
          <b>{row.original.title} </b>
        ),
      },
      ...endUsesData
        .filter(({ endUse, calculatedConsumption, endUseProfileId }) => endUse && calculatedConsumption && endUseProfileId)
        .map(({ endUse }) => {
          return {
            Header: () => <div>{endUse}</div>,
            minWidth: 100,
            headerStyle,
            Cell: row => (
              <b>{formatNumber(row.original[endUse])} </b>
            ),
          }
        })],
      NormalizedConsumptionTableData: baseline.map(({ title }) => {
        return {
          title,
          ...endUsesData.reduce((
            (acc, { endUse, calculatedConsumption, endUseProfileId }) => {
              return ({ 
                ...acc,
                // eslint-disable-next-line max-len
                [endUse]: calculatedConsumption * ((endUseProfiles.find(({ id }) => id === endUseProfileId) || {})[title.toLowerCase()] / 100), 
              })
            }), {}),
        }
      }),
    }
  }, [endUsesData, baseline, endUseProfiles])

  

  return (
    <>
      <Container>
        <Row className='f-flex justify-content-end'>
          <Col md='9'>
            <Row>
              <div className="equations-modal__header d-flex justify-content-around w-100">
                {fuelTypes.map((page) =>
                  (
                    <div
                      key={page.step}
                      onClick={() => setFuel(page)}
                  
                      className={cn(
                        'equations-modal__header--step',
                        { 'equations-modal__header--step--active': page === fuel }
                      )}>
                      <span className="equations-modal__header--step__circle" style={page === fuel ? {
                        backgroundColor: getSystemColor(fuelName).toRGBA(1),
                      } : {}}>
                        <i className="equations-modal__header--step__circle--icon material-icons" >
                      info
                        </i>
                      </span>
                      <span className="equations-modal__header--step__name">{page}</span>
                    </div>
                  )
                )}
              </div>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md='3'>
            <Row className='mt-4'>
              <ListInfoCard
                link={`/projects/edit?id=${project.id}&tab=baseline`}
                className='w-100'
                title={`${fuelName} (${moment(baselineData.monthRange.start).format('MMM YY')} - ${moment(baselineData.monthRange.end).format('MMM YY')})`}
                info={baseline} />
            </Row>
          </Col>
          <Col md='9'>
            <Row>
              <BChart data={chartData} title='' fuel={fuelName}> </BChart>
              <CircleLoader show={chartLoading}></CircleLoader>
            </Row>
            <Row className="d-flex w-100">
              <div className="d-flex justify-content-end w-100">
                <Button onClick={addItem} style={{
                  backgroundColor: getSystemColor(fuelName).toRGBA(1),
                  borderColor: getSystemColor(fuelName).toRGBA(1),
                }}>Add Item</Button>
              </div>
              <Container className='mt-3'>
                <ReactTable
                  showPageSizeOptions={false}
                  showPageJump={false}
                  columns={tableColumns}
                  sortable={false}
                  showPagination={false}
                  manual
                  className='w-100'
                  loading={tableLoading}
                  pageSize={1}
                  data={endUsesData}
                />
              </Container>
            </Row>
          </Col>
        </Row>
        {endUsesData
          .filter(({ endUse, calculatedConsumption, endUseProfileId }) => endUse && calculatedConsumption && endUseProfileId).length
       && <Row>
         <Col md='3'></Col>
         <Col md='9'>
           <Row className='mt-4'>
             <CChart stackedBars={NormalizedConsumptionTableData} fuel={fuelName} scatters={baseline} title={`Normalized ${fuelName} Consumptions`}></CChart>
           </Row>
           <Row className='mt-4'>
             <h5>Normalized { fuelName } Consumptions</h5>
             <Container>
               <ReactTable
                 showPageSizeOptions={false}
                 showPageJump={false}
                 columns={NormalizedConsumptionTableHeaders}
                 sortable={false}
                 showPagination={false}
                 manual
                 className='w-100'
                 loading={tableLoading}
                 pageSize={1}
                 data={NormalizedConsumptionTableData}
               />
             </Container>
           </Row>
         </Col>
       </Row>}
      </Container>
      <EndUseProfilesModal isOpen={endUseProfilesOpened} data={endUseProfiles} handleClose={setEndUseProfilesOpened}></EndUseProfilesModal>
    </>
  )
}

export default connect(
  (state) => ({
    electricityConsumptionFuel: getElectricityConsumptionFuelData(state),
    chilledWaterConsumptionFuel: getChilledWaterConsumptionFuelData(state),
    waterConsumptionFuel: getWaterConsumptionFuelData(state),
    lpgGasConsumptionFuel: getLpgGasConsumptionFuelData(state),
  }),
  (dispatch) => ({
    loadElectricityConsumptionFuel: (range, projectId) => dispatch(loadElectricityConsumptionFuelByDateRange(range, projectId)),
    loadChilledWaterConsumptionFuel: (range, projectId) => dispatch(loadChilledWaterConsumptionFuelByDateRange(range, projectId)),
    loadWaterConsumptionFuel: (range, projectId) => dispatch(loadWaterConsumptionFuelByDateRange(range, projectId)),
    loadLpgGasConsumptionFuel: (range, projectId) => dispatch(loadLpgGasConsumptionFuelByDateRange(range, projectId)),
  })
)(TabOneContainer)