import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsHeatMap from "highcharts/modules/heatmap"
import HighchartsExportData from 'highcharts/modules/export-data'
import Sankey from 'highcharts/modules/sankey'
import Organization from 'highcharts/modules/organization'
import colors from './colors'

var _ = require('lodash');

if (typeof Highcharts === 'object') {
    HighchartsExportData(Highcharts)
    HighchartsExporting(Highcharts)
    HighchartsHeatMap(Highcharts)
    Sankey(Highcharts)
    Organization(Highcharts)
}

const defaultOptions = {
    plotOptions: {
        column: {
            pointPadding: 0.1,
            borderWidth: 0,
            borderRadius: 7,
            groupPadding: 0,
        },
        series: {
            // colorAxis: 10,
            negativeColor: colors.danger.value,
        },
        organization: {
            borderColor: '#ffffff',
            linkColor: 'red',
            linkLineWidth: 1,
        },
        stacking: 'normal',
        turboThreshold: 6000,
    },
    colors: [colors.primary.value, "#434348", "#90ed7d", "#f7a35c", 
        "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"],
    categories: [],
    tooltip: {
        shared: true,
    },
    title: {
        align: "left",
        y: 15,
        x: 7,
    },
    yAxis: {
        gridLineColor: colors.gray500.toRGBA(0.7),
        gridLineDashStyle: 'longdash',
        labels: {
            style: {
                color: colors.gray700.value,
            }
        }
    },
    xAxis: {
        crosshair: true,
        labels: {
            style: {
                color: colors.gray700.value,
            }
        }
    },
    lang: {
        thousandsSep: ','
    }
}

export default class HighChart {
    constructor(options) {
        this.options = options
    }

    initOptions() {
        return _.merge(this.options, defaultOptions)
    }
}