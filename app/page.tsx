"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Download, ChevronDown, Mail, ExternalLink, CheckCircle } from "lucide-react"
import { TypeAnimation } from "react-type-animation"
import { Navbar } from "@/components/navbar"

export default function Home() {
  const projectsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    // Hide cursor on scroll, show when at top
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setCursorVisible(true)
      } else {
        setCursorVisible(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Handle form submission with animation
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const response = await fetch("https://formspree.io/f/xeokvzka", {
      method: "POST",
      headers: { 'Accept': 'application/json' },
      body: formData,
    });
    if (response.ok) {
      setFormSubmitted(true);
      // Delay showing thank you animation
      setTimeout(() => setShowThankYou(true), 100);
      form.reset();
    } else {
      alert("There was an error submitting the form. Please try again.");
    }
  }

  // Add animation classes for thank you screen
  const thankYouAnimation = "transition-all duration-700 ease-out opacity-0 scale-95 animate-fade-in-scale"

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Custom Cursor Bubble */}
      <div 
          className={`fixed pointer-events-none z-[9999] transition-opacity duration-200 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: mousePosition.x - 25,
          top: mousePosition.y - 25,
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
        }}
      >
        <div className="w-12 h-12 border-2 border-cyan-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="w-8 h-8 border border-cyan-300 rounded-full opacity-40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Navigation */}
      <Navbar scrollToSection={scrollToSection} projectsRef={projectsRef} contactRef={contactRef} />

{/* Hero Section */}
<section className="min-h-[90vh] pt-20 pb-16 relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)] -z-10"></div>
  <div className="container mx-auto px-4 h-full">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">

      {/* Image Section - moved to the left */}
      <div className="lg:col-span-5 flex justify-center items-center lg:pr-8 order-1 lg:order-none">
        <div className="relative w-72 h-72 md:w-96 md:h-96 lg:mr-4">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl transform rotate-6 shadow-2xl shadow-cyan-500/50"></div>
          <div className="absolute inset-0 bg-gray-900 rounded-2xl overflow-hidden transform -rotate-3 shadow-xl border border-gray-700">
            <Image
                      src="./websitepics/anish.jpg"
              alt="Profile"
              fill
              className="object-cover"
              priority
                      unoptimized
            />
          </div>
        </div>
      </div>

      {/* Text Section - now on the right */}
      <div className="lg:col-span-7 space-y-8 text-center lg:text-left mt-10 order-2 lg:order-none">
        <h1 className="text-6xl md:text-7xl font-extrabold text-white">
          Hello, I'm {" Anish "}
        </h1>

        <div className="h-16">
          <TypeAnimation
            sequence={[
              "Problem Solver",
              2000,
                      "Aspiring Engineer",
                      2000,
                      "Creative Thinker",
              2000,
                      "Dedicated & Disciplined",
              2000,
            ]}
            wrapper="h2"
            speed={50}
            deletionSpeed={65}
            repeat={Infinity}
            cursor={true}
            preRenderFirstString={true}
            className="text-4xl md:text-5xl font-semibold text-cyan-400 inline-block"
          />
        </div>

        <p className="text-2xl text-gray-300 mb-4 font-medium">
          Computer Engineering student at Georgia Tech
        </p>

        <div className="flex space-x-4 justify-center lg:justify-start">
                  <Link href="https://www.linkedin.com/in/anishneema" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300"
            >
              <Linkedin className="h-5 w-5" />
            </Button>
          </Link>
                  <Link href="https://github.com/anishneema" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300"
            >
              <Github className="h-5 w-5" />
            </Button>
          </Link>
                  <Link href="mailto:anish.neema@gatech.edu">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300"
            >
              <Mail className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        <div className="w-[400px] max-w-full mt-4">
  <Button
    asChild
    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl py-5 text-lg flex items-center justify-center shadow-lg shadow-cyan-500/25 transition-all duration-300"
  >
                    <a href="./websitepics/resume.pdf" target="_blank" rel="noopener noreferrer">
      <Download className="w-5 h-5 mr-2" />
      Download Resume
    </a>
  </Button>
</div>
        
        <div className="pt-8 flex justify-center lg:justify-start">
          <button
            onClick={() => scrollToSection(projectsRef)}
            className="text-cyan-400 flex flex-col items-center hover:text-cyan-300 transition-colors duration-300"
          >
            <span className="mb-2">Scroll to explore</span>
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Projects Section */}
      <section ref={projectsRef} className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">Projects</h2>
            <div className="mt-4 h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto"></div>
          </div>

          <div className="grid gap-12 ">
            {/* Project Card 3 - Gymseekr Mobile App */}
            <Card className="overflow-hidden border border-gray-700 bg-gray-800 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:scale-[1.02]">
              <div className="p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-3xl font-bold text-white">Gymseekr Mobile App</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">React Native</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">AWS Amplify</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">DynamoDB</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                        asChild
                      variant="outline"
                      className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600 rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://patch.com/california/sanramon/san-ramon-students-launch-fitness-app" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> Read About It
                        </a>
                    </Button>
                    <Button
                        asChild
                      variant="outline"
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 border-none rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://apps.apple.com/us/app/gymseekr/id6624301767" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> App Link
                        </a>
                    </Button>
                  </div>
                </CardContent>
              </div>
              <div className="grid md:grid-cols-2 gap-4 p-6 bg-gray-900">
                <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                      src="./websitepics/welcome.png"
                      alt="Welcome to Gymseekr"
                      width={350}
                      height={175}
                      className="object-contain w-full h-full bg-black"
                      unoptimized
                  />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                  <Image
                      src="./websitepics/nearbygyms.png"
                      alt="Nearby Gyms - Gymseekr"
                      width={350}
                      height={175}
                      className="object-contain w-full h-full bg-black"
                      unoptimized
                  />
                </div>
              </div>
            </Card>

            {/* Project Card 4 - Bluestamp Engineering */}
            <Card className="overflow-hidden border border-gray-700 bg-gray-800 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:scale-[1.02]">
              <div className="p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-3xl font-bold text-white">Wall-E Interactive Robot</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Arduino</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">C++</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">MIT App Inventor</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                        asChild
                      variant="outline"
                      className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600 rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://anishneema.github.io/emotive-robot/" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> Github Link
                        </a>
                    </Button>
                    <Button
                        asChild
                      variant="outline"
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 border-none rounded-full px-6 transition-all duration-300"
                    >
                        <a href="./websitepics/Portfolio.pdf" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Demo Link
                        </a>
                    </Button>
                  </div>
                </CardContent>
              </div>
              <div className="grid md:grid-cols-2 gap-4 p-6 bg-gray-900">
                <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                      src="./websitepics/walle.png"
                      alt="Project Photo - WALLE"
                    width={600}
                    height={300}
                      className="object-contain w-full h-full bg-black"
                      unoptimized
                  />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                  <Image
                      src="./websitepics/walleschem.png"
                      alt="Project Schematic - WALLE"
                    width={600}
                    height={300}
                      className="object-contain w-full h-full bg-black"
                      unoptimized
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} id="contact" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4">
            {showThankYou ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div 
                  className={`w-full max-w-xl bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12 shadow-2xl border border-cyan-500/30 text-center animate-fade-in-scale animate-glow-pulse`}
                >
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center animate-checkmark-pulse">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold text-cyan-400 mb-4 animate-slide-in-up">
                    Thank you!
                  </h2>
                  <p className="text-xl text-gray-200 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                    I'll be in contact soon.
                  </p>
                  <div className="mt-8 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                    <Button 
                      onClick={() => {
                        setFormSubmitted(false);
                        setShowThankYou(false);
                      }}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-6 py-2 transition-all duration-300 hover:scale-105"
                    >
                      Send Another Message
                    </Button>
                  </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-cyan-400 mb-2">Contact Me</h2>
                <p className="text-gray-300">Feel free to reach out if you have any questions or want to connect!</p>
              </div>
              <div className="flex flex-col md:flex-row gap-12 items-start justify-center">
                {/* Contact Form */}
                <div className="flex-1 max-w-lg w-full bg-black/60 rounded-xl p-8 shadow-lg border border-gray-800">
                  <form
                    className="space-y-6"
                      onSubmit={handleFormSubmit}
                  >
                    <div>
                      <label className="block text-white font-semibold mb-1">Name</label>
                      <input name="name" type="text" className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Your Name" required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-1">Email</label>
                      <input name="email" type="email" className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="your.email@example.com" required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-1">Message</label>
                      <textarea name="message" className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Your message here..." required />
                    </div>
                    <button type="submit" className="w-full py-3 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-md hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                      Send Message <span className="ml-2">→</span>
                    </button>
                  </form>
                </div>
                {/* Contact Info Card */}
                <div className="flex-1 max-w-md w-full bg-black/60 rounded-xl p-8 shadow-lg border border-gray-800 mt-8 md:mt-0">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-6">Contact Information</h3>
                  <ul className="space-y-5 text-gray-200">
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-cyan-400 text-cyan-300"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></span>
                        <span><span className="font-semibold">Email</span><br /><a href="mailto:anish.neema@gatech.edu" className="text-cyan-300 hover:underline">anish.neema@gatech.edu</a></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-cyan-400 text-cyan-300"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 8a6 6 0 11-12 0 6 6 0 0112 0z" /><path d="M12 14v7m-4-4h8" /></svg></span>
                        <span><span className="font-semibold">LinkedIn</span><br /><a href="https://www.linkedin.com/in/anishneema" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">linkedin.com/in/anishneema</a></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-cyan-400 text-cyan-300"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 12l2 2 4-4" /></svg></span>
                        <span><span className="font-semibold">GitHub</span><br /><a href="https://github.com/anishneema" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">github.com/anishneema</a></span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
        <footer className="py-6 bg-black text-white border-t border-gray-800">
        <div className="container mx-auto px-4">
            <div className="text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Anish. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
