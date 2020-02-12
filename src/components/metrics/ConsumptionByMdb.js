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

import colors from '../../utils/colors'
import { formatNumber } from '../../utils/format'
import Chart from '../../utils/chart'
import DateRangeFilter from '../charts/DateRangeFilter'


class ConsumptionByMdb extends React.Component {
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
        // Uncomment the next line in order to disable the animations.
        // animation: false,
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
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
                return formatNumber(label)
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                userCallback(label) {
                  return label > 999 ? `${(label / 1000).toFixed(0)}k` : label
                },
              },
            },
          ],
        },
      },
      ...this.props.chartOptions,
    }

    if (update) {
      this.chart.options = { ...chartOptions }
      this.chart.data = this.props.chartData
  
      this.chart.update()
      this.legendRef.current.innerHTML = this.chart.generateLegend()
      return
    }

    const chart = new Chart(this.canvasRef.current, {
      type: 'bar',
      data: this.props.chartData,
      options: chartOptions,
    })

    this.chart = chart

    // Generate the chart labels.
    this.legendRef.current.innerHTML = chart.generateLegend()

    if (!this.props.chartData.length) {
      return
    }

    // Hide initially the first and last chart points.
    // They can still be triggered on hover.
    const meta = chart.getDatasetMeta(0)
    meta.data[0]._model.radius = 0
    meta.data[
      this.props.chartData.datasets[0].data.length - 1
    ]._model.radius = 0

    // Render the chart.
    chart.render()
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

            {/* <Col>
              <DateRangeFilter 
                value={this.props.range}
                onChange={this.props.onRangeChange}
              />
            </Col> */}
          </Row>
        </CardHeader>

        <CardBody className="pt-0">
          <div ref={this.legendRef} />
          <canvas
            height="120"
            ref={this.canvasRef}
            style={{ maxWidth: '100% !important' }}
            className="sales-overview-sales-report"
          />
        </CardBody>
      </Card>
    )
  }
}

ConsumptionByMdb.defaultProps = {
  title: 'Sales Report',
  chartData: {
    labels: [
      '2014',
      '2015',
      '2016',
      '2017',
      '2018',
      '2019',
    ],
    datasets: [
      {
        label: 'Profit',
        fill: 'start',
        data: [
          28922,
          25317,
          23182,
          32119,
          11291,
          8199,
        ],
        backgroundColor: 'rgba(0, 123, 255, 1)',
        borderColor: 'rgba(0, 123, 255, 1)',
        pointBackgroundColor: '#FFFFFF',
        pointHoverBackgroundColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1.5,
      },
      {
        label: 'Shipping',
        fill: 'start',
        data: [
          2892,
          2531,
          2318,
          3211,
          1129,
          819,
        ],
        backgroundColor: 'rgba(72, 160, 255, 1)',
        borderColor: 'rgba(72, 160, 255, 1)',
        pointBackgroundColor: '#FFFFFF',
        pointHoverBackgroundColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1.5,
      },
      {
        label: 'Tax',
        fill: 'start',
        data: [
          1400,
          1250,
          1150,
          1600,
          500,
          400,
        ],
        backgroundColor: 'rgba(153, 202, 255, 1)',
        borderColor: 'rgba(153, 202, 255, 1)',
        pointBackgroundColor: '#FFFFFF',
        pointHoverBackgroundColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1.5,
      },
    ],
  },
  // chartData: {
  //   labels: [
  //     '2019',
  //     '2014',
  //     '2016',
  //   ],
  //   datasets: [
  //     {
  //       label: 'MDB-2',
  //       fill: 'start',
  //       data: [1, 10, 200],
  //       backgroundColor: colors.primary.toRGBA(0.1),
  //       borderColor: colors.primary.toRGBA(1),
  //       pointBackgroundColor: colors.white.toHex(),
  //       pointHoverBackgroundColor: colors.primary.toRGBA(1),
  //       borderWidth: 1.5,
  //     },
  //     {
  //       label: 'MDB-1',
  //       fill: 'start',
  //       data: [400, 900, 120],
  //       backgroundColor: colors.salmon.toRGBA(0.1),
  //       borderColor: colors.salmon.toRGBA(1),
  //       pointBackgroundColor: colors.white.toHex(),
  //       pointHoverBackgroundColor: colors.salmon.toRGBA(1),
  //       borderDash: [5, 5],
  //       borderWidth: 1.5,
  //       pointRadius: 0,
  //       pointBorderColor: colors.salmon.toRGBA(1),
  //     },
  //   ],
  // },
}

export default ConsumptionByMdb
