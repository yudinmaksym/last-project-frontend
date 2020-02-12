import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
} from 'shards-react'

import colors from '../../utils/colors'
import Chart from '../../utils/chart'
import { formatNumber } from '../../utils/format'
// import DateRangeFilter from '../charts/DateRangeFilter'


function percent(total = 1, ready = 1) {
  return +(parseFloat((total / (ready + 1))  * 100).toFixed(0))
}

class Consumptions extends React.Component {
  constructor(props) {
    super(props)

    this.canvasRef = React.createRef()
  }

  componentDidMount() {
    this.init()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataId !== this.props.dataId) {
      window.requestAnimationFrame(
        () => {
          try {
            this.init(true)
          } catch (e) {
            console.log(e)
          }
        }
      )
    }
  }

  init(update = false) {
    const { chartData } = this.props
    const chartConfig = {
      type: 'doughnut',
      options: {
        ...{
          legend: false,
          cutoutPercentage: 80,
          tooltips: {
            enabled: false,
            mode: 'index',
            position: 'nearest',
            callbacks: {
              label: function(tooltipItem, data) {
                const { datasetIndex, index } = tooltipItem
                const color = data.datasets[datasetIndex].backgroundColor[index]
                const title = data.labels[index] || ''
                const value = percent(data.datasets[datasetIndex].data[index],chartData.total)

                return (
                  `
                  <span>
                    <b style="color: ${color}; font-weight: bolder;">${title}</b>: ${value}%
                  </span>
                  `
                )
              },
            },
          },
        },
        ...this.props.chartOptions,
      },
      data: this.props.chartData,
    }

    if (update) {
      this.chart.options = chartConfig.options
      this.chart.data = {
        ...this.props.chartData,
      }

      this.chart.update()
      return 
    }

    this.chart = new Chart(this.canvasRef.current, chartConfig)
  }

  render() {
    const { title, subTitle } = this.props
    const labels = this.getParsedLabels()

    return (
      <Card small className="ubd-stats h-100">
        <CardHeader className="border-bottom">
          <Row>
            <Col md="6">
              <h6 className="m-0">{title}</h6>
              <h6 className="m-0">{subTitle}</h6>
            </Col>
            <Col md="6">
              {/* <DateRangeFilter 
                className={'float-left'}
                fromBeginning={true}
                value={this.props.range}
                onChange={this.props.onRangeChange}
              /> */}
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="d-flex flex-column">
          {/* Chart */}
          <canvas
            id="chart-2"
            width="100"
            ref={this.canvasRef}
            className="analytics-users-by-device mt-3 mb-4"
          />

          {/* Legend */}
          <div className="ubd-stats__legend w-100 m-auto pb-4">
            {labels.map((label, idx) => (
              <div key={idx} className="ubd-stats__item">
                <span className="ubd-stats__category">{label.title}</span>
                <span className="ubd-stats__value">{label.value}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    )
  }

  getParsedLabels() {
    const { chartData } = this.props

    if (!chartData || typeof chartData.labels === 'undefined') {
      return []
    }

    return chartData.labels.map((label, idx) => {
      const dataset = chartData.datasets[0]

      return {
        title: label,
        icon: dataset.icons[idx],
        iconColor: dataset.backgroundColor[idx],
        value: formatNumber(dataset.data[idx]),
      }
    })
  }
}

Consumptions.defaultProps = {
  title: 'Cost Per Fuel',
  chartConfig: Object.create(null),
  chartOptions: Object.create(null),
  chartData: {
    labels: ['Desktop', 'Tablet', 'Mobile'],
    datasets: [
      {
        hoverBorderColor: colors.white.toRGBA(1),
        data: [68.3, 24.2, 7.5],
        icons: [
          '<i class="material-icons">&#xE30B;</i>',
          '<i class="material-icons">&#xE32F;</i>',
          '<i class="material-icons">&#xE325;</i>',
        ],
        backgroundColor: [
          colors.primary.toRGBA(0.9),
          colors.primary.toRGBA(0.5),
          colors.primary.toRGBA(0.3),
        ],
      },
    ],
  },
}

export default Consumptions
