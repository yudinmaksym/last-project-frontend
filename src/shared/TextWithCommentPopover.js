import omit from 'lodash/omit'
import React, { useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  FormTextarea,
} from 'shards-react'

import CircleLoader from '../components/preloadrers/circle-loader'
import agent from '../../agent'
import { showAlert } from '../../redux/reducers/alerts'


const TextWithCommentPopover = ({ item, anchor, entityId, showNotification }) => {
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState({ entityId, content: '', key: item.key })
  useEffect(() => {
    if(opened) {
      (async () => {
        try {
          setLoading(true)
          const { data: { rows: [ commentPaylaod ] } } = await agent.FieldComments.get(`?entityId=${entityId}&key=${item.key}`)
          commentPaylaod && setComment(commentPaylaod)
        } catch (e) {
          showNotification({ theme: 'danger', text: 'Failed to load comment' })
          console.error(e)
        } finally {
          setLoading(false)
        }
      })()
    } 
    return setComment({ entityId, key: item.key })
  }, [opened])

  const saveOrUpdate = useCallback(async () => {
    try {
      setLoading(true)
      if(comment.id) {
        await agent.FieldComments.patch(`/${comment.id}`, omit(comment, ['id']))
        showNotification({ theme: 'success', text: 'Comment successfully updated' })
      } else {
        await agent.FieldComments.post('/', comment)
        showNotification({ theme: 'success', text: 'Comment successfully created' })
      }
      setOpened(false)
    } catch (e) {
      console.error(e)
      showNotification({ theme: 'danger', text: 'Failed write comment' })
    } finally {
      setLoading(false)
    }
  }, [comment])
  return (
    <div id={`for-popover-${anchor}`} style={{ flex: 1, color: '#333F4F' }}
      className="text-left pl-2 d-flex justify-content-between text-semibold text-reagent-gray flex-row-reverse">
      <div className='pl-3'>
        <i className="material-icons" style={item.highlighted ? { color: '#007bff', cursor: 'pointer'  } : { cursor: 'pointer' }} onClick={() => setOpened(!opened)}>message</i>
        <Popover
          placement="right"
          open={opened}
          target={`#for-popover-${anchor}`}
        >
          <CircleLoader show={loading}/>
          <PopoverHeader className="d-flex justify-content-between align-items-center">
            {/* {item.hi} */}
            {item.title}<Button small className="btn btn-white" onClick={() => setOpened(false)}><i className="material-icons">close</i></Button>
          </PopoverHeader>
          <PopoverBody>
            <FormTextarea value={comment.content} onChange={(e) => setComment({ ...comment, content: e.target.value })} className='mb-1'></FormTextarea>
            <div className='d-flex justify-content-between'>
              <Button small onClick={() => saveOrUpdate()}>Save</Button>
              {comment.user && comment.user.name && <span className='align-self-end'>Last edited by: {comment.user.name}</span>}
            </div>
          </PopoverBody>
        </Popover>
      </div>
    </div>
  )
}

export default connect(
  () => ({}),
  (dispatch) => ({
    showNotification: (options) => dispatch(showAlert({ show: true, ...options })),
  })
)(TextWithCommentPopover)