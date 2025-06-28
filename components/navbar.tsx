"use client"

import type React from "react"
import Link from "next/link"
import { AnimatedLink } from "./page-transition"

interface NavbarProps {
  scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void
  projectsRef: React.RefObject<HTMLDivElement>
  contactRef?: React.RefObject<HTMLDivElement>
}

export function Navbar({ scrollToSection, projectsRef, contactRef }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-4 flex justify-end items-center">
        <div className="flex space-x-6">
          <button
            onClick={() => scrollToSection(projectsRef)}
            className="text-white hover:text-cyan-400 transition-colors"
          >
            Projects
          </button>
          <button
            onClick={() => contactRef && scrollToSection(contactRef)}
            className="text-white hover:text-cyan-400 transition-colors"
          >
            Contact
          </button>
          <AnimatedLink href="/about">
            <button className="text-white hover:text-cyan-400 transition-colors">
              About
            </button>
          </AnimatedLink>
        </div>
      </div>
    </nav>
  )
}
