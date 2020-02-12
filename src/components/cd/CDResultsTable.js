import * as React from 'react'
import {
  Container,
} from 'shards-react'
import cn from 'classnames'

import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
  TableRow,
  TableCol,
} from '../../components/common/table'


const EMPTY_CHAR = '–'

const getYearColumns = (total) => {
  const columns = []

  for (let i=0;i<=total;i++) {
    columns.push(i)
  }

  return columns
}

const calcTotal = (values = []) => values.reduce((a,b) => a+b, 0)

const getDataRowColumnValue = (data, r, c) => {
  return data && data[r] ? (
    data[r][c] || EMPTY_CHAR
  ) : EMPTY_CHAR
}

const CDResultsTable = ({ years, labels, data }) => {
  const yearColumns = getYearColumns(years)
  return (
    <Container fluid className="px-0">
      <Table id="cd" scrollable>
        <TableHeader>
          <TableRow>
            <TableHeaderCol 
              fixed
              empty
              width={226}
            />
            {yearColumns.map(_year => (
              <TableHeaderCol 
                key={`year_${_year}`}
                className="text-right"
              >{'Y'}{_year}</TableHeaderCol>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {labels.map((label, _rowIndex) => (
            <TableRow 
              key={`row_${_rowIndex}`} 
              className={cn({
                'results': _rowIndex === (labels.length - 1),
              })}
            >
              <TableCol 
                fixed
                width={226}
              >{label}</TableCol>
              {yearColumns.map((_year, _columnIndex) => (
                <TableCol 
                  key={`column_${_rowIndex}_${_columnIndex}`}
                  className="text-right"
                >
                  {getDataRowColumnValue(data, _rowIndex, _columnIndex)}
                </TableCol>
              ))}
            </TableRow> 
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}

CDResultsTable.defaultProps = {
  years: 0,
  labels: [
    'Annual Savings on Customers Bill',
    '% savings accrued to Customer',
    'Customer Gross Savings',
    'Customer Investment',
    'Savings Insurance',
    'Customer CapEx Payment',
    'Customer OpEx Payment',
    'Customer Cash Flow',
    'Customer Profit',
  ],
  data: [
    [0, 879351,879351,967286,1064014,1170416,1287457,1416203,1557823,1713606,1884966],
    [100,30,30,30,30,30,30,30,100,100,100],
    [0, 263805,263805,290186,319204,351125,386237,424861,1557823,1713606,1884966],
    [200727,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [200727,263805,263805,290186,319204,351125,386237,424861,1557823,1713606,1884966],
    [200727,63078,326883,617069,936273,1287398,1673635,2098496,3656319,5369925,7254891],
  ],
}

export default CDResultsTable
