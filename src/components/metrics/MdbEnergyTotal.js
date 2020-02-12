import React from 'react';
import { Card } from 'shards-react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighChart from '../../utils/highCharts';

if (typeof Highcharts === 'object') {
    (function(H) {
        H.Pointer.prototype.reset = function() {
          return undefined;
        };
        /**
         * Highlight a point by showing tooltip, setting hover state and draw crosshair
         */
        H.Point.prototype.highlight = function(event) {
          event = this.series.chart.pointer.normalize(event);
          this.onMouseOver(); // Show the hover marker
          this.series.chart.tooltip.refresh(this); // Show the tooltip
          this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
        };
      
        H.syncExtremes = function(e) {
          var thisChart = this.chart;
      
          if (e.trigger !== "syncExtremes") {
            // Prevent feedback loop
            Highcharts.each(Highcharts.charts, function(chart) {
              if (chart && chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) {
                  // It is null while updating
                  chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
                    trigger: "syncExtremes"
                  });
                }
              }
            });
          }
        };
    })(Highcharts);
}



class MdbEnergyTotal extends React.Component {
    componentDidMount() {
        ["mousemove", "touchmove", "touchstart"].forEach(function(eventType) {
            if(document) {
                document
                    .getElementById("sync-container")
                    .addEventListener(eventType, function(e) {
                    var chart, point, i, event;
            
                    for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                        chart = Highcharts.charts[i];
                        if (chart && chart.title.textStr === "TEMPERATURE") {
                        // Find coordinates within the chart
                            event = chart.pointer.normalize(e);
                        // Get the hovered point
                        chart.series.forEach(series => {
                            const point = series.searchPoint(event, true);
                            if (point) {
                              try {
                                point.highlight(e);
                              } catch (err) {
                                // pass;
                              }
                            }
                          });
                        }
                    }
                });
            }
        });
      }

    options() {
        let options = {
            chart: {
                type: 'column',
                marginLeft: 50
            },
            title: {
                text: this.props.title,
            },
            xAxis: [{
                categories: this.props.categories,
                events: {
                    setExtremes: function(e) {
                      Highcharts.syncExtremes(e);
                    }
                }
            }],
            yAxis: {
                title: {
                    text: ''
                },
            },
            legend: this.props.legend,
            series: this.props.data
        }

        return options
    }

    optionsSecond() {
        let options = {
            chart: {
                height: 200,
                marginLeft: 50
            },
            title: {
              text: "TEMPERATURE",
              align: 'left'
            },
            yAxis: {
                title: {
                    text: '',
                },
            },
            xAxis: {
                type: 'datetime',
                endOnTick: true,
                categories: this.props.categories,
                events: {
                    setExtremes: function(e) {
                      Highcharts.syncExtremes(e);
                    }
                  }
            },
            legend: {
                enabled: true
            },
            series: this.props.sync,
        }

        return options
    }

    render() {
        let firstChart = new HighChart(this.options())
        let secondChart = new HighChart(this.optionsSecond())
        return (
            <Card id="sync-container">
                <HighchartsReact constructorType={"chart"} highcharts={Highcharts} options={firstChart.initOptions()} />
                {this.props.sync && <HighchartsReact constructorType={"chart"} highcharts={Highcharts} options={secondChart.initOptions()} />}
            </Card>
        )
    }
}

MdbEnergyTotal.defaultProps = {
    title: 'PROJECT ENERGY TOTAL (kWh)',
    yAxis: {
        title: {
            text: 'kWh',
        },
    },
    legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        itemStyle: {"color": "#3b5173", "cursor": "pointer", "fontSize": "14px", "fontWeight": "500", "textOverflow": "ellipsis"}
    },
}

export default MdbEnergyTotal;