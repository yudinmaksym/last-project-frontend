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
import colors from '../../utils/colors'
import Chart from '../../utils/chart'


class ZoneMonthlyConsumption extends React.Component {
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
              gridLines: false,
              ticks: {
                callback(tick, index) {
                  return tick.split(' ')
                },
              },
            },
          ],
          yAxes: [
            {
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

    const ChartInstance = new Chart(this.canvasRef.current, {
      type: 'line',
      data: this.props.chartData,
      options: chartOptions,
    })

    this.chart = ChartInstance

    // Generate the chart labels.
    this.legendRef.current.innerHTML = ChartInstance.generateLegend()

    if (!this.props.chartData.length) {
      return
    }

    // Hide initially the first and last chart points.
    // They can still be triggered on hover.
    const meta = ChartInstance.getDatasetMeta(0)
    meta.data[0]._model.radius = 0
    meta.data[
      this.props.chartData.datasets[0].data.length - 1
    ]._model.radius = 0

    // Render the chart.
    ChartInstance.render()
  }


  render() {
    const { title, subTitle, extraValues } = this.props

    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
          <h6 className="m-0">{subTitle}</h6>
        </CardHeader>

        <CardBody className="pt-0">
          <div ref={this.legendRef} />
          <canvas
            height="120"
            ref={this.canvasRef}
            style={{ maxWidth: '100% !important' }}
            className="sales-overview-sales-report"
          />

          <br />
          {/* Legend */}
          <div className="ubd-stats__legend w-100 m-auto pb-6">
            {extraValues.map((ev, idx) => (
              <div key={idx} className="ubd-stats__item">
                {ev.icon && (
                  <div
                    dangerouslySetInnerHTML={{ __html: ev.icon }}
                    style={{ color: ev.iconColor }}
                  />
                )}
                <h5><b>{formatNumber(ev.value)}</b></h5>
                <span className="ubd-stats__category">{ev.label}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    )
  }
}

ZoneMonthlyConsumption.defaultProps = {
  title: 'Energy Consumption Per Fuel',
  chartData: {
    labels: [
      '09:00 PM',
      '10:00 PM',
      '11:00 PM',
      '12:00 PM',
      '13:00 PM',
      '14:00 PM',
      '15:00 PM',
      '16:00 PM',
      '17:00 PM',
    ],
    datasets: [
      {
        label: 'Electricity',
        fill: 'start',
        data: [5, 5, 10, 30, 10, 42, 5, 15, 5],
        backgroundColor: colors.primary.toRGBA(0.1),
        borderColor: colors.primary.toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: colors.primary.toRGBA(1),
        borderWidth: 1.5,
      },
      {
        label: 'Water',
        fill: 'start',
        data: ['', 23, 5, 10, 5, 5, 30, 2, 10],
        backgroundColor: colors.salmon.toRGBA(0.1),
        borderColor: colors.salmon.toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: colors.salmon.toRGBA(1),
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0,
        pointBorderColor: colors.salmon.toRGBA(1),
      },
      {
        label: 'Water',
        fill: 'start',
        data: ['', 1, 4, 5, 5, 5, 1, 2, 40],
        backgroundColor: colors.salmon.toRGBA(0.1),
        borderColor: colors.salmon.toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: colors.salmon.toRGBA(1),
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0,
        pointBorderColor: colors.salmon.toRGBA(1),
      },
    ],
  },
}

export default ZoneMonthlyConsumption
