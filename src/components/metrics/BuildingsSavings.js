import React from 'react'
import { Card } from 'shards-react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighChart from '../../utils/highCharts'

const BuildingsSavings = props => {
    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: props.title,
        },
        xAxis: {
            categories: props.categories,
        },
        series: [{
            name: 'Energy',
            data: props.buildingSavesData,
        }],
        legend: {
            enabled: false
        },
        yAxis: props.yAxis,
    }

    let chart = new HighChart(options)
    
    return (
        <Card>
            <HighchartsReact highcharts={Highcharts} options={chart.initOptions()} />
        </Card>
    )
}

BuildingsSavings.defaultProps = {
    title: 'BUILDING SAVINGS (kWh)',
    yAxis: {
        title: {
            text: 'kWh'
        },
    }
}

export default BuildingsSavings;
