import React, { useState, useCallback, useMemo } from 'react'
import { Row, Col, Button, Container, FormInput, FormSelect } from 'shards-react'
import ReactTable from 'react-table'
import sumBy from 'lodash/sumBy'
import { DebounceInput } from 'react-debounce-input'
import uuid from 'uuid/v4'

import CostBarChart from './costBarChart'
import MetricCard from '../../components/metrics/MetricInfoCard'

const headerStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
}

const designCostsDefaults = [{
  task: 'Energy Audit',
  cost: 0
}, {
  task: 'Energy Model',
  cost: 0
}, {
  task: 'Building Information Model',
  cost: 0
}, {
  task: 'Design & Specification',
  cost: 0
}, {
  task: 'Commissioning',
  cost: 0
}, {
  task: 'Project Management',
  cost: 0
}, {
  task: 'Other',
  cost: 0
}]

const constructionsCostsDefaults = [
  'Chiller Plant Optimization',
  'Chiller Wet Walls',
  'Energy Control Management System',
  'Evaporative Cooling for AHUs',
  'FAHU Demand Controlled Ventillation',
  'FAHU Supply Fan Static Pressure Reset',
  'Pool Hot Water Heat Pump ',
  'AHU Demand Controlled Ventillation',
  'AHU Supply Fan Static Pressure Reset',
  'Chiller Swap',
  'Corridor Lighting Retrofit',
  'ECM Motors for FCUs',
  'FCU Thermostat Setback',
  'High Efficiency Motor Swap',
  'Hot Water Heat Pump Retrofit',
  'Kitchen Demand Controlled Ventillation',
  'Lighting Control',
  'Parking Lighting Retrofit',
  'AHU Discharge Air Temperature Reset',
  'AHU Supply Air Temperature Reset',
  'Chilled Water Pressure Reset',
  'Chilled Water Pump Optimization',
  'Direct Drive Motors for AHU Fans',
  'Domestic Cold Water Cooling/ Heat Pump',
  'Domestic Cold Water Temperature Reset',
  'Domestic Water Pressure Regulation',
  'Emergency Light LED Retrofit',
  'Envelope Sealing',
  'Exhaust Air Energy Recovery',
  'FAHU Discharge Air Temperature Reset',
  'FAHU Supply Air Temperature Reset',
  'Freezer Temperature Setback',
  'High Efficiency Plug Fan Retrofit',
  'High Efficiency Pumps',
  'Hot Water Heater Scheduling',
  'Hot Water Heating Capacity Scheduling',
  'Lighting Delamping',
  'Low Flow Fixtures',
  'Motion Sensor Lighting',
  'Natural Gas Hot Water Boilers',
  'Optimal Start/Stop',
  'Pool Cover',
  'Pool Temperature Management',
  'Pressure Regulation',
  'Smart Thermostat',
  'Solar Hot Water',
  'Variable Speed AHUs',
  'VAV Retrofit',
  'Window Film',
  'AHU Reheat Management',
  'Airside Economizer',
  'Chilled Water Plant HEX Staging',
  'Chilled Water Return Bypass Line',
  'Condensate Driven Coil Pre-Cooling',
  'Condensate Recovery ',
  'Cooling Management',
  'Daylight Sensing Lighting',
  'Greywater System',
  'Laundry Heat Recovery',
  'Lift Optimization',
  'Pump Impeller Trimming',
  'Refrigerator Setpoints',
  'Reverse Osmosis Treatment',
  'Roof Coating',
  'Room EMS Occupancy Setback',
  'Room FCU Fan Settings',
  'Solar Panels',
  ]
//   .map(name => ({
//   name,
//   quantity: 0,
//   pieceCost: 0,
//   materialCost: 0,
//   installCost: 0,
//   totalCost: 0,
// }))

const EEMSelect = ({ foo, item, anchor, onChange }) => {
  const availableList = useMemo(() => [...foo.bar(), item], [anchor])
  return (
    <FormSelect
      key={uuid()}
      onChange={(e) => onChange(e)}
      value={item}
    >
      <option disabled selected>Select...</option>
      {availableList.map(value => (
        <option key={value} value={value}>{value}</option>
      ))}
    </FormSelect>
  )
}

const annualOperationDefaults = [
  'Energy Managment',
  'Measurements & Verification',
  'Financial Management',
  'Customer Retraining',
  'Subscriptions',
  'FM Management Reporting',
  'Maintenance',
  'BMS AMC',
  'Mechanical AMC',
  'Chiller AMC',
  'Billing Services',
  'Other',
].map((name) => ({
  name,
  monthlyCost: 0
}))

const EEMCosts = ({ id }) => {
  const [designCosts, setDesignCosts] = useState(designCostsDefaults)
  const [constructionsCosts, setConstructionsCosts] = useState([])
  const [annualOperation, setAnnualOperationCosts] = useState(annualOperationDefaults)

  // const [focusedInput, setFocusedInput] = useState(null)

  const handleDesignCostChange  = useCallback((value, index) => {
    const temp = [...designCosts]
    const row = temp[index]
    row.cost = +value
    setDesignCosts(temp)
  }, [designCosts])

  const handleConstructionsCostChange = useCallback((key, value, index) => {
    const temp = [...constructionsCosts]
    const row = temp[index]
    row[key] = key === 'name' ? value : +value
    setConstructionsCosts(temp)
  }, [constructionsCosts])

  const foo = {
    bar: useCallback(() => {
      return constructionsCostsDefaults.filter(cc => !constructionsCosts.some(({ name }) => name == cc))
    }, [constructionsCosts]),
  }

  const handleOperationsCostChange = useCallback((key, value, index) => {
    const temp = [...annualOperation]
    const row = temp[index]
    row[key] = +value
    setAnnualOperationCosts(temp)
  }, [annualOperation])

  const designCostsHeaders = useMemo(() => [
    {
        Header: () => <div>Task</div>,
        accessor: 'endUse',
        minWidth: 100,
        headerStyle,
        Cell: row => (
          <span>{row.original.task}</span>
        ),
        Footer: () => <div className='d-flex justify-content-end'>Total</div>
      },
      {
        Header: () => <div>Total Cost</div>,
        accessor: 'cost',
        minWidth: 100,
        headerStyle,
        Cell: row => (
          <DebounceInput
          onClick={(e) => e.stopPropagation()}
          debounceTimeout={1000}
          type='number'
          value={row.original.cost}
          element={FormInput}
          onChange={(e) => handleDesignCostChange(e.target.value, row.index)}/>
          // <FormInput
          //   type='number'
          //   value={row.original.cost}
          //   autoFocus={row.index === focusedInput}
          //   onFocus={() => setFocusedInput(row.index)}
          //   onChange={(e) => handleDesignCostChange(e.target.value, row.index)}
          // />
        ),
        Footer: () => <div className='d-flex justify-content-end'>{sumBy(designCosts, 'cost')}</div>
      }
  ], [handleDesignCostChange])

  const addItem = useCallback(() => {
    if(constructionsCosts.length === constructionsCostsDefaults.length) {
      return
    }
 
    setConstructionsCosts([...constructionsCosts, {}])
  }, [constructionsCosts])

  const constructionsCostsHeaders = useMemo(() => [
    {
        Header: () => <div>Item</div>,
        accessor: 'name',
        minWidth: 200,
        headerStyle,
        Cell: row => (
          <EEMSelect
            key={`construction_${uuid()}`}
            foo={foo}
            item={row.original.name}
            anchor={`construction_${uuid()}`}
            onChange={(e) => handleConstructionsCostChange('name', e.target.value, row.index)}/>

          // <span>{row.original.name}</span>
        ),
        Footer: () => <div className='d-flex justify-content-end'>Total</div>
      },
      {
        Header: () => <div>Quantity</div>,
        accessor: 'quantity',
        minWidth: 100,
        headerStyle,
        Cell: row => (
          <DebounceInput
            onClick={(e) => e.stopPropagation()}
            debounceTimeout={1000}
            type='number'
            value={row.original.quantity}
            element={FormInput}
            onChange={(e) => handleConstructionsCostChange('quantity', e.target.value, row.index)}/>
        ),
        Footer: () => <div className='d-flex justify-content-end'>{sumBy(constructionsCosts, 'quantity')}</div>
      },
      {
        Header: () => <div>Piece Cost</div>,
        accessor: 'pieceCost',
        minWidth: 100,
        headerStyle,
        Cell: row => (
          <DebounceInput
            onClick={(e) => e.stopPropagation()}
            debounceTimeout={1000}
            type='number'
            value={row.original.pieceCost}
            element={FormInput}
            onChange={(e) => handleConstructionsCostChange('pieceCost', e.target.value, row.index)}/>
        ),
        Footer: () => <div className='d-flex justify-content-end'>{sumBy(constructionsCosts, 'pieceCost')}</div>
      },
      {
        Header: () => <div>Material Cost</div>,
        accessor: 'materialCost',
        minWidth: 100,
        headerStyle,
        Cell: row => (
          <div>{(constructionsCosts[row.index].quantity || 0) * (constructionsCosts[row.index].pieceCost || 0)}</div>
        ),
        Footer: () => <div className='d-flex justify-content-end'>
          {constructionsCosts.reduce((acc, { quantity, pieceCost }) => acc + ((quantity || 0) * (pieceCost || 0)), 0)}
        </div>
      },
      {
        Header: () => <div>Install Cost</div>,
        accessor: 'installCost',
        minWidth: 100,
        headerStyle,
        Cell: row => (
          <DebounceInput
            onClick={(e) => e.stopPropagation()}
            debounceTimeout={1000}
            type='number'
            value={row.original.installCost}
            element={FormInput}
            onChange={(e) => handleConstructionsCostChange('installCost', e.target.value, row.index)}/>
        ),
        Footer: () => <div className='d-flex justify-content-end'>{sumBy(constructionsCosts, 'installCost')}</div>
      },
      {
        Header: () => <div>Total Cost</div>,
        accessor: 'totalCost',
        minWidth: 100,
        headerStyle,
        Cell: row => (
          <div>{((constructionsCosts[row.index].quantity || 0) * (constructionsCosts[row.index].pieceCost || 0)) + (constructionsCosts[row.index].installCost || 0)}</div>
        ),
        Footer: () => <div className='d-flex justify-content-end'>
          {constructionsCosts.reduce((acc, { quantity, pieceCost, installCost }) => acc + ((quantity || 0) * (pieceCost || 0)) + (installCost || 0), 0)}
        </div>
      },
  ], [handleConstructionsCostChange])

  const alluanOperationsHeaders = useMemo(() => [
    {
        Header: () => <div>Name</div>,
        accessor: 'endUse',
        minWidth: 180,
        headerStyle,
        Cell: row => (
          <span>{row.original.name}</span>
        ),
        Footer: () => <div className='d-flex justify-content-end'>Total</div>
      },
      {
        Header: () => <div>Monthly Cost</div>,
        accessor: 'cost',
        minWidth: 100,
        headerStyle,
        Cell: row => (
          <DebounceInput
          onClick={(e) => e.stopPropagation()}
          debounceTimeout={1000}
          type='number'
          value={row.original.monthlyCost}
          element={FormInput}
          onChange={(e) => handleOperationsCostChange('monthlyCost', e.target.value, row.index)}/>
        ),
        Footer: () => <div className='d-flex justify-content-end'>{sumBy(annualOperation, 'monthlyCost')}</div>
      },
      {
        Header: () => <div>Annual Cost</div>,
        accessor: 'endUse',
        minWidth: 180,
        headerStyle,
        Cell: row => (
          <span>{(annualOperation[row.index].monthlyCost || 0) * 12}</span>
        ),
        Footer: () => <div className='d-flex justify-content-end'>{(sumBy(annualOperation, 'monthlyCost') * 12)}</div>
      },
  ], [handleOperationsCostChange])

  const metrics = useMemo(
    () => [{
      title: 'Total Cost',
      value: sumBy(designCosts, 'cost') + (sumBy(annualOperation, 'monthlyCost') * 12)
      + constructionsCosts.reduce((acc, { quantity, pieceCost, installCost }) => acc + ((quantity || 0) * (pieceCost || 0)) + (installCost || 0), 0),
      metric: 'AED'
    }, {
      title: 'Design',
      value: sumBy(designCosts, 'cost'),
      metric: 'AED',
    }, {
      title: 'Construction',
      value: constructionsCosts.reduce((acc, { quantity, pieceCost, installCost }) => acc + ((quantity || 0) * (pieceCost || 0)) + (installCost || 0), 0),
      metric: 'AED',
    }, {
      title: 'Operations',
      value: (sumBy(annualOperation, 'monthlyCost') * 12),
      metric: 'AED',
    }],
    [designCosts, constructionsCosts, annualOperation]
  )

  return (
    <>
    <Row>
      {metrics.map((metric) => <MetricCard {...metric}/>)}
    </Row>
    <Container className='mt-4'>
      <Container className="badge-primary w-100">DESIGN COST</Container>
        <Row>
          <Col md='5'>
            <Container className='mt-4'>
              <ReactTable
                showPageSizeOptions={false}
                showPageJump={false}
                columns={designCostsHeaders}
                sortable={false}
                showPagination={false}
                manual
                className='w-100'
                loading={false}
                pageSize={1}
                data={designCosts}
              />
            </Container>
          </Col>
          <Col md='7'>
            <CostBarChart
              title=''
              data={designCosts.reduce((acc, { task, cost }) => (
                acc.labels.push(task),
                acc.datasets.push(cost),
                acc
              ), { labels: [], datasets: [] })} />
          </Col>
        </Row>
      </Container>
    <Container className='mt-4'>
      <Container className="badge-primary w-100">CONSTRUCTION COST</Container>
        <Row>
          <Container className='mt-4'>
            <div className="d-flex justify-content-end w-100">
              <Button onClick={addItem}>Add Item</Button>
            </div>
            <ReactTable
              showPageSizeOptions={false}
              showPageJump={false}
              columns={constructionsCostsHeaders}
              sortable={false}
              showPagination={false}
              manual
              className='w-100 mt-1'
              loading={false}
              pageSize={1}
              data={constructionsCosts}
            />
          </Container>
        </Row>
      <Row>
        {constructionsCosts.length && <CostBarChart
          column={true}
          title=''
          data={constructionsCosts.reduce((acc, { name, quantity, pieceCost, installCost }) => (
            acc.labels.push(name),
            acc.datasets.push(((quantity || 0) * (pieceCost || 0)) + (installCost || 0)),
            acc
          ), { labels: [], datasets: [] })} />}
      </Row>
    </Container>
    <Container className='mt-4'>
      <Container className="badge-primary w-100">ANNUAL OPERATION COST</Container>
      <Row>
        <Col md='6'>
          <Container className='mt-4'>
            <ReactTable
              showPageSizeOptions={false}
              showPageJump={false}
              columns={alluanOperationsHeaders}
              sortable={false}
              showPagination={false}
              manual
              className='w-100'
              loading={false}
              pageSize={1}
              data={annualOperation}
            />
          </Container>
        </Col>
        <Col md='6'>
        <CostBarChart
          title=''
          data={annualOperation.reduce((acc, { name, monthlyCost }) => (
            acc.labels.push(name),
            acc.datasets.push(monthlyCost),
            acc
          ), { labels: [], datasets: [] })} />
        </Col>
      </Row>
    </Container>
    </>
  )
}

export default EEMCosts