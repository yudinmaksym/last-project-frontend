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

import RangeDatePicker from '../common/RangeDatePicker'
import Chart from '../../utils/chart'
import { formatNumber } from '../../utils/format'


class ZoneEnergyConsumption extends React.Component {
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
          // callbacks: {
          //   label: function(tooltipItem, data) {
          //     return formatNumber(tooltipItem.yLabel)
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
      this.chart.options = { ...chartOptions }
      this.chart.data = this.props.chartData
  
      this.chart.update()
      // this.legendRef.current.innerHTML = this.chart.generateLegend()
      return
    }

    const chart = new Chart(this.canvasRef.current, {
      type: 'bar',
      data: this.props.chartData,
      options: chartOptions,
    })

    this.chart = chart

    // Generate the chart labels.
    // this.legendRef.current.innerHTML = chart.generateLegend()

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
    const labels = this.getParsedLabels()

    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <Row>
            <Col>
              <h6 className="m-0">{title}</h6>
              <h6 className="m-0">{subTitle}</h6>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="pt-0">
          {/* <div ref={this.legendRef} /> */}
          <br />
          <br />
          <canvas
            height="400"
            ref={this.canvasRef}
            style={{ maxWidth: '100% !important' }}
            className="sales-overview-sales-report"
          />

          {/* Legend */}
          {/* <table className="table m-0">
            <tbody>
              {labels.map((label, idx) => (
                <tr key={idx}>
                  <td className="d-flex align-items-center">
                    <span
                      className="d-inline-flex mr-1"
                      style={{
                        backgroundColor: label.color,
                        width: '20px',
                        height: '12px',
                      }}
                    /><b>{label.title}</b></td>
                  <td className="text-right">{label.value}</td>
                </tr>
              ))}
            </tbody>
          </table> */}
        </CardBody>
      </Card>
    )
  }

  getParsedLabels() {
    const { chartData } = this.props

    if (!chartData || typeof chartData.labels === 'undefined') {
      return []
    }

    const labels = []

    // const labels = chartData.labels.map((label, idx) => {
    //   const dataset = chartData.datasets[0]

    //   return {
    //     title: label || 'N/A',
    //     icon: dataset.icons[idx],
    //     color: dataset.backgroundColor[idx],
    //     value: formatNumber(dataset.data[idx]),
    //     _value: dataset.data[idx],
    //   }
    // }).sort((a,b) => b._value - a._value)

    const topLabels = labels.slice(0, 5)

    // if (labels.length > 5) {
    //   const otherLabels = labels.slice(5)

    //   const othersSum = otherLabels.reduce(
    //     (acc, item) => acc + item._value,
    //     0.0
    //   )
      
    //   topLabels.push({
    //     title: 'Other',
    //     color: '#ddd',
    //     value: percent(othersSum, chartData.total),
    //   })
    // }
    
    return topLabels.sort((a,b) => b._value - a._value)
  }

}

ZoneEnergyConsumption.defaultProps = {
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
}

export default ZoneEnergyConsumption
