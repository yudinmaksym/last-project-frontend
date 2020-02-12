import React, { useState } from 'react'
import {
  Popover,
  PopoverHeader,
  PopoverBody,
  ListGroup,
  ListGroupItem,
} from 'shards-react'


const InfoCardPopover = ({ info = {}, anchor }) => {
  const [opened, setOpened] = useState(false)
  return (
    <>
      {info && info.list && !!info.list.length
       && <>
         <i id={anchor}
           className="material-icons"
           style={{ cursor: 'pointer' }}
           onMouseEnter={() => setOpened(true)}
           onMouseLeave={() => setOpened(false)}
         >info</i>
         <Popover
           target={`#${anchor}`}
           open={opened}
           placement="right"
         >
           <PopoverHeader>
             {info.header}
           </PopoverHeader>
           <PopoverBody>
             <ListGroup small flush className="list-group-small border-none">
               {info.list.map((item, idx) => (
                 <ListGroupItem key={idx} className="d-flex px-3 py-1">
                   <span className="text-semibold text-fiord-blue">{item.value}</span>
                 </ListGroupItem>
               ))}
             </ListGroup>
           </PopoverBody>
         </Popover>
       </>}
    </>
  )
}

export default InfoCardPopover
