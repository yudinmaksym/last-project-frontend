import React from 'react'
import { connect } from 'react-redux'

import {
  getLoading,
  getSelectedZone,
  getHeatmapValues,
  getDateRange,
  getFuelType,
  getCurrentCompany,
  resetHeatmap,
  loadHeatmapValues,
} from '../../redux/reducers/heatmap'
import HeatmapForm from '../forms/HeatmapForm'
import CircleLoader from '../components/preloadrers/circle-loader'
import { loadZonesGroup } from '../../redux/reducers/zones'


class HeatmapContainer extends React.Component {

  componentDidMount() {
    this.props.loadZonesGroup()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.currentCompany !== this.props.currentCompany){
      this.props.loadZonesGroup()
      this.props.resetHeatmap()
    }
  }

  handleZoneChange = () => {
    const { activeZoneId, range, fuelType } = this.props
    activeZoneId!== -1 && fuelType!== '' &&this.props.loadHeatmapValues(
      activeZoneId,
      range,
      fuelType
    )
  }

  render() {
    const {
      activeZoneId,
      heatmapValues,
      loading,
    } = this.props
    const meters = heatmapValues.length === 0  &&  heatmapValues

    return (
      <>
        <CircleLoader
          show={loading}
        />

        <HeatmapForm
          onZoneChange={this.handleZoneChange}
          meters={heatmapValues}
          initialValues={{
            zoneId: activeZoneId,
            meters,
          }}
        />
      </>
    )
  }

}

export default connect(
  (state) => ({
    loading: getLoading(state),
    range: getDateRange(state),
    fuelType:getFuelType(state),
    activeZoneId: getSelectedZone(state) || -1,
    heatmapValues: getHeatmapValues(state),
    currentCompany: getCurrentCompany(state),
  }),
  (dispatch) => ({
    loadHeatmapValues: (projectId, delta, fuel) =>
      dispatch(loadHeatmapValues(projectId, delta, fuel)),
    loadZonesGroup: () =>
      dispatch(loadZonesGroup()),
    resetHeatmap: () =>
      dispatch(resetHeatmap()),
  })
)(HeatmapContainer)
