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


class YearsZoneConsumption extends React.Component {
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
            },
          ],
          yAxes: [
            {
              beginAtZero: true,
              stacked: true,
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
      // this.legendRef.current.innerHTML = this.chart.generateLegend()
      return
    }

    this.chart = new Chart(this.canvasRef.current, {
      type: 'bar',
      data: this.props.chartData,
      options: chartOptions,
    })

    // Generate the chart labels.
    // this.legendRef.current.innerHTML = this.chart.generateLegend()

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
    const labels = this.getParsedLabels() 

    return (
      <Card small className="h-100 country-stats">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
          <h6 className="m-0">{subTitle}</h6>
        </CardHeader>

        <CardBody className="p-0">
          <br />
          <canvas
            height="180"
            ref={this.canvasRef}
            style={{ maxWidth: '100% !important' }}
            className="sales-overview-sales-report"
          />
          
          {/* Legend */}
          <table className="table m-0">
            <tbody>
              {labels.map((label, idx) => (
                <tr key={idx} >
                  <td className="d-flex align-items-center">
                    <span 
                      className="d-inline-flex mr-1"
                      style={{
                        backgroundColor: label.color,
                        width: '20px',
                        height: '12px',
                      }}
                    />
                    <b>{label.title}</b>
                  </td>
                  <td className="text-right">&nbsp;</td>
                  <td className="text-right">{formatNumber(label.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    )
  }

  getParsedLabels() {
    const { chartData } = this.props

    if (!chartData || typeof chartData.labels === 'undefined') {
      return []
    }

    const labels = chartData.datasets.map((set) => {
      return {
        title: set.label || 'N/A',
        color: set.backgroundColor,
        value: set.data.reduce((a, b) => a + b, 0.0),
        _value: set.data.reduce((a, b) => a + b, 0.0),
      }
    }).sort((a,b) => b._value - a._value)

    const topLabels = labels.slice(0, 5)

    if (labels.length > 5) {
      const otherLabels = labels.slice(5)

      const othersSum = otherLabels.reduce(
        (acc, item) => acc + item._value,
        0.0
      )
      
      topLabels.push({
        title: 'Other',
        color: '#ddd',
        value: othersSum,
        _value: othersSum,
      })
    }
    
    return topLabels.sort((a,b) => b._value - a._value)
  }
}

YearsZoneConsumption.defaultProps = {
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

export default YearsZoneConsumption
