import * as React from 'react'
import router from 'next/router'
import { connect } from 'react-redux'
import { parseCookies, destroyCookie, setCookie } from 'nookies'
import { get } from 'lodash'

import agent from '../agent'
import agentDaily from '../agentDaily'
import { setCurrentUser } from '../redux/reducers/users'
import { showStickLoader } from '../redux/reducers/loaders'
import StickLoader from '../src/components/preloadrers/sticks-loader'
import { hasAccess as userHasAcess } from '../src/utils/roles'


export default (Page, options = {}) => {
  const { 
    rules, 
  } = options

  let PageWithUser = class PageWithUser extends React.Component {
    static async getInitialProps(ctx) {
      const {
        pathname,
        req,
        res,
        reduxStore,
        query,
      } = ctx
      const { token } = parseCookies(ctx)

      agent.setToken(token || query.token)
      agentDaily.setToken(token || query.token)
      try {
        const { users } = reduxStore.getState()
        if(!users.currentUser.id) {
          await reduxStore.dispatch(setCurrentUser())
          const { users: { currentUser } } = reduxStore.getState()
          const companyId = get(currentUser, 'companyId')
          agent.setCompanyId(companyId)
          setCookie(ctx, 'companyId', companyId)
        }
      } catch {
        if(ctx.req && !ctx.req.url.includes('/auth')) {
          ctx.res.writeHead(302, { Location: '/auth/login' })
          ctx.res.end()
        } else if (!ctx.req && process.browser && !window.location.pathname.includes('auth')) {
          router.replace('/auth/login')
        }
        destroyCookie(ctx, 'token')
        return destroyCookie(ctx, 'userToken')
      }

      let hasAccess = true
      const { users: { currentUser } } = reduxStore.getState()

      if (rules) {
        hasAccess = userHasAcess(
          { rules }, currentUser
        )
      }

      reduxStore.dispatch(showStickLoader(true))
      let props = {}
      if (typeof Page.getInitialProps === 'function') {
        props = await Page.getInitialProps(ctx)
      }
      reduxStore.dispatch(showStickLoader(false))

      return {
        ...props,
        hasAccess,
        currentUser,
      }
    }

    UNSAFE_componentWillMount() {
      const { companyId, token } = parseCookies()
    
      // WHI
      // DO
      // THE
      // HELL
      // NOBODY
      // TEST
      // IT
      agent.setCompanyId(companyId || 2)
      agent.setToken(token)
      agentDaily.setToken(token)
      agentDaily.setCompanyId(companyId || 2)
    }

    render() {
      return (
        <>
          <StickLoader />
          <Page {...this.props} />
        </>
      )
    }
  }

  return PageWithUser

}
