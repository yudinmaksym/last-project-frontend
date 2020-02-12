import React, { useState, useCallback } from 'react'
import ImgsViewer from 'react-images-viewer'
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
} from 'shards-react'

import InfoCardPopover from '../../shared/InfoCardPopover'
import InfoIcon from '../common/InfoIcon'


const ProjectInfo = ({ title, info, masterBuilding }) => {
  const [imageOpened, setImageOpened] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const openImage = useCallback((index) => {
    setCurrentImage(index)
    setImageOpened(true)
  }, [imageOpened])

  const [images] = useState((masterBuilding.photo || '')
    .split(',')
    .slice(0, 2).map(src => ({ src, thumbnail: src })))

  return (
    <>
      {masterBuilding && masterBuilding.photo && <div className='d-flex align-items-center'>
        {(masterBuilding.photo || '')
          .split(',')
          .slice(0, 2)
          .map((img, i) => (
            <div
              id={i} 
              onClick={() => openImage(i)} 
              style={{ flexBasis: '0%', cursor: 'pointer' }} 
              className='p-1 flex-grow-1 flex-shrink-1'
            >
              <img alt='' style={{ objectFit: 'contain' }} className="mw-100" src={img}></img>
            </div>
          ))
        }   
      </div>}
      <ImgsViewer
        imgs={images}
        currImg={currentImage}
        isOpen={imageOpened}
        onClickPrev={() => setCurrentImage(currentImage - 1)}
        onClickNext={() => setCurrentImage(currentImage + 1)}
        onClose={() => setImageOpened(false)}
      />
      <Card small className=''>
        <CardHeader className="border-bottom border">
          <h6 className="m-0">{title}</h6>
          {/* <div className="block-handle" /> */}
        </CardHeader>

        <CardBody className="p-0">
          <ListGroup small flush className="list-group-small border-bottom">
            {info.map((item, idx) => item.space ? (
              <ListGroupItem 
                key={idx} 
                className="d-flex px-3 p-0 border-top-0" 
                style={{ backgroundColor: 'rgba(242, 243, 245, 0.4)' }}>
                <span className="text-muted d-block my-2">{item.title}</span>
              </ListGroupItem>
            ) : (
              <ListGroupItem key={idx} className="d-flex px-3 py-1">
                <span className="text-semibold text-fiord-blue">{item.title}</span>
                <span className="ml-auto text-right text-semibold text-reagent-gray">
                  {item.value}
                </span>
                {item.info && (
                  <InfoIcon 
                    id={`project_info_${idx}`}
                    message={item.info}
                  />
                )}
                <InfoCardPopover 
                  info={item.additionalInfo}
                  anchor={`anchor_${idx}_${title.replace(/[^a-zA-Z0-9]/g,'_')}`} 
                />
              </ListGroupItem>
            ))}
          </ListGroup>
        </CardBody>
      </Card>
    </>
  )
}

ProjectInfo.defaultProps = {
  title: 'Top Referrals',
  info: [
    {
      title: 'GitHub',
      value: '19,291',
    },
    {
      title: 'Stack Overflow',
      value: '11,201',
    },
    {
      title: 'Hacker News',
      value: '9,291',
    },
    {
      title: 'Reddit',
      value: '8,281',
    },
    {
      title: 'The Next Web',
      value: '7,128',
    },
    {
      title: 'Tech Crunch',
      value: '6,218',
    },
    {
      title: 'YouTube',
      value: '1,218',
    },
    {
      title: 'Adobe',
      value: '1,171',
    },
  ],
}

export default ProjectInfo
