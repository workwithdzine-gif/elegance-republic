import { useEffect, useRef } from 'react'

const DESKTOP_POINTER = '(min-width: 768px) and (hover: hover) and (pointer: fine)'
const RING_RADIUS = 12
const SPRING = 0.058
const DAMPING = 0.7

export default function CursorRing() {
  const ringRef = useRef(null)

  useEffect(() => {
    const ring = ringRef.current
    const media = window.matchMedia(DESKTOP_POINTER)
    let frame = 0
    let running = false
    let initialized = false
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0
    let velocityX = 0
    let velocityY = 0
    let angle = 0

    const draw = () => {
      const distanceX = targetX - currentX
      const distanceY = targetY - currentY

      velocityX = (velocityX + distanceX * SPRING) * DAMPING
      velocityY = (velocityY + distanceY * SPRING) * DAMPING
      currentX += velocityX
      currentY += velocityY

      const speed = Math.hypot(velocityX, velocityY)
      if (speed > 0.08) angle = Math.atan2(velocityY, velocityX) * (180 / Math.PI)
      const rubber = Math.min(speed / 60, 0.3)
      const stretch = 1 + rubber
      const squash = 1 - rubber * 0.32
      ring.style.transform = `translate3d(${currentX - RING_RADIUS}px, ${currentY - RING_RADIUS}px, 0) rotate(${angle}deg) scale(${stretch}, ${squash})`

      if (Math.abs(distanceX) > 0.08 || Math.abs(distanceY) > 0.08 || speed > 0.08) {
        frame = window.requestAnimationFrame(draw)
      } else {
        currentX = targetX
        currentY = targetY
        velocityX = 0
        velocityY = 0
        ring.style.transform = `translate3d(${currentX - RING_RADIUS}px, ${currentY - RING_RADIUS}px, 0)`
        running = false
      }
    }

    const move = (event) => {
      if (event.pointerType === 'touch') return
      targetX = event.clientX
      targetY = event.clientY

      if (!initialized) {
        initialized = true
        currentX = targetX
        currentY = targetY
        ring.style.transform = `translate3d(${currentX - RING_RADIUS}px, ${currentY - RING_RADIUS}px, 0)`
      }

      ring.classList.add('is-visible')
      if (!running) {
        running = true
        frame = window.requestAnimationFrame(draw)
      }
    }

    const hide = () => ring.classList.remove('is-visible')

    const disable = () => {
      document.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      ring.classList.remove('is-visible')
      window.cancelAnimationFrame(frame)
      running = false
      initialized = false
      velocityX = 0
      velocityY = 0
    }

    const configure = () => {
      disable()
      if (!media.matches) return
      document.addEventListener('pointermove', move, { passive: true })
      document.documentElement.addEventListener('pointerleave', hide)
      window.addEventListener('blur', hide)
    }

    configure()
    media.addEventListener('change', configure)

    return () => {
      disable()
      media.removeEventListener('change', configure)
    }
  }, [])

  return <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
}
