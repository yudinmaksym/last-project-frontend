import React from 'react';
import Highcharts from 'highcharts';

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



class SyncChart extends React.Component {
    componentDidMount() {
        ["mousemove", "touchmove", "touchstart"].forEach(function(eventType) {
            if(document) {
                document
                    .getElementById("sync-container")
                    .addEventListener(eventType, function(e) {
                    var chart, point, i, event;
            
                    for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                        chart = Highcharts.charts[i];
                        if (chart) {
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

    render() {
        return (
            <div id="sync-container">
                {this.props.children}
            </div>
        )
    }
}

export default SyncChart;