import React, { useState, useEffect }  from 'react'
import classNames from 'classnames'
import {
  Popover, 
  PopoverBody,
} from 'shards-react'

import SystemIcon from '../../shared/SystemIcon'


const InfoLabel = ({ 
  label,
  icon,
  unit,
  className,
  ...attrs 
}) => {
  const classes = classNames(
    className,
  )

  return (
    <span {...attrs} className={classes}>
      {icon && (
        <>
          <SystemIcon name={icon} />
          &nbsp;
        </>
      )}
      {label}
      {' '}{
        unit && (
          <small><b>({unit})</b></small>)
      }
    </span>
  )
}

InfoLabel.defaultProps = {
  label: 'N/A',
}

export default InfoLabel

