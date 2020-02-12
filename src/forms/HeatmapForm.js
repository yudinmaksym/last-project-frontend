import * as React from 'react'
import * as _ from 'lodash'
import { Field,  reduxForm } from 'redux-form'
import moment from 'moment'
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from 'shards-react'
import uniqBy from 'lodash/uniqBy'

// import DateRangeField from '../fields/DateRangeField'
import FuelTypeField from '../fields/FuelTypeField'
import ZoneField from '../fields/ZoneField'


export const FORM_KEY = 'heatmap'

const MONTHS = ['Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan']

let HeatmapForm = props => {

  const getHeatmapData =()=>{
    let years=[]
    props.meters.map((data)=>{
      data.dataset.map((label)=>{
        years.push(label.label)
      })
    })
    return uniqBy(years).sort((a, b) => b-a)
  }

  const years=getHeatmapData()

  return (
    <form onSubmit={props.handleSubmit} className="heatmap-container">
      <Card className="p-0">

        <CardHeader className="border-bottom">
          <Field
            name="zoneId"
            component={ZoneField}
            onChange={props.onZoneChange}
          />
          <div className="heatmap-select">
            {/*<Field*/}
            {/*  name="dateRange"*/}
            {/*  component={DateRangeField}*/}
            {/*  onChange={props.onZoneChange}*/}
            {/*/>*/}
            <Field
              name="fuel_type"
              label="Fuel Type"
              component={FuelTypeField}
              onChange={props.onZoneChange}
            />
          </div>
        </CardHeader>

        <CardBody
          className="p-0"
          style={{ 'width': '100%','overflowX': 'auto' }}
        >
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0 heatmap-container__col heatmap-container__col--empty">
                &nbsp;
                </th>
                {props.meters.map(meter =>
                  years.length > 0 && <th
                    scope="col"
                    className="border-0 heatmap-container__col heatmap-container__col--meter"
                    key={meter.account_number}
                  >
                    <div>
                      <span>
                        {meter.account_number}
                      </span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {years.map((data)=>{
                return MONTHS.map(m =>
                  moment().diff(`${m} ${data}`, 'months') > 0 && <tr key={m}>
                    <td
                      className="heatmap-container__col heatmap-container__col--month"
                    >
                      <span>
                        {`${m} ${data}`}
                      </span>
                    </td>
                    {props.meters.map((meter,i) => {
                      const index = _.findIndex(meter.dataset, (m) => m.label == data)
                      const className = 'heatmap-container__col heatmap-container__col--value '
                        + (_.get(meter, `dataset.${index}.data.${m}`,false)?' heatmap-container__filldata' : '')
                      return <td key={i} className={className}>
                        {_.get(meter, `dataset.${index}.data.${m}`)
                        &&_.get(meter, `dataset.${index}.data.${m}`).toFixed()}
                      </td>
                    })}
                  </tr>
                )
              })
              }
            </tbody>
          </table>
        </CardBody>

        <CardFooter className="border-top">
        </CardFooter>
      </Card>
    </form>
  )
}

HeatmapForm = reduxForm({
  form: FORM_KEY,
  enableReinitialize: true,
  fields: [

  ],
})(HeatmapForm)

export default HeatmapForm


