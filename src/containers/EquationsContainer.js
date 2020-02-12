import * as React from 'react'
import { connect } from 'react-redux'
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
  CardHeader,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ListGroup,
  ListGroupItem,
} from 'shards-react'

import {
  getSiteEquation,
} from '../../redux/reducers/equations'
import EquationForm from '../forms/equation/EquationForm'


class EquationsContainer extends React.Component {
  
  render() {
    const { 
      equations,
    } = this.props

    return (
      <div> 
        <EquationForm />

        {/* <ListGroup small flush className="list-group-small">
          <ListGroupItem className="d-flex px-0">
            <Col md="2">
              <b>Header</b>
            </Col>
            <Col md="1">
              <b>Equal</b>
            </Col>
            <Col md="9">
              <b>Expression</b>
            </Col>
          </ListGroupItem>

          {equations.map((equation, idx) => (
            <ListGroupItem key={idx} className="d-flex px-0">
              <Col md="2">
                <Button size="sm" theme="primary" outline className="mb-2 mr-1">
                  {equation.equationName}
                </Button>
              </Col>
              <Col md="1">
                <Button size="sm" theme="light" className="mb-2 mr-1">
                  =
                </Button>
              </Col>
              <Col md="9">
                {equation.equationVariables.map((variable, _idx) => (
                  <Button size="sm" theme="primary" outline className="mb-2 mr-1" key={_idx}>
                    {variable}
                  </Button>
                ))}
              </Col>
            </ListGroupItem>
          ))}
        </ListGroup> */}
      </div>
    )
  }
}


export default connect(
  (state) => ({
    equations: getSiteEquation(state),
  }),
  (dispatch) => ({
   
  })
)(EquationsContainer) 