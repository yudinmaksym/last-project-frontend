import React from 'react'
import { 
  Nav,
  Collapse,
  DropdownItem,
  DropdownMenu,
} from 'shards-react'
import cn from 'classnames'
import { connect } from 'react-redux'
import { remove } from 'lodash'
import { withRouter } from 'next/router'

import { hasAccess as userHasAcess } from '../../../utils/roles'
import { getItems } from '../../../../redux/reducers/navigation'
import NavLink from '../../common/NavLink'

import SidebarNavItem from './SidebarNavItem'


const adminSection = {
  title: 'Admin',
  items: [
    {
      title: 'Taka users',
      to: '/users/taka-users',
      htmlBefore: '<i class="material-icons">table_chart</i>',
      htmlAfter: '',
    },
    {
      title: 'Customers',
      to: '/customers',
      htmlBefore: '<i class="material-icons">list_alt</i>',
      htmlAfter: '',
    },
  ],
}

class SidebarNavItems extends React.Component {

  state = {
    openId: 'dashboard',//null,
  }

  handleDropdownItemClick = (id) => (e) => {
    e.preventDefault()
    const { openId } = this.state

    return openId === id 
      ? this.setState({ openId: null })
      : this.setState({ openId: id })
  }

  isActive = (to) => this.props.router.pathname === to

  renderDropdownItem = (nav, index) => (
    <div key={nav.title || index}>
      <Nav className="nav--no-borders flex-column">
        <li className='nav-item' style={{ position: 'relative' }}>
          <NavLink
            className={cn('dropdown-toggle')}
            to={'#'}
            onClick={this.handleDropdownItemClick(nav.id)}
          >
            {nav.htmlBefore && (
              <div
                className="d-inline-block item-icon-wrapper"
                dangerouslySetInnerHTML={{ __html: nav.htmlBefore }}
              />
            )}
            {nav.title && <span>{nav.title}</span>}
            {nav.htmlAfter && (
              <div
                className="d-inline-block item-icon-wrapper"
                dangerouslySetInnerHTML={{ __html: nav.htmlAfter }}
              />
            )}
          </NavLink>
          <Collapse 
            tag={DropdownMenu} 
            small 
            open={nav.id === this.state.openId} 
            style={{ top: 0 }}
          >
            {nav.items.map((subItem, idx) => (
              <DropdownItem 
                key={idx} 
                tag={NavLink} 
                to={subItem.to}
                className={cn({
                  'active': this.isActive(subItem.to),
                })}
              >
                {subItem.title}
              </DropdownItem>
            ))}
          </Collapse>
        </li>
      </Nav>
    </div>
  )

  renderGeneralItem = (nav, index) => (
    <div key={nav.title || index}>
      {nav.title && <h6 className="main-sidebar__nav-title">{nav.title}</h6>}
      {(nav.items && nav.items.length) ? (
        <Nav className="nav--no-borders flex-column">
          {nav.items.map((item) => (
            <SidebarNavItem 
              key={item.to} 
              item={item}
            />
          ))}
        </Nav>
      ) : null}
    </div>
  )

  renderItem = (nav, index) => nav.dropdown 
    ? this.renderDropdownItem(nav, index) 
    : this.renderGeneralItem(nav, index)

  hideEmptyGroups = (group) => group.items 
    ? group.items.length !== 0 
    : true

  filterItemsByUser = (items, currentUser) => 
    items.map(_item => _item.items 
      ? ({
        ..._item,
        items: this.filterItemsByUser(_item.items, currentUser),
      }) : ({ 
        ..._item, 
      }))
      .filter(_item => userHasAcess(_item, currentUser))
      .filter(this.hideEmptyGroups)

  render() {
    const { currentUser } = this.props
    let { items } = this.props
    if(currentUser.role === 'TakaAdmin') {
      if(!items.some(({ title }) => title === 'Admin')) {
        items.push(adminSection)
      }
      const projectSection = items.find(({ title }) => title === 'Projects')
      if(!projectSection.items.some(({ title }) => title === 'Projects Info')) {
        projectSection.items.push({
          title: 'Projects Info',
          to: '/projects/info',
          htmlBefore: '<i class="material-icons">table_chart</i>',
          htmlAfter: '',
        })
      }
    } else {
      const projectSection = items.find(({ title }) => title === 'Projects')
      remove(projectSection.items, ({ title }) => title === 'Projects Info')
      remove(items, ({ title }) => title === 'Admin')
    }

    items = this.filterItemsByUser(items, currentUser)

    return (
      <div className="nav-wrapper">
        {items.map(this.renderItem)}
      </div>
    )
  }
}

export default connect(
  (state) => ({
    currentUser: state.users.currentUser,
    items: getItems(state),
  }),
  () => ({})
)(withRouter(SidebarNavItems))
