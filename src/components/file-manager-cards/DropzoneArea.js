import React from 'react'
import cn from 'classnames'
import Dropzone from 'react-dropzone'
import { Row } from 'shards-react'


class DropzoneArea extends React.Component {
  render() {
    return (
      <Row noGutters>
        <div className={
          cn(this.props.className, 'w-100')
        }>
          <Dropzone onDrop={this.props.onDrop}>
            {({ getRootProps, getInputProps, isDragActive }) => {
              return (
                <div
                  {...getRootProps()}
                  className={cn('dropzone', {
                    'dropzone--isActive': isDragActive,
                  })}
                >
                  <input {...getInputProps()} />
                  <p className="m-0">
                    {isDragActive
                      ? 'Drop files here...'
                      : 'Try dropping some files here, or click to select files to upload.'}
                  </p>
                </div>
              )
            }}
          </Dropzone>
        </div>
      </Row>
    )
  }
}

export default DropzoneArea
