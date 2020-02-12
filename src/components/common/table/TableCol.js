import * as React from 'react'
import cn from 'classnames'


const Col = ({ 
  // params
  fixed,
  width,
  // meta
  className, 
  children, 
  ...rest
}) => (
  <td 
    {...rest} 
    className={cn(
      'tk-table__wrapper__table__body__column', className,
    )}
    style={{
      width: fixed ? width : 'auto',
      minWidth: fixed ? width : 'auto',
    }}
  >
    {children}
  </td>
)


const TableCol = (props) => {
  return (
    <>
      {props.fixed && (
        <Col 
          {...props} 
          key={`${props.key}_clone`}
          className={cn(
            'tk-table__wrapper__table__body__column--fixed',
            'tk-table__wrapper__table__body__column--clone'
          )}
        />
      )}
      <Col {...props} />
    </>
  )
}

TableCol.defaultProps = {
  fixed: false,
}

export default TableCol