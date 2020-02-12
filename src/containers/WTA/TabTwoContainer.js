import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Container, Card, Button, Form, Row, Col } from 'shards-react'
import { reduxForm } from 'redux-form'
import cn from 'classnames'

import CircleLoader from '../../components/preloadrers/circle-loader'
import agent from '../../../agent'
import fields from '../../forms/ed/fields'
import RenderForm from '../../forms/renderForm'
import Router from 'next/router'

import ProjectsSelect from '../../components/projects/ProjectsSelect'

const formOptions = {
  form: 'eemWizard',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
}

const eemSurveyOptions = [
  'FAHU',
  'AHU',
  'Cooling',
  'FCU',
  'BMS',
  'Plumbing',
  'Swimming Pool',
  'Lightning',
  'Kitchen',
  'Hotel',
  'Water',
  'Other',
]

const ConnectedForm = ({ handleSubmit, fields, onSubmit }) => {
  return (
    <Form onSubmit={handleSubmit(onSubmit)} id={'eemWizardForm'}>
      <Container className='mt-4'>
        <RenderForm formFields={fields} perRow={1}/> 
      </Container>
    </Form>
  )
}

const TabTwoContainer = ({ id, name }) => {
  const [initialValues, setInitialValues] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async() => {
      try {
        setLoading(true)
        const { data } = await agent.EEMSurvey.get(`/${id}`)
        data ? setInitialValues(data) : setInitialValues({})
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const [ selectedSurvey, setSelectedSurvey ] = useState(eemSurveyOptions[0])
  const handleSubmit = useCallback(async (data) => {
    await agent.EEMSurvey.post('/', {
      ...data, projectId: id,
    })
  }, [id])
  const SelectedForm = useMemo(() => {
    return reduxForm(Object.assign(formOptions, { initialValues }))((props) => (
      <ConnectedForm
        {...props}
        onSubmit={handleSubmit}
        fields={fields[`${selectedSurvey.toLowerCase().split(' ').join('')}Fields`]} />
    )) 
  }, [selectedSurvey, initialValues])
  return (
    <Container>
       <Row className='d-flex justify-content-end'>
        <Col md='4' className='my-4'>
          <ProjectsSelect 
            value={{
              label: name,
              value: id,
            }}
            onChange={({ value }) => Router.push(`/wta?id=${value}`)} />
        </Col>
      </Row>
      <div className="equations-modal__header mx-auto">
        {eemSurveyOptions.map((page) =>
          (
            <div
              key={page.step}
              onClick={() => setSelectedSurvey(page)}
              className={cn(
                'equations-modal__header--step',
                { 'equations-modal__header--step--active': page === selectedSurvey }
              )}>
              <span className="equations-modal__header--step__circle">
                <i className="equations-modal__header--step__circle--icon material-icons">
                      info
                </i>
              </span>
              <span className="equations-modal__header--step__name">{page}</span>
            </div>
          )
        )}
      </div>
      <Card className="mt-4">
        <SelectedForm></SelectedForm>
      </Card>
      <div className='d-flex mt-4'>
        <Button type='submit' form='eemWizardForm' value="Submit">Submit</Button>
      </div>
      <CircleLoader show={loading}/>
    </Container>
  )
}

export default TabTwoContainer