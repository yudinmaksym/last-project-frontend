import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  FormCheckbox,
} from 'shards-react'

import colors from '../../utils/colors'
import Chart from '../../utils/chart'
import { formatNumber } from '../../utils/format'
import DateRangeFilter from '../charts/DateRangeFilter'


function percent(total = 1, ready = 1) {
  return +(parseFloat((total / (ready+1))  * 100).toFixed(0))
}

class ConsumptionByZonePie extends React.Component {
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
    const { chartData } = this.props
    const chartConfig = {
      type: 'doughnut',
      options: {
        ...{
          legend: false,
          cutoutPercentage: 80,
          tooltips: {
            enabled: false,
            mode: 'index',
            position: 'nearest',
            callbacks: {
              label: function(tooltipItem, data) {
                const { datasetIndex, index } = tooltipItem
                const color = data.datasets[datasetIndex].backgroundColor[index]
                const title = data.labels[index] || ''
                const value = percent(data.datasets[datasetIndex].data[index],chartData.total)
                
                return (
                  `
                  <span>
                    <b style="color: ${color}; font-weight: bolder;">${title}</b>: ${value}%
                  </span>
                  `
                )
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

  getParsedLabels() {
    const { chartData } = this.props

    if (!chartData || typeof chartData.labels === 'undefined') {
      return []
    }

    const labels = chartData.labels.map((label, idx) => {
      const dataset = chartData.datasets[0]

      return {
        title: label || 'N/A',
        icon: dataset.icons[idx],
        color: dataset.backgroundColor[idx],
        value: formatNumber(dataset.data[idx]),
        _value: dataset.data[idx],
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
        value: percent(othersSum, chartData.total),
      })
    }
    
    return topLabels.sort((a,b) => b._value - a._value)
  }

  render() {
    const { title, subTitle } = this.props
    const labels = this.getParsedLabels()

    return (
      <Card small className="ubd-stats h-100 country-stats">
        <CardHeader className="border-bottom">
          <Row>
            <Col>
              <h6 className="m-0">{title}</h6>
              <h6 className="m-0">{subTitle}</h6>
            </Col>
          </Row>
          <Row>
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
            <Col>
              {/* <DateRangeFilter 
                value={this.props.range}
                onChange={this.props.onRangeChange}
                fromBeginning
              /> */}
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="d-flex flex-column p-0">
          {/* Chart */}
          <canvas
            id="chart-2"
            width="100"
            ref={this.canvasRef}
            className="analytics-users-by-device mt-3 mb-4"
          />

          {/* Legend */}
          <table className="table m-0">
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
                    />
                    <b>{label.title}</b>
                  </td>
                  <td className="text-right">{label.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    )
  }

  // getParsedLabels() {
  //   const { chartData } = this.props

  //   if (!chartData || typeof chartData.labels === 'undefined') {
  //     return []
  //   }

  //   return chartData.labels.map((label, idx) => {
  //     const dataset = chartData.datasets[0]

  //     return {
  //       title: label,
  //       icon: dataset.icons[idx],
  //       iconColor: dataset.backgroundColor[idx],
  //       value: percent(dataset.data[idx], chartData.total),
  //     }
  //   })
  // }
}

ConsumptionByZonePie.defaultProps = {
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

export default ConsumptionByZonePie
