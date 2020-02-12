import React, { Component, Fragment } from 'react';
import { Table } from 'react-bootstrap';

export default class DataTable extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  // render function
  render() {
    const compdata = [...this.props.csvData];

    console.log('this is data', compdata);

    const headerData = compdata[0];
    const tableData = compdata;
    tableData.shift();

    console.log('this is data', compdata);
    console.log('header data', headerData);
    // var tableData = this.tableCe

    return (
      <>
        {headerData ? (
          <Table striped bordered hover responsive style={{ fontSize: '14px' }}>
            <thead>
              <tr>
                <th>#</th>
                {headerData.map(item => (
                  <th key={item}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i.toString()}>
                  <td>{i}</td>
                  {row.map((el, i) => (
                    <td key={i.toString()}>{el}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <h4>Loading</h4>
        )}
      </>
    );
  }
}
