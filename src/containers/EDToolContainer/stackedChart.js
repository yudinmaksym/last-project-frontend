import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { getColor, getSystemColor } from '../../utils/theme'


const getOptions = (title = '', categories, series) => ({
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
    column: {
      stacking: 'normal',
    },
  },
  series,
})

const SavingsPerBuilding = ({ stackedBars, scatters, title, fuel }) => {
  const { categories, series } = stackedBars.reduce((acc, { title, ...rest }) => {
    acc.categories.push(title)
    Object.entries(rest).forEach(([k, v]) => {
      const existedGroup = acc.series.find(({ name }) => name == k)
      if(existedGroup) {
        return existedGroup.data.push(+v.toFixed(2))
      }
      acc.series.push({ name: k, data: [+v.toFixed(2)], type: 'column' })
    })
    return acc
  }, { categories: [], series: [] })
  series.push({
    type: 'line',
    name: 'Baseline',
    color: getSystemColor(fuel).toRGBA(1),
    data: scatters.map(({ originalValue }) => +originalValue.toFixed(2)),
    marker: {
      radius: 4,
    },
  })
  const options = getOptions(title, categories, series)

  return (
    <div className="w-100">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

export default SavingsPerBuilding
