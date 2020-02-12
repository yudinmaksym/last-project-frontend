import * as React from 'react'
import cn from 'classnames'


const Col = ({
  // params
  fixed,
  empty,
  width,
  // meta
  className, 
  children, 
  ...rest
}) => (
  <td
    {...rest}
    className={cn(
      'tk-table__wrapper__table__header__column', className
    )}
    style={{
      width: fixed ? width : 'auto',
      minWidth: fixed ? width : 'auto',
    }}
  >
    {empty ? (
      <>&nbsp;</>
    ):(
      children
    )}
  </td>
)

const TableHeaderCol = (props) => {
  return (
    <>
      {props.fixed && (
        <Col 
          {...props} 
          key={`${props.key}_clone`}
          className={cn(
            'tk-table__wrapper__table__header__column--fixed',
            'tk-table__wrapper__table__header__column--clone'
          )}
        />
      )}
      <Col {...props} />
    </>
  )
}

TableHeaderCol.defaultProps = {
  fixed: false,
  empty: false,
}

export default TableHeaderCol