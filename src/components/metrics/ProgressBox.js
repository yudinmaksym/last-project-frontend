import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Card, CardBody, Col, ListGroupItem, Progress, Tooltip } from 'shards-react'
import shortid from 'shortid'
import Router from 'next/router'


class ProgresBox extends React.Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = { open: false }
  }

  toggle() {
    this.setState({
      open: !this.state.open,
    })
  }

    handleMissingConsumptionClick = () => {
      Router.push('/projects/missingConsumption')
    }

    render() {
      const {
        variation,
        label,
        value,
        percentage,
        uploaded,
        total,
      } = this.props

      const cardClasses = classNames(
        'stats-small',
        variation && `stats-small--${variation}`
      )

      const cardBodyClasses = classNames(
        variation === '1' ? 'p-0 d-flex' : 'px-0 pb-0'
      )

      const innerWrapperClasses = classNames(
        'd-flex',
        'justify-content-between',
        variation === '1' ? 'flex-column m-auto' : 'px-3'
      )

      const dataFieldClasses = classNames(
        'stats-small__data',
        variation === '1' && 'text-center'
      )

      const progressFieldClass = classNames(
        'stats-small__data',
        'text-right',
        'pt-3'
      )

      const progressBarWrapperClasses = classNames(
        'd-flex',
        'mt-3',
        variation === '1' ? 'flex-column m-auto' : 'px-3'
      )

      const totalWrapperClasses = classNames(
        'd-flex',
        'mt-2',
        // 'float-right',
        variation === '1' ? 'flex-column m-auto' : 'px-3'
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

      const totalFieldClasses = classNames(

      )

      return (
        <Card small className={cardClasses}>
          <CardBody className={cardBodyClasses}>
            <div className={innerWrapperClasses}>
              <div className={dataFieldClasses}>
                <span className={labelClasses}>{label}</span>
                <h6 className={valueClasses}>{percentage}</h6>
              </div>
              <i className="material-icons" id="MissingConsumption"
                style={{ fontSize: 25,paddingRight: 15, cursor:'pointer' }}
                onClick={this.handleMissingConsumptionClick}>layers_clear</i>
              <Tooltip
                open={this.state.open}
                target="#MissingConsumption"
                toggle={this.toggle}
              >
                       Missing Consumption List
              </Tooltip>
            </div>
            <div className={progressBarWrapperClasses}>
              <Progress
                theme="success"
                style={{
                  height: '5px',
                  width: '100%',
                  margin: '0px',
                }}
                value={value}
                className={`m-0 stats-small-${shortid()}`}
              />
            </div>
            <div className={totalWrapperClasses}>
              <div className={totalFieldClasses}>
                <h6 className={valueClasses}>{uploaded}/{total}</h6>
              </div>
            </div>
          </CardBody>
        </Card>
      )
    }
}

ProgresBox.defaultProps = {
  increase: true,
  percentage: 0,
  value: 0,
  uploaded: 0,
  total: 0,
  label: 'Label',
  subLabel: '',
}

export default ProgresBox
