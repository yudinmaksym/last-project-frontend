const USER = 'User'
const ADMIN = 'Admin'
const SUPERADMIN = 'TakaAdmin'

export const ROLES = {
  USER,
  ADMIN,
  SUPERADMIN,
}

export const hasAccess = (item = {}, currentUser = {}) => {
  const { rules } = item
  if (!rules) {
    return true
  }

  // DEBUG
  // console.log(item.title, rules, currentUser.role, currentUser.companyId)
    
  const { companies, roles } = rules
    
  if (companies) {
    if (companies.indexOf(currentUser.companyId) != -1) {
      return false
    }
  }

  if (roles) {
    if (roles.indexOf(currentUser.role) != -1) {
      return false
    }
  }
    
  return true
}