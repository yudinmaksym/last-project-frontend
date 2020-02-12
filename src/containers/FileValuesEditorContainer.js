import * as React from 'react'
import { connect } from 'react-redux'
import {
  initialize, 
  formValueSelector, 
} from 'redux-form'
import { 
  Row, 
  Col, 
  Card, 
  CardHeader,
  CardBody,
  ButtonGroup, 
  Button,
} from 'shards-react'


import FileFieldsForm, { FORM_KEY as ATTRIBUTES_FORM_KEY } from '../forms/FileFieldsForm'
import { FORM_KEY as UPLOAD_FORM_KEY } from '../forms/UploadForm'


class FileValuesEditorContainer extends React.Component {
  
  static defaultProps = {
    ignoredKeys: ['name', 'selected', 'key', 'type'],
  }

  UNSAFE_componentWillMount() {
    if (this.props.file && this.props.file.valid) {
      this.reinitialize(this.props.file)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.field !== this.props.field) {
      if (nextProps.file && nextProps.file.valid) {
        this.reinitialize(nextProps.file)
      }
    }
  }

  reinitialize(file) {
    const data = {
      invoices: [
        ...file.invoices,
      ],
    }
    
    this.props.reinitialize(data)
  }

  handleRemove = () => {
    this.props.onRemove(this.props.field)
  }

  render() {
    const {
      file,
      onSubmit,
    } = this.props

    return (
      <FileFieldsForm 
        onSubmit={onSubmit}
        onRemove={this.handleRemove}
      />
    )
  }
    
}

const fileDateSelector = formValueSelector(UPLOAD_FORM_KEY)

export default connect(
  (state, ownProps) => ({
    file: fileDateSelector(state, `${ownProps.field}`), 
  }),
  (dispatch) => ({
    reset: () => dispatch(reset(ATTRIBUTES_FORM_KEY)),
    reinitialize: (data) => dispatch(initialize(ATTRIBUTES_FORM_KEY, data)),
  })
)(FileValuesEditorContainer)