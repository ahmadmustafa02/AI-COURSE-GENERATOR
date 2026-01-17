"use client"

import React, { useEffect, useRef } from 'react'

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const mouse = { x: 0, y: 0 }
    const particles: Array<{
      x: number
      y: number
      baseX: number
      baseY: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles.length = 0
      // Reduced particle count for subtle effect
      const count = Math.floor((canvas.width * canvas.height) / 18000)
      
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 4 + 3,
          opacity: Math.random() * 0.6 + 0.5
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        // Mouse interaction
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 180) {
          const force = (180 - dist) / 180
          const angle = Math.atan2(dy, dx)
          particle.x -= Math.cos(angle) * force * 3
          particle.y -= Math.sin(angle) * force * 3
        }

        // Return to base position
        particle.x += (particle.baseX - particle.x) * 0.05 + particle.vx
        particle.y += (particle.baseY - particle.y) * 0.05 + particle.vy

        // Wrap around
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.baseX = Math.random() * canvas.width
          particle.x = particle.baseX
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.baseY = Math.random() * canvas.height
          particle.y = particle.baseY
        }

        // Draw particle with glow
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.shadowBlur = 10
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 160) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 * (1 - dist / 160)})`
            ctx.lineWidth = 1.5
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5
      }}
    />
  )
}

export default ParticleBackground
