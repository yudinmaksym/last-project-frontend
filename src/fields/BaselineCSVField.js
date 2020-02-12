import * as React from 'react'
import { Field } from 'redux-form'
import {
  Badge,
} from 'shards-react'
import cn from 'classnames'
import papaParse from 'papaparse'
import Dropzone from 'react-dropzone'


const extractValue = (item, attr) => {
  let val = item[attr]

  return parseFloat(
    val.replace(/[^\d\.\-]/g, '')
  )
}

export default class BaselineCSVField extends React.Component {
    state = {
      file: null,
      csvData: null,
      fileErr: null,
    }

    formatData = (data) => {
      console.log(data)

      const baselineValues = []

      data.forEach((item) => {
        const month = item['Month']
        delete item['Month']

        Object.keys(item).forEach(topic => {
          topic = topic.trim()
          const value = extractValue(item, topic)

          baselineValues.push({
            topic,
            month,
            value,
            source: 'csv',
          })
        })
      })
      
      return baselineValues
    }

    handleParserComplete = (result) => {
      const formattedData = this.formatData(result.data)
      
      this.props.input.onChange(formattedData)
    }

    handleFileDrop = (files) => {
      const [file] = files
      if(file){
        this.setState({ file })
      }

      papaParse.parse(files[0], {
        header: true,
        complete: this.handleParserComplete,
      })
    }

    getTopics = () => {
      const topics = []
        
      this.props.input.value.forEach(({ topic }) => {
        if (topics.indexOf(topic) === -1) {
          topics.push(topic)
        }
      })

      return topics
    }

    render() {
      const {
        input: { value, onChange, onBlur },
      } = this.props

      if (value) {
        return (
          <div className="user-details__tags p-4">
            {this.getTopics().map((tag, idx) => (
              <Badge
                pill
                theme="light"
                className="text-light text-uppercase mb-2 border mr-1"
                key={idx}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )
      }

      return (
        <div className="file-manager__dropzone">
          <Dropzone onDrop={this.handleFileDrop}>
            {({ getRootProps, getInputProps, isDragActive }) => {
              return (
                <div
                  {...getRootProps()}
                  className={cn('dropzone', {
                    'dropzone--isActive': isDragActive,
                  })}
                >
                  <input {...getInputProps()} />
                  <span>
                    {isDragActive
                      ? 'Drop files here!'
                      : 'Drop files here to upload'}
                  </span>
                </div>
              )
            }}
          </Dropzone>
        </div>
      )
    }
}