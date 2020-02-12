import React from 'react';
import { Card } from 'shards-react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import colors from '../../utils/colors'
import HighChart from '../../utils/highCharts';

class SummaryEnergyConsumptionToBaseline extends React.Component {
    options() {

        const options = {
            chart: {
                type: 'column'
            },
            title: {
                text: this.props.title,
            },
            xAxis: {
                categories: this.props.categories,
            },
            yAxis: this.props.yAxis,
            plotOptions: this.props.barChartStyle,
            legend: this.props.legend,
            series: this.props.data
        }

        return options
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

SummaryEnergyConsumptionToBaseline.defaultProps = {
    title: 'MDB ENERGY TOTAL (kWh)',
    legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        itemStyle: {
            "color": colors.fiordBlue.value, 
            "cursor": "pointer", 
            "fontSize": "14px", 
            "fontWeight": "500", 
            "textOverflow": "ellipsis"
        },
        
    },
}

export default SummaryEnergyConsumptionToBaseline;