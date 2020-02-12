import * as React from 'react'
import { Field } from 'redux-form'
import cn from 'classnames'
import {
  Row, 
  Col, 
  Button, 
  Card, 
  CardBody, 
  CardFooter,
} from 'shards-react'

import agent from '../../agent'
import DropzoneArea from '../components/file-manager-cards/DropzoneArea'
import SectionTitle from '../components/file-manager-cards/SectionTitle'


export default class FilesField extends React.Component {

    state = {
      loading: false,
      filesToUpload: 0,
    }
    
    startLoading = () => this.setState({ loading: true })
    finishLoading = () => this.setState({ loading: false })

    _uploadFile = (file) => {
      return agent.Upload.getSignedUrl(file.name, file.type)
        .then((res) => agent.Upload.putFile(res.url, res.key, file))
    }

    isSelected = (field) => this.props.activeField === field

    handleSelect = (selectedField, index) => () => {
      if (this.isSelected(selectedField)) {
        selectedField = null
      }
      
      let key
      if (selectedField) {
        key = this.props.fields.get(index)
      }

      this.props.onSelect && this.props.onSelect(selectedField, key)
    }

    handleDrop = async (files) => {
      this.startLoading()
      this.setState({ filesToUpload: files.length })

      let uploadedFiles = []
      try {
        uploadedFiles = await Promise.all(files.map(this._uploadFile))
      } catch(err) {
        console.error(err)
      }

      uploadedFiles.forEach((file) => {
        agent.Files.ready(file.key)
          .then(this.handleFileReady)
      })
    }

    handleFileReady = (f) => {
      this.props.fields.push({
        key: f.s3_key,
        file_name: f.file_name,
        valid: f.ocr_validation_status,
        invoices: [ 
          ...f.invoices,
        ],
      })

      this.setState(prevState => ({ filesToUpload: prevState.filesToUpload - 1 }))
    }

    renderSrcField = (field) => (
      <h6 className="upload-manager__files__item-name">{field.input.value}</h6>
    )

    renderValidField = (field) => (
      !!field.input.value && (
        <span className="upload-manager__files__item-valid ml-auto">
          <i className="material-icons">
            done_all
          </i>
        </span>
      )
    )
    
    renderFile = (member, index, fields, meta) => (
      <Card
        small
        className={meta.classes}
        onMouseDown={this.handleSelect(member, index)}
      >
        <CardFooter>
          <span className="upload-manager__files__item-icon">
            <i className="material-icons">&#xE24D;</i>
          </span>
          <Field
            name={`${member}.file_name`}
            type="text"
            component={this.renderSrcField}
          />
          <Field
            name={`${member}.valid`}
            component={this.renderValidField}
          />
        </CardFooter>
      </Card>
    )

    renderFileOld = (member, index, fields, className) => (
      <li key={index}>
        <Field
          name={`${member}.name`}
          type="text"
          component={this.renderSrcField}
        />
    
        {'       '}
        <span>
          {TYPES.map(type => (
            <label key={type}>
              <Field name={`${member}.type`} component="input" type="radio" value={type}/> {type}
            </label>
          ))}
        </span>

        {'      '}
        <button
          type="button"
          title="Remove Member"
          onClick={() => fields.remove(index)}
        >x</button>
      </li>
    )

    render() {
      return (
        <div className="upload-manager__files">
          <Row form >
            <Col className="mb-3">
              <DropzoneArea 
                className="upload-manager__files__dropzone"
                onDrop={this.handleDrop}
              />
            </Col>
          </Row>
        
          {(this.state.filesToUpload > 0) && (
            <Row>
              <Col className="mb-3">
                <strong className="text-muted d-block mb-2">Uploading files...</strong>
              </Col>
            </Row>
          )}
                
          {(this.props.fields && this.props.fields.length > 0) && (
            <React.Fragment>
              <SectionTitle title="Uploaded Files" />
                    
              <Row>
                {this.props.fields.map((field, index) => {
                  const selected = this.isSelected(field)

                  const classes = cn(
                    'mb-4',
                    'upload-manager__files__item',
                    selected && 'upload-manager__files__item--selected'
                  )

                  return (
                    <Col lg="4" sm="6" key={index}>
                      {this.renderFile(
                        field, 
                        index, 
                        this.props.fields, 
                        {
                          classes,
                          selected,
                        }
                      )}
                    </Col>
                  )
                })}
              </Row>      
            </React.Fragment>
          )}    
        </div>
      )
    }
}