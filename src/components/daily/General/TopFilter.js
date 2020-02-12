import React from 'react'
import {
    Row,
    Col,
    Container,
} from 'shards-react';
import DatePicker from './DatePicker'
import Link from '../../common/Link'
import ProjectsRoute from './ProjectsRoute'
import ProjectsSelect from './ProjectsSelect';

var moment = require('moment');

class TopFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            project: '',
        }
    }

    handleDateRange = (startDate, endDate) => {
        const { selectedData, equipments } = this.props;
        const data = {
            label: selectedData.project,
            value: selectedData.projectId,
            region: selectedData.region,
            cdd: selectedData.cdd,
            category: selectedData.category
        }
        const range = {
            startDate: startDate,
            endDate: endDate
        }

        const equip = {
            name: selectedData.equip,
            tower: selectedData.tower,
            label: selectedData.equip,
        }

        this.props.handleDate(range, data, equip, equipments)
        this.setState({
            startDate: startDate,
            endDate: endDate,
        })
    }

    handleChangeProject = (data) => {
        const { selectedData } = this.props

        const range = {
            startDate: selectedData.startDate,
            endDate: selectedData.endDate
        }
        this.props.handleProject(data, range)
    }

    handleChangeTower = (towerData) => {
        const { selectedData } = this.props

        const range = {
            startDate: selectedData.startDate,
            endDate: selectedData.endDate
        }

        const data = {
            label: selectedData.project,
            value: selectedData.projectId,
            region: selectedData.region,
            cdd: selectedData.cdd,
            category: selectedData.category,
            tower: selectedData.tower
        }

        const equip = {
            name: selectedData.equip,
            tower: towerData.iot_name,
            label: selectedData.equip,
        }

        this.props.handleTower(range, data, equip)
    }

    handleChangeEquip = (equip) => {
        const { equipments, selectedData } = this.props
        const range = {
            startDate: selectedData.startDate,
            endDate: selectedData.endDate
        }

        const data = {
            label: selectedData.project,
            value: selectedData.projectId,
            region: selectedData.region,
            cdd: selectedData.cdd,
            category: selectedData.category,
            tower: selectedData.tower
        }
        this.props.handleEquip(range, data, equip, equipments)
    }



    render() {
        const {
            projects,
            title,
            selectedData,
            routedData,
            towers,
            equipments,
        } = this.props
        return (
            <Container fluid className="filterBar">
                <Row className="pl-3 d-flex justify-content-between align-items-center">
                    <h3>{title}</h3>
                    <div className="d-flex">
                        {selectedData && selectedData.project === 'Oceana_1407' &&
                            <Link
                                to={`/pool/dashboard`}
                                className="mr-3"
                                style={{ fontSize: 24 }}
                            >
                                <i className="material-icons" title="Pool Dashboard">list_alt</i>
                            </Link>
                        }
                        {selectedData &&
                            <Link
                                to={`/mdb-summary/heatmap?project=${selectedData.project}&id=${selectedData.projectId}`}
                                className="mr-3"
                                style={{ fontSize: 24 }}
                            >
                                <i className="material-icons" title="Consumption Heatmap">table_chart</i>
                            </Link>
                        }
                        {selectedData &&
                            <Link
                                to={`/lobby/dashboard?project=${selectedData.project}&id=${selectedData.projectId}`}
                                style={{ fontSize: 24 }}
                            >
                                <i className="material-icons" title="Lobby">list_alt</i>
                            </Link>
                        }
                        <div className="d-flex align-items-center ml-4">
                            <span>Date range:</span>
                            {selectedData &&
                                <DatePicker
                                    onApply={(startDate, endDate) =>
                                        this.handleDateRange(moment(startDate).format("YYYY-MM-DD"), moment(endDate).format("YYYY-MM-DD"))
                                    }
                                >
                                    <input
                                        type="text"
                                        value={`${selectedData.startDate || this.state.startDate} / ${selectedData.endDate || this.state.endDate}`}
                                        className="daily_pick-date-input top-filter mb-0"
                                        readOnly={true}
                                    />
                                </DatePicker>
                            }
                        </div>
                    </div>
                </Row>
                <Row className="pb-3 pt-2 justify-content-between row">
                    <Col lg="2">
                        {projects
                            &&
                            <>
                                <p className="mb-1"><small>Projects</small></p>
                                <ProjectsSelect
                                    value={{
                                        value: routedData.id,
                                        label: routedData.project
                                    }}
                                    projects={projects}
                                    onChange={e => this.handleChangeProject(e)}
                                />
                            </>
                        }
                    </Col>

                    <Col lg="2">
                        {/* TOWER SELECTION */}
                        {towers
                            &&
                            <>
                                <p className="mb-1"><small>Tower</small></p>
                                <ProjectsSelect
                                    value={{
                                        label: `${towers[0].iot_name}`,
                                        value: towers[0].id
                                    }}
                                    equipments={towers}
                                    onChange={e => this.handleChangeTower(e)}
                                />
                            </>
                        }
                    </Col>
                    <Col lg="2">
                        {/* EQUIPMENTS SELECTION */}
                        {equipments && equipments.length !== 0
                            &&
                            <>
                                <p className="mb-1"><small>Equipment</small></p>
                                <ProjectsSelect
                                    value={{
                                        label: `${equipments[0].iot_name}`
                                    }}
                                    equipments={equipments}
                                    onChange={e => this.handleChangeEquip(e)}
                                />
                            </>
                        }
                    </Col>

                    <Col lg="auto">
                        {/* PAGE SELECTION */}
                        <p className="mb-1"><small>Page</small></p>
                        <ProjectsRoute
                            currentPage={title}
                            selectedData={selectedData}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default TopFilter