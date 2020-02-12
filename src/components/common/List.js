import * as React from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Button,
  FormSelect,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Card,
  CardBody,
} from 'shards-react'


export default class List extends React.Component {

    static defaultProps = {
      idKey: null,
    }

    hasMore = () => this.props.loaded


    loadMore = () => {

    }

    getKey = (item, index) => {
      return this.props.idKey ? item[this.props.idKey] : index
    }

    renderItem = (item, index) => {

      return (
        <div 
          key={this.getKey(item, index)}
          className="line"
        >
          {this.props.columns.map((_column) => (
            <div 
              className="column"
              key={_column.accessor}
              style={{
                width: _column.width || 'auto',
                minWidth: _column.minWidth,
              }}
            >
              {_column.Header}
            </div>
          ))}
        </div>
      )
    }

    renderItems = () => (
      <React.Fragment>
        {this.props.items.map(this.renderItem)}
      </React.Fragment>
    )

    renderHeader = () => (
      <React.Fragment>
        {this.props.columns.map((_column) => (
          <div 
            className="column"
            key={_column.accessor}
            style={{
              width: _column.width || 'auto',
              minWidth: _column.minWidth,
            }}
          >
            {_column.Header}
          </div>
        ))}
      </React.Fragment>
    )

    render() {
      return (
        <div
          className={'list'}
        >
          <div className="header">
            {this.renderHeader()}
          </div>

          <InfiniteScroll
            className="rows"
          >
            {this.renderItems()}
          </InfiniteScroll>
        </div>
      )
    }
} 