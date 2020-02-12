import React from 'react';
import Highcharts from 'highcharts';
import highchartsXrange from "highcharts/modules/xrange";
import HighchartsReact from 'highcharts-react-official';

if (typeof Highcharts === 'object') {
    highchartsXrange(Highcharts)
}

class RunStsChart extends React.Component {
    constructor(props) {
        super(props);
    }

    options() {
        const options = {
            chart: {
                type: 'xrange',
            },
            title: null,
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                categories: this.props.categories,
                reversed: true,
                title: null,
            },
            series: [{
                turboThreshold: 5000,
                pointWidth: 30,
                minPointLength: 7,
                borderRadius: 0,
                data: this.props.data,
            }],
            dataLabels: {
                enabled: true
            }
        }

        return options
    }

    render() {
        return (
            <div>
                <div className="[ chart-container ]">
                    <p className="[ chart-title ] pl-3 mb-1 pt-3">{this.props.title}</p>
                    <div className="[ chart_custom-legend ] d-flex align-items-center px-3">
                        <div className="mr-4">
                            <div className="mr-2" style={{width: 30, height: 11, backgroundColor: '#FF0000', display: 'inline-block'}}></div>
                            {this.props.end}
                        </div>
                        <div>
                            <div className="mr-2" style={{width: 30, height: 11, backgroundColor: '#00FF00', display: 'inline-block'}}></div>
                            {this.props.start}
                        </div>
                    </div>
                    <HighchartsReact highcharts={Highcharts} options={this.options()} />
                    {/* <div className="d-flex justify-content-around">
                        <div className="text-center">
                            <h4 className="mb-1">190</h4>
                            <p className="mb-1">EXPECTED RUN</p>
                        </div>
                        <div className="text-center">
                            <h4 className="mb-1">200.2</h4>
                            <p className="mb-1">RUN HOURS</p>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}

RunStsChart.defaultProps = {
    start: "RUN",
    end: "OFF",
    title: 'RUN STS',
    xAxis: {
        crosshair: true,
        labels: {
            style: {
                color:'#9EAABD',
            }
        },
        
        categories: [
            'CH-xx',
            'CH-xx',
            'CH-xx',
            'CH-xx',
        ],
    },
    yAxis: {
        title: {
            text: '',
        },
        gridLineColor: 'rgba(158,170,189,0.5)',
        gridLineDashStyle: 'longdash',
        endOnTick: false,
        labels: {
            style: {
                color:'#9EAABD',
            }
        },
        categories: [
            'Nov 10,2017',
            'Nov 11,2017',
            'Nov 12,2017',
            'Nov 13,2017',
        ],
    },
    barChartStyle: {
        series: {
            stacking: 'normal',
        },
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
    off: {
        color: 'black',
        marker: false
    },
    run: {
        color: 'red',
        marker: false
    }
}

export default RunStsChart;