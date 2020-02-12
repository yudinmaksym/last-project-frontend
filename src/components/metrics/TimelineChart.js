import React from 'react';
import { Card } from 'shards-react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighChart from '../../utils/highCharts';

const TimelineChart = props => {

    const options = {
        chart: {
            height: props.height
        },
        title: {
          text: props.title,
        },
        yAxis: props.yAxis,
        xAxis: {
            type: 'datetime',
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

TimelineChart.defaultProps = {
    height: null,
    legend: {
        enabled: true,
    },
}

export default TimelineChart;