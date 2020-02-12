import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Slider, 
  FormSelect,
  FormInput,
} from 'shards-react'
import minBy from 'lodash/minBy'
import maxBy from 'lodash/maxBy'
import uniq from 'lodash/uniq'
import compact from 'lodash/compact'
import get from 'lodash/get'
import sumBy from 'lodash/sumBy'
import ReactSelect from 'react-select'

import YearMonthSelect from '../components/common/YearMonthSelect'
import ListInfoCard from '../shared/ListInfoCard'
import { formatNumber } from '../../src/utils/format'
import CircleLoader from '../components/preloadrers/circle-loader'
import { loadProjectInfo, loadInfoSet } from '../../redux/reducers/projects'
import InfoLabel from '../components/common/InfoLabel'


function filterProjectsByRange(key, [min, max]) {
  return (project) => {
    return +project[key] >= +min && +project[key] <= +max
  }
}

function filterProjectsByName(search) {
  return (project) => {
    return project.name.toLowerCase().search(search.toLowerCase()) !== -1
  }
}

function filterByKey(key, values = []) {
  return (project) => {
    return !values.length || values.includes(get(project, key))
  }
}

const filterProjects = ({ projects, range, search, occupancyType, takaRange, zoneName, offerType, coolingType }) => {
  return projects
    .filter(filterProjectsByRange('annualEnergyCost',range))
    .filter(filterProjectsByName(search))
    .filter(filterByKey('occupancyType', occupancyType))
    .filter(filterByKey('productOfferingDetails', offerType))
    .filter(filterByKey('zone.name', zoneName))
    .filter(filterByKey('coolingType', coolingType))
    .filter(filterProjectsByRange('score', takaRange))
}

const getInfo = (info) => {
  return [
    {
      title: 'Annual Energy Consumption (kWh)',
      value: formatNumber(info.annualEnergykWh),
    },
    {
      title: 'Annual Energy Cost (AED)',
      value: formatNumber(info.annualEnergyCost),
    },
    {
      title: 'Annual Electrical (kWh)',
      value: formatNumber(info.annualElectricalkWh),
    },
    {
      title: 'Annual Electrical (AED)',
      value: formatNumber(info.annualElectricalAED),
    },
    {
      title: 'Annual Chilled Water (AED)',
      value: formatNumber(info.annualChilledWaterAED),
    },
    {
      title: 'Annual LPG (L) Consumption',
      value: formatNumber(info.annualLPGSngkWh),
    },
    {
      title: 'Annual LPG (AED) Consumption',
      value: formatNumber(info.annualLPGSngAED),
    },
    {
      title: <span>EUI (kWh / m<sup>2</sup>)</span>,
      value: formatNumber(info.averageEUI),
    },
    { 
      title: (
        <InfoLabel 
          label={'Total Area'}
          unit={<>m<sup>2</sup></>}
        />
      ),
      value: formatNumber(info.totalArea),
    },
    {
      title: 'Estimated Project Value',
      value: formatNumber(info.estimatedProjectValue),
    },
    {
      title: 'Percentage Energy Reduction',
      value: `${formatNumber(info.percentageEnergyReduction)}%`,
    },
    {
      title: 'Annual energy reduction',
      value: formatNumber(info.annualEnergyReduction),
    },
    {
      title: 'Forecast Cost Reduction',
      value: formatNumber(info.forecastCostReduction),
    },
    {
      title: <span>Forecast EUI (kWh / m<sup>2</sup>)</span>,
      value: formatNumber(info.forecastEUI),
    },
    {
      title: <span>Forecast ECI (AED / m<sup>2</sup>)</span>,
      value: formatNumber(info.forecastECI),
    },
    {
      title: 'Taka Score',
      value: info.score,
    },
    {
      title: 'Forecast Taka Score',
      value: info.forecastScore,
    },
  ]
}

const sortKeys = [
  {
    key: 'annualEnergyCost',
    label: 'Total Project Value',
  }, {
    key: 'totalArea',
    label: 'Total Area',
  }, {
    key: 'score',
    label: 'Taka Score',
  }]

const sortProjects = ({ key, dir }) => {
  return (a, b) => {
    const comparation = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
    return dir === 'asc' ? comparation : comparation * -1
  }
}

const ProjectsInfoContainer = ({ loadInfo, projects, currentUser, loadProjects }) => {
  const [showLoader, setShowLoader] = useState(false)
  const [loadindPid, setLoadindPid] = useState(null)
  const [sliderValue, setSliderValue] = useState([0, 0])
  const [takaSliderValue, setTakaSliderValue] = useState([0, 10])
  const [defaultSliderValue, setDefaultSliderValue] = useState([0, 1])
  const [filters, setFilters] = useState([])
  const [searchStr, setSearchStr] = useState('')
  const [occupancyType, setOccupancyType] = useState([])
  const [selectedZone, setSelectedZone] = useState([])
  const [offerType, setOfferType] = useState([])
  const [coolingType, setCoolingType] = useState([])
  const [sortOptions, setSortOptions] = useState({ dir: 'asc' })

  const companiesOptions = useMemo(
    () => currentUser.companyMap.map(({ company: { name: label, id: value } }) => ({ label, value })), 
    [currentUser]
  )

  const handleCompanyChange = useCallback((companies) => {
    loadProjects((companies || []).map(({ value }) => value))
  })

  const displayedProjects = useMemo(() => {
    return filterProjects({
      projects,
      range: sliderValue,
      search: searchStr,
      occupancyType,
      takaRange: takaSliderValue,
      zoneName: selectedZone,
      offerType,
      coolingType,
    }).sort(sortProjects(sortOptions))
  }, [
    sliderValue,
    searchStr,
    occupancyType,
    takaSliderValue,
    selectedZone,
    offerType,
    coolingType,
    sortOptions,
    projects,
  ])

  useEffect(() => {
    if(projects.length) {
      const { annualEnergyCost: min } = minBy(projects, 'annualEnergyCost')
      const { annualEnergyCost: max } = maxBy(projects, 'annualEnergyCost')
      const values = [ min, Math.round(max/10000)*10000 || 1]
      setDefaultSliderValue(values)
      setSliderValue(values)
    }
  }, [projects])

  useEffect(() => {
    const occupancyTypes = projects.map(({ occupancyType }) => occupancyType)
    const zones =  projects
      .filter(({ zone }) => zone)
      .map(({ zone }) => zone.name)
    const offerTypes =  projects
      .map(({ productOfferingDetails }) => productOfferingDetails)

    const coolingTypes =  projects
      .map(({ coolingType }) => coolingType)

    setFilters([{
      name: 'Zone Name',
      options: compact(uniq(zones)).map(z => ({ label: z, value: z })),
      onChange: (e = []) => setSelectedZone((e || []).map(({ value }) => value)),
    },{
      name: 'Building Types',
      options: compact(uniq(occupancyTypes)).map(z => ({ label: z, value: z })),
      onChange: (e = []) => setOccupancyType((e || []).map(({ value }) => value)),
    },
    {
      name: 'Plant Type',
      options: compact(uniq(coolingTypes)).map(z => ({ label: z, value: z })),
      onChange: (e = []) => setCoolingType((e || []).map(({ value }) => value)),
    }, {
      name: 'Offer Type',
      options: compact(uniq(offerTypes)).map(z => ({ label: z, value: z })),
      onChange: (e = []) => setOfferType((e || []).map(({ value }) => value)),
    }])
  }, [projects])

  const loadProject = useCallback(async (id, date) => {
    setShowLoader(true)
    setLoadindPid(id)
    await loadInfo(id, date)
    setShowLoader(false)
    setLoadindPid(null)
  }, [])

  const handleSlide = useCallback((range) => {
    setSliderValue(range)
  }, [])

  const handleTakaSlide = useCallback((range) => {
    setTakaSliderValue(range)
  }, [])

  const annualEnergyCostDisplayed = useMemo(
    () => sumBy(displayedProjects, 'annualEnergyCost'),
    [displayedProjects]
  )

  return (
    <Container>
      <Row>
        <div className='w-50 p-4' >
          <div>
            <label><strong style={{ fontWeight: 'bolder' }}>Total Project Value (AED</strong>)</label>
          </div>
          <Slider
            connect
            step={1000}
            onSlide={handleSlide}
            pips={{ 
              mode: 'positions',
              values: [0, 20, 40, 60, 80, 100],
              stepped: true,
              density: 10, 
            }}
            start={sliderValue}
            range={{ min: defaultSliderValue[0], max: defaultSliderValue[1] }}
          />
        </div> 
        <div className='w-50 p-4'>
          <div>
            <label><strong style={{ fontWeight: 'bolder' }}>Taka Energy Score: </strong></label>
          </div>
          <Slider
            connect
            step={1}
            pips={{ mode: 'steps', stepped: true, density: 10 }}
            onSlide={handleTakaSlide}
            start={takaSliderValue}
            range={{ min: 0, max: 10 }}
          />
        </div> 
      </Row>
      <Container className="mt-1">
        <Container>
          <Row className='mt-2'>
            <div className='mr-2'>
              <label><strong style={{ fontWeight: 'bolder' }}>Project Name</strong></label>
              <FormInput
                value={searchStr}
                onChange={(e) => setSearchStr(e.target.value)}
              />
            </div>
            {filters.map((filter) => (
              <div className='mr-2 w-100' key={filter.name}>
                <label><strong style={{ fontWeight: 'bolder' }}>{filter.name}</strong></label>
                <ReactSelect
                  isMulti={true}
                  options={filter.options}
                  // eslint-disable-next-line react/jsx-handler-names
                  onChange={filter.onChange}>
                </ReactSelect>
              </div>
            ))}
          </Row>
        </Container>
      </Container>
      <Container className="mt-3">
        <label><strong style={{ fontWeight: 'bolder' }}>Companies</strong></label>
        <ReactSelect
          defaultValue={companiesOptions.find(({ value }) => currentUser.companyId == value)}
          options={companiesOptions}
          isMulti={true}
          onChange={handleCompanyChange}></ReactSelect>
      </Container>
      <Container className="mt-3">
        <div className='mr-2'>
          <label><strong style={{ fontWeight: 'bolder' }}>Projects Count: </strong></label>
          <span>{displayedProjects.length}</span>
        </div>
        <div className='mr-2'>
          <label><strong style={{ fontWeight: 'bolder' }}>Total Project Values: </strong></label>
          <span>{formatNumber(annualEnergyCostDisplayed)} (AED)</span>
        </div>
      </Container>
      <Container className="mt-3">
        <Container>
          <Row>
            <label><strong style={{ fontWeight: 'bolder' }}>Sorting</strong></label>
            <FormSelect
              onChange={({ target }) => setSortOptions({ ...sortOptions, key: target.value })}>
              {sortKeys.map(option => (
                <option value={option.key} key={option.key}>{option.label}</option>
              ))}
            </FormSelect>
            <FormSelect
              onChange={({ target }) => setSortOptions({ ...sortOptions, dir: target.value })}>
              {['asc', 'desc'].map(option => (
                <option value={option} key={option}>{option}</option>
              ))}
            </FormSelect>
          </Row>
        </Container>
      </Container>
      <Row className='m-1'>
        {displayedProjects.map(p => (
          <div key={p.id} className='m-2' style={{ minWidth: '300px', maxWidth: '300px', position: 'relative' }}>
            <ListInfoCard title={p.name} id={p.id} info={getInfo(p)}>
              <CircleLoader show={showLoader && loadindPid === p.id }/>
              <YearMonthSelect
                initialDate={new Date(p.startDate)}
                submitting={true}
                onChange={(date) => loadProject(p.id, date)}></YearMonthSelect>     
            </ListInfoCard>
          </div>
        ))}
      </Row>
    </Container>
  )
}

export default connect(
  ({ projects, users }) => ({
    projects: projects.projectsInfo,
    currentUser: users.currentUser,
  }),
  (dispatch) => ({
    loadInfo: (id, startDate) => dispatch(loadProjectInfo(id, startDate)),
    loadProjects: (companyIds) => dispatch(loadInfoSet(companyIds)),
  })
)(ProjectsInfoContainer)
