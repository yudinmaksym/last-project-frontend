import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
} from 'shards-react'
import { useCookies } from 'react-cookie'
import Router from 'next/router'

import { ROLES } from '../../../../utils/roles'
import Link from '../../../common/Link'
import { getCurrentUser } from '../../../../../redux/reducers/users'
import { getCompany } from '../../../../../redux/reducers/companies'


const LOGOUT_URL = '/auth/login'

const UserActions = ({ user, company }) => {
  const [ visible, setVisible ] = useState(false)
  const [ cookies, setCookie, removeCookie ] = useCookies(['token', 'userToken'])

  const onToggle = () => setVisible(!visible)

  const handleLogout = () => {
    removeCookie('token')
    removeCookie('userToken')
    removeCookie('companyId')
    // Router.replace('/auth/login')
    Router.replace(LOGOUT_URL, LOGOUT_URL, { shallow: true })
  }


  const isAdmin = user && (
    user.role === ROLES.ADMIN
    || user.role === ROLES.SUPERADMIN
  )

  return (
    <Dropdown
      open={visible}
      toggle={onToggle}
      className="mr-2"
    >
      <DropdownToggle tag={'span'} caret className="btn border-0 nav-link text-nowrap px-3">
        {user.picture && <img
          className="user-avatar rounded-circle mr-2"
          src={user.picture}
          alt="User Avatar"
        />}{' '}
        <span className="d-none d-md-inline-block p-1">{user.name}</span>
      </DropdownToggle>
      <DropdownMenu small right>
        <DropdownItem tag={Link} to={`/users/edit?id=${user.id}`}>
          <i className="material-icons">&#xE8B8;</i> Edit Profile
        </DropdownItem>
        {/* Only Visible To Admin Links */}
        {isAdmin && (
          <>
            <DropdownItem tag={Link} to={'/users'}>
              <i className="material-icons">supervisor_account</i> Manage Users
            </DropdownItem>
          </>
        )}
        {/* / Admin Links */}
        <DropdownItem tag={Link} to={'/calendar'}>
          <i className="material-icons">date_range</i> Calendar
        </DropdownItem>
        <DropdownItem tag={Link} to={'/help'}>
          <i className="material-icons">help_outline</i> Help Center
        </DropdownItem>
        <DropdownItem onClick={handleLogout} className="text-danger">
          <i className="material-icons text-danger">&#xE879;</i> Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default connect(
  (store) => ({
    user: getCurrentUser(store.users),
    company: getCompany(store),
  })
)(UserActions)

