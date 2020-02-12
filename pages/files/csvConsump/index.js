import React from 'react'
import moment from 'moment'
import {
  Button,
  Card,
  CardHeader,
  Row,
  Col,
  CardBody,
  CardFooter,
} from 'shards-react'
import papaParse from 'papaparse'
import compact from 'lodash/compact'
import { connect } from 'react-redux'

import ConfirmationModal from '../../../src/modals/ConfirmationModal'
import DropzoneArea from '../../../src/components/file-manager-cards/DropzoneArea'
import { publish } from '../../../redux/reducers/uploadCsv'


const validateFileFormat = (csvFileErr, message = '') => {
  if (csvFileErr == false) {
    return (
      <div className="alert alert-success round-pill" role="alert">
        File uploaded Successfully
      </div>
    )
  } else if (csvFileErr == true) {
    return (
      <div className="alert text-center alert-danger" role="alert">
        {message || 'CSV Format Error -download csv Template'}
      </div>
    )
  } 
}

const FormSectionTitle = ({ title, description }) => (
  <Row form>
    <Col className="mb-1">
      <h6 className="form-text m-0">{title}</h6>
      <p className="form-text text-muted m-0">{description}</p>
    </Col>
  </Row>
)

class ConsumCsv extends React.Component {
  state={
    file:null,
    csvData:null,
    fileErr:null,
    fileErrMessage: '',
  }

  postCsvFileData = async data => {
    const result = await this.props.publish({ data })
    if(result){
      if(result.success===true){
        this.setState({
          csvData:null,
          fileErr:null,
        })
        console.log('Response ==>>', result)
        location.reload()
      }
      else console.log('Server Error')
     
      
    }
  }

  handleDrop = (files) => {
    const [file] = files
    console.log(file)
    if(file){
      this.setState({ file })
    }

    // Use reader
    papaParse.parse(files[0], {
      header: true,
      complete: (results) =>  {
        const fileErr = results.data.some(({ month }) => moment(month, 'MMM-YY').format('MMM-YY') !== month)
        if(fileErr) {
          setTimeout(() => {
            this.setState({ fileErr:null, fileErrMessage: 'Date format should be MMM-YY' })
          }, 5000)
          return this.setState({ fileErr, fileErrMessage: 'Date format should be MMM-YY' })
        }
        const rowData = results.data
        const calculatedData = rowData.map(item => {
          const consumption = Object.entries(item)
            .filter(([k, v]) => k)
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
          
          if(consumption.consumption_KWh && !consumption.cost_AED){
            consumption.consumption_KWh = +`${consumption.consumption_KWh}`.replace(/,/g, '.')
            if(consumption.invoice_type === 'Electricity'){
              consumption.cost_AED =  consumption.consumption_KWh * 0.45
              return item 
            }
            if(consumption.invoice_type === 'Water'){
              consumption.cost_AED =  consumption.consumption_KWh * 0.006
              return item
            }
            if(consumption.invoice_type == 'Chilled Water'){
              consumption.cost_AED =  consumption.consumption_KWh * 0.65
              return item
            }
          }else if(consumption.cost_AED && !consumption.consumption_KWh){
            consumption.cost_AED = +`${consumption.cost_AED}`.replace(/,/g, '.')
            if(consumption.invoice_type === 'Electricity'){
              consumption.consumption_KWh =  consumption.cost_AED / 0.45
              return item
            }
            if(consumption.invoice_type === 'Water'){
              consumption.consumption_KWh =  consumption.cost_AED / 0.006
              return item
            }
            if(consumption.invoice_type == 'Chilled Water'){
              consumption.consumption_KWh =  consumption.cost_AED / 0.65
              return item
            }

          } else {
            consumption.consumption_KWh = +`${consumption.consumption_KWh}`.replace(/,/g, '.')
            consumption.cost_AED = +`${consumption.cost_AED}`.replace(/,/g, '.')
            return consumption
          }
        })
       
        this.setState({ csvData:calculatedData }, () => {
          const fileErr = this.props.validateFileFields(
            this.props.fields,
            compact(results.meta.fields)
          )
          if(!fileErr){
            return this.postCsvFileData(this.state.csvData)
          }
          this.setState({ fileErr })
          setTimeout(() => {
            this.setState({ fileErr:null })
          }, 2000)
        })
      },
      dynamicTyping: true,
      skipEmptyLines: true,
    })
  }
  
 
  render(){
    return (
      <>
        <Row form>
          <Col className="mb-1">
            <Card>
              <CardHeader>
                <FormSectionTitle
                  title="Files"
                  description="Upload .csv file"
                />
              </CardHeader>
              <CardBody>
                <div className="upload-manager__files">
                  <Row form>
                    <Col className="mb-3">
                      <DropzoneArea 
                        className="upload-manager__files__dropzone"
                        onDrop={this.handleDrop}
                      />
                    </Col>
                  </Row>
                </div>
              </CardBody>
              <CardFooter>
                {validateFileFormat(this.state.fileErr, this.state.fileErrMessage)}
                <Button style={{ marginLeft:'80px' }} onClick={this.props.downloadCsvTemplate}>Download File Template 
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <ConfirmationModal />
      </>
    )
  }}

export default connect(
  () => ({}),
  (dispatch) => ({
    publish: (data) => dispatch(publish(data)),
  })
)(ConsumCsv)
