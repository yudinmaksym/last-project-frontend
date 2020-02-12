import React from 'react'
import {connect} from 'react-redux'
import {
    Card,
    CardBody,
} from 'shards-react';

class Sidebar extends React.Component {
    render() {
        return(
            <Card className="rounded-0">
                <CardBody className="px-0">
                </CardBody>
            </Card>
        )
    }
}

export default connect(
    (state) => ({
    }),
    (dispatch) => ({
    })
)(Sidebar)