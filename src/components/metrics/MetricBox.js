import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Card, CardBody } from 'shards-react'


class MetricBox extends React.Component {

  render() {
    const { variation, label, subLabel, value, percentage, increase } = this.props

    const cardClasses = classNames(
      'stats-small',
      variation && `stats-small--${variation}`
    )

    const cardBodyClasses = classNames(
      variation === '1' ? 'p-0 d-flex' : 'px-0 pb-0'
    )

    const innerWrapperClasses = classNames(
      'd-flex',
      variation === '1' ? 'flex-column m-auto' : 'px-3'
    )

    const dataFieldClasses = classNames(
      'stats-small__data-1',
      variation === '1' && 'text-center'
    )

    const labelClasses = classNames(
      'stats-small__label',
      'text-uppercase',
      variation !== '1' && 'mb-1'
    )

    const valueClasses = classNames(
      'stats-small__value',
      'count',
      variation === '1' ? 'my-3' : 'm-0'
    )

    const innerDataFieldClasses = classNames(
      'stats-small__data-1',
      variation !== '1' && 'text-right align-items-center'
    )

    const percentageClasses = classNames(
      'stats-small__percentage',
      `stats-small__percentage--${increase ? 'increase' : 'decrease'}`
    )

    const cardContainerClasses = classNames(
      this.props.className, 
      cardClasses
    )

    return (
      <Card small className={cardContainerClasses}>
        <CardBody className={cardBodyClasses}>
          <div className={innerWrapperClasses}>
            <div className={dataFieldClasses}>
              <span className={labelClasses}>{label}</span>
              <h6 className={valueClasses}>{value}</h6>
            </div>
            {percentage ? (
              <div className={innerDataFieldClasses}>
                <span className={percentageClasses}>{percentage}</span>
              </div>
            ): null}
            <span className={labelClasses}>{subLabel}</span>
          </div>
        </CardBody>
      </Card>
    )
  }
}

MetricBox.defaultProps = {
  increase: true,
  percentage: 0,
  value: 0,
  label: 'Label',
  subLabel: '',
}

export default MetricBox
