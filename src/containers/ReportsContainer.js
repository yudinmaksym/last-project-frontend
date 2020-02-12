import * as React from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import { parseCookies } from 'nookies'
import { formValueSelector } from 'redux-form'
import {
  Container,
} from 'shards-react'

import ReportForm, { FORM_KEY as GENERATE_REPORT_FORM_KEY }  from '../forms/reporting/ReportForm'


const baseUrl = 'https://llix9i7cij.execute-api.us-east-1.amazonaws.com/dev/pdf'
const buildUrl = (type, range, token) => {
  return `${baseUrl}?url=${'http://3.92.196.103'}/${type.split(' ').join('%20')}?token=${token}&range=${range}`
}

class ReportsContainer extends React.Component {

  printPage = (url) => {
    if(window) {
      const link = document.createElement('a')
      link.href = url
      link.download='report.pdf'
      link.target='_blank'
      link.click()
    }
  }

  handleSubmit = (data) => {
    const {
      type,
      year,
      month,
      zone,
      project,
    } = data

    const { token } = parseCookies()


    let params = `type=${type}&year=${year}&month=${month}&token=${token}`

    if (type === 'zone') {
      params += `&id=${zone.value}`
    }

    if (type === 'project') {
      params += `&id=${project}` 
    }

    // dev debugg
    // if (false) {
    //   Router.push(
    //     '/reporting/report?' + params
    //   )
    //   return console.dir(params)
    // }
    
    const printUrl = `${baseUrl}?url=${'http://3.92.196.103/reporting/report'}&${params}`
    this.printPage(printUrl)
  }

  render() {
    const { type } = this.props
    return (
      <Container>
        <ReportForm
          onSubmit={this.handleSubmit}
          type={type}
        />
      </Container>
    )
  }

}

const selector = formValueSelector(GENERATE_REPORT_FORM_KEY)

export default connect(
  (state) => ({
    type: selector(state, 'type'),
  }),
  (disaptch) => ({

  })
)(ReportsContainer)
