import * as React from 'react'
import {connect} from 'react-redux'
import { Container, Row, Col } from 'shards-react'
import HeatMap from '../components/metrics/HeatMap'
import {
    loadAllProjects,
    loadMdbList,
    loadData,

    getConsumption,
    getProjects,
    getMdbList
} from '../../redux/reducers/summaryHeatmap'
import {withRouter} from 'next/router'
import ProjectsSelect from '../components/daily/General/ProjectsSelect'

var moment = require('moment')

class SummaryHeatmapContainer extends React.Component {
    state = {
        dateIndex: 7,
        valueIndex: 6
    }
    componentDidMount() {
        const {router} = this.props
        if(router.query.project) {
            this.props.loadAllProjects(
              router.query.id, 
              router.query.project
            )
            this.setState({
                project: {name: router.query.project, id:router.query.id}
            })
        } else {
            this.props.loadAllProjects()
        }
    }

    handleChangeProject = (data) => {
        this.props.loadMdbList(data.value, data.label)
        this.setState({
            project: {name: data.label, id:data.value}
        })
    }

    handleChangeEquip = (data) => {
        const {project} = this.state
        const {projects, mdbList} = this.props
        if(data.label === 'Whole building') {
            this.props.loadData(
                `${project ? project.name : projects[0].iot_name}`,
                mdbList
            )
            this.setState({
                dateIndex: 3,
                valueIndex: 4,
                wholeBuilding: true,
            })
        } else {
            this.props.loadData(
                `${project ? project.name : projects[0].iot_name}`,
                data.label
            )
            this.setState({
                dateIndex: 7,
                valueIndex: 6,
                wholeBuilding: false,
            })
        }
    }

    formatHeatmapData = (cons) => {
        const {dateIndex, valueIndex} = this.state
        const data = []
        for(let i = 0; i<cons.length; i++) {
            const splited = cons[i].split(',')
            if(splited[valueIndex] !== '' && Number(splited[valueIndex]) !== 0) {
                data.push({
                    x: Number(moment.utc(splited[dateIndex], 'YYYY-MM-DDTHH:mm:ssZ').format('H')),
                    y: moment.utc(splited[dateIndex], 'YYYY-MM-DDTHH:mm:ssZ').format('YYYY-MM-DD'),
                    value: Number(splited[valueIndex]),
                })
            }
        }

        const formatYAxis = []
        let daysIndex = 0

        for(let i = 0; i < data.length; i++) {
            if(i !== data.length - 1) {
                if(data[i].y === data[i+1].y) {
                    formatYAxis.push({
                        x: data[i].x,
                        y: daysIndex,
                        value: data[i].value
                    })
                } else {
                    formatYAxis.push({
                        x: data[i].x,
                        y: daysIndex,
                        value: data[i].value
                    })
                    daysIndex++
                }
            } else {
                formatYAxis.push({
                    x: data[i].x,
                    y: daysIndex,
                    value: data[i].value
                })
            }
        }

        return formatYAxis
    }

    findMinMax(arr) {
        if(arr) {
            let min = arr[0].value, max = arr[0].value
            for (let i = 1, len=arr.length; i < len; i++) {
                let v = arr[i].value
                min = (v < min) ? v : min
                max = (v > max) ? v : max
            }
            return [min, max]
        }
    }

    formatHeatmapYAxisCategories = (cons) => {
        const {dateIndex, valueIndex, wholeBuilding} = this.state
        const filter = []
        const categories = []
        let plusOneDay
        for(let i = 0; i<cons.length; i++) {
            const splited = cons[i].split(',')
            if(splited[valueIndex] !== '' && splited[valueIndex] !== 0) {
                filter.push(moment.utc(splited[dateIndex], 'YYYY-MM-DDTHH:mm:ssZ').format('MMM DD'))
            }
            if(i === cons.length - 1) {
                plusOneDay = moment.utc(splited[dateIndex], 'YYYY-MM-DDTHH:mm:ssZ').add(1, 'day').format('MMM DD')
            }
        }

        filter.push(plusOneDay)

        if(!wholeBuilding) {
            filter.splice(0, 22)
        }

        for(let i = 0; i<filter.length; i++) {
            if(i !== filter.length - 1) {
                if(filter[i] !== filter[i+1]) {
                    categories.push(filter[i])
                }
            } else {
                categories.push(filter[i])
            }
        }
        
        return categories
    }

    render() {
        const {
           title,
           projects,
           mdbList,
           consumption,
           router,
        } = this.props
        return (
            <>
                <Container className="filterBar">
                    <Row className="pl-3">
                        <h3>{title}</h3>
                    </Row>
                    <Row className="pb-3 pt-2 row">
                        <Col lg="2">
                            {projects.length !== 0
                            && 
                                <>
                                    <p className="mb-1"><small>Projects</small></p>
                                    <ProjectsSelect 
                                        value={{
                                            value: router.query.id || projects[0].id,
                                            label: router.query.project || projects[0].iot_name
                                        }}
                                        projects={projects}
                                        onChange={e => this.handleChangeProject(e)}
                                    />
                                </>
                            }
                        </Col>
                        <Col lg="2">
                            {mdbList.length !== 0
                                &&
                                <>
                                    <p className="mb-1"><small>Equipment</small></p>
                                    <ProjectsSelect 
                                        value={{
                                            label: mdbList[0].iot_name
                                        }}
                                        equipments={mdbList}
                                        onChange={e => this.handleChangeEquip(e)}
                                    />
                                </>
                            }
                        </Col>
                    </Row>
                </Container>
                <Container style={{marginTop: 150}}>
                    {consumption.length !== 0 && <HeatMap 
                        yAxisCategories={this.formatHeatmapYAxisCategories(consumption)}
                        xAxisCategories={['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']}
                        data={this.formatHeatmapData(consumption)}
                        min={this.findMinMax(this.formatHeatmapData(consumption))[0]}
                        max={this.findMinMax(this.formatHeatmapData(consumption))[1]}
                    />}
                </Container>
            </>
        )
    }
}

export default withRouter(connect(
    (state) => ({
        mdbList: getMdbList(state),
        projects: getProjects(state),
        consumption: getConsumption(state),
    }),
    (dispatch) => ({
        loadAllProjects:    (id, name) => dispatch(loadAllProjects(id, name)),
        loadMdbList:        (id, name) => dispatch(loadMdbList(id, name)),
        loadData:           (projectName, mdbName) => dispatch(loadData(projectName, mdbName))
    })
)(SummaryHeatmapContainer))