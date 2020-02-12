import * as React from 'react'
import { connect } from 'react-redux'

import { 
  getFiles,
  updateFile,
  removeFile,
} from '../../redux/reducers/upload'
import FileType from '../fields/FileType'


class FilesContainer extends React.Component {

    handleTypeUpdate = (file) => (type) => {
      this.props.updateFile(file, { type })
    }

    handleFileRemove = (file) => () => {
      this.props.removeFile(file)
    }

    renderFile = (file) => (
      <li key={file.uid}>
        <p>
          <span>
            {file.name}
          </span>
          <button 
            type='button'
            onClick={this.handleFileRemove(file)}
          >
                    x
          </button>
        </p>
        {'   '}
        <FileType
          id={file.uid}
          type={file.type}
          onChange={this.handleTypeUpdate(file)}
        />
      </li>
    )

    renderFiles = () => (
      <ul>
        {this.props.files.map(this.renderFile)}
      </ul>
    )

    render() {
      const { files } = this.props

      return (
        <div>
          {this.renderFiles()}
        </div>
      )
    }

}


export default connect(
  (state) => ({
    files: getFiles(state),
  }),
  (dispatch) => ({
    updateFile: (file, data) => dispatch(updateFile(file, data)),
    removeFile: (file) => dispatch(removeFile(file)),
  })
)(FilesContainer)