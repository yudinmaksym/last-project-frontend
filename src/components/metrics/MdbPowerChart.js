import React from 'react'
import { Card } from 'shards-react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighChart from '../../utils/highCharts'


class MdbPowerChart extends React.Component {
    options = () => {
        return {
            title: {
                text: this.props.title,
            },
            yAxis: this.props.yAxis,
            xAxis: {
                // categories: props.categories,
                type: 'datetime',
                endOnTick: true,
                ...this.props.xAxis
            },
            plotOptions: this.props.plotOptions,
            legend: this.props.legend,
            series: this.props.data,
        }
    }

    render() {
        let chart = new HighChart(this.options())
        return (
            <Card> 
                <HighchartsReact highcharts={Highcharts} options={chart.initOptions()} />
            </Card>
        )
    }
}

MdbPowerChart.defaultProps = {
    title: 'MDB POWER (kW)',
    yAxis: {
        title: {
            text: '',
        },
    },
    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            color: undefined,
        },
    },
    legend: {
        enabled: true,
    },
}

export default MdbPowerChart;