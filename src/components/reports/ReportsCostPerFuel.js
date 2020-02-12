import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
} from 'shards-react'

import colors from '../../utils/colors'
import Chart from '../../utils/chart'
import { formatNumber } from '../../utils/format'
import DateRangeFilter from '../charts/DateRangeFilter'

function percent(total = 1, ready = 1) {
  return +(parseFloat((total / (ready + 1))  * 100).toFixed(0));
}

class ReportsCostPerFuel extends React.Component {
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
    const chartConfig = {
      type: 'doughnut',
      options: {
        ...{
          responsive: false,
          animation: false,
          legend: false,
          cutoutPercentage: 80,
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
        },
        ...this.props.chartOptions,
      },
      data: this.props.chartData,
    }

    if (update) {
      this.chart.options = chartConfig.options
      this.chart.data = {
        ...this.props.chartData,
      }

      this.chart.update()
      return 
    }

    this.chart = new Chart(this.canvasRef.current, chartConfig)
  }

  render() {
    const { title, subTitle } = this.props
    const labels = this.getParsedLabels()

    return (
      <Card small className="ubd-stats">
        <CardHeader className="border-bottom">
          <Row>
            <Col>
              <h6 className="m-0">{title}</h6>
              <h6 className="m-0">{subTitle}</h6>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="d-flex flex-column pt-2 pb-2">
          <Row form> 
            <Col md="12" lg="12" >
              {/* Chart */}
              <canvas
                ref={this.canvasRef}
                width="120px"
                height="120px"
                // className="m-4"
                // className="p-2"
                style={{ 
                  maxWidth: '100% !important',
                  margin: '0px auto',
                  'margin-top': '6mm',
                  'margin-bottom': '4mm',
                }}
              />

              {/* Legend */}
              <div className="ubd-stats__legend w-100 m-auto">
                {labels.map((label, idx) => (
                  <div key={idx} className="ubd-stats__item">
                    {/* {label.icon && (
                  <div
                    dangerouslySetInnerHTML={{ __html: label.icon }}
                    style={{ color: label.iconColor }}
                  />
                )} */}
                    <span className="ubd-stats__category">{label.title}</span>
                    <span className="ubd-stats__value">{label.value}%</span>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    )
  }

  getParsedLabels() {
    const { chartData } = this.props

    if (!chartData || typeof chartData.labels === 'undefined') {
      return []
    }

    return chartData.labels.map((label, idx) => {
      const dataset = chartData.datasets[0]
      
      return {
        title: label,
        iconColor: dataset.backgroundColor[idx],
        value: percent(dataset.data[idx], chartData.total),
      }
    })
  }
}

ReportsCostPerFuel.defaultProps = {
  title: 'Cost Per Fuel',
  chartConfig: Object.create(null),
  chartOptions: Object.create(null),
  chartData: {
    labels: ['Desktop', 'Tablet', 'Mobile'],
    datasets: [
      {
        hoverBorderColor: colors.white.toRGBA(1),
        data: [68.3, 24.2, 7.5],
        icons: [
          '<i class="material-icons">&#xE30B;</i>',
          '<i class="material-icons">&#xE32F;</i>',
          '<i class="material-icons">&#xE325;</i>',
        ],
        backgroundColor: [
          colors.primary.toRGBA(0.9),
          colors.primary.toRGBA(0.5),
          colors.primary.toRGBA(0.3),
        ],
      },
    ],
  },
}

export default ReportsCostPerFuel
