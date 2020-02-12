import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col,
  FormSelect,
} from 'shards-react'


import Link from '../common/Link'
import colors from '../../utils/colors'
import { formatNumber } from '../../utils/format'
import Chart from '../../utils/chart'
import DateRangeFilter from '../charts/DateRangeFilter'


class MonthlyElectricityConsumption extends React.Component {
  static defaultProps = {
    type: 'bar',
  }

  constructor(props) {
    super(props)

    // this.initied
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
        responsive: true,
        legend: false,
        // elements: {
        //   line: {
        //     // A higher value makes the line look skewed at this ratio.
        //     tension: 0.38,
        //   },
        // },
        scales: {
          xAxes: [
            {
              gridLines: false,
              // ticks: {
              //   callback(tick, index) {
              //     return index % 2 === 0 ? '' : tick
              //   },
              // },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                // suggestedMax: 45,
                callback: function(label, index, labels) {
                  return formatNumber(label)
                },
              },
            },
          ],
        },
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
      },
      ...this.props.chartOptions,
    }

    if (update) {
      this.chart.options = chartOptions
      this.chart.data = this.props.chartData

      this.chart.update()
      // Generate the analytics overview chart labels.
      this.legendRef.current.innerHTML = this.chart.generateLegend()
      return 
    } 

    const AnalyticsOverviewChart = new Chart(this.canvasRef.current, {
      type: this.props.type,
      data: this.props.chartData,
      options: chartOptions,
    })

    this.chart = AnalyticsOverviewChart

    // Generate the analytics overview chart labels.
    this.legendRef.current.innerHTML = AnalyticsOverviewChart.generateLegend()

    if (!this.props.chartData.length) {
      return
    }

    // Hide initially the first and last analytics overview chart points.
    // They can still be triggered on hover.
    const meta = AnalyticsOverviewChart.getDatasetMeta(0)
    meta.data[0]._model.radius = 0
    meta.data[
      this.props.chartData.datasets[0].data.length - 1
    ]._model.radius = 0

    // Render the chart.
    AnalyticsOverviewChart.render()
  }

  render() {
    const { title, subTitle, extraValues } = this.props

    return (
      <Card small className="h-100">
        {/* Card Header */}
        <CardHeader className="border-bottom">
          <Row>
            <Col>
              <h6 className="m-0">{title}</h6>
              <h6 className="m-0">{subTitle}</h6>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="pt-0">
          <div ref={this.legendRef} />
          <canvas
            id="chart-1"
            height="300"
            ref={this.canvasRef}
            style={{ maxWidth: '100% !important' }}
            className="analytics-overview-sessions"
          />
        </CardBody>
      </Card>
    )
  }
}

MonthlyElectricityConsumption.defaultProps = {
  title: 'Electricity Consumption',
  extraValues: [],
  chartData: {
    labels: [
      'May 2019',
    ],
    datasets: [
      {
        label: 'Adjusted Baseline',
        fill: 'start',
        data: [529913],
        backgroundColor: colors.primary.toRGBA(0.1),
        borderColor: colors.primary.toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: colors.primary.toRGBA(1),
        borderWidth: 1.5,
      },
      {
        label: 'Common Space',
        fill: 'start',
        data: [515572],
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
        label: 'Tenant Sub-Meter',
        fill: 'start',
        data: [135705],
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

export default MonthlyElectricityConsumption
