import { useEffect, useRef } from 'react'
import { gsap, isPhone, prefersReducedMotion } from './useHomeScroll.js'

/** Generic fade+slide reveal once an element enters the viewport. */
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, y = 32, children, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return undefined
    const phone = isPhone()
    const tween = gsap.from(el, {
      y: phone ? Math.min(y, 14) : y,
      opacity: 0,
      duration: phone ? 0.45 : 0.9,
      ease: phone ? 'power2.out' : 'power3.out',
      delay: phone ? 0 : delay,
      scrollTrigger: { trigger: el, start: phone ? 'top 98%' : 'top 88%', once: true },
    })
    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill()
      tween.revert()
    }
  }, [delay, y])

  return (
    <Tag className={className} ref={ref} {...rest}>
      {children}
    </Tag>
  )
}
