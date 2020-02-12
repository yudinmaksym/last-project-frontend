import React from 'react';
import { Card } from 'shards-react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighChart from '../../utils/highCharts';

const EnergyConsPieChart = props => {

    var options = {
        chart: {
            type: 'pie'
        },
        title: {
            text: props.title,
        },
        plotOptions: {
            series: {
                dataLabels: props.dataLabels,
            },
            pie: props.pie
        },
        legend: props.legend,
        tooltip: props.tooltip,
        series: [
            {
                name: props.name,
                colorByPoint: true,
                data: props.data
            }
        ],
    };

    let chart = new HighChart(options)

    return (
        <Card>
            <HighchartsReact highcharts={Highcharts} options={chart.initOptions()} />
        </Card>
    )
}

EnergyConsPieChart.defaultProps = {
    pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        showInLegend: true
    },
    dataLabels: {
        enabled: true,
        formatter: function() {
            if (this.point.y >= 1000000000) {
                return (this.point.y / 1000000000).toFixed(2).replace(/\.0$/, '') + 'G';
            }
            if (this.point.y >= 1000000) {
                return (this.point.y / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
            }
            if (this.point.y >= 1000) {
                return (this.point.y / 1000).toFixed(2).replace(/\.0$/, '') + 'K';
            }
            return '<p style={{color: #3a5173}}>' + this.point.y + '</p>';
        },
        padding: -7,
        verticalAlign: 'top',
        align: "left",
        style: {
            color: '#3b5173',
            fontWeight: 500,
            fontSize: '0.8rem',
        }
    },
    legend: {
        align: 'left',
        verticalAlign: 'top',
        x: 0,
        y: 0,
        itemStyle: {"color": "#3b5173", "cursor": "pointer", "fontSize": "14px", "fontWeight": "500", "textOverflow": "ellipsis"}
    },
    tooltip: {
        headerFormat: '<span style="font-size:11px"></span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
    },
}

export default EnergyConsPieChart;