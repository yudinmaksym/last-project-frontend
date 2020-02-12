import React from 'react'
import cn from 'classnames'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col,
  FormSelect,
} from 'shards-react'

import Link from '../common/Link'
import colors from '../../utils/colors'
import Chart from '../../utils/chart'
import { formatNumber } from '../../utils/format'


const LEVELS_COUNT = 10

class EnergyPerformanceBar extends React.Component {

  renderLevelPoint = (from, to, index, isActive, isFirst, isLast) => (
    <div 
      className={cn(
        'energy-performance-bar__levels__point',
        {
          'energy-performance-bar__levels__point--first': isFirst,
          'energy-performance-bar__levels__point--last': isLast,
        }
      )}
      style={{
        background: isActive && `linear-gradient(to right, ${from}, ${to})`,
      }}
      key={index}
    >
      <div 
        className={cn(
          'energy-performance-bar__levels__point__value',
          {
            'energy-performance-bar__levels__point__value--active': isLast,
          }
        )}
        style={{
          background: isActive && to,
        }}
      >
        {index}
      </div>
      {isLast && (
        <div className="energy-performance-bar__levels__point__tooltip">
          <i className="material-icons">flash_on</i>
          <label>EUI:&nbsp;<b>{this.props.value}</b></label>
        </div>
      )}
    </div>
  )

  renderPoints = () => {
    const l = this.props.levels

    const elems = []

    for (let i=1;i<=l;i++) {
      const currentLevel  = this.props.points[i - 1]
      const nextLevel  = this.props.points[i]
      const isActive = i <= this.props.level//(i <= this.props.level)
      const isFirst = (i === 1)
      const isLast = (i === this.props.level)
      
      elems.push(this.renderLevelPoint(
        currentLevel,
        nextLevel,
        i,
        isActive,
        isFirst,
        isLast
      ))
    }

    return (
      <div className={'energy-performance-bar__levels'}>
        {elems}
      </div>
    )
  }

  render() {
    return (
      <div className={'energy-performance-bar'}>
        <div 
          className={'energy-performance-bar__line'} 
        />
        {this.renderPoints()}
      </div>
    )
  }


}

EnergyPerformanceBar.defaultProps = {
  levels: 10,
  level: 10,
  colors: [
    '#ff0000',
    '#fa5829',
    '#f59646',
    '#c99646',
    '#249845',
  ],
  points: [
    '#ff0a0d',
    '#fe190b',
    '#fc411f',
    '#f96b32',
    '#f79344',
    '#d39646',
    '#ac9746',
    '#849745',
    '#5e9745',
    '#799646',
    '#369845',
  ],
}

export default EnergyPerformanceBar
