import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { getColor, getSystemColor } from '../../utils/theme'
import colors from '../../utils/colors'


const getOptions = (title = '', categories, series, column) => ({
  chart: { type: column ? 'column' : 'bar' },
  title: {
    text: title,
  },
  xAxis: {
    categories,
  },
  yAxis: {
    min: 0,
    title: {
      text: '',
    },
  },
  tooltip: {
    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
    shared: true,
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: false,
      },
    },
  },
  series,
})

const SavingsPerBuilding = ({ data, title, column }) => {
  console.log(data, '**********************')
  const options = getOptions(
    title,
    data.labels,
    {data: data.datasets},
    column
  )
    
  return (
    <div className='w-100 p-4'>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

export default SavingsPerBuilding
