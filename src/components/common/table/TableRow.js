import * as React from 'react'
import cn from 'classnames'


const Row = ({ 
  // params
  fixed,
  width,
  // meta
  className, 
  children, 
  ...rest
}) => (
  <tr 
    {...rest} 
    className={cn(
      'tk-table__wrapper__table__body__row', className,
    )}
    style={{
      width: fixed ? width : 'auto',
      minWidth: fixed ? width : 'auto',
    }}
  >
    {children}
  </tr>
)

const TableRow = (props) => {
  return (
    <>
      {props.fixed && (
        <Row 
          {...props} 
          key={`${props.key}_clone`}
          className={cn(
            'tk-table__wrapper__table__body__row--fixed',
            'tk-table__wrapper__table__body__row--clone'
          )}
        />
      )}
      <Row {...props} />
    </>
  )
}

TableRow.defaultProps = {
  fixed: false,
}

export default TableRow