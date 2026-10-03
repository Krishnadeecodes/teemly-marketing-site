import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from './useHomeScroll.js'

function drawLogo(ctx, g) {
  ctx.save()
  ctx.translate(g.ox, g.oy)
  ctx.scale(g.k, g.k)
  const stem = ctx.createLinearGradient(0, 40, 0, 95)
  stem.addColorStop(0, '#F62DA0')
  stem.addColorStop(1, '#E91E63')
  ctx.fillStyle = stem
  ctx.beginPath()
  ctx.moveTo(37, 40)
  ctx.lineTo(62, 40)
  ctx.lineTo(62, 82)
  ctx.arc(49.5, 82, 12.5, 0, Math.PI)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#032297'
  ctx.beginPath()
  ctx.moveTo(37, 40)
  ctx.lineTo(62, 40)
  ctx.lineTo(37, 55)
  ctx.closePath()
  ctx.fill()

  const bar = ctx.createLinearGradient(6, 0, 94, 0)
  bar.addColorStop(0, '#0187E0')
  bar.addColorStop(0.5, '#03A6DD')
  bar.addColorStop(1, '#07D7D9')
  ctx.fillStyle = bar
  ctx.beginPath()
  const x = 6, y = 16, w = 88, h = 26, r = 13
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2)
  ctx.lineTo(x + r, y + h)
  ctx.arc(x + r, y + r, r, Math.PI / 2, Math.PI * 1.5)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

export default function ParticleT({ heroRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const hero = heroRef.current
    const canvas = canvasRef.current
    if (!hero || !canvas) return undefined
    const ctx = canvas.getContext('2d')

    let W = 0, H = 0, geo = null, parts = [], amb = []
    let rad = 2
    const mouse = { x: -9999, y: -9999 }
    let scrollP = 0
    const t0 = performance.now()
    let raf = null
    let visible = true

    function layout() {
      const r = hero.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      W = r.width
      H = r.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const mobile = W < 900
      let S, cx, cy
      if (mobile) {
        S = Math.min(W * 0.78, 340)
        cx = W / 2
        cy = H - S * 0.55 - 20
      } else {
        S = Math.min(H * 0.6, W * 0.32, 460)
        cx = Math.min(W * 0.78, W / 2 + Math.min(W, 1240) / 2 - S * 0.5)
        cy = H * 0.48
      }
      geo = { S, cx, cy, k: S / 100, ox: cx - (50 * S) / 100, oy: cy - (55 * S) / 100 }

      const oc = document.createElement('canvas')
      oc.width = Math.ceil(W)
      oc.height = Math.ceil(H)
      const o = oc.getContext('2d')
      drawLogo(o, geo)
      const gap = Math.max(6, Math.round(S / 46))
      const data = o.getImageData(0, 0, oc.width, oc.height).data
      const tg = []
      for (let y = Math.floor(geo.oy); y < geo.oy + S; y += gap) {
        for (let x = Math.floor(geo.ox); x < geo.ox + S; x += gap) {
          if (x < 0 || y < 0 || x >= oc.width || y >= oc.height) continue
          const i = (y * oc.width + x) * 4
          if (data[i + 3] > 200) tg.push({ x, y, c: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})` })
        }
      }
      rad = gap * 0.34

      parts = tg.map((t, i) => {
        const p = parts[i] || {
          x: Math.random() * W,
          y: Math.random() * H,
          vx: 0,
          vy: 0,
          sx: Math.random() * W,
          sy: Math.random() * H,
          d: Math.random() * 1.1,
          rx: Math.random() * 2 - 1,
          ry: Math.random() * 0.8 + 0.2,
          ph: Math.random() * 6.283,
        }
        p.tx = t.x
        p.ty = t.y
        p.c = t.c
        return p
      })

      if (!amb.length) {
        for (let a = 0; a < 46; a++) {
          amb.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            r: Math.random() * 1.6 + 0.7,
            c: Math.random() < 0.5 ? '3,166,221' : '233,30,99',
          })
        }
      }

      if (reduced) {
        parts.forEach((p) => {
          p.x = p.tx
          p.y = p.ty
        })
        draw(99)
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H)
      for (let j = 0; j < amb.length; j++) {
        const b = amb[j]
        b.x += b.vx
        b.y += b.vy
        if (b.x < 0) b.x = W
        if (b.x > W) b.x = 0
        if (b.y < 0) b.y = H
        if (b.y > H) b.y = 0
        ctx.fillStyle = `rgba(${b.c},.3)`
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, 6.283)
        ctx.fill()
      }
      const R = 110
      const R2 = R * R
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        const on = t > 0.3 + p.d
        let tx, ty
        if (on) {
          tx = p.tx + Math.sin(t * 1.3 + p.ph) * 0.9
          ty = p.ty + Math.cos(t * 1.1 + p.ph) * 0.9
        } else {
          tx = p.sx + Math.sin(t * 0.9 + p.ph) * 24
          ty = p.sy + Math.cos(t * 0.8 + p.ph) * 24
        }
        if (scrollP > 0) {
          tx += p.rx * scrollP * W * 0.35
          ty += p.ry * scrollP * H * 0.9
        }
        if (!reduced) {
          const k = on ? 0.055 : 0.02
          p.vx += (tx - p.x) * k
          p.vy += (ty - p.y) * k
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 1
            const f = (1 - d / R) * 5.2
            p.vx += (dx / d) * f
            p.vy += (dy / d) * f
          }
          p.vx *= 0.8
          p.vy *= 0.8
          p.x += p.vx
          p.y += p.vy
        }
        ctx.shadowBlur = 6
        ctx.shadowColor = p.c
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(p.x, p.y, rad, 0, 6.283)
        ctx.fill()
      }
      ctx.shadowBlur = 0
    }

    function loop(now) {
      draw((now - t0) / 1000)
      raf = requestAnimationFrame(loop)
    }

    layout()
    if (!reduced) raf = requestAnimationFrame(loop)

    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      if (visible && !reduced) {
        if (raf === null) raf = requestAnimationFrame(loop)
      } else if (raf !== null) {
        cancelAnimationFrame(raf)
        raf = null
      }
    })
    io.observe(hero)

    let resizeTimer
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(layout, 150)
    }
    window.addEventListener('resize', onResize)

    let fontsCancelled = false
    document.fonts?.ready?.then(() => {
      if (!fontsCancelled) layout()
    })

    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(layout, 150)
    })
    ro.observe(hero)

    function onPointerMove(e) {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    function onPointerLeave() {
      mouse.x = mouse.y = -9999
    }
    hero.addEventListener('pointermove', onPointerMove)
    hero.addEventListener('pointerleave', onPointerLeave)

    function onScroll() {
      const r = hero.getBoundingClientRect()
      const total = r.height
      const passed = Math.min(Math.max(-r.top, 0), total)
      scrollP = Math.max(0, (passed / total - 0.3) / 0.7)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      fontsCancelled = true
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      hero.removeEventListener('pointermove', onPointerMove)
      hero.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [heroRef])

  return <canvas ref={canvasRef} className="h-particle-canvas" aria-hidden="true" />
}
