import React from 'react'
import { Card } from 'shards-react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighChart from '../../utils/highCharts'

class OrganizationChart extends React.Component {

    options() {
        const options = {
            chart: {
                inverted: false,
                height: '70%'
            },
            title: {
                text: this.props.title
            },
            series: [{
                type: 'organization',
                name: '',
                keys: ['from', 'to'],
                data: this.props.data.data,
                hangingIndent: 60,
                levels: [{
                    level: 0,
                    color: 'silver',
                }, {
                    level: 1,
                    color: 'orange',
                }, {
                    level: 2,
                    color: '#419dc0'
                }],
                nodes: this.props.data.nodes,
                colorByPoint: false,
                color: '#007ad0',
                nodeWidth: '30%'
            }],
            tooltip: {
                outside: true
            },
            exporting: {
                allowHTML: true,
                sourceWidth: 1000,
                sourceHeight: 800
            }
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

OrganizationChart.defaultProps = {
    title: 'EQUIP STRUCTURE',
}

export default OrganizationChart;