import React from 'react'
import cn from 'classnames'

import { ICONS } from '../types/meta'


export { 
  TYPES
} from '../types/meta' 

const DEFAULT_FUEL = 'General'

const SystemIcon = ({ name, className, style }) => {
  const icon = ICONS[name] || ICONS[DEFAULT_FUEL]
  return (
    <>
      <i 
        className={cn(className, icon)}
        style={style}
      >&nbsp;</i>
    </>
  )
}

SystemIcon.defaultProps = {
  name: DEFAULT_FUEL,
}
 
export default SystemIcon
