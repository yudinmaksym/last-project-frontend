import React from 'react'
import classNames from 'classnames'
import { Col } from 'shards-react'


const PageTitle = ({ 
  title, month, subtitle, className, 
  xs,
  sm,
  ...attrs 
}) => {
  const classes = classNames(
    className,
    'text-center',
    'text-md-left',
    'mb-sm-0'
  )

  return (
    <Col xs={xs} sm={sm} className={classes} { ...attrs }>
      <h3 className="page-title">{title}</h3>
      { month && <span style= {{ fontSize:20, color:'#757e8d' }} className="mT-5">{month}<br/></span> }
      <span className="text-uppercase page-subtitle">{subtitle}</span>
    </Col>
  )
}

export default PageTitle
