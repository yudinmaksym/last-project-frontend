import React from 'react'
import { connect } from 'react-redux'
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
} from 'shards-react'
import { getFormValues, reset } from 'redux-form'

import TakaUserDetailsForm from '../forms/userManagment/takaUserDeatails'
import { 
  updateUser,
  createUser,
  SET_ERROR,
  setSelectedUser,
} from '../../redux/reducers/users'


const EditUserContainer = ({
  selecterUser,
  updateUser,
  createNewUser,
  isNew,
  error,
  company,
  currentUser,
  formValues,
  // projectList,
  setError,
  resetPage,
}) => {
  const projects = (selecterUser.projectMap || []).map(({ project }) => {
    return {
      label: project && project.name,
      value: project && project.id,
      companyId: project && project.company_id,
    }})

  const projectList = currentUser.projectMap.map(({ project }) => ({
    project: project && project.name,
    project_id: project && project.id,
    companyId: project && project.company_id,
  }))
  console.log(projectList)

  Object.assign(selecterUser, { projects })
  const handleSubmit = (data) => {
    return isNew
      ? createNewUser(data)
      : updateUser(data.id, data)
  }
  return (
    <div className="edit-project mb-4">
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">User Details</h6>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <TakaUserDetailsForm
                  projectList={projectList}
                  currentUser={currentUser}
                  initialValues={isNew ? {} : selecterUser}
                  userProject={projects}
                  formValues={formValues}
                  onSubmit={handleSubmit}
                  isNew={isNew}/>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Card>
    </div>
  )
}

export default connect(
  (state) => ({
    selecterUser: state.users.selectedUser,
    error: state.users.error,
    company: state.companies.currentCompany,
    currentUser: state.users.currentUser,
    formValues: getFormValues('takaUserDetails')(state),
    projectList: state.projects.list.items,
  }), 
  (dispatch) => ({
    updateUser: (id, data) => dispatch(updateUser(id, data)),
    createNewUser: (data) => dispatch(createUser(data)),
    setError: (error) => dispatch({ type: SET_ERROR, payload: error }),
    resetPage: () => {
      dispatch(setSelectedUser({}))
      dispatch(reset('takaUserDetails'))
    },
  })
)(EditUserContainer)