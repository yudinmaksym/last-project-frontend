import * as React from 'react'
import cn from 'classnames'
import Link from 'next/link'


export default ({ to, title, target, children, className, style, onClick }) => (
  <Link href={to}>
    <a href={to} target={target} className={cn('nav-link', className)} onClick={onClick} style={style} title={title}>
      {children}
    </a>
  </Link>
)
