import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
} from 'shards-react'

import DateRangeFilter from '../charts/DateRangeFilter'
import { formatNumber } from '../../utils/format'
import Chart from '../../utils/chart'


export function getEveryTick(range) {
  switch (range) {
  case 24:
    return 2
      
  case 18:
    return 19
      
  case 12:
    return 13
      
  case 6:
    return 7
      
  case 3:
  default: 
    return 4
  }
}

function isHidden(index, range) {
  const tick = getEveryTick(+range)
  return ((index+1) % tick) === 0
}

class ConsumptionByZone extends React.Component {
  constructor(props) {
    super(props)

    // this.legendRef = React.createRef()
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
              ticks: {
                callback: (tick, index) => {
                  return tick || 'N/A '
                },
              },
            },
          ],
          yAxes: [
            {
              // display: false,
              stacked: false,
              ticks: {
                beginAtZero: true,
                userCallback(label) {
                  return ''//formatNumber(label)
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
      // this.legendRef.current.innerHTML = this.chart.generateLegend()
      return
    }

    const SalesReportChart = new Chart(this.canvasRef.current, {
      type: 'bar',
      data: this.props.chartData,
      options: chartOptions,
    })

    this.chart = SalesReportChart
    
    // Generate the chart labels.
    // this.legendRef.current.innerHTML = SalesReportChart.generateLegend()

    if (!this.props.chartData.length) {
      return
    }

    // Hide initially the first and last chart points.
    // They can still be triggered on hover.
    const meta = SalesReportChart.getDatasetMeta(0)
    meta.data[0]._model.radius = 0
    meta.data[
      this.props.chartData.datasets[0].data.length - 1
    ]._model.radius = 0

    // Render the chart.
    SalesReportChart.render()
  }

  render() {
    const { title, subTitle } = this.props

    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <Row>
            <Col>
              <h6 className="m-0">{title}</h6>
              <h6  className="m-0">{subTitle}</h6>
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
          <br />
          {/* <div ref={this.legendRef} /> */}
          <canvas
            height="100"
            ref={this.canvasRef}
            style={{ maxWidth: '100% !important' }}
            className="sales-overview-sales-report"
          />
        </CardBody>
      </Card>
    )
  }
}

ConsumptionByZone.defaultProps = {
  title: 'Sales Report',
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

export default ConsumptionByZone
