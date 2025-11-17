"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Download, ChevronLeft, ChevronRight, Mail, ExternalLink, CheckCircle } from "lucide-react"
import { TypeAnimation } from "react-type-animation"
import { Navbar } from "@/components/navbar"
import TargetCursor from "@/components/TargetCursor"
import Squares from "@/components/Squares"

export default function Home() {
  const projectsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [currentProject, setCurrentProject] = useState(1) // Start at 1 (first real item, 0 is clone)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const currentProjectRef = useRef(1)
  const isResettingRef = useRef(false)

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  const totalProjects = 5
  // We'll have: [clone of last] [0] [1] [2] [3] [4] [clone of first]
  // So indices: 0           1   2   3   4   5   6
  // Real items are at indices 1-5

  // Get the actual project index for display (0-4)
  const getDisplayIndex = (index: number) => {
    if (index === 0) return totalProjects - 1 // Clone of last
    if (index === totalProjects + 1) return 0 // Clone of first
    return index - 1 // Real items (1-5 -> 0-4)
  }

  // Update ref when currentProject changes
  useEffect(() => {
    currentProjectRef.current = currentProject
  }, [currentProject])

  // Handle seamless looping with timeout-based reset
  useEffect(() => {
    // Only handle reset when we're at a clone position
    if (currentProject === 0 || currentProject === totalProjects + 1) {
      // Mark that we're resetting
      isResettingRef.current = true
      
      // Calculate the target index
      const newIndex = currentProject === totalProjects + 1 ? 1 : totalProjects
      
      // Wait for transition to complete (500ms) then reset instantly
      const resetTimeout = setTimeout(() => {
        // Disable transitions for instant jump
        setIsTransitioning(false)
        
        // Update position (will be instant since transitions are disabled)
        setCurrentProject(newIndex)
        
        // Re-enable transitions after React has processed the update
        setTimeout(() => {
          setIsTransitioning(true)
          isResettingRef.current = false
        }, 50)
      }, 500) // Match transition duration (500ms)
      
      return () => {
        clearTimeout(resetTimeout)
      }
    } else if (currentProject >= 1 && currentProject <= totalProjects) {
      // We're at a real project, ensure state is correct
      // Clear reset flag if it's set
      if (isResettingRef.current) {
        isResettingRef.current = false
      }
    }
  }, [currentProject, totalProjects])
  
  // Separate effect to ensure transitions are always enabled at real projects
  useEffect(() => {
    if (currentProject >= 1 && currentProject <= totalProjects && !isResettingRef.current) {
      // We're at a real project and not resetting, ensure transitions are enabled
      if (!isTransitioning) {
        // Small delay to avoid conflicts
        const timeoutId = setTimeout(() => {
          setIsTransitioning(true)
        }, 150)
        return () => clearTimeout(timeoutId)
      }
    }
  }, [currentProject, isTransitioning, totalProjects])

  const nextProject = () => {
    // Don't allow navigation during reset
    if (isResettingRef.current) {
      return
    }
    
    setCurrentProject((prev) => {
      // Safety check: ensure prev is valid
      if (prev < 0 || prev > totalProjects + 1) {
        return 1
      }
      
      // If we're at the last real project (index 5), move to clone of first (index 6)
      if (prev === totalProjects) {
        return totalProjects + 1
      }
      // Otherwise, just move to next project
      return prev + 1
    })
  }

  const prevProject = () => {
    // Don't allow navigation during reset
    if (isResettingRef.current) {
      return
    }
    
    setCurrentProject((prev) => {
      // Safety check: ensure prev is valid
      if (prev < 0 || prev > totalProjects + 1) {
        return totalProjects
      }
      
      if (prev <= 1) {
        // Move to clone (index 0), useEffect will handle reset after transition
        return 0
      }
      return prev - 1
    })
  }

  const goToProject = (targetIndex: number) => {
    // targetIndex is 0-4, we need to go to real item at index targetIndex + 1
    setCurrentProject(targetIndex + 1)
  }


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
      {/* Target Cursor */}
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
      />

      {/* Navigation */}
      <Navbar scrollToSection={scrollToSection} projectsRef={projectsRef} contactRef={contactRef} />

{/* Hero Section */}
<section className="min-h-[90vh] pt-20 pb-16 relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)] -z-10"></div>
  {/* Squares Background - Full Hero Section */}
  <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }}>
    <Squares 
      speed={0.5} 
      squareSize={60}
      direction='diagonal'
      borderColor='rgba(255, 255, 255, 0.25)'
      hoverFillColor='rgba(34, 211, 238, 0.7)'
    />
  </div>
  <div className="container mx-auto px-4 h-full relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">

      {/* Image Section - moved to the left */}
      <div className="lg:col-span-5 flex justify-center items-center lg:pr-8 order-1 lg:order-none">
        <div className="relative w-72 h-72 md:w-96 md:h-96 lg:mr-4">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl transform rotate-6 shadow-2xl shadow-cyan-500/50"></div>
          <div className="absolute inset-0 bg-gray-900 rounded-2xl overflow-hidden transform -rotate-3 shadow-xl border border-gray-700">
            <Image
                      src="./websitepics/anishnewpic.png"
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
      <div className="lg:col-span-7 space-y-8 text-center lg:text-left mt-10 order-2 lg:order-none relative">
        <h1 className="cursor-target text-6xl md:text-7xl font-extrabold text-white relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          Hello, I'm {" Anish "}
        </h1>

        <div className="h-16 relative z-10">
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
            className="text-4xl md:text-5xl font-semibold text-cyan-400 inline-block drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)]"
          />
        </div>

        <p className="cursor-target text-2xl text-gray-300 mb-4 font-medium relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Computer Engineering student at Georgia Tech
        </p>

        <div className="flex space-x-4 justify-center lg:justify-start relative z-10">
                  <Link href="https://www.linkedin.com/in/anishneema" target="_blank" rel="noopener noreferrer" className="cursor-target">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-lg shadow-black/50 hover:shadow-xl hover:shadow-cyan-400/50"
            >
              <Linkedin className="h-5 w-5" />
            </Button>
          </Link>
                  <Link href="https://github.com/anishneema" target="_blank" rel="noopener noreferrer" className="cursor-target">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-lg shadow-black/50 hover:shadow-xl hover:shadow-cyan-400/50"
            >
              <Github className="h-5 w-5" />
            </Button>
          </Link>
                  <Link href="mailto:anish.neema@gatech.edu" className="cursor-target">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-lg shadow-black/50 hover:shadow-xl hover:shadow-cyan-400/50"
            >
              <Mail className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        <div className="w-[400px] max-w-full mt-4 relative z-10">
  <Button
    asChild
    className="cursor-target w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl py-5 text-lg flex items-center justify-center shadow-xl shadow-black/60 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300"
  >
                    <a href="https://drive.google.com/file/d/1gKZ6nXmMucreQZq9B6dHABaEFULnUZZp/view?usp=sharing" target="_blank" rel="noopener noreferrer">
      <Download className="w-5 h-5 mr-2" />
      Download Resume
    </a>
  </Button>
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

          {/* Carousel Container */}
          <div className="relative px-8 md:px-12">
            {/* Navigation Arrows */}
            <button
              onClick={prevProject}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 rounded-full p-2 md:p-3 text-cyan-400 transition-all cursor-target shadow-lg border border-gray-700 hidden md:block"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            <button
              onClick={nextProject}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 rounded-full p-2 md:p-3 text-cyan-400 transition-all cursor-target shadow-lg border border-gray-700 hidden md:block"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Projects Container */}
            <div className="overflow-hidden rounded-lg">
              <div 
                ref={carouselRef}
                className="flex"
                style={{ 
                  transform: `translateX(-${Math.max(0, Math.min(currentProject, totalProjects + 1)) * 100}%)`,
                  transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
                }}
              >
                {/* Clone of Last Project (Remi) - for seamless loop */}
                <div className="min-w-full px-2">
                  <Card className="overflow-hidden border border-gray-700 bg-gray-800 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="cursor-target text-3xl font-bold text-white">Remi (HackPrinceton Fall 2025)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">React</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Express.js</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Gemini LLM</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Photon</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">OAuth</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">NoSQL</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">SQLite</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                        asChild
                      variant="outline"
                      className="cursor-target bg-gray-700 text-white hover:bg-gray-600 border-gray-600 rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://github.com/B3rK-3/HackPrinceton" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> Github Link
                        </a>
                    </Button>
                    <Button
                        asChild
                      variant="outline"
                      className="cursor-target bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 border-none rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://youtu.be/ImRRI6CSAU4?si=bplRv5tqmDobRYZP" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Demo Link
                        </a>
                    </Button>
                  </div>
                </CardContent>
              </div>
              <div className="grid md:grid-cols-2 gap-4 p-6 bg-gray-900">
                <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                      src="./websitepics/remi4website.png"
                      alt="Remi Project Overview"
                    width={600}
                    height={300}
                      className="object-contain w-full h-full bg-black"
                      unoptimized
                  />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                  <Image
                      src="./websitepics/introtobioremi.png"
                      alt="Remi Intro to Bio Dashboard"
                    width={600}
                    height={300}
                      className="object-contain w-full h-full bg-black"
                      unoptimized
                  />
                </div>
              </div>
            </Card>
                  </div>
                {/* Project Card 1 - Gymseekr Mobile App */}
                <div className="min-w-full px-2">
                  <Card className="overflow-hidden border border-gray-700 bg-gray-800 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="cursor-target text-3xl font-bold text-white">Gymseekr Mobile App</CardTitle>
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
                      className="cursor-target bg-gray-700 text-white hover:bg-gray-600 border-gray-600 rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://patch.com/california/sanramon/san-ramon-students-launch-fitness-app" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> Read About It
                        </a>
                    </Button>
                    <Button
                        asChild
                      variant="outline"
                      className="cursor-target bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 border-none rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://github.com/anishneema/GymSeekr" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> GitHub Link
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
                  </div>

                {/* Project Card 2 - Wall-E Interactive Robot */}
                <div className="min-w-full px-2">
                  <Card className="overflow-hidden border border-gray-700 bg-gray-800 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="cursor-target text-3xl font-bold text-white">Wall-E Interactive Robot</CardTitle>
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
                      className="cursor-target bg-gray-700 text-white hover:bg-gray-600 border-gray-600 rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://anishneema.github.io/emotive-robot/" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> Github Link
                        </a>
                    </Button>
                    <Button
                        asChild
                      variant="outline"
                      className="cursor-target bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 border-none rounded-full px-6 transition-all duration-300"
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

                {/* Project Card 3 - ServeSmart */}
                <div className="min-w-full px-2">
                  <Card className="overflow-hidden border border-gray-700 bg-gray-800 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="cursor-target text-3xl font-bold text-white">ServeSmart (HackGT Project)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">React</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Flask</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Python</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Scikit-learn</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">TensorFlow</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">XGBoost</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">OpenAI</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Pandas</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">NumPy</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Matplotlib</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Seaborn</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">SQLite</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                        asChild
                      variant="outline"
                      className="cursor-target bg-gray-700 text-white hover:bg-gray-600 border-gray-600 rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://github.com/anishneema/HackGTproject" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> Github Link
                        </a>
                    </Button>
                    <Button
                        asChild
                      variant="outline"
                      className="cursor-target bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 border-none rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://youtu.be/4wxwXPZdtnM?si=d6SErNs9Bpl1rySg" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Demo Link
                        </a>
                    </Button>
                  </div>
                </CardContent>
              </div>
              <div className="grid md:grid-cols-2 gap-4 p-6 bg-gray-900">
                <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                      src="./websitepics/dashboardservesmart.png"
                      alt="ServeSmart Dashboard"
                    width={600}
                    height={300}
                      className="object-contain w-full h-full bg-black"
                      unoptimized
                  />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                  <Image
                      src="./websitepics/donationhubservesmart.png"
                      alt="ServeSmart Donation Hub"
                    width={600}
                    height={300}
                      className="object-contain w-full h-full bg-black"
                      unoptimized
                  />
                </div>
              </div>
            </Card>
                  </div>

                {/* Project Card 4 - Pebble */}
                <div className="min-w-full px-2">
                  <Card className="overflow-hidden border border-gray-700 bg-gray-800 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="cursor-target text-3xl font-bold text-white">Pebble (Cal Hacks Project)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">React</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Flask</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Python</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">MediaPipe</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">YOLO8</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">VAPI</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">XGBoost</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">ngrok</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                        asChild
                      variant="outline"
                      className="cursor-target bg-gray-700 text-white hover:bg-gray-600 border-gray-600 rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://github.com/aditya-chandrasekhar/studybuddy" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> Github Link
                        </a>
                    </Button>
                    <Button
                        asChild
                      variant="outline"
                      className="cursor-target bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 border-none rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://www.youtube.com/watch?time_continue=1&v=Br37QsLWrpw&embeds_referring_euri=https%3A%2F%2Fdevpost.com%2F&source_ve_path=Mjg2NjY" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Demo Link
                        </a>
                    </Button>
                  </div>
                </CardContent>
              </div>
              <div className="grid md:grid-cols-2 gap-4 p-6 bg-gray-900">
                <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                      src="./websitepics/pebble.png"
                      alt="Pebble Project Overview"
                    width={600}
                    height={300}
                      className="object-contain w-full h-full bg-black"
                      unoptimized
                  />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                  <Image
                      src="./websitepics/pebbledashboard.png"
                      alt="Pebble Dashboard"
                    width={600}
                    height={300}
                      className="object-contain w-full h-full bg-black"
                      unoptimized
                  />
                </div>
              </div>
            </Card>
                  </div>

                {/* Project Card 5 - Remi */}
                <div className="min-w-full px-2">
                  <Card className="overflow-hidden border border-gray-700 bg-gray-800 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="cursor-target text-3xl font-bold text-white">Remi (HackPrinceton Fall 2025)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">React</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Express.js</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Gemini LLM</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">Photon</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">OAuth</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">NoSQL</Badge>
                    <Badge className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800 border border-cyan-700">SQLite</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                        asChild
                      variant="outline"
                      className="cursor-target bg-gray-700 text-white hover:bg-gray-600 border-gray-600 rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://github.com/B3rK-3/HackPrinceton" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> Github Link
                        </a>
                    </Button>
                    <Button
                        asChild
                      variant="outline"
                      className="cursor-target bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 border-none rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://youtu.be/ImRRI6CSAU4?si=bplRv5tqmDobRYZP" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Demo Link
                        </a>
                    </Button>
                  </div>
                </CardContent>
              </div>
              <div className="grid md:grid-cols-2 gap-4 p-6 bg-gray-900">
                <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                      src="./websitepics/remi4website.png"
                      alt="Remi Project Overview"
                    width={600}
                    height={300}
                      className="object-contain w-full h-full bg-black"
                      unoptimized
                  />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                  <Image
                      src="./websitepics/introtobioremi.png"
                      alt="Remi Intro to Bio Dashboard"
                    width={600}
                    height={300}
                      className="object-contain w-full h-full bg-black"
                      unoptimized
                  />
                </div>
              </div>
            </Card>
                  </div>

                {/* Clone of First Project (Gymseekr) - for seamless loop */}
                <div className="min-w-full px-2">
                  <Card className="overflow-hidden border border-gray-700 bg-gray-800 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="cursor-target text-3xl font-bold text-white">Gymseekr Mobile App</CardTitle>
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
                      className="cursor-target bg-gray-700 text-white hover:bg-gray-600 border-gray-600 rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://patch.com/california/sanramon/san-ramon-students-launch-fitness-app" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> Read About It
                        </a>
                    </Button>
                    <Button
                        asChild
                      variant="outline"
                      className="cursor-target bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 border-none rounded-full px-6 transition-all duration-300"
                    >
                        <a href="https://github.com/anishneema/GymSeekr" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> GitHub Link
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
                  </div>
              </div>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalProjects }).map((_, index) => {
                const displayIndex = getDisplayIndex(currentProject)
                return (
                  <button
                    key={index}
                    onClick={() => goToProject(index)}
                    className={`w-3 h-3 rounded-full transition-all cursor-target ${
                      index === displayIndex
                        ? 'bg-cyan-500' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} id="contact" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10"></div>
        {/* Squares Background - Full Contact Section */}
        <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }}>
          <Squares 
            speed={0.5} 
            squareSize={60}
            direction='diagonal'
            borderColor='rgba(255, 255, 255, 0.25)'
            hoverFillColor='rgba(34, 211, 238, 0.7)'
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
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
                      className="cursor-target bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-6 py-2 transition-all duration-300 hover:scale-105"
                    >
                      Send Another Message
                    </Button>
                  </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-cyan-400 mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">Contact Me</h2>
                <p className="text-gray-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Feel free to reach out if you have any questions or want to connect!</p>
              </div>
              <div className="flex flex-col md:flex-row gap-12 items-start justify-center relative z-10">
                {/* Contact Form */}
                <div className="flex-1 max-w-lg w-full bg-black/60 rounded-xl p-8 shadow-lg border border-gray-800 relative z-10">
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
                    <button type="submit" className="cursor-target w-full py-3 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-md hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                      Send Message <span className="ml-2">→</span>
                    </button>
                  </form>
                </div>
                {/* Contact Info Card */}
                <div className="flex-1 max-w-md w-full bg-black/60 rounded-xl p-8 shadow-lg border border-gray-800 mt-8 md:mt-0 relative z-10">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-6">Contact Information</h3>
                  <ul className="space-y-5 text-gray-200">
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-cyan-400 text-cyan-300"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></span>
                        <span><span className="font-semibold">Email</span><br /><a href="mailto:anish.neema@gatech.edu" className="cursor-target text-cyan-300 hover:underline">anish.neema@gatech.edu</a></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-cyan-400 text-cyan-300"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 8a6 6 0 11-12 0 6 6 0 0112 0z" /><path d="M12 14v7m-4-4h8" /></svg></span>
                        <span><span className="font-semibold">LinkedIn</span><br /><a href="https://www.linkedin.com/in/anishneema" target="_blank" rel="noopener noreferrer" className="cursor-target text-cyan-300 hover:underline">linkedin.com/in/anishneema</a></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-cyan-400 text-cyan-300"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 12l2 2 4-4" /></svg></span>
                        <span><span className="font-semibold">GitHub</span><br /><a href="https://github.com/anishneema" target="_blank" rel="noopener noreferrer" className="cursor-target text-cyan-300 hover:underline">github.com/anishneema</a></span>
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
