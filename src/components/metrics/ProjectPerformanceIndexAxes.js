import React from 'react'
import { Card } from 'shards-react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighChart from '../../utils/highCharts'

const ProjectPerformanceIndexAxes = props => {

    const options = {
        title: {
          text: props.title,
        },
        xAxis: {
            categories: [0, ...props.categories],
        },
        series: [{
            name: 'index',
            data: props.data,
            dashStyle: 'ShortDash',
            marker: false,
        }],
        legend: {
            enabled: false
        },
        yAxis: props.yAxis,
    };

    let chart = new HighChart(options)
    
    return (
        <Card>
            <HighchartsReact highcharts={Highcharts} options={chart.initOptions()} />
        </Card>
    )
}

ProjectPerformanceIndexAxes.defaultProps = {
    title: 'PROJECT PERFORMANCE INDEX (kWh)',
    yAxis: {
        title: {
            text: 'kWh'
        },
    }
}

export default ProjectPerformanceIndexAxes;