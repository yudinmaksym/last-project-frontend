import React from 'react'
import {connect} from 'react-redux'
import { Row } from 'shards-react'
import ReactTable from 'react-table'
import {formatInfluxData} from '../../utils/format'

var moment = require('moment')

class AlarmTable extends React.Component {

  formatDataForTable = () => {
    let data = []

    formatInfluxData(this.props.data).map(el => {
      const splited = el.split(',')
      data.push({
        project: splited[9],
        class: splited[5],
        time: moment(splited[4]).format("MM-DD-YYYY hh:mm"),
        equip: splited[6],
        measurement: splited[3],
        pointName: splited[7],
        priority: splited[8],
        value: Number(splited[10]),
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
        Header: 'Class',
        accessor: 'class',
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
        Header: 'Point Name',
        accessor: 'pointName',
      },
      {
        Header: 'Priority',
        accessor: 'priority',
      },
      {
        Header: 'Value',
        accessor: 'value',
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

export default connect(
  (state) => ({
  }),
  (dispatch) => ({
  })
)(AlarmTable)
