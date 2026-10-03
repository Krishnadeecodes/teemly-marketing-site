import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from './useHomeScroll.js'

/** Generic fade+slide reveal once an element enters the viewport. */
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, y = 32, children, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return undefined
    const tween = gsap.from(el, {
      y,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
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
