import * as React from 'react'
import { showStickLoader } from '../../redux/reducers/loaders'
import {connect} from 'react-redux'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Container, Row, Col, Card } from 'shards-react'
import moment from 'moment'
import agentDaily from '../../agentDaily'
import DegreeDayForm from '../forms/degreeDays/DegreeDayForm'
import ReactSelect from 'react-select'
import HighChart from '../utils/highCharts'

class DegreeCalculatorContainer extends React.Component {
    state = {
        cities: ["Dubai", "Abu Dhabi", "Sharjah"],
        types:  ["cdd", "hdd"],
        selectedType: 'cdd',
        resultList: [],
        showForm: true,
        cddList: [],
        cddChecked: [],
    }

    componentDidMount() {
        return agentDaily.Weather.loadTopicsList()
            .then(res => {
                const format = []
                res.items.map(_item => {
                    format.push({
                        label: _item,
                        value: +(_item.split('_')[1]),
                    })
                })

                this.setState({cddList: format})
            })
    }

    capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    loadDegrees = async (data) => {
        const {cddChecked} = this.state
        const city = this.refs.city
        const degreeType = this.refs.degreeType
        if(data.dd) {
            const res = []
            for(let [key, value] of Object.entries(data.dd)) {
                const values = []
                const range = value.start.split('/')
                for(let i = 0; i < cddChecked.length; i++) {
                    await agentDaily.Weather.loadTotalDegrees(`${degreeType.value}_${cddChecked[i].value}`, city.value, range[0].trim(), range[1].trim())
                        .then(result => values.push({
                                value: result.items[0].value.toFixed(1),
                                degreeType: result.topic
                            }
                        ))
                }
                res.push({
                    startDate: range[0].trim(),
                    endDate: range[1].trim(),
                    month: moment(this.capitalize(key), 'MMM').format('MMMM'),
                    value: values,
                })
            }
            this.setState({
                resultList: res,
                showForm: false,
            })
        }
    }

    backToForm = () => {
        this.setState({showForm: true, resultList: []})
    }

    downloadCsvTemplate = () => {
        const rows = [
            [
                'start_date',
                'end_date',
                'month',
                this.state.cddChecked.map(_cdd => {
                    return `cdd_${_cdd.value}`
                })
            ],
        ]
        this.state.resultList.map(el => {
            rows.push([
                el.startDate,
                el.endDate,
                el.month,
                el.value.map(_val => {
                    return _val.value
                }),
            ])
        })
        const csvContent = `data:text/csv;charset=utf-8,${rows
          .map(el => el.join(','))
          .join('\n')}`
      
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', 'degrees_daily.csv')
        document.body.appendChild(link) // Required for FF
      
        link.click()
    }

    handleDegeeTemp = data => {
        this.setState({cddChecked: data})
    }

    changeType = data => {
        this.setState({selectedType: data.currentTarget.value})
    }

    chartOptions = (data) => {
        const values = data[0].value.length
        let tempArray = []
        const finalArray = []
        for(let i = 0; i < values; i++) {
            let lineName = ""
            data.map(_val => {
                lineName = _val.value[i].degreeType
                tempArray.push(+(_val.value[i].value))
            })
            finalArray.push({
                data: tempArray,
                name: lineName
            })
            tempArray = []
        }

        let options = {
            chart: {
                type: 'line',
                marginLeft: 50
            },
            yAxis: {
                title: {
                    text: '',
                },
            },
            title: {
                text: 'DegreeDay Values',
                align: 'left'
            },
            series: finalArray,
            xAxis: {
                categories: data.map(_d => _d.month)
            }
        }

        let chart = new HighChart(options)

        return chart.initOptions()
    }

    render() {
        const {showForm, resultList, cddList, cddChecked, cities, types, selectedType} = this.state
        return (
            <Container fluid>
                {resultList.length === 0 && showForm
                ?
                <>
                    <Row className="mb-5 mt-3">
                        <Col lg="2">
                            <p className="mb-1"><small>City</small></p>
                            <select 
                                className="form-control my-0"
                                ref="city"
                            >
                                {cities.map((el,index) => {
                                    return <option value={el} key={index}>{el}</option>
                                })}
                            </select>
                        </Col>
                        <Col lg="2">
                            <p className="mb-1"><small>Degree Type</small></p>
                            <select 
                                className="form-control my-0"
                                ref="degreeType"
                                onChange={this.changeType}
                            >
                                {types.map((el,index) => {
                                    return <option value={el} key={index}>{el}</option>
                                })}
                            </select>
                        </Col>
                        <Col lg="4">
                            <p className="mb-1"><small>Degree Temp</small></p>
                            <ReactSelect
                                isMulti={true}
                                options={cddList.filter(_el => _el.label.includes(selectedType))}
                                onChange={this.handleDegeeTemp}
                            >
                            </ReactSelect>
                        </Col>
                    </Row>
                   <DegreeDayForm 
                        loadDegrees={this.loadDegrees}
                    />
                </>
                :   
                <>
                    <table className="table">
                        <thead className="bg-light">
                            <tr>
                                <th scope="col" className="border-0">Start Date</th>
                                <th scope="col" className="border-0">End Date</th>
                                <th scope="col" className="border-0">Month</th>
                                {cddChecked.map(_cdd => {
                                    return <th scope="col" className="border-0">{_cdd.label}</th>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {resultList && resultList.length !== 0 && resultList.map((el,index) => {
                                return <tr key={index}>
                                    <td>{el.startDate}</td>
                                    <td>{el.endDate}</td>
                                    <td>{el.month}</td>
                                    {el.value.map(_val => {
                                        return <td>{_val.value}</td>
                                    })}
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <button 
                        className="btn btn-primary"
                        onClick={this.backToForm}
                    >
                        Back to Form
                    </button>
                    <button
                        className="btn btn-primary ml-3"
                        onClick={this.downloadCsvTemplate}
                    >
                        Download Csv File
                    </button>

                    <Card className="mt-4">
                        <HighchartsReact
                            constructorType={"chart"}
                            highcharts={Highcharts}
                            options={this.chartOptions(resultList)}
                        />
                    </Card>
                </>
                }
            </Container>
        )
    }
}

export default DegreeCalculatorContainer

