import React from 'react';
import Highcharts from 'highcharts';
import highchartsHeatMap from "highcharts/modules/heatmap";
import HighchartsReact from 'highcharts-react-official';
import colors from '../../utils/colors'

var moment = require("moment")

if (typeof Highcharts === 'object') {
    highchartsHeatMap(Highcharts)
}

class HeatMap extends React.Component {

    options() {
        const options = {
            chart: {
                type: 'heatmap',
                marginTop: 70,
                marginBottom: 80,
                plotBorderWidth: 0,
                backgroundColor: colors.white.value,
                height: 860,
            },
        
            boost: {
                useGPUTranslations: true
            },
        
            title: null,
        
            xAxis: {
                categories: this.props.xAxisCategories,
            },
        
            yAxis: {
                title: {
                    text: null
                },
                categories: this.props.yAxisCategories
            },
        
            colorAxis: {
                min: this.props.min,
                max: this.props.max,
                minColor: this.props.minColor,
                maxColor: this.props.maxColor
            },
        
            series: [{
                borderWidth: 1,
                borderColor: colors.white.value,
                backgroundColor: colors.white.value,
                data: this.props.data,
                dataLabels: {
                    enabled: false,
                    color: colors.black.value,
                },
                turboThreshold: 5000
            }],

            legend: {
                verticalAlign: 'top',
                margin: 120,
            },
            
            tooltip: this.props.tooltip
        }

        return options
    };

    render() {
        return (
            <div>
                <div className="[ chart-container ]">
                    <p className="[ chart-title ] pl-3 mb-1 pt-3">{this.props.title}</p>   
                    <HighchartsReact highcharts={Highcharts} options={this.options()} />
                </div>
            </div>
        )
    }
}

HeatMap.defaultProps = {
    min: 0,
    max: 500,
    minColor: colors.success.value,
    maxColor: colors.danger.value,
    tooltip: {
        formatter: function () {
            return `${this.series.yAxis.categories[this.point.y]}` + '<br>'
            + ' ' + this.series.xAxis.categories[this.point.x] + ':00:00' + '<br>'
            + '<b>' + this.point.value + '</b>';
       }
    }
}

export default HeatMap