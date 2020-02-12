import * as React from 'react'
import cn from 'classnames'


const TableBody = ({
  // meta
  className, 
  children, 
  ...rest
}) => (
  <tbody {...rest} className={cn(
    'tk-table__wrapper__table__body', className
  )}>
    {children}
  </tbody>
)

TableBody.defaultProps = {
 
}

export default TableBody