import React, { useState, useCallback, useEffect } from 'react'
import { FormInput } from 'shards-react'
import moment from 'moment'

import DatePicker from '../components/daily/General/DatePicker'


const onClick = (e) => e.stopPropagation()

const DateRangePickerTableHeader = ({ onChange, title, values, timeout = 1000 }) => {
  const [pickerValue, setPickerValue] = useState('')
  useEffect(() => {
    if(values.startDate && values.endDate) {
        setPickerValue(`${moment(values.startDate).format("MMM YY")} - ${moment(values.endDate).format("MMM YY")}`)
    } else {
      setPickerValue('')
    }
  }, [values])
  const handleApply = useCallback((startDate, endDate) => {
    setTimeout(
      () => onChange(moment(startDate).startOf('month').format("YYYY-MM-DD"), moment(endDate).startOf('month').format("YYYY-MM-DD")),
      timeout
    )
  }, [pickerValue])

  const handleKeyDown = useCallback((e) => {
    e.stopPropagation()
    e.persist()
    if(e.keyCode == 8 || e.keyCode == 46) {
      onChange(void 0, void 0)
    }
  }, [])
  return (
    <div 
      className='d-flex flex-column align-items-center justify-content-center h-100 table-header' 
      style={{ whiteSpace: 'normal' }}
    >
      <span className='mb-0'>{title}</span>
      <div onClick={onClick}>
        <DatePicker onApply={handleApply}>
            <FormInput value={pickerValue} readonly={true} onKeyDown={handleKeyDown}/>
        </DatePicker>
      </div>
    </div>
  )
}

export default DateRangePickerTableHeader