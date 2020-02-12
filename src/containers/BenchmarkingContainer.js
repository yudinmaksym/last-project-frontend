import * as React from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col, Popover, PopoverBody, Button, Modal, ModalBody,
} from 'shards-react'
import find from 'lodash/find'

import ProjectBenchmarking from '../components/projects/ProjectBenchmarking'
import {
  getBenchmarks,
  loadProjectBenchmarks,
  getCurrentCompany,
  resetBenchmarks,
  getOccupancyType,
  getOccupancyTypeValue,
  getSetOccupancyTypeValue,
} from '../../redux/reducers/projects'
import colors from '../utils/colors'
import { getColor } from '../utils/theme'
import BenchmarkingFilter from '../components/projects/BenchmarkingFilter'
import EuiScoreBaseline from '../components/projects/EuiScoreBaseline'
import { loadZonesGroup } from '../../redux/reducers/zones'
import InfoLabel from '../components/common/InfoLabel'
import { formatNumber } from '../utils/format'
import BenckmarkInfo from '../components/projects/BenchmarkInfo'


const getAvarageValue = (dataset) => {
  const sum = dataset.reduce((a, b) => a + b, 0.0)
  return sum / (dataset.length)
}

class BenchmarkingContainer extends React.Component {
  state = {
    open: false,
  }

  componentDidMount() {
    this.props.getSetOccupancyTypeValue()
    this.props.loadProjectBenchmarks()
    this.props.loadZonesGroup()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.currentCompany !== this.props.currentCompany){
      this.props.resetBenchmarks()
      this.props.loadProjectBenchmarks()
      this.props.loadZonesGroup()
      this.props.getSetOccupancyTypeValue()
    }
  }

  toggle = () => {
    this.setState({
      open: !this.state.open,
    })
  }
  getsummary() {
    const {
      benchmarks,
    } = this.props

    return [
      {
        title: (
          <InfoLabel
            label={'No. Of Projects'}
          />
        ),
        value: formatNumber(benchmarks.noOfProject),
      },
      {
        title: (
          <InfoLabel
            label={'No. Of Buildings'}
          />
        ),
        value: formatNumber(benchmarks.noOfbuildings),
      },
      {
        title: (
          <InfoLabel
            label={'Total of all Energy Costs'}
          />
        ),
        value: formatNumber(benchmarks.annualEnergyCost),
      },
      {
        title: (
          <InfoLabel
            label={'Total of all Energy consumption'}
          />
        ),
        value: formatNumber(benchmarks.annualEnergykWh),
      },
      {
        title: (
          <InfoLabel
            label={'Area'}
            unit={<>m<sup>2</sup></>}
          />
        ),
        value: formatNumber(benchmarks.sumOfArea),
      },

    ].filter((_i) => !_i.hidden)
  }
  formatBenchmarks = () => {
    const { benchmarks, occupancyType, occupancyTypeValue } = this.props
    const average = getAvarageValue(benchmarks.datasets)

    let valueOfOccupancyType = []
    let targetValue
    if(occupancyTypeValue && occupancyType){
      const targetObject = find(occupancyTypeValue, { 'label': occupancyType.value })
      if(targetObject){
        if(targetObject.value){
          targetValue = targetObject.value
          valueOfOccupancyType = [
            ...benchmarks.labels.map((i) => { return { x: targetValue, y: i }} ),
          ]
        }

      }
    }

    const data = [
      ...benchmarks.labels.map((i) => { return { x: average, y: i }} ),
    ]

    const datasets = [
      {
        type: 'line',
        label: 'Avarage',
        borderColor: colors.gray600.toRGBA(1),
        backgroundColor: colors.gray600.toRGBA(1),
        borderWidth: 1.5,
        borderDash: [5,5],
        fill: false,
        data: [
          ...data,
        ],
        pointRadius: 1.5,
      },
      {
        label: benchmarks.label,
        fill: false,
        data: [...benchmarks.datasets],
        backgroundColor: getColor(0).toHex(0.1),
        borderColor: getColor(0).toHex(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: getColor(0).toRGBA(1),
      },
    ]
    occupancyType && datasets.unshift({
      type: 'line',
      label: 'target',
      borderColor:colors.red.toRGBA(1),
      backgroundColor: colors.red.toRGBA(1),
      borderWidth: 1.5,
      borderDash: [5,5],
      fill: false,
      data: [
        ...valueOfOccupancyType,
      ],
      pointRadius: 1.5,
    })

    return datasets
  }
  render() {
    const {
      benchmarks,
      loading,
    } = this.props
    const projectEUITitle = 'EUI ' + (benchmarks.year && `(${benchmarks.year})`)
    return (
      <React.Fragment>
        <div className="euiScoreBaseButton">
          <Button id='euiScoreBaseline' onClick={this.toggle}>
           EUI Score Baseline
          </Button>
          <Modal
            placement="bottom"
            open={this.state.open}
            toggle={this.toggle}
            target="#euiScoreBaseline"
            className="popup-modal"
            size="md"
          >
            <ModalBody className="p-0">
              <EuiScoreBaseline close={this.toggle}/>
            </ModalBody>
          </Modal>
        </div>


        <BenchmarkingFilter />
        <Row>
          <Col md="3" lg="3" className="mb-4">
            <BenckmarkInfo title='All Properties' subtitle='Facts & Figures' info={this.getsummary()}/>
          </Col>
          <Col md="9" lg="9" className="mb-4">
            <ProjectBenchmarking
              title={projectEUITitle}
              subTitle="Projects"
              dataId={benchmarks.dataId}
              type="horizontalBar"
              chartData={{
                labels: benchmarks.labels,
                datasets: this.formatBenchmarks(),
              }}
              length= {benchmarks.labels.length}
            />
          </Col>

        </Row>

      </React.Fragment>
    )
  }

}

export default connect(
  (state) => ({
    benchmarks: getBenchmarks(state),
    currentCompany: getCurrentCompany(state),
    occupancyType : getOccupancyType(state),
    occupancyTypeValue: getOccupancyTypeValue(state),

  }),
  (dispatch) => ({
    loadProjectBenchmarks: () => dispatch(loadProjectBenchmarks()),
    loadZonesGroup: () =>
      dispatch(loadZonesGroup()),
    resetBenchmarks: () => dispatch(resetBenchmarks()),
    getSetOccupancyTypeValue: () => dispatch(getSetOccupancyTypeValue()),
  })
)(BenchmarkingContainer)
