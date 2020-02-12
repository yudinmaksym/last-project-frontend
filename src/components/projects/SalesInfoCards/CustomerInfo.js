import React, { useMemo, useCallback, useState, useEffect } from 'react'
import ImgsViewer from 'react-images-viewer'
import {
  Card,
  CardHeader,
  CardBody,
} from 'shards-react'

import agent from '../../../../agent'
import CircleLoader from '../../../components/preloadrers/circle-loader'
import CommentInfoCard from '../../../shared/CommentInfoCard'


const CustomerInfo = ({ customer } = {}) => {
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState([])
  const [imageOpened, setImageOpened] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  
  const openImage = useCallback((index) => {
    setCurrentImage(index)
    setImageOpened(true)
  }, [imageOpened])

  const [images] = useState((customer.organisationStructure || '')
    .split(',')
    .slice(0, 2).map(src => ({ src, thumbnail: src })))

  const customerInfo = useMemo(() => {
    return [
      {
        title: 'Company Information',
        value: customer.companyInformation,
        key: 'companies_companyInformation',
        highlighted: comments.find(({ key }) => key === 'companies_companyInformation'),
      },
      {
        title: 'POC(s)',
        value: customer.poc,
        key: 'companies_poc',
        highlighted: comments.find(({ key }) => key === 'companies_poc'),
      },
      {
        title: 'Existing Relation to POC',
        value: customer.existingRelationToPoc,
        key: 'companies_existingRelationToPoc',
        highlighted: comments.find(({ key }) => key === 'companies_existingRelationToPoc'),
      },
      {
        title: 'Past Experience',
        value: customer.pastExpirience,
        key: 'companies_pastExpirience',
        highlighted: comments.find(({ key }) => key === 'companies_pastExpirience'),
      },
      {
        title: 'Decision Maker(s) / Authorize Signatory',
        value: customer.desitionMaker,
        key: 'companies_desitionMaker',
        highlighted: comments.find(({ key }) => key === 'companies_desitionMaker'),
      },
      {
        title: 'Level of Interest',
        value: customer.levelOfInterest,
        key: 'companies_levelOfInterest',
        highlighted: comments.find(({ key }) => key === 'companies_levelOfInterest'),
      },
      {
        title: 'Customer Contract Priority (Share vs Split) ',
        value: customer.customerContractPriority,
        key: 'companies_customerContractPriority',
        highlighted: comments.find(({ key }) => key === 'companies_customerContractPriority'),
      },
    ]
  }, [comments])
  useEffect(() => {
    (async () => {
      setLoading(true)
      const { data: { rows } } = await agent.FieldComments.get(`?entityId=${customer.id}`)
      setComments(rows)
      setLoading(false)
    })()
  }, [customer])
  return (
    <>
      <CircleLoader show={loading}/>
      <ImgsViewer
        imgs={images}
        currImg={currentImage}
        isOpen={imageOpened}
        onClickPrev={() => setCurrentImage(currentImage - 1)}
        onClickNext={() => setCurrentImage(currentImage + 1)}
        onClose={() => setImageOpened(false)}
      />
      <CommentInfoCard title='Customer Information' info={customerInfo} id={customer.id}/>
      {customer && customer.organisationStructure && <div className='d-flex align-items-center'>
        {(customer.organisationStructure || '')
          .split(',')
          .slice(0, 1)
          .map((img, i) => <Card className='mt-3'>
            <CardHeader>
              <h6>Organisation Structure</h6>
            </CardHeader>
            <CardBody onClick={() => openImage(i)} style={{ flexBasis: '0%', cursor: 'pointer' }} className='p-1 flex-grow-1 flex-shrink-1'>
              <img alt='' style={{ objectFit: 'contain' }} className="mw-100" src={img}></img>
            </CardBody>
          </Card>)
        }   
      </div>}
    </>
  )
}

export default CustomerInfo
