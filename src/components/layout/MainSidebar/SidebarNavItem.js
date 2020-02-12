import React from 'react'
import PropTypes from 'prop-types'
import {
  NavItem,
  DropdownMenu,
  DropdownItem,
  Collapse,
} from 'shards-react'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import cn from 'classnames'

import NavLink from '../../common/NavLink'
import { toggleItem } from '../../../../redux/reducers/navigation'


class SidebarNavItem extends React.Component {

  toggleDropdown = (item) => (e) => this.props.toggle(item)

  isActive = () => {
    // console.log('this.props.item.to', this.props.router)
    return this.props.router.pathname === this.props.item.to
  }

  render() {
    const { item } = this.props
    const hasSubItems = item.items && item.items.length
    
    if (!item.title) {
      return null
    }

    return (
      <li className='nav-item' style={{ position: 'relative' }}>
        <NavLink
          className={cn({
            'dropdown-toggle': hasSubItems,
            'active': this.isActive(),
          })}
          to={hasSubItems ? '#' : item.to}
          onClick={this.toggleDropdown(item)}
        >
          {item.htmlBefore && (
            <div
              className="d-inline-block item-icon-wrapper"
              dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
            />
          )}
          {item.title && <span>{item.title}</span>}
          {item.htmlAfter && (
            <div
              className="d-inline-block item-icon-wrapper"
              dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
            />
          )}
        </NavLink>
        {hasSubItems && (
          <Collapse tag={DropdownMenu} small open={true} style={{ top: 0 }}>
            {item.items.map((subItem, idx) => (
              <DropdownItem 
                key={idx} 
                tag={NavLink} 
                to={subItem.to}
                className={cn({
                  'active': this.isActive(),
                })}
              >
                {subItem.title}
              </DropdownItem>
            ))}
          </Collapse>
        )}
      </li>
    )
  }
}

SidebarNavItem.propTypes = {
  /**
   * The item object.
   */
  item: PropTypes.object,
}

export default connect(
  (state) => ({
    

  }),
  (dispatch) => ({
    toggle: (item) => dispatch(toggleItem(item)),
  })
)(withRouter(SidebarNavItem))