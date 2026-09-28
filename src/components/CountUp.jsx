import { useEffect, useRef, useState } from 'react'

export default function CountUp({ value, duration = 500, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(value)
  const startRef = useRef(value)
  const rafRef = useRef(null)

  useEffect(() => {
    const start = startRef.current
    const end = value
    const startTime = performance.now()

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + (end - start) * eased)
      setDisplay(current)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        startRef.current = end
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  return (
    <span>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}