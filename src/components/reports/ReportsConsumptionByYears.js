import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Card, CardHeader, CardBody, Button } from 'shards-react'

import { formatNumber } from '../../utils/format'
import Chart from '../../utils/chart'


class ConsumptionByYears extends React.Component {
  constructor(props) {
    super(props)

    this.canvasRef = React.createRef()
    // this.legendRef = React.createRef()
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
        responsive: false,
        animation: false,
        legend: {
          position: 'top',
        },
        // elements: {
        //   line: {
        //     // A higher value makes the line look skewed at this ratio.
        //     tension: 0.3,
        //   },
        //   point: {
        //     radius: 0,
        //   },
        // },
        scales: {
          xAxes: [
            {
              gridLines: false,
              // ticks: {
              //   callback(tick, index) {
              //     // Jump every 7 values on the X axis labels to avoid clutter.
              //     return index % 7 !== 0 ? '' : tick
              //   },
              // },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: function(label, index, labels) {
                  return formatNumber(label)
                },
              },
            },
          ],
        },
        hover: {
          mode: 'nearest',
          intersect: false,
        },
        tooltips: {
          custom: false,
          mode: 'nearest',
          intersect: false,
        },
      },
      ...this.props.chartOptions,
    }

    if (update) {
      this.chart.options = chartOptions
      this.chart.data = this.props.chartData
  
      this.chart.update()
      // Generate the analytics overview chart labels.
      // this.legendRef.current.innerHTML = this.chart.generateLegend()
      return 
    } 

    const chart = new Chart(this.canvasRef.current, {
      type: 'LineWithLine',
      data: this.props.chartData,
      options: chartOptions,
    })


    this.chart = chart

    if (!this.props.chartData.length) {
      return
    }

    // They can still be triggered on hover.
    const buoMeta = chart.getDatasetMeta(0)
    buoMeta.data[0]._model.radius = 0
    buoMeta.data[
      this.props.chartData.datasets[0].data.length - 1
    ]._model.radius = 0

    // Render the chart.
    chart.render()
  }

  render() {
    const { title, subTitle } = this.props
    const { initialValues, onOptionsChange } = this.props
    return (
      <Card small>
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
          <h6 className="m-0">{subTitle}</h6>
        </CardHeader>
        <CardBody className="pt-0">
          <Row form> 
            <Col md="12" lg="12" className="pt-4">
              {/* <div ref={this.legendRef} /> */}
              <canvas
                ref={this.canvasRef}
                style={{ 
                  maxWidth: '100% !important',
                }}
                width="680px"
                height="208px"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    )
  }
}

ConsumptionByYears.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The chart dataset.
   */
  chartData: PropTypes.object,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object,
}

ConsumptionByYears.defaultProps = {
  title: 'Users Overview',
  chartData: {
    labels: Array.from(new Array(30), (_, i) => (i === 0 ? 1 : i)),
    datasets: [
      {
        label: 'Current Month',
        fill: 'start',
        data: [
          500,
          800,
          320,
          180,
          240,
          320,
          230,
          650,
          590,
          1200,
          750,
          940,
          1420,
          1200,
          960,
          1450,
          1820,
          2800,
          2102,
          1920,
          3920,
          3202,
          3140,
          2800,
          3200,
          3200,
          3400,
          2910,
          3100,
          4250,
        ],
        backgroundColor: 'rgba(0,123,255,0.1)',
        borderColor: 'rgba(0,123,255,1)',
        pointBackgroundColor: '#ffffff',
        pointHoverBackgroundColor: 'rgb(0,123,255)',
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 3,
      },
      {
        label: 'Past Month',
        fill: 'start',
        data: [
          380,
          430,
          120,
          230,
          410,
          740,
          472,
          219,
          391,
          229,
          400,
          203,
          301,
          380,
          291,
          620,
          700,
          300,
          630,
          402,
          320,
          380,
          289,
          410,
          300,
          530,
          630,
          720,
          780,
          1200,
        ],
        backgroundColor: 'rgba(255,65,105,0.1)',
        borderColor: 'rgba(255,65,105,1)',
        pointBackgroundColor: '#ffffff',
        pointHoverBackgroundColor: 'rgba(255,65,105,1)',
        borderDash: [3, 3],
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 2,
        pointBorderColor: 'rgba(255,65,105,1)',
      },
    ],
  },
}

export default ConsumptionByYears
