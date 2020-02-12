import React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import differenceBy from 'lodash/differenceBy'

import {
  getOccupancyTypeValue,
  setOccupancyTypeValue,
} from '../../../redux/reducers/projects'

import { occupancyTypeOptions } from './BenchmarkingFilter'


class EuiScoreBaseline extends React.Component {
  state={
    occupancyTypeValue:[],
  }
  componentDidMount() {
    this.setState({
      occupancyTypeValue:this.props.occupancyTypeValue,
    })
  }

  handleOccupancyValueChange = idx => evt => {
    const newOccupancyTypeValue = this.state.occupancyTypeValue.map((occupancyType, sidx) => {
      if (idx !== sidx) return occupancyType
      return { ...occupancyType, value: evt.target.value }
    })
    this.setState({
      occupancyTypeValue:newOccupancyTypeValue,
    })
  };

  saveOccupancyTypeValue = () =>{
    this.props.setOccupancyTypeValue([...this.state.occupancyTypeValue])
  }

  handleOccupancyTypeChange = async (selectedOption) => {
    const x = [...this.state.occupancyTypeValue,{ label:selectedOption.label, value:''  }]
    this.setState({
      occupancyTypeValue:x,
    })

  }
  handleRemoveOccupancyType = idx => () => {
    const x = this.state.occupancyTypeValue.filter((s, sidx) => idx !== sidx)
    this.setState({
      occupancyTypeValue:x,
    })
  };

  render() {
    const newOccupancyTypeOptions = differenceBy(occupancyTypeOptions, this.state.occupancyTypeValue, 'label')
    return (
      <form onSubmit={this.saveOccupancyTypeValue}>
        <div className="popupHeader">
          <h4>EUI Scores Baselines</h4>
          <span onClick={this.props.close}>&times;</span>
        </div>
        {this.state.occupancyTypeValue.map((occupancyType, idx) => {
          return  <div className="euiScoreBaselineWrapper">
            <input
              type="text"
              placeholder={occupancyType.label}
              disabled={true}
            />
            <input
              type="number"
              placeholder={'Value'}
              value={occupancyType.value}
              onChange={this.handleOccupancyValueChange(idx)}
            />
            <button
              type="button"
              onClick={this.handleRemoveOccupancyType(idx)}
              className="remove"
            >
              -
            </button>
          </div>
        })}
        <Select
          onChange={this.handleOccupancyTypeChange}
          options={newOccupancyTypeOptions}
          placeholder={'Select Occupancy type...'}
          className="dropdown-option"
        />
        <button type="submit" className="btn btn-primary float-right mt-3 mb-3" >Save</button>
      </form>
    )
  }
}

export default connect(
  (state) => ({
    occupancyTypeValue : getOccupancyTypeValue(state),
  }),
  (dispatch) => ({
    setOccupancyTypeValue : (value) => dispatch(setOccupancyTypeValue(value)),


  })
)(EuiScoreBaseline)

