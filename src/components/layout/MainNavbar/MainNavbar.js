import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Container, Navbar, NavbarBrand, FormSelect } from 'shards-react'
import { connect } from 'react-redux'
import { useCookies } from 'react-cookie'
import Router from 'next/router'

import { LAYOUT_TYPES } from '../../../utils/constants'
import { changeCompany } from '../../../../redux/reducers/companies'

import UserActions from './NavbarNav/UserActions'


const takaRoles = ['TakaAdmin', 'TakaUser']

const CompanySelect = ({ onChange, companies = [], company }) => (
  <>
    <FormSelect onChange={onChange}>
      {companies.map(({ id, name }) => (
        <option selected={company.id === id} value={+id} key={id}>{name}</option>
      ))}
    </FormSelect>
  </>
)

const MainNavbar = ({ layout, stickyTop, companies, exchange, currentCompany, currentUser }) => {
  const isHeaderNav = layout === LAYOUT_TYPES.HEADER_NAVIGATION
  const classes = classNames(
    'main-navbar',
    'bg-white',
    stickyTop && 'sticky-top'
  )

  const [companyId, setCompanyId] = useState('')
  const [{ token }, setCookie, destroyCookie] = useCookies([companyId])


  const handleChange = useCallback((e) => {
    setCompanyId(e.target.value)
    destroyCookie('token', { path: '/' })
    exchange({ companyId: e.target.value, token }, setCookie, window.location.pathname)
  }, [companyId])

  const handleNotification = () =>{
    Router.push('/files/Notification')
  }

  return (
    <div className={classes}>
      <Container fluid={!isHeaderNav || null} className="p-0">
        <Navbar type="light" className="align-items-center justify-content-end flex-md-nowrap p-0">
          {isHeaderNav && (
            <NavbarBrand href="/" style={{ lineHeight: '25px' }}>
              <div className="d-table m-auto">
                <img
                  id="main-logo"
                  className="d-inline-block align-top mr-1 ml-3"
                  style={{ maxWidth: '40px' }}
                  src={'/img/logo.jpg'}
                  alt=""
                />
                <span className="d-none d-md-inline ml-1">
                  Dashboard
                </span>
              </div>
            </NavbarBrand>
          )}
          <div className='d-flex align-items-center'>
            <i onClick={handleNotification} className="material-icons icons-style">notification_important</i>
            {<span className="d-none d-md-inline-block p-1">Company: </span>}
            { takaRoles.includes(currentUser.role)
              ? <CompanySelect companies={companies} company={currentCompany} onChange={handleChange} />
              : <span>{ currentCompany.name }</span>}

          </div>
          <UserActions />
        </Navbar>
      </Container>
    </div>
  )
}

MainNavbar.propTypes = {
  /**
   * The layout type where the MainNavbar is used.
   */
  layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool,
}

MainNavbar.defaultProps = {
  stickyTop: true,
}

export default connect(
  ({ companies, users }) => ({
    companies: companies.list,
    currentCompany: companies.currentCompany,
    currentUser: users.currentUser,
  }),
  (dispatch) => ({
    exchange: (...args) => dispatch(changeCompany(...args)),
  })
)(MainNavbar)
