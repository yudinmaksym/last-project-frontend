import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Popover,
  PopoverBody,
} from 'shards-react'

import EnergyPerformanceBar from './EnergyPerformanceBar'


class ProjectEnergyScore extends React.Component {
 
  state = {
    infoOpened: false,
  }

  setOpened = (infoOpened) => this.setState({ infoOpened })  

  render() {
    const { title, score, value } = this.props
 
    return (
      <Card small className="project-energy-score h-120">
        <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
          <h6 className="m-0">{title}</h6>

          <i id={'taka_score'}
            class="material-icons"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => this.setOpened(true)}
            onMouseLeave={() => this.setOpened(false)}
          >info</i>

          <Popover
            placement="right"
            open={this.state.infoOpened}
            target={'#taka_score'}
          >
            <PopoverBody>
              Taka Score & EUI is based on past 12 months consumption. 
              This is a Rolling EUI score which is updated monthly as new data is uploaded.
            </PopoverBody>
          </Popover>
        </CardHeader>

        <CardBody className="d-table-cell align-middle">
          <EnergyPerformanceBar 
            level={score}
            value={value}
          />
        </CardBody>
      </Card>
    )
  }
}

ProjectEnergyScore.defaultProps = {
  title: 'Taka Energy Score',
  score: 0,
  value: 100,
}

export default ProjectEnergyScore
