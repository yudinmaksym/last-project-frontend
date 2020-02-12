import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { getColor, getSystemColor } from '../../utils/theme'
import colors from '../../utils/colors'


const getOptions = (title = '', categories, series) => ({
  chart: { type: 'column',  height: '200px' },
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
        enabled: true,
      },
    },
  },
  series,
})

const SavingsPerBuilding = ({ data, title, fuel }) => {
  const options = getOptions(
    title,
    data.labels,
    data.datasets.map(item => ({
      ...item,
      color: getSystemColor(fuel).toRGBA(1),
    }))
  )
    
  return (
    <div className='w-100 p-4'>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

export default SavingsPerBuilding
