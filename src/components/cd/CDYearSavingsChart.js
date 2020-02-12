import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
} from 'shards-react'

import Chart from '../../utils/chart'
import colors from '../../utils/colors'
import { getColor, getSystemColor } from '../../utils/theme'
import { formatNumber } from '../../utils/format'


class CDYearSavingsChart extends React.Component {
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
              scaleLabel: {
                display: true,
                labelString: 'Years',
                fontColor: getColor(0, 3).toHex(),
                fontStyle: 'bold',
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
              scaleLabel: {
                display: true,
                labelString: 'AED',
                fontColor: getColor(0, 3).toHex(),
                fontStyle: 'bold',
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

    return (
      <Card small className="mb-4">
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
            height="80"
            ref={this.canvasRef}
            style={{ 
              maxWidth: '100% !important',
              maxHeigth: '80px !important',
            }}
            className="sales-overview-sales-report"
          />
        </CardBody>
      </Card>
    )
  }
}

CDYearSavingsChart.defaultProps = {
  title: 'Savings (AED)',
  subTitle: 'By Years',
  chartData: {
    labels: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
    ],
    datasets: [
      {
        label: 'Customer Cash Flow',
        fill: true,
        type: 'bar',
        data: [
          200727,
          263805,
          263805,
          290186,
          319204,
          351125,
          386237,
          424861,
          1557823,
          1713606,
          1884966,
        ],
        backgroundColor: colors.primary.toRGBA(0.1),
        borderColor: colors.primary.toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: colors.primary.toRGBA(1),
      },
      {
        label: 'Customer Profit',
        fill: false,
        type: 'line',
        data: [
          200727,
          63078,
          326883,
          617069,
          936273,
          1287398,
          1673635,
          2098496,
          3656319,
          5369925,
          7254891,
        ],
        backgroundColor: colors.salmon.toRGBA(0.1),
        borderColor: colors.salmon.toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: colors.salmon.toRGBA(1),
        borderWidth: 1.5,
      },
    ],
  },
}

export default CDYearSavingsChart
