import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


const SavingsPerBuilding = props => {
    const options = {
        chart: {
            height: 282,
            type: 'column'
        },
        title: {
            text: '',
        },
        xAxis: {
            categories: props.categories,
            ...props.xAxis
        },
        yAxis: props.yAxis,
        legend: props.legend,
        tooltip: props.tooltip,
        plotOptions: {
            column: props.columnStyle,
            stacking: 'normal'
        },
        series: [{
            name: props.chartName,
            data: props.buildingSavesData,
            color: props.color,
            negativeColor: '#FF0000'
        }]
    }
    
    return (
        <div>
            <div className="[ chart-container ]" style={{paddingTop: 10}}>
                <h4 className="lobby_stats-item_title pl-3">{props.title}</h4>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
        </div>
    )
}

SavingsPerBuilding.defaultProps = {
    title: 'Building Savings (kWh)',
    buildingSavesData: [50, -50, -50, -50, -50],
    chartName: 'Energy',
    color: '#A1D3FF',
    columnStyle: {
        pointPadding: 0.1,
        borderWidth: 0,
        borderRadius: 7,
        groupPadding: 0,
    },
    tooltip: {
        // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        //     '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        // footerFormat: '</table>',
        // shared: true,
        // useHTML: true
    },
    categories: [
        '20 Aug',
        '21 Aug',
        '22 Aug',
        '23 Aug',
        '24 Aug',
    ],
    yAxis: {
        title: {
            text: ''
        },
        gridLineColor: 'rgba(158,170,189,0.5)',
        gridLineDashStyle: 'longdash',
        labels: {
            style: {
                color:'#9EAABD',
            }
        }
    },
    xAxis: {
        crosshair: true,
        labels: {
            style: {
                color:'#9EAABD',
            }
        }
    },
    legend: {
        enabled: false
    }
}

export default SavingsPerBuilding;
