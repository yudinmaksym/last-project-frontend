import * as React from 'react'
import { Card, CardBody, Form, FormInput } from 'shards-react'

import 'react-quill/dist/quill.snow.css'


class Editor extends React.Component {
  constructor(props) {
    super(props)

    if (typeof window !== 'undefined') {
      this.ReactQuill = require('react-quill')
    }
  }

  render() {
    let textarea

    const ReactQuill = this.ReactQuill
    if (typeof window !== 'undefined' && ReactQuill) {
      textarea = (
        <React.Fragment>
          <FormInput size="lg" className="mb-3" placeholder="Your Post Title" />
          <ReactQuill className="add-new-post__editor mb-1" />
        </React.Fragment>
      )
    } else {
      textarea = (
        <FormInput size="lg" className="mb-3" placeholder="Your Post Title" />
      )
    }

    return (
      <Card small className="mb-3">
        <CardBody>
          <Form className="add-new-post">
            {textarea}
          </Form>
        </CardBody>
      </Card>
    )
  }
}

export default Editor
