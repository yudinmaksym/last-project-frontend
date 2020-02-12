import React from 'react';
import { Card } from 'shards-react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighChart from '../../utils/highCharts';

const StackedBarChart = props => {

    const options = {
        title: {
          text: props.title,
        },
        chart: {
            type: 'column'
        },
        xAxis: {
            categories: props.categories
        },
        yAxis: props.yAxis,
        plotOptions: {
            column: {
              stacking: 'value'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
        },
        series: props.data
    };
    let chart = new HighChart(options)
    return (
        <Card>
            <HighchartsReact highcharts={Highcharts} options={chart.initOptions()} />
        </Card>
    )
}

StackedBarChart.defaultProps = {
    title: '',
    yAxis: {
        title: {
            text: 'kWh',
        },
    },
    legend: {
        enabled: true,
    },
}

export default StackedBarChart;