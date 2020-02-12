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
import {
  submit,
  change,
  arrayRemove,
  isPristine,
  isInvalid,
  isSubmitting,
  formValueSelector,
} from 'redux-form'

import { publish, extractFields } from '../../redux/reducers/upload'
import UploadForm, { FORM_KEY as UPLOAD_FORM_KEY } from '../forms/UploadForm'
import { FORM_KEY as ATTR_FORM_KEY } from '../forms/FileFieldsForm'
import ConfirmationModal from '../modals/ConfirmationModal'

import FileValuesEditorContainer from './FileValuesEditorContainer'


class UploadContainer extends React.Component {
  state = {
    field: '',
  };

  getActiveFileField = () => this.state.field;

  handlePublish = data => {
    return this.props.publish(data)
  }

  handleFileChoose = async (field, file) => {
    if (file) {
      if (!file.valid) {
        await this.getFileFields(field, file)
      }
    }

    this.setState({ field })
  };

  getFileFields = (formField, file) => {
    return this.props.extractFields(formField, {
      key: file.key,
    })
  };

  getValues = () => {
    return this.props.form
  };

  handleTabChange = (member, val) => {};

  handleValuesSubmit = data => {
    const { invoices } = data
    const activeField = this.getActiveFileField()

    this.props.changeUploadField(`${activeField}.invoices`, invoices)
    this.props.changeUploadField(`${activeField}.valid`, true)

    this.handleFileChoose(null)
  };

  handleRemove = file => {
    const index = file.replace('files[', '').replace(']', '')

    this.props.removeFile(index)
    this.handleFileChoose(null)
  };

  handleUploadSubmit = () => {
    this.props.startSubmit()
  };

  render() {
    return (
      <>
        <Card className="upload-manager mb-4">
          <CardHeader className="border-bottom">
            <Row form className="p-0">
              <Col>
                <h6 className="form-text m-0">Upload Form</h6>
              </Col>
            </Row>
          </CardHeader>

          <CardBody className="p-0 mt-4">
            <UploadForm
              onSelect={this.handleFileChoose}
              activeField={this.state.field}
              projectId={this.props.projectId}
              onSubmit={this.handlePublish}
            />

            {/* inner form */}
            {this.state.field && (
              <Row form className="mx-4">
                <Col className="mb-3">
                  <FileValuesEditorContainer
                    field={this.state.field}
                    onSubmit={this.handleValuesSubmit}
                    onRemove={this.handleRemove}
                  />
                </Col>
              </Row>
            )}
            {/* /inner form */}
          </CardBody>

          <CardFooter className="border-top">
            <div className="ml-auto d-table">
              <Button
                theme="accent"
                type="submit"
                disabled={
                  this.props.pristine
                  || this.props.submitting
                }
                onClick={this.handleUploadSubmit}
              >
                <i className="material-icons">publish</i>
                &nbsp;
                {this.props.submitting ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </CardFooter>
        </Card>
        <ConfirmationModal 
          title={'Information'}
          showCancel={false}
        />
      </>
    )
  }
}

const selector = formValueSelector(UPLOAD_FORM_KEY)

export default connect(
  state => ({
    pristine: isPristine(UPLOAD_FORM_KEY)(state),
    invalid: isInvalid(UPLOAD_FORM_KEY)(state),
    submitting: isSubmitting(UPLOAD_FORM_KEY)(state),
    projectId: selector(state, 'projectId'),
  }),
  dispatch => ({
    startSubmit: () => dispatch(submit(UPLOAD_FORM_KEY)),
    publish: data => dispatch(publish(data)),
    removeFile: member =>
      dispatch(arrayRemove(UPLOAD_FORM_KEY, 'files', member)),
    extractFields: (formField, data) =>
      dispatch(extractFields(formField, data)),
    changeUploadField: (field, value) =>
      dispatch(change(UPLOAD_FORM_KEY, field, value)),
    changeAttributeField: (field, value) =>
      dispatch(change(ATTR_FORM_KEY, field, value)),
  })
)(UploadContainer)
