import React from 'react'

class MapBox extends React.Component {

  imports = {}

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

    const {
      Map,
      TileLayer,
      Marker,
      Popup,
    } = this.imports

    return (
      <>
        {this.state.mount && (
          <Map center={this.props.center} zoom={this.props.zoom}
            style={{
              height: '93vh',
              width: '100%',
            }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'
            />
            {this.props.points.map(_p => (
              <Marker position={[_p.lat, _p.lng]} key={_p.name}>
                <Popup>
                  <div className="pin_header text-center">
                    {_p.name}
                  </div>
                  <div className="pin_container px-4">
                    <div className="pin_container_stat-item d-flex justify-content-between align-items-center">
                      <div className="pin_container_stat-item_value">76</div>
                      <div className="pin_container_stat-item_desc col-7">EUI</div>
                    </div>
                    <div className="pin_container_stat-item d-flex justify-content-between align-items-center">
                      <div className="pin_container_stat-item_value">3</div>
                      <div className="pin_container_stat-item_desc col-7">Active Alarms</div>
                    </div>
                    <div className="pin_container_stat-item d-flex justify-content-between align-items-center">
                      <div className="pin_container_stat-item_value green">-3%</div>
                      <div className="pin_container_stat-item_desc col-7">Consumption since last month</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </Map>
        )}
      </>
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
      lng: 55.140798,
    },
    { 
      name: 'Silicon Star',
      lat: 25.107746,
      lng: 55.378939,
    },
  ],
}

export default MapBox
