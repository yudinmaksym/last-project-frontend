import React, { useState, useCallback } from 'react'
import { FormSelect, Form, Button } from 'shards-react'



const fromMonth = new Date(2016, 0)
const toMonth = new Date(2016 + 10, 11)
const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const YearMonthSelect = ({ initialDate, onChange, submitting }) => {
  const [date, setDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth()))
  const years = []
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i)
  }

  const handleChange = useCallback((e) => {
    const { year: { value: year }, month: { value: month } } = e.target.form
    const value = new Date(year, month)
    setDate(value)
    !submitting && onChange(value)
  })

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    onChange(date)
  })

  return (
    <Form className="d-flex justify-content-around" onSubmit={handleSubmit}>
      <FormSelect className="w-auto" name="month" onChange={handleChange} value={date.getMonth()}>
        {months.map((month, i) => (
          <option key={month} value={i}>
            {month}
          </option>
        ))}
      </FormSelect>
      <FormSelect className="w-auto" name="year" onChange={handleChange} value={date.getFullYear()}>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </FormSelect>
      {submitting && <Button type="submit">Load</Button>}
    </Form>
  )
}

export default YearMonthSelect