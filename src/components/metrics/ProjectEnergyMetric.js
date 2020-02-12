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
  FormCheckbox,
} from 'shards-react'

import { formatNumber } from '../../utils/format'
import Chart from '../../utils/chart'


class ConsumptionByZone extends React.Component {
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
                return formatNumber(label)
              },
            },
          ],
          yAxes: [
            {
              beginAtZero: true,
              stacked: true,
              ticks: {
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
      this.chart.options = chartOptions
      this.chart.data = this.props.chartData

      return this.chart.update()
    } 

    const SalesReportChart = new Chart(this.canvasRef.current, {
      type: 'bar',
      data: this.props.chartData,
      options: chartOptions,
    })

    this.chart = SalesReportChart

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
      <Card small className='h-100'>
        <CardHeader className="border-bottom">
          <Row>
            <Col>
              <h6 className="m-0">{title}</h6>
              <h6 className="m-0">{subTitle}</h6>
            </Col>
            <Col className="">
              <fieldset className="d-inline-flex float-right">
                <FormCheckbox 
                  className="d-inline-flex"
                  toggle 
                  small 
                  onChange={this.props.onTypeChange}
                >
                  {this.props.type}
                </FormCheckbox>
              </fieldset>          
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="pt-0">
          <br />
          <br />
          <canvas
            height="260"
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
