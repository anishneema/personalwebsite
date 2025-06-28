"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in when component mounts
    setIsVisible(true)
  }, [])

  return (
    <div
      className={`min-h-screen transition-all duration-500 ease-out transform ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-full"
      }`}
    >
      {children}
    </div>
  )
}

// Global transition state
let isTransitioning = false

// Custom Link component with smooth fade transition
export function AnimatedLink({ 
  href, 
  children, 
  className = "" 
}: { 
  href: string
  children: React.ReactNode
  className?: string 
}) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isTransitioning) return
    isTransitioning = true
    
    // Create a fade overlay
    const fadeOverlay = document.createElement('div')
    fadeOverlay.style.position = 'fixed'
    fadeOverlay.style.top = '0'
    fadeOverlay.style.left = '0'
    fadeOverlay.style.width = '100%'
    fadeOverlay.style.height = '100%'
    fadeOverlay.style.backgroundColor = 'black'
    fadeOverlay.style.zIndex = '9999'
    fadeOverlay.style.opacity = '0'
    fadeOverlay.style.transition = 'opacity 0.3s ease-out'
    document.body.appendChild(fadeOverlay)
    
    // Fade in the overlay
    setTimeout(() => {
      fadeOverlay.style.opacity = '1'
    }, 10)
    
    // Navigate after fade completes
    setTimeout(() => {
      router.push(href)
      // Clean up the overlay after navigation
      setTimeout(() => {
        if (document.body.contains(fadeOverlay)) {
          document.body.removeChild(fadeOverlay)
        }
        isTransitioning = false
      }, 200)
    }, 300)
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
} 