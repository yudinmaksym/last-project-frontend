import React from 'react'
import agentDaily from '../../../agentDaily'
import {connect} from 'react-redux'
import {
    getCurrentUser,
    loadCurrentUser
} from '../../../redux/reducers/users'
import {
    Button,
} from 'shards-react'
import ZendeskForm from './ZendeskForm'

class ZendeskWidget extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { 
            collapse: false,
            currentUser: [] ,
            fields: []
        };
    }

    componentDidMount() {
        this.getFiledList()
        this.getCurrentUser()
    }

    getFiledList = async () => {
        const response = await agentDaily.Zendesk.getFieldsList()
            .then(res => res)
        this.setState({fields: response})
    }

    getCurrentUser = async () => {
        const response = await this.props.loadCurrentUser()
            .then(res => res)
        this.setState({currentUser: response})
    }
    
    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        const {fields, currentUser} = this.state
        return (
            <div style={{
                position: "fixed", 
                bottom: 25, 
                right: 25, 
                zIndex: 1000,
                maxWidth: 400, 
                width: '100%' 
            }}>
                {this.state.collapse 
                    ? <ZendeskForm 
                        toggle={() => this.toggle()} 
                        fields={fields} 
                        user={currentUser} 
                      /> 
                    : <Button className="ml-auto d-block" pill onClick={this.toggle}>Help</Button>
                }
            </div>
        )
    }
}

export default connect(
    (state) => ({
        currentUser: getCurrentUser(state)
    }),
    (dispatch) => ({
        loadCurrentUser: () => dispatch(loadCurrentUser())
    })
)(ZendeskWidget)