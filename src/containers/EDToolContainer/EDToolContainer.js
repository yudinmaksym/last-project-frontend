import React, { useState, useCallback, useMemo } from 'react'
import { Container, Row, Card, CardHeader, CardBody, Nav, NavItem, NavLink, Col } from 'shards-react'
import Router from 'next/router'

import ProjectsSelect from '../../components/projects/ProjectsSelect'

import TabOneContainer from './TabOneContainer'
import EEMCosts from './EEMCosts'


const tabList = [{
  name: 'End-Uses',
  active: true,
  component: TabOneContainer,
}, {
  name: 'EEM Costs',
  active: false,
  component: EEMCosts,
}]

const EDToolContainer = ({ project, baseline }) => {
  const [tabs, setTabs] = useState(tabList)
  const ActiveTabContent = useMemo(() => tabs.find(({ active }) => active).component, [tabs])

  const handleTabChanged = useCallback((i) => {
    const tabsTemp = tabs.map(t => ({ ...t, active: false }))
    tabsTemp[i] = { ...tabsTemp[i], active: true }
    setTabs(tabsTemp)
  }, [tabs])

  return (
    <Container>
      <Row className='d-flex justify-content-end'>
        <Col md='4' className='my-4'>
          <ProjectsSelect 
            value={{
              label: project.name,
              value: project.id,
            }}
            onChange={({ value }) => Router.push(`/ed?id=${value}`)} />
        </Col>
      
      </Row>
      <Card>
        <CardHeader>
          <Nav tabs className="justify-content-end">
            {tabs.map(({ name, active }, i) => (
              <NavItem onClick={() => handleTabChanged(i)}>
                <NavLink active={active} href="#">
                  {name}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </CardHeader>
        <CardBody>
          <ActiveTabContent id={project.id} project={project} baselineData={baseline}></ActiveTabContent>
        </CardBody>
      </Card>
    </Container>
  )
}

export default EDToolContainer