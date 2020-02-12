import * as React from 'react'
import Dropzone from 'react-dropzone'


const FileDropzone = (props) => (
  <Dropzone onDrop={props.onDrop}>
    {({ getRootProps, getInputProps }) => (
      <section>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <span>Drag 'n' drop some files here, or click to select files</span>
        </div>
      </section>
    )}
  </Dropzone>
)

FileDropzone.defaultProps = {
  accept: 'application/pdf',
}

export default FileDropzone