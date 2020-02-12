import * as React from 'react'
import Link from 'next/link'


export default ({ to, title, target, children, className, style, onClick }) => (
  <Link href={to}>
    <a href={to} target={target} className={className} onClick={onClick} style={style} title={title}>
      {children}
    </a>
  </Link>
)
