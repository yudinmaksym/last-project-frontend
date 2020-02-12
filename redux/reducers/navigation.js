import getItemsData from '../../src/data/sidebar-nav-items'

// actions
export const TOGGLE_ITEM = 'TOGGLE_ITEM'

const formatItem = (item) => {
  return item.items ? ({
    ...item,
    items: item.items.map(formatItem),
  }) : ({
    ...item,
    open: false,
  })
}

const formatItems = (items) => {
  return items.map(formatItem)
}

// state
const initialState = {
  items: formatItems(getItemsData()),
}

const openItemGroup = (items, item) => {
  const nextItems = [ ...items ]

  let navGroupIdx = null
  let navItemIdx = null

  items.forEach((navItem, _idx) => {
    const __idx = navItem.items.indexOf(item)
    if (__idx !== -1) {
      navGroupIdx = _idx
      navItemIdx = __idx
    }
  })

  return nextItems.map((g,i) => i === navGroupIdx ? ({
    ...g,
    open: !g.open,
  }) : ({
    ...g,
    open: false,
  }))
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
  case TOGGLE_ITEM:
    return {
      ...state,
      items: openItemGroup(state.items, action.payload.item),
    }

  default: 
    return state
  }

}

// actions handlers

export const toggleItem = (item) => ({
  type: TOGGLE_ITEM,
  payload: {
    item,
  },
})

// getters
export const getItems = (state) => state && state.navigation && state.navigation.items