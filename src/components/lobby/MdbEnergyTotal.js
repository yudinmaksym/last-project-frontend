import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


class MdbEnergyTotal extends React.Component {
    constructor(props) {
        super(props);

        Highcharts.setOptions({lang: {thousandsSep: ','}})
    }

    options() {
        const options = {
            chart: {
                height: 282,
                type: 'column'
            },
            title: {
                text: '',
            },
            xAxis: {
                ...this.props.xAxis,
                categories: this.props.categories,
            },
            yAxis: this.props.yAxis,
            plotOptions: this.props.barChartStyle,
            legend: this.props.legend,
            series: [
                {   
                    data: this.props.totalEnergyData,
                    ...this.props.energyAdjustedTenant,
                },
                {
                    data: this.props.tenantBaselineData,
                    name: "Daily Baseline",
                    ...this.props.totalConsumptionBaseline
                },
                {
                    data: this.props.dailyForecastData,
                    name: `Daily ${this.props.dailyForecastLegendTitle}`,
                    ...this.props.dailyForecastConsumption
                },
            ]
        }

        return options
    }

    render() {
        return (
            <div>
                <div className="[ chart-container ]" style={{paddingTop: 10}}>
                    <h4 className="lobby_stats-item_title pl-3">{this.props.title}</h4>
                    <HighchartsReact highcharts={Highcharts} options={this.options()} />
                </div>
            </div>
        )
    }
}

MdbEnergyTotal.defaultProps = {
    title: 'ENERGY TOTAL (kWh)',
    seriesBarChart: {
        name: 'Electricity',
        data: [10, 20, 30, 40, 50, 60],
        color: '#a1d3ff',
    },
    xAxis: {
        crosshair: true,
        labels: {
            style: {
                color:'#9EAABD',
            }
        }
    },
    yAxis: {
        title: {
            text: '',
        },
        gridLineColor: 'rgba(158,170,189,0.5)',
        gridLineDashStyle: 'longdash',
        tickPixelInterval: 25,
        minRange: 0,
        endOnTick: false,
        min: 0,
        labels: {
            style: {
                color:'#9EAABD',
            }
        }
    },
    seriesLineChart: {
        name: 'Water',
        type: 'spline',
        data: [10, 20, 30, 40, 50, 60],
        dashStyle: 'ShortDash',
        color: 'red',
        marker: false
    },
    barChartStyle: {
        column: {
            pointPadding: 0.1,
            borderWidth: 0,
            borderRadius: 7,
            groupPadding: 0,
        }
    },
    legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        itemStyle: {"color": "#3b5173", "cursor": "pointer", "fontSize": "14px", "fontWeight": "500", "textOverflow": "ellipsis"}
    },
    energyAdjustedTenant: {
        name: 'Actual Energy',
        color: '#a1d3ff',
    },
    totalConsumptionBaseline: {
        dashStyle: 'ShortDash',
        type: 'spline',
        color: 'black',
        marker: false,
    },
    dailyForecastConsumption: {
        dashStyle: 'ShortDash',
        type: 'spline',
        color: 'red',
        marker: false
    }
}

export default MdbEnergyTotal;