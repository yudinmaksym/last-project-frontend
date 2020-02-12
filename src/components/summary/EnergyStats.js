import React from 'react'
import { 
    Row,
    Col, 
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'shards-react'
import BuildingEnergyItem from '../daily/BuildingEnergyItem'
import {formatInfluxData} from '../../utils/format'

class EnergyStats extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this)
        this.state = { 
            open: false,
        };
    }
    
    toggle() {
        this.setState(prevState => {
          return { open: !prevState.open }
        });
    }

    formatEnergyTotal = () => {
        const {energyTotal} = this.props;
        const filtered = formatInfluxData(energyTotal)

        let data = [];
        filtered.forEach((el) => {
            if(el[0] !== "") {
                const splited = el.split(',');
                data.push({value: Number(Number(splited[4]).toFixed(0)), subject: splited[3]});
            }
        })

        if(data.length !== 0) {
            return data[0].value
        } else {
            return 0
        }
    }
    
    formatSavingTotal = () => {
        const {savingTotal} = this.props;
        const energyTotal = this.formatEnergyTotal()
        
        let subtractData = savingTotal[0].data - energyTotal;

        return Number(subtractData.toFixed(0));
    }

    render() {
        const {equipList} = this.props
        return(
            <Row className="mb-4">
                <Col lg="3" className="px-0">
                    <BuildingEnergyItem value={this.formatEnergyTotal().toLocaleString('en')} title="Energy Total" />
                </Col>
                 
                <Col lg="3" className="px-0">
                    <BuildingEnergyItem value={this.formatSavingTotal().toLocaleString('en')} title="Saving Total" />
                </Col>
                
                <Col lg="3">
                        <Dropdown open={this.state.open} toggle={this.toggle}>
                            <DropdownToggle>Equip List</DropdownToggle>
                            <DropdownMenu>
                                {equipList.map((_equip, index) => {
                                    if(_equip.iot_name !== "") {
                                        return <DropdownItem key={index}>{_equip.iot_name}</DropdownItem>
                                    }
                                })}
                            </DropdownMenu>
                        </Dropdown>
                </Col>
            </Row>
        )
    }
}

export default EnergyStats