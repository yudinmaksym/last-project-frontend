import React, { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import cn from 'classnames'
import { compact } from 'lodash'

import agent from '../../agent'


const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
}

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
}

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
}

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
}


const SilpleFileField = ({ onChange, value = '', name, meta }) => {
  const upload = useCallback((file) => {
    return agent.Upload.getSignedUrl(file.name, file.type)
      .then((res) => agent.Upload.putFile(res.url, res.key, file)
        .then(data => ({ ...data, url: res.url })))})

  const [files, setFiles] = useState(compact(value.split(', ')).map(url => ({ url })))
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: async (acceptedFiles) => {
      try {
        const uploadedFiles = await Promise.all(acceptedFiles.map(upload))
        const updatedFiles = acceptedFiles.map((file, i) => Object.assign(file, {
          preview: URL.createObjectURL(file),
          url: uploadedFiles[i].url.split('?')[0],
        }))
        setFiles(updatedFiles)
        onChange(updatedFiles.map(({ url }) => url).join(', '))
      } catch(err) {
        console.error(err)
      }
    },
  })
  
  const thumbs = files.map(file => (
    <div style={thumb} key={file.url}>
      <div style={thumbInner}>
        <img
          src={file.url}
          style={img}
        />
      </div>
    </div>
  ))

  useEffect(() => () => {
    files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  return (
    <section className="container">
      <div {...getRootProps({
        className: cn('dropzone form-control', {
          'is-valid': meta.touched && !meta.error, 
          'is-invalid': meta.touched && !!meta.error,
        }),
      } )}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </section>
  )
}

export default SilpleFileField