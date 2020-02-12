import React, { useMemo, useCallback, useState, useEffect } from 'react'
import ImgsViewer from 'react-images-viewer'

import CommentInfoCard from '../../../shared/CommentInfoCard'
import agent from '../../../../agent'
import CircleLoader from '../../../components/preloadrers/circle-loader'


const getDrawingsString = (building) => {
  const drawingsReceived = []
  building.hvacAsBuilt && drawingsReceived.push('HVAC As-built')
  building.mechanicalAsBuilt && drawingsReceived.push('Mechanical As-built')
  building.architecturalAsBuilt && drawingsReceived.push('Architectural As-built')
  building.electricalAsBuilt && drawingsReceived.push('Electrical As-built')
  building.chilledWaterVentilationRisers && drawingsReceived.push('Chilled Water and Ventilation Risers')
  building.bmsRisers && drawingsReceived.push('BMS Risers')
  return drawingsReceived.join(', ')
}

const BuildingInfo = ({ masterBuilding } = {}) => {
  const [imageOpened, setImageOpened] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState([])
  const openImage = useCallback((index) => {
    setCurrentImage(index)
    setImageOpened(true)
  }, [imageOpened])

  const [images] = useState((masterBuilding.photo || '')
    .split(',')
    .slice(0, 2).map(src => ({ src, thumbnail: src })))
  const buildingInfo = useMemo(() => {
    return [
      {
        title: 'Building Name',
        value: masterBuilding.name,
        key: 'buildings_name',
        highlighted: comments.find(({ key }) => key === 'buildings_name'),
      },
      {
        title: 'Year Built',
        value: masterBuilding.year_built,
        key: 'buildings_year_built',
        highlighted: comments.find(({ key }) => key === 'buildings_year_built'),
      },
      {
        title: 'Neighborhood',
        value: masterBuilding.city,
        key: 'buildings_city',
        highlighted: comments.find(({ key }) => key === 'buildings_city'),
      },
      {
        title: 'Owner',
        value: masterBuilding.owner,
        key: 'buildings_owner',
        highlighted: comments.find(({ key }) => key === 'buildings_owner'),
      },
      {
        title: 'Operator',
        value: masterBuilding.operator,
        key: 'buildings_operator',
        highlighted: comments.find(({ key }) => key === 'buildings_operator'),
      },
      {
        title: 'Main Contractor',
        value: masterBuilding.mainContractor,
        key: 'buildings_mainContractor',
        highlighted: comments.find(({ key }) => key === 'buildings_mainContractor'),
      },
      {
        title: 'MEP Contractor',
        value: masterBuilding.mepContractor,
        key: 'buildings_mepContractor',
        highlighted: comments.find(({ key }) => key === 'buildings_mepContractor'),
      },
      {
        title: 'Consultant',
        value: masterBuilding.consultant,
        key: 'buildings_consultant',
        highlighted: comments.find(({ key }) => key === 'buildings_consultant'),
      },
      {
        title: 'MEP Consultant',
        value: masterBuilding.mepConsultant,
        key: 'buildings_mepConsultant',
        highlighted: comments.find(({ key }) => key === 'buildings_mepConsultant'),
      },
      {
        title: 'Occupancy Type',
        value: masterBuilding.occupancy_type,
        key: 'buildings_occupancy_type',
        highlighted: comments.find(({ key }) => key === 'buildings_occupancy_type'),
      },
      {
        title: 'Cooling Type',
        value: masterBuilding.cooling_type,
        key: 'buildings_cooling_type',
        highlighted: comments.find(({ key }) => key === 'buildings_cooling_type'),
      },
      {
        title: 'Metering Infrastructure',
        value: masterBuilding.metering_infrastructure,
        key: 'buildings_metering_infrastructure',
        highlighted: comments.find(({ key }) => key === 'buildings_metering_infrastructure'),
      },
      {
        title: 'FM',
        value: masterBuilding.fm,
        key: 'buildings_fm',
        highlighted: comments.find(({ key }) => key === 'buildings_fm'),
      },
      {
        title: 'Drawing Received',
        value: getDrawingsString(masterBuilding),
        key: 'buildings_drawing_received',
        highlighted: comments.find(({ key }) => key === 'buildings_fm'),
      },
      {
        title: 'Past EE Upgrades',
        value: masterBuilding.pastEEUpgrades,
        key: 'buildings_pastEEUpgrades',
        highlighted: comments.find(({ key }) => key === 'buildings_pastEEUpgrades'),
      },
    ]
  }, [comments])
  useEffect(() => {
    (async () => {
      setLoading(true)
      const { data: { rows } } = await agent.FieldComments.get(`?entityId=${masterBuilding.id}`)
      setComments(rows)
      setLoading(false)
    })()
  }, [masterBuilding])
  return (
    <>
      <CircleLoader show={loading}/>
      {masterBuilding && masterBuilding.photo && <div className='d-flex align-items-center'>
        {(masterBuilding.photo || '')
          .split(',')
          .slice(0, 2)
          .map((img, i) => <div onClick={() => openImage(i)} style={{ flexBasis: '0%', cursor: 'pointer' }} className='p-1 flex-grow-1 flex-shrink-1'>
            <img alt='' style={{ objectFit: 'contain' }} className="mw-100" src={img}></img>
          </div>)
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
      <CommentInfoCard title='Building Information' info={buildingInfo} id={masterBuilding.id}/>
    </>
  )
}

export default BuildingInfo
