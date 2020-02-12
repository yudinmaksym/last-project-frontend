import React from 'react'
import {connect} from 'react-redux'
import { Button } from "shards-react";
import Router from 'next/router'

class ProjectsRoute extends React.Component {
    pages() {
        return [
            'Project',
            'MDB',
            'FAHU',
            'CHW',
            'Chiller',
            'FCU',
            'HWP',
        ]
    }

    handleChangePage = (value) => {
        const { selectedData } = this.props
        const query = {
            project: selectedData.project,
            projectId: selectedData.projectId,
            start: selectedData.startDate,
            end: selectedData.endDate
        }

        switch(value) {
            case 'Project': {
                return Router.push({
                    pathname: '/daily/dashboard',
                    query: query
                })
            }
            case 'MDB': {
                return Router.push({
                    pathname: '/mdb-summary/dashboard',
                    query: query
                })
            }
            case 'FAHU': {
                return Router.push({
                    pathname: '/fahu/dashboard',
                    query: query
                })
            }
            case 'CHW': {
                return Router.push({
                    pathname: '/chiller-water-plant/dashboard',
                    query: query
                })
            }
            case 'Chiller': {
                return Router.push({
                    pathname: '/chiller/dashboard',
                    query: query
                })
            }
            case 'FCU': {
                return Router.push({
                    pathname: '/fcu/dashboard',
                    query: query
                })
            }
            case 'HWP': {
                return Router.push({
                    pathname: '/hot-water-plant/dashboard',
                    query: query
                })
            }
            default: return null
        }
    }

    render() {
        const { currentPage } = this.props
        return (
            <div>
                {this.pages().map(_page => {
                    return <Button
                                outline={_page === currentPage ? false : true}
                                onClick={e => this.handleChangePage(e.currentTarget.textContent)}
                            >
                                {_page}
                            </Button>
                })}
            </div>
        )
    }
}

export default connect(
    (state) => ({
    }),
    (dispatch) => ({
    })
)(ProjectsRoute)