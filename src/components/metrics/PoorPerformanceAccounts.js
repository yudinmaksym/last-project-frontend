import * as React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import {
  Card,
  CardBody, CardHeader, Col, Row,
  Nav, NavItem, NavLink,
} from 'shards-react'
import moment from 'moment'
import Router from 'next/router'

import DebounceTableHeader from '../../fields/DebounceTableHeader'
import {
  getLoading,
  getAll,
  getDatas,
  getComparisonMonths,
  getCurrentCompany,
} from '../../../redux/reducers/poorPerformanceAccounts'

import PoorPerformanceProjects from './poorPerformanceProjects'


class poorPerformanceAccounts extends React.Component {
 state={
   selectedTab:'Accounts',
 }

 componentDidMount() {
   this.props.getAll()
 }

 componentDidUpdate(prevProps) {
   if(prevProps.currentCompany !== this.props.currentCompany){
     this.props.getAll()
   }
 }

  goToAlarmingList = () => {
    this.state.selectedTab === 'Accounts'
      ? Router.push('/files/Notification')
      : Router.push({ pathname:'/files/Notification', query:{type:'project'} })
  }

  handleAccountsClick = () => {
    this.setState({
      selectedTab:'Accounts',
    })
  }
  handleProjectsClick = () => {
    this.setState({
      selectedTab:'Projects',
    })
  }

  getColumns() {
    return [
      {
        Header: () => (
          <DebounceTableHeader title={'Project'} />
        ),
        headerClassName: 'd-flex align-items-center justify-content-left',
        accessor: 'projectName',
        minWidth: 110,
        className: 'text-center d-flex align-items-left',
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Account'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'accountNumber',
        minWidth: 87,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Fuel Type'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'fuelType',
        minWidth: 75,
        className: 'text-center d-flex align-items-center',
      },
      {
        Header: () => (
          <DebounceTableHeader title={'Diff(%)'} />
        ),
        headerClassName: 'd-flex align-itens-center justify-content-center',
        accessor: 'difference',
        minWidth: 55,
        className: 'text-center d-flex align-items-center',
      },
    ]
  }

  render() {
    const {
      loading,
      poorPerformanceData,
      comparisonMonth,
    } = this.props
    const { selectedTab } = this.state
    const months = comparisonMonth && comparisonMonth.split('_') || []
    const tableColumns = this.getColumns()
    return (
      <div>
        <Card>
          <CardHeader className="border-bottom pb-0 pt-3 px-3">
            <Row className="m-0">
              <Col lg="10" md="10" sm="10" className="p-0">
                <h6 className="m-0 w-100">{`Worst Performing ${selectedTab}`}</h6>
                <h6 className="w-100 small-text mb-0">
                  {`${moment(months[0]).format('MMM YYYY')} VS ${moment(months[1]).format('MMM YYYY')}`}</h6>
              </Col>
              <Col lg="2" md="2" sm="2" className="px-0 d-flex justify-content-end">
                <i className="material-icons" style={{ cursor:'pointer',fontSize:25 }}
                  onClick={this.goToAlarmingList}>notification_important</i>
              </Col>
            </Row>
            <Nav tabs className="justify-content-end">
              <NavItem>
                <NavLink style={selectedTab==='Accounts'?{ fontWeight:'bold' }:{} } onClick={this.handleAccountsClick}>
                  Accounts
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink style={selectedTab==='Projects'?{ fontWeight:'bold' }:{}} onClick={this.handleProjectsClick}>Projects</NavLink>
              </NavItem>
            </Nav>
          </CardHeader>
          <CardBody className="p-0 poorPerformance">
            { selectedTab === 'Accounts'&&<ReactTable
              showPageSizeOptions={false}
              showPagination={false}
              showPageJump={false}
              columns={tableColumns}
              sortable={true}
              manual

              loading={loading}
              pageSize={10}
              resizable={false}

              data={poorPerformanceData}
            />}
            {
              selectedTab === 'Projects'&&<PoorPerformanceProjects/>
            }
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default connect(
  (state) => ({

    loading: getLoading(state),
    poorPerformanceData: getDatas(state),
    comparisonMonth: getComparisonMonths(state),
    currentCompany:getCurrentCompany(state),

  }),
  (dispatch) => ({
    getAll: () => dispatch(getAll()),
  })
)(poorPerformanceAccounts)

