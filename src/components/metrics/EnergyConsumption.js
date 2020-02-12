import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  CardFooter,
  Row,
  Col,
  FormSelect,
} from 'shards-react'


import Link from '../common/Link'
import colors from '../../utils/colors'
import { formatNumber } from '../../utils/format'
import Chart from '../../utils/chart'
import { isHidden } from '../../utils/charts'
import DateRangeFilter from '../charts/DateRangeFilter'


class EnergyConsumption extends React.Component {
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
        elements: {
          line: {
            // A higher value makes the line look skewed at this ratio.
            tension: 0.3,
          },
          point: {
            radius: 1,
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: false,
              ticks: {
                callback: (tick, index) => {
                  return isHidden(index, this.props.range) ? '' : tick && tick.split(' ')
                },
              },
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
    const { title, subTitle, extraValues, isCard } = this.props
    const Wrapper = isCard !== false ? Card : Container
    const headerStyle = isCard !== false ? {} : { display: 'none' }
    return (
      <Wrapper small className="h-100 w-100">
        {/* Card Header */}
        <CardHeader className="border-bottom" style={headerStyle}>
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
          <canvas
            id="chart-1"
            height="120"
            ref={this.canvasRef}
            style={{ maxWidth: '100% !important' }}
            className="analytics-overview-sessions"
          />
          <br />
          {/* Legend */}
          <div className="ubd-stats__legend w-100 m-auto pb-4">
            {extraValues.map((ev, idx) => (
              <div key={idx} className="ubd-stats__item">
                {ev.icon && (
                  <div
                    dangerouslySetInnerHTML={{ __html: ev.icon }}
                    style={{ color: ev.iconColor }}
                  />
                )}
                <h5><b>{ev.rawValue ? ev.rawValue : formatNumber(ev.value)}</b></h5>
                <span className="ubd-stats__category">{ev.label}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Wrapper>
    )
  }
}

EnergyConsumption.defaultProps = {
  title: 'Energy Consumption Per Fuel',
  extraValues: [],
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

export default EnergyConsumption
