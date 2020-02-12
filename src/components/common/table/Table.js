import * as React from 'react'
import cn from 'classnames'


const Table = ({ 
  // params
  scrollable,
  maxWidth,
  size,
  // meta
  id,
  className, 
  children, 
  ...rest
}) => (
  <div
    id={id}
    className={cn('tk-table', `tk-table--size_${size}`,{
      'tk-table--scrollable': scrollable,
    })}
    style={{
      maxWidth: scrollable ? maxWidth : 'auto',
    }}
  >
    <div className={cn('tk-table__wrapper')}>
      <table 
        {...rest} 
        className={cn('tk-table__wrapper__table', 'table')}
      >
        {children}
      </table>
    </div>
  </div>
)

Table.defaultProps = {
  scrollable: false,
  size: 'small',
  maxWidth: '100%',
}

export default Table