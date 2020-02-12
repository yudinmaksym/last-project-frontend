import * as React from 'react'
import { connect } from 'react-redux'
import forEach from 'lodash/forEach'
import { 
  Row, 
  Col, 
  Card, 
  CardHeader,
  CardFooter,
  CardBody,
  ButtonGroup, 
  Button,
  ListGroup,
  ListGroupItem,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
} from 'shards-react'

import ManualInputForm from '../forms/ManualInputForm'
import { inputData } from '../../redux/reducers/manual'


class ManualDataInputContainer extends React.Component {

  handleSubmit = (data) => this.props.inputData(data)

  render() {
    return (
      <div className="manual-data-input mb-4">
        <ManualInputForm 
          onSubmit={this.handleSubmit}
        />
      </div>
    )
  }

}

export default connect(
  (state) => ({
    
  }),
  (dispatch) => ({
    inputData: (data) => dispatch(inputData(data)),
  })
)(ManualDataInputContainer)