import * as React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { Slider } from 'shards-react'


import { getZonesGroup, loadZonesGroup } from '../../../redux/reducers/zones'
import { loadProjectBenchmarks,
  getZoneId, getCoolingType, getOccupancyType, getSquareFootage,
  setZoneId,setOccupancyType,setCoolingType,setSquareFootage,
} from '../../../redux/reducers/projects'



export const occupancyTypeOptions = [
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Hotel', label: 'Hotel' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Infrastructure', label: 'Infrastructure' },
  { value: 'Mixed Use', label: 'Mixed Use' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Mixed', label: 'Mixed' },
  { value: 'Labor', label: 'Labor' },
  { value: 'Mall', label: 'Mall' },
  { value: 'Education', label: 'Education' },
  { value: 'Health', label: 'Health' },
  { value: 'Airport', label: 'Airport' },
]
const coolingTypeOptions = [
  { value: 'District Cooling', label: 'District Cooling' },
  { value: 'AC Chillers', label: 'AC Chillers' },
  { value: 'WC Chillers', label: 'WC Chillers' },
  { value: 'DX Units', label: 'DX Units' },
]

const formatOptions = (options) => {
  return options.map(_option => ({
    label: _option.name,
    value: _option.id,
  }))
}

class BenchmarkingFilter extends React.Component {
  constructor(props) {
    super(props)
    this.handleSlide = this.handleSlide.bind(this)
  }

  handleSlide = async (e) => {
    const sliderValue = [parseFloat(e[0]), parseFloat(e[1])]
    await this.props.setSquareFootage(sliderValue)
    this.props.loadProjectBenchmarks()
  }

  handleZoneChange = async (selectedOption) => {
    await this.props.setZoneId(selectedOption)
    this.props.loadProjectBenchmarks()

  }
  handleOccupancyTypeChange = async (selectedOption) => {
    await this.props.setOccupancyType(selectedOption)
    this.props.loadProjectBenchmarks()
  }
  handleCoolingTypeChange = async (selectedOption) => {
    await this.props.setCoolingType(selectedOption)
    this.props.loadProjectBenchmarks()
  }

  render() {
    const {
      zoneId,
      occupancyType,
      coolingType,
      squareFootage,
    } = this.props
    return (
      <div>
        <div className="main_wrapper_content">
          <span>
            <Select
              isClearable={true}
              value={zoneId}
              onChange={this.handleZoneChange}
              options={this.props.zoneOptions}
              placeholder={'Select Zone...'}
            />
          </span>
          <span>
            <Select
              isClearable={true}
              value={occupancyType}
              onChange={this.handleOccupancyTypeChange}
              options={occupancyTypeOptions}
              placeholder={'Select Occupancy type...'}
            />
          </span>
          <span>
            <Select
              isClearable={true}
              value={coolingType}
              onChange={this.handleCoolingTypeChange}
              options={coolingTypeOptions}
              placeholder={'Select Cooling Type...'}
            />
          </span>
        </div>
        <div className="main_wrapper_slider">
          <label>Area m<sup>2</sup> : </label>
          <span>
            <Slider
              connect
              tooltips={true}
              pips={{ mode: 'steps', stepped: true, density: 3 }}
              onSet={this.handleSlide}
              start={squareFootage}
              range={{ min: 0, max: 685602 }}
            />
          </span>
        </div>
      </div>

    )
  }

}

export default connect(
  (state) => ({
    zoneOptions: formatOptions(getZonesGroup(state)),
    zoneId: getZoneId(state),
    occupancyType : getOccupancyType(state),
    coolingType : getCoolingType(state),
    squareFootage: getSquareFootage(state),

  }),
  (dispatch) => ({
    loadZonesGroup: () =>
      dispatch(loadZonesGroup()),
    setZoneId: (id) => dispatch(setZoneId(id)),
    setOccupancyType : (occupancyType) => dispatch(setOccupancyType(occupancyType)),
    setCoolingType : (coolingType) => dispatch(setCoolingType(coolingType)),
    setSquareFootage : (squareFootage) => dispatch(setSquareFootage(squareFootage)),
    loadProjectBenchmarks : () => dispatch(loadProjectBenchmarks()),

  })
)(BenchmarkingFilter)
