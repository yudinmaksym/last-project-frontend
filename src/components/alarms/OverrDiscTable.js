import React from 'react'
import { Row } from 'shards-react'
import ReactTable from 'react-table'
import {formatInfluxData} from '../../utils/format'

var moment = require('moment')

class OverrDiscTable extends React.Component {

  formatDataForTable = () => {
    let data = []

    formatInfluxData(this.props.data).map(el => {
      const splited = el.split(',')
      data.push({
        project: splited[6],
        time: moment(splited[3]).format("MM-DD-YYYY hh:mm"),
        equip: splited[5],
        measurement: splited[4],
        tower: splited[7]
      })
    })

    return data
  }

  getColumns() {
    return [
      {
        Header: 'Project',
        accessor: 'project',
      },
      {
        Header: 'Time',
        accessor: 'time',
      },
      {
        Header: 'Equipment',
        accessor: 'equip',
      },
      {
        Header: 'Measurement',
        accessor: 'measurement',
      },
      {
        Header: 'Tower',
        accessor: 'tower'
      }
    ]
  }

  render() {

    const columns = this.getColumns()

    return(
      <div>
        <Row className="mt-3">
          <ReactTable
            style={{flex: 1}}
            columns={columns}
            defaultSorted={[
              {
                id: "project",
                desc: false
              }
            ]}
            showPagination={true}
            resizable={true}
            data={this.formatDataForTable()}
          />
        </Row>
      </div>
    )
  }
}

export default OverrDiscTable
