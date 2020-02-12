import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Card, CardBody } from 'shards-react'

import Link from '../common/Link'


const GOOGLE_KEY = 'AIzaSyDoF9WgOn5j9p2b9GZCtQwR4FKOQHZRtfo'


const Pin = ({ text, projectTitle }) => (
  <div className="pin">
    <div className="pin--title">
      {text}
    </div>
  </div>
)


class MapBox extends React.Component {

  imports = {

  }

  state = {
    mount: false,
  }

  componentDidMount() {
    const RL = require('react-leaflet')

    this.imports = {
      Map: RL.Map,
      TileLayer: RL.TileLayer,
      Marker: RL.Marker,
      Popup: RL.Popup,
    }

    this.setState({ mount: true })
  }

  render() {
    const { variation, label, subLabel, value, percentage, increase } = this.props

    const cardClasses = classNames(
      'stats-small',
      variation && `stats-small--${variation}`
    )

    const cardBodyClasses = classNames(
      variation === '1' ? 'p-0 d-flex' : 'px-0 pb-0'
    )

    const innerWrapperClasses = classNames(
      'd-flex',
      variation === '1' ? 'flex-column m-auto' : 'px-3'
    )

    const dataFieldClasses = classNames(
      'stats-small__data',
      variation === '1' && 'text-center'
    )

    const labelClasses = classNames(
      'stats-small__label',
      'text-uppercase',
      variation !== '1' && 'mb-1'
    )

    const valueClasses = classNames(
      'stats-small__value',
      'count',
      variation === '1' ? 'my-3' : 'm-0'
    )

    const innerDataFieldClasses = classNames(
      'stats-small__data',
      variation !== '1' && 'text-right align-items-center'
    )

    const percentageClasses = classNames(
      'stats-small__percentage',
      `stats-small__percentage--${increase ? 'increase' : 'decrease'}`
    )

    const cardContainerClasses = classNames(
      this.props.className, 
      cardClasses
    )

    const {
      Map,
      TileLayer,
      Marker,
      Popup,
    } = this.imports

    const position = [51.505, -0.09]
    return (
      <Card small className={''}>
        <CardBody className={''}>
          {this.state.mount && (
            <Map center={this.props.center} zoom={this.props.zoom}
              style={{
                height: '600px',
                width: '100%',
              }}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'
              />
              {this.props.points.map(_p => (
                <Marker position={[_p.lat, _p.long]} key={_p.id}>
                  <Popup>
                    <Link 
                      className='btn btn-white d-flex align-items-center' 
                      to={`/projects/dashboard?id=${_p.id}`}
                    >
                      {_p.name}
                    </Link>
                  </Popup>
                </Marker>
              ))}
            </Map>
          )}
        </CardBody>
      </Card>
    )
  }
}

MapBox.defaultProps = {
  increase: true,
  percentage: 0,
  value: 0,
  label: 'Label',
  subLabel: '',
  center: [ 25.10, 55.14],
  zoom: 10,
  points: [
    { 
      name: 'Fairmont The Palm',
      lat: 25.109231,
      long: 55.140798,
    },
    { 
      name: 'Silicon Star',
      lat: 25.107746,
      long: 55.378939,
    },
    { 
      name: 'Falcon House',
      lat: 25.003198,
      long: 55.154542,
    },
    { 
      name: 'O14',
      lat: 25.180595,
      long: 55.269051,
    },
    { 
      name: 'Regal Tower',
      lat: 25.1865,
      long: 55.260447,
    },
    { 
      name: 'Imperial Tower',
      lat: 25.047124,
      long: 55.19539,
    },
    { 
      name: 'Oceana Palm',
      lat: 25.108985,
      long: 55.137154,
    },
    { 
      name: 'Indigo Tower',
      lat: 25.095701,
      long: 55.378652,
    },
    { 
      name: 'Phoenix Tower',
      lat: 25.088643,
      long: 55.379545,
    },
    { 
      name: 'Green Tower',
      lat: 25.257838,
      long: 22.321415,
    },
    { 
      name: 'Falcon Tower',
      lat: 25.259701,
      long: 55.319318,
    },
    { 
      name: 'BAN',
      lat: 25.291373,
      long: 55.361605,
    },
    { 
      name: 'Movenpick JBR',
      lat: 25.080141,
      long: 55.13693,
    },
  ],
}

export default MapBox
