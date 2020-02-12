import React, {useEffect, useState} from 'react'
import agentDaily from '../../../agentDaily'

import {
    Form,
    FormInput,
    FormGroup,
    FormSelect,
    Card,
    Button,
    CardHeader,
    FormTextarea,
    CardBody,
    CardFooter, 
} from 'shards-react'
import { Field, reduxForm } from 'redux-form'

const ZendeskForm = (props) => {
    const [location, setLocation] = useState('')

    useEffect(() => {
        getLocation()
    },[setLocation])

    const getLocation = async () => {
        fetch('http://gd.geobytes.com/GetCityDetails')
            .then(res => res.json())
            .then(result => setLocation(result))
            .catch(error => console.log(error))
    }

    const renderSelectField = (props) => {
        return <FormGroup key={props.position}>
                    <label htmlFor={props.title}>{props.agent_description}</label>
                    <FormSelect 
                        id={props.title} 
                        required={props.required_in_portal}
                        onChange={props.input.onChange}
                    >   
                        <option value="">-</option>
                        {props.custom_field_options && props.custom_field_options.map(_option => {
                            return <option 
                                        value={_option.value} 
                                        id={_option.id}
                                        key={_option.id}
                                    >
                                    {_option.raw_name}
                                </option>
                        })}
                    </FormSelect>
                </FormGroup>
    }

    const renderInputField = (data) => {
        return <FormGroup key={data.position}>
                    <label htmlFor={data.title}>{data.title_in_portal}</label>
                    <FormInput 
                        onChange={data.input.onChange}
                        id={data.title}
                        defaultValue={data.title === "Subject" ? props.user.email : null}
                        placeholder={data.description || data.title_in_portal} 
                        required={data.required_in_portal} 
                    />
                </FormGroup>
    }

    const renderTextareaField = (data) => {
        return <FormGroup key={data.position}>
                    <label htmlFor={data.title}>{data.title}</label>
                    <FormTextarea 
                        onChange={data.input.onChange}
                        id={data.title} 
                        placeholder={data.description || data.title} 
                        required={data.required_in_portal} 
                    />
                </FormGroup>
    }

    const sendTicket = async (values) => {
        const body = JSON.stringify({
            "request": {
              "requester": {"name": values["Subject Name"],  "email": `${!values["Subject"] ? props.user.email : values["Subject"]}`},
              "subject": values["Description"],
              "comment": {"body": values["Description"] },
              "custom_fields": [{
                  "id": 360007084380,
                  "value": values["Problem"]
              }, {
                  "id": 360007137420,
                  "value": values["Priority"]
              }, {
                  "id": 360007143400,
                  "value": `${window.navigator.appVersion}`
              }, {
                  "id": 360007292939,
                  "value": `${window.navigator.platform}`
              }, {
                  "id": 360007196940,
                  "value": values["Subject Name"]
              }, {
                  "id": 360007247419,
                  "value": `${props.user.id}`
              }, {
                  "id": 360007272900,
                  "value": `${props.user.companyId}`
              }, {
                  "id": 360007292899,
                  "value": `${props.user.name}`
              }, {
                  "id": 360007292919,
                  "value": `${props.user.role}`
              }, {
                  "id": 360007246739,
                  "value": location.geobytesipaddress
              }]
            }
        })

        return agentDaily.Zendesk.createTicket(body)
            .then(res => console.log(res))
    }

    return(
        
        <Form onSubmit={props.handleSubmit(sendTicket)}>
            <Card>
                <CardHeader className="justify-content-between d-flex border-bottom py-2 align-items-center">
                    Support with a smile
                    <Button style={{ fontSize: 20 }} theme="light" onClick={props.toggle}><b>-</b></Button>
                </CardHeader>
                <CardBody className="py-2" style={{maxHeight: 350, overflow: 'auto' }}>
                    {props.fields && props.fields.ticket_fields && props.fields.ticket_fields.map(_field => {
                        if(_field.editable_in_portal && _field.active){
                            switch(_field.type) {
                                case 'tagger': {
                                    return <Field 
                                        name={_field.title}
                                        component={renderSelectField}
                                        {..._field}
                                    />
                                } 
                                case 'textarea': case 'description': {
                                    return <Field 
                                        name={_field.title}
                                        component={renderTextareaField}
                                        {..._field}
                                    />
                                } 
                                default: {
                                    return <Field 
                                        name={_field.title}
                                        component={renderInputField}
                                        {..._field}
                                    />
                                }
                            }
                        }
                    })}
                </CardBody>
                <CardFooter>
                    <Button disabled={props.submitting} style={{ fontSize: 18 }} className="ml-auto d-block">Send</Button>
                </CardFooter>
            </Card>
        </Form>
    )
}

export default reduxForm({
    form: 'zendeskForm', // <------ same form name
    destroyOnUnmount: false,
})(ZendeskForm)