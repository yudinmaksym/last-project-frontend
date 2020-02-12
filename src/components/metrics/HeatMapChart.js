import React from 'react';
import Highcharts from 'highcharts';
import { Card } from 'shards-react'
import HighchartsReact from 'highcharts-react-official';
import { formatInfluxData } from '../../utils/format'
import HighChart from '../../utils/highCharts'
import colors from '../../utils/colors'

var moment = require("moment")
class HeatMapChart extends React.Component {
    
    formatTenantBaselineData = (tenantBaseline, totalEnergyConsumption) => {
        const startDate = moment().subtract(1, 'year').format('YYYY-MM-DD')
        const endDate = moment().format('YYYY-MM-DD')
        let tenant
        if(tenantBaseline !== undefined) {
            tenant = tenantBaseline[0].data.map(el => {
                return Number(el.value);
            })
        } else {
            tenant = undefined
        }

        let diff = 0
        diff = moment(endDate).diff(startDate, "days");
        
        let generateEnergyWithZero = [];
        for(var i = 0; i <=diff; i++) {
            generateEnergyWithZero.push({
                date: moment(startDate).add(i, "days").format('YYYY-MM-DD'),
                value: 0
            })
        }

        let totalEnergyFilteredData = [];
        formatInfluxData(totalEnergyConsumption).forEach((el) => {
            if(el[0] !== "") {
                const splited = el.split(',');
                totalEnergyFilteredData.push({
                    date: moment(splited[3]).format("YYYY-MM-DD"),
                    value: Number(splited[4])
                })
                
            }
        })
        
        for(let i = 0; i<generateEnergyWithZero.length; i++) {
            for(let j = 0; j<totalEnergyFilteredData.length; j++) {
                if(generateEnergyWithZero[i].date === totalEnergyFilteredData[j].date) {
                    generateEnergyWithZero[i].value = totalEnergyFilteredData[j].value
                }
            }
        }

        let subtractData=[]
        generateEnergyWithZero.forEach((el,index) => {
            if(tenant !== undefined) {
                subtractData.push(Number((el.value - tenant[index]).toFixed(0)));
            } else {
                subtractData.push(Number(el.value.toFixed(0)));
            }
        })
        return subtractData
    }

    formatData = () => {
        const {forecast, energyConsumption, tenantBaseline} = this.props
        const consumption = this.formatTenantBaselineData(tenantBaseline, energyConsumption)
        const data = []

        for(let i = 0; i < forecast.items.length; i++) {
            const startYear = moment(forecast.items[0].date).format("YYYY")
            if(consumption[i] <= 0) {
                data.push({
                    x: Number(moment(forecast.items[i].date).format("M")), 
                    y: Number(moment(forecast.items[i].date).format("D")), 
                    value: null,
                    color: '#ffffff',
                })
            } else {
                if(startYear === moment(forecast.items[i].date).format("YYYY")) {
                    data.push([
                        Number(moment(forecast.items[i].date).format("M")), 
                        Number(moment(forecast.items[i].date).format("D")), 
                        Number( ((1/( consumption[i] / forecast.items[i].value.toFixed(0) )) * 100).toFixed(0) ),
                    ]) 
                } else {
                    data.push([
                        Number(moment(forecast.items[i].date).format("M")) + 12, 
                        Number(moment(forecast.items[i].date).format("D")), 
                        Number( ((1/( consumption[i] / forecast.items[i].value.toFixed(0) )) * 100).toFixed(0) ),
                    ]) 
                }
                
            }
        }
        return data
        
    }

    formatXAxisCategories = () => {
        const {forecast} = this.props
        const categories = [0]
        for(let i = 0; i < forecast.items.length; i++) {
            if(i !== forecast.items.length - 1) {
                const current = forecast.items[i].date
                const next = forecast.items[i+1].date
                if(moment(current).format("YYYY-MM") !== moment(next).format("YYYY-MM")) {
                    categories.push(moment(current).format("MMM"))
                }
            } else {
                categories.push(moment(forecast.items[i].date).format("MMM"))
            }
        }
        return categories
    }
    

    options() {
        const options = {
            chart: {
                type: 'heatmap',
                marginTop: 120,
                marginBottom: 80,
                plotBorderWidth: 0,
                backgroundColor: colors.white.value,
                height: 860,
            },
        
            boost: {
                useGPUTranslations: true
            },
        
            title: {
                text: this.props.title,
            },
        
            xAxis: {
                categories: this.formatXAxisCategories(),
            },
        
            yAxis: {
                title: {
                    text: null
                },
                categories: [
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
                ],
                gridLineColor: colors.white.value
            },
        
            colorAxis: {
                min: 70,
                max: 101,
                minColor: colors.danger.value,
                maxColor: colors.success.value
            },
        
            series: [{
                borderWidth: 1,
                borderColor: colors.white.value,
                backgroundColor: colors.white.value,
                data: this.formatData(),
                dataLabels: {
                    enabled: false,
                    color: colors.black.value,
                }
            }],

            legend: {
                verticalAlign: 'top',
                margin: 120,
            },
            
            tooltip: {
                formatter: function () {
                         return moment(this.series.xAxis.categories[this.point.x], 'MMM').format('MMMM') 
                         + ' ' + moment(this.series.yAxis.categories[this.point.y], 'D').format('Do') + '<br>'
                         + 'Forecast Accuracy <b>' + this.point.value + '</b>';
                    }
            }
        }

        return options
    };

    render() {
        let chart = new HighChart(this.options())
        return (
            <Card>
                <HighchartsReact highcharts={Highcharts} options={chart.initOptions()} />
            </Card>
        )
    }
}

export default HeatMapChart