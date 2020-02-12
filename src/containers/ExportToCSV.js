import React,{ useState } from 'react'
import {
  Button,
  Tooltip,
} from 'shards-react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { connect } from 'react-redux'

import { getExportAll, getExportItems } from '../../redux/reducers/tables'


const ExportCSV = ({ fileName, getExportAll, reportItems }) => {
  const [open, setOpen] = useState(false)
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const toggle=()=> {
    setOpen(!open)
  }

  const exportFunction = () => {
    getExportAll().then((data) => {
      exportToCSV(data.items, fileName)
    })
  }

  const exportToCSV = (reportItems, fileName) => {
    const ws = XLSX.utils.json_to_sheet(reportItems)
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  return (
    <div>
      <i id="TooltipExport" style={{ fontSize:25,cursor:'pointer' }} className="fas fa-file-export"
        onClick={exportFunction}></i>
      <Tooltip
        open={open}
        target="#TooltipExport"
        toggle={toggle}
      >
         Export table
      </Tooltip>
    </div>

  )
}

export default connect(
  (state) => ({
    reportItems: getExportItems(state),
  }),
  (dispatch) => ({
    getExportAll: () =>
      dispatch(getExportAll()),

  })
)(ExportCSV)
