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
import DateRangeFilter from '../charts/DateRangeFilter'


class ZoneConsumptionByBuilding extends React.Component {
  constructor(props) {
    super(props)

    this.legendRef = React.createRef()
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
        elements: {
          line: {
            // A higher value makes the line look skewed at this ratio.
            tension: 0.3,
          },
          point: {
            radius: 1,
          },
        },
        // Uncomment the next line in order to disable the animations.
        // animation: false,
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
          // callbacks: {
          //   label: function(tooltipItem, data) {
          //     const { datasetIndex, index } = tooltipItem
          //     const value = data.datasets[datasetIndex].data[index]

          //     return formatNumber(value)
          //   }, 
          // },
          callbacks: {
            label: function(tooltipItem, data) {
              const color = data.datasets[tooltipItem.datasetIndex].borderColor
              const title = data.datasets[tooltipItem.datasetIndex].label || ''
              const value = formatNumber(tooltipItem.yLabel)
              return (
                `
                <span>
                  <b style="color: ${color}; font-weight: bolder;">${title}</b>: ${value}
                </span>
                `
              )
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

      this.chart.update()
      this.legendRef.current.innerHTML = this.chart.generateLegend()
      return
    }

    this.chart = new Chart(this.canvasRef.current, {
      type: 'bar',
      data: this.props.chartData,
      options: chartOptions,
    })

    // Generate the chart labels.
    this.legendRef.current.innerHTML = this.chart.generateLegend()

    if (!this.props.chartData.length) {
      return
    }

    // Hide initially the first and last chart points.
    // They can still be triggered on hover.
    const meta = this.chart.getDatasetMeta(0)
    meta.data[0]._model.radius = 0
    meta.data[
      this.props.chartData.datasets[0].data.length - 1
    ]._model.radius = 0

    // Render the chart.
    this.chart.render()
  }

  render() {
    const { title, subTitle } = this.props

    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <Row>
            <Col>
              <h6 className="m-0">{title}</h6>
              <h6 className="m-0">{subTitle}</h6>
            </Col>

            <Col>
              {/* <DateRangeFilter 
                value={this.props.range}
                onChange={this.props.onRangeChange}
              /> */}
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="pt-0">
          <div ref={this.legendRef} />
          {/* <br /> */}
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

ZoneConsumptionByBuilding.defaultProps = {
  title: 'Monthly Consumption',
  chartData: {
    labels: [
      'Green Tower',
      'O14',
      'Falcon Tower',
      'Phoenix Tower',
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
      {
        label: 'Water',
        fill: 'start',
        data: [
          8922,
          5317,
          3182,
          2119,
          1291,
          199,
          5182,
          2120,
          20219,
          771,
          2992,
          221,
        ],
        backgroundColor: '#000000',
        borderColor: '#000000',
        pointBackgroundColor: '#111111',
        pointHoverBackgroundColor: '#333333',
        borderWidth: 1.5,
      },
      {
        label: 'Water',
        fill: 'start',
        data: [
          8922,
          5317,
          3182,
          2119,
          1291,
          199,
          5182,
          2120,
          20219,
          771,
          2992,
          221,
        ],
        backgroundColor: '#000000',
        borderColor: '#000000',
        pointBackgroundColor: '#111111',
        pointHoverBackgroundColor: '#333333',
        borderWidth: 1.5,
      },
    ],
  },
}

export default ZoneConsumptionByBuilding
