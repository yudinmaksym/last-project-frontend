import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
} from 'shards-react'

import TextWithCommentPopover from './TextWithCommentPopover'
import InfoCardPopover from './InfoCardPopover'


const CommentInfoCard = ({ title, info, id, currentUser, children, link }) => {
  const [toggle, setToggle] = useState(false)

  return (
    <Card small className="h-100" >
      <CardHeader className="border-bottom">
        <div className="d-flex justify-content-between">
          <h6 className="m-0 text-center">{title}</h6>
          <div className="collspan-pointer" onClick={() => setToggle(!toggle)}>{toggle?<i className="material-icons">keyboard_arrow_up </i>
            :<i className="material-icons">keyboard_arrow_down </i>}</div>
        </div>
      </CardHeader>

      {toggle && <CardBody className="p-0" >
        <ListGroup small flush className="list-group-small">
          {info.map((item, idx) => (
            <ListGroupItem key={idx} className="d-flex py-1 ">
              <div className="text-semibold d-flex align-items-center w-100">{item.title}</div>
              <div className='text-right w-100'>
                {item.value}
              </div>
              <div className="pl-4">
                <InfoCardPopover info={item.additionalInfo} anchor={`anchor_${idx}_${title.replace(/[^a-zA-Z0-9]/g,'_')}`}/>
              </div>
              <TextWithCommentPopover
                userId={currentUser.id}
                entityId={id}
                anchor={`anchor_${idx}_${title.replace(/[^a-zA-Z0-9]/g,'_')}`}
                item={item} />
            </ListGroupItem>
          ))}
        </ListGroup>
      </CardBody>}
      {children && <CardBody>{children}</CardBody>}
    </Card>
  )
}

export default connect(
  (state) => ({
    currentUser: state.users.currentUser,
  }),
)(CommentInfoCard)
