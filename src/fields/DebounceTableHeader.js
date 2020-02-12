import * as React from 'react'
import { DebounceInput } from 'react-debounce-input'
import { FormInput } from 'shards-react'


const TableHeader = ({ debounceOptions, title }) => {
  const onClick = (e) => e.stopPropagation()
  const { name, onFilterChange, timeout, values } = debounceOptions || {}
  return (
    <div 
      className='d-flex flex-column align-items-center justify-content-center h-100 table-header' 
      style={{ whiteSpace: 'normal' }}
    >
      <span className='mb-0'>{title}</span>
      {debounceOptions && <DebounceInput
        onClick={onClick}
        debounceTimeout={timeout}
        name={name}
        value={values[name]}
        element={FormInput}
        onChange={onFilterChange}/>}
    </div>
  )
}

export default TableHeader