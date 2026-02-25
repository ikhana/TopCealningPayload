// src/components/ui/CircularText/CircularText.tsx
'use client'
import { cn } from '@/utilities/cn'
import React, { useEffect, useState } from 'react'
import './CircularText.css'

interface CircularTextProps {
  text: string
  radius?: number
  fontSize?: number
  fontWeight?: string | number
  color?: string
  className?: string
  startAngle?: number // Starting angle in degrees
  direction?: 'clockwise' | 'counterclockwise'
  letterSpacing?: number
  enableTrails?: boolean
}

export const CircularText: React.FC<CircularTextProps> = ({
  text = "WE'RE NEW BIRTH LABS.",
  radius = 200,
  fontSize = 24,
  fontWeight = 900,
  color = '#000000',
  className = '',
  startAngle = -90, // Start at top
  direction = 'clockwise',
  letterSpacing = 1.2,
  enableTrails = true
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Clean text and split into individual letters
  const letters = text.split('')
  const totalLetters = letters.length

  // Calculate angle step between letters
  const totalAngle = 360 // Full circle
  const angleStep = totalAngle / totalLetters

  return (
    <div 
      className={cn("circular-text-container", className)}
      style={{
        width: radius * 2 + fontSize * 2,
        height: radius * 2 + fontSize * 2,
      }}
    >
      {letters.map((letter, index) => {
        // Skip spaces but maintain positioning
        if (letter === ' ') {
          return null
        }

        // Calculate angle for this letter
        const angle = startAngle + (direction === 'clockwise' ? angleStep * index : -angleStep * index)
        const radian = (angle * Math.PI) / 180

        // Calculate position
        const x = Math.cos(radian) * radius
        const y = Math.sin(radian) * radius

        // Calculate rotation for letter orientation
        const letterRotation = angle + 90 // Adjust for proper orientation

        return (
          <span
            key={index}
            className={cn(
              'circular-letter',
              enableTrails && 'letter-with-trail',
              isVisible && 'letter-visible'
            )}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `
                translate(-50%, -50%) 
                translate(${x}px, ${y}px) 
                rotate(${letterRotation}deg)
              `,
              fontSize: `${fontSize}px`,
              fontWeight: fontWeight,
              color: color,
              letterSpacing: `${letterSpacing}px`,
              animationDelay: `${index * 0.05}s`,
            }}
          >
            {letter}
          </span>
        )
      })}
    </div>
  )
}

export default CircularText