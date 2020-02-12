import React, { useState }  from 'react'
import {
  Popover, 
  PopoverBody,
} from 'shards-react'


const InfoIcon = ({ 
  id,
  message,
  ...attrs 
}) => {
  const [opened, setOpened] = useState(false)

  return (
    <span {...attrs} className={'pl-1'}>
      <>
        <i 
          id={id}
          class="material-icons"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setOpened(true)}
          onMouseLeave={() => setOpened(false)}
        >info</i>

        <Popover
          placement="right"
          open={opened}
          target={`#${id}`}
        >
          <PopoverBody>
            {message}
          </PopoverBody>
        </Popover>
      </>
    </span>
  )
}

InfoIcon.defaultProps = {
  message: '',
}

export default InfoIcon

