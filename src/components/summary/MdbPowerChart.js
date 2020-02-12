import React from 'react';
import { Card } from 'shards-react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import colors from '../../utils/colors'
import HighChart from '../../utils/highCharts';

if (typeof Highcharts === 'object') {
    Highcharts.setOptions({lang: {thousandsSep: ','}})
}

const MdbPowerChart = props => {

    const options = {
        title: {
          text: props.title,
        },
        yAxis: props.yAxis,
        xAxis: {
            type: 'datetime',
            endOnTick: true,
        },
        legend: props.legend,
        series: props.data,
    };
    let chart = new HighChart(options)
    return (
        <Card>
            <HighchartsReact highcharts={Highcharts} options={chart.initOptions()} />
        </Card>
    )
}

MdbPowerChart.defaultProps = {
    title: 'Chart',
    legend: {
        enabled: false
    },
}

export default MdbPowerChart;