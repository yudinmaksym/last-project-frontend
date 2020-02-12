import * as React from 'react'
import cn from 'classnames'


const TableBody = ({
  // meta
  className, 
  children, 
  ...rest
}) => (
  <thead {...rest} className={cn(
    'tk-table__wrapper__table__body', 
    'py-2 bg-light text-semibold',
    className
  )}>
    {children}
  </thead>
)

TableBody.defaultProps = {
 
}

export default TableBody