import { useLayoutEffect, useRef } from 'react'
import { isPhone } from './useHomeScroll.js'
import { reveal } from './reveal.js'

/** Generic fade+slide reveal once an element enters the viewport. */
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, y = 32, children, ...rest }) {
  const ref = useRef(null)

  useLayoutEffect(() => reveal(ref.current, { y: isPhone() ? Math.min(y, 14) : y, opacity: 0 }, { delay }), [delay, y])

  return (
    <Tag className={className} ref={ref} {...rest}>
      {children}
    </Tag>
  )
}
