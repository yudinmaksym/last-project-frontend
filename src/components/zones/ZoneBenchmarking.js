import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  ButtonGroup,
  Button,
} from 'shards-react'

import { formatNumber } from '../../utils/format'
import Chart from '../../utils/chart'


class ZoneBenchmarking extends React.Component {
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
    const chartOptions = {
      ...{
        legend: false,
        // Uncomment the next line in order to disable the animations.
        // animation: false,
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
          callbacks: {
            label: function(tooltipItem, data) {
              const { datasetIndex, index } = tooltipItem
              const value = data.datasets[datasetIndex].data[index]

              return formatNumber(value)
            }, 
          },
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              gridLines: false,
              callback: function(label, index, labels) {
                return label
              },
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90,
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              beginAtZero: true,
              ticks: {
                userCallback(label) {
                  return formatNumber(label)
                },
              },
            },
          ],
        },
      },
      ...this.props.chartOptions,
    }

    if (update) {
      this.chart.options = chartOptions
      this.chart.data = this.props.chartData

      return this.chart.update()
    }

    const ZoneChart = new Chart(this.canvasRef.current, {
      type: 'bar',
      data: this.props.chartData,
      options: chartOptions,
    })

    this.chart = ZoneChart

    if (!this.props.chartData.length) {
      return
    }

    // Hide initially the first and last chart points.
    // They can still be triggered on hover.
    const meta = ZoneChart.getDatasetMeta(0)
    meta.data[0]._model.radius = 0
    meta.data[
      this.props.chartData.datasets[0].data.length - 1
    ]._model.radius = 0

    // Render the chart.
    ZoneChart.render()
  }

  render() {
    const { title, subTitle } = this.props

    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
          <h6 className="m-0">{subTitle}</h6>
        </CardHeader>

        <CardBody className="pt-0">
          <br />
          <canvas
            height="200"
            ref={this.canvasRef}
            style={{ maxWidth: '100% !important' }}
            className="sales-overview-sales-report"
          />
        </CardBody>
      </Card>
    )
  }
}

ZoneBenchmarking.defaultProps = {
  title: 'Monthly Consumption',
  chartData: {
    labels: [
      'Electric',
      'Asteco',
      'Other',
      'H&H',
      'ADWEA',
    ],
    datasets: [
      {
        label: 'Electric',
        fill: 'start',
        data: [
          28922,
          25317,
          23182,
          32119,
          11291,
          8199,
          25182,
          22120,
          10219,
          8771,
          12992,
          8221,
        ],
        backgroundColor: '#2ecc7f',
        borderColor: '#2ecc7f',
        pointBackgroundColor: '#FFFFFF',
        pointHoverBackgroundColor: '#2ecc7f',
        borderWidth: 1.5,
      },
    ],
  },
}

export default ZoneBenchmarking
