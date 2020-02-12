import React from 'react'
import {connect} from 'react-redux'
import ProjectCheckList from './ProjectCheckList'

class ProjectFilter extends React.Component {
    state = {
        toggleCheckList: false
    }

    formatBuildings = () => {
        return this.props.projects.map(_project => ({
          value: _project.id,
          label: _project.iot_name,
          selected: true,
        }))
    }

    handleBuildingsCheck = (data) => {
        const {start, end} = this.props
        const { buildings = [] } = data
        const checkedBuildingsIds = buildings.filter(_b => _b.selected).map(_b => { return  {iot_name: _b.label, id: _b.value} })
        this.props.loadAllData(start, end, checkedBuildingsIds)
    }

    render() {
        const {projects} = this.props
        return(
            <div style={{position: 'relative'}}>
                <p className="mb-1"><small>Project Filter</small></p>
                <div className="form-control" onClick={() => this.setState({toggleCheckList: !this.state.toggleCheckList})}>
                    Click to select projects
                </div>
                {this.state.toggleCheckList && projects 
                && 
                    <div
                        style={{
                            position: "absolute",
                            top: 60,
                            left: 0,
                            flex: 1,
                            backgroundColor: 'white',
                            paddingTop: 15,
                            paddingBottom: 15,
                        }}
                    >
                        {projects && <ProjectCheckList
                            onChange={this.handleBuildingsCheck}
                            title={"Projects"}
                            initialValues={{
                                buildings: this.formatBuildings(),
                            }}
                        />}
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    (state) => ({
    }),
    (dispatch) => ({
    })
)(ProjectFilter)
