"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X } from "lucide-react"
import { PageTransition, AnimatedLink } from "@/components/page-transition"
import { useRouter } from "next/navigation"
import Image from "next/image"

type VolunteeringDescription = { text: string; positions: string[] };
type AwardsDescription = { text: string; awards: string[] };
type CurrentGoalsDescription = { text: string; goals: string[] };
type AwardsGroupsDescription = { text: string; groups: { label: string; items: string[] }[] };
type BubbleDescription = string | VolunteeringDescription | AwardsDescription | CurrentGoalsDescription | AwardsGroupsDescription;

export default function About() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isScrolling, setIsScrolling] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const router = useRouter()
  let isTransitioning = false
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null)
  const [showPowerliftingLightbox, setShowPowerliftingLightbox] = useState(false)

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

  const handleBackClick = (e: React.MouseEvent) => {
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
      router.push('/')
      // Clean up the overlay after navigation
      setTimeout(() => {
        if (document.body.contains(fadeOverlay)) {
          document.body.removeChild(fadeOverlay)
        }
        isTransitioning = false
      }, 200)
    }, 300)
  }

  // Modal content for each bubble
  const bubbleDetails: Record<string, { title: string; emoji: string; description: BubbleDescription }> = {
    Powerlifting: {
      title: "Powerlifting",
      emoji: "🏋️‍♂️",
      description: "I'm a competitive powerlifter with a current total of 1212 lbs in the 148.8 lbs weight class. As a 2x National and 3x State record holder, my passion for lifting inspired me to create my app Gymseekr.",
    },
    Volunteering: {
      title: "Volunteering",
      emoji: "🤝",
      description: {
        text: "4+ year volunteer for the American Red Cross. My work has ranged from raising $1000 for my school club as Treasurer to helping organize and run blood drives at a national scale, including coding a script to automate volunteer outreach.",
        positions: [
          "DVHS Treasurer",
          "DIV: BIO Onboarding Team Member",
          "Volunteer",
          "National Headquarters: VIPC"
        ]
      },
    },
    "Current Goals": {
      title: "Current Goals",
      emoji: "🏃‍♂️",
      description: {
        text: "Here are some of my current goals:",
        goals: [
          "Bench 315 lbs",
          "Finish DSA course online",
          "Build out Gymseekr to be more robust",
          "Drink 1 gallon of water a day",
          "Build a drone"
        ]
      },
    },
    Awards: {
      title: "Awards",
      emoji: "🏅",
      description: {
        text: "Honored to have received recognition for sports, academics, and volunteering.",
        groups: [
          {
            label: "Sports Awards",
            items: [
              "Most Valuable Player, Wildcat Award, Outstanding Wrestler Award (DVHS Wrestling)",
              "North Coast Section Wrestling – 3x Medalist (5th, 5th, 8th)",
              "USA Powerlifting National Champion — Set national records for total weight (1212.2 lbs) and squat (451 lbs); CA state record for bench press (275 lbs)"
            ]
          },
          {
            label: "Academic Awards",
            items: [
              "2x President's List (California Interscholastic Federation)",
              "4x Scholar Athlete (California Interscholastic Federation) — Achieved 4.0/4.0 UW 6 semesters in a row",
              "CSF Highest Honors",
              "AIME Qualifier (top 5% nationally)"
            ]
          },
          {
            label: "Volunteering",
            items: [
              "Presidential Volunteer Service Award (AmeriCorps) — 260.5 hrs",
              "RVSA Service Award"
            ]
          }
        ]
      },
    },
  }

  return (
    <>
      {/* Modal Overlay for Bubble Details */}
      {selectedBubble && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all">
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12 shadow-2xl border border-cyan-500/30 w-full max-w-3xl min-h-[60vh] mx-4 flex flex-col overflow-y-auto animate-fade-in-scale">
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-cyan-400 transition-colors text-xl"
              onClick={() => setSelectedBubble(null)}
              aria-label="Close"
            >
              <X className="w-7 h-7" />
            </button>
            <div className="flex flex-col items-center justify-center flex-1 py-8">
              {selectedBubble === 'Powerlifting' ? (
                <>
                  <div className="w-40 h-40 relative mb-6 cursor-pointer" onClick={() => setShowPowerliftingLightbox(true)}>
                    <Image
                      src="/websitepics/powerlifting.jpeg"
                      alt="Powerlifting Large"
                      fill
                      className="object-cover rounded-full border-4 border-cyan-500 shadow-lg bg-black"
                      priority
                      unoptimized
                    />
                  </div>
                  {showPowerliftingLightbox && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90" onClick={() => setShowPowerliftingLightbox(false)}>
                      <div className="relative w-full max-w-2xl h-[70vh] flex items-center justify-center">
                        <Image
                          src="/websitepics/powerlifting.jpeg"
                          alt="Powerlifting Full"
                          fill
                          className="object-contain rounded-xl shadow-2xl bg-black"
                          priority
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : selectedBubble === 'Volunteering' ? (
                <div className="w-40 h-40 relative mb-6 flex items-center justify-center">
                  <Image
                    src="/websitepics/americanredcross.png1.png"
                    alt="American Red Cross Icon"
                    fill
                    className="object-contain rounded-full border-4 border-cyan-500 shadow-lg bg-white"
                    priority
                    unoptimized
                  />
                </div>
              ) : selectedBubble === 'Current Goals' ? (
                <div className="w-40 h-40 relative mb-6 flex items-center justify-center">
                  <Image
                    src="/websitepics/goals.png"
                    alt="Current Goals"
                    fill
                    className="object-cover rounded-full border-4 border-cyan-500 shadow-lg bg-white"
                    priority
                    unoptimized
                  />
                </div>
              ) : selectedBubble === 'Awards' ? (
                <div className="w-40 h-40 relative mb-6 flex items-center justify-center">
                  <Image
                    src="/websitepics/award.png"
                    alt="Awards"
                    fill
                    className="object-cover rounded-full border-4 border-cyan-500 shadow-lg bg-white"
                    priority
                    unoptimized
                  />
                </div>
              ) : (
                <div className="text-7xl mb-6">{bubbleDetails[selectedBubble].emoji}</div>
              )}
              <div className="bg-gray-900/80 rounded-xl p-6 border border-cyan-900/40 w-full max-w-lg mx-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
                {selectedBubble === 'Awards' && typeof bubbleDetails.Awards.description !== 'string' ? (
                  <>
                    <p className="text-xl text-gray-200 text-center mb-4">{(bubbleDetails.Awards.description as AwardsGroupsDescription).text}</p>
                    {(bubbleDetails.Awards.description as AwardsGroupsDescription).groups.map((group, idx) => (
                      <div key={idx} className="mb-4">
                        <h4 className="text-lg font-semibold text-cyan-300 mb-2">{group.label}</h4>
                        <ul className="list-disc list-inside text-lg text-gray-300 pl-4 space-y-1">
                          {group.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </>
                ) : selectedBubble === 'Current Goals' && typeof bubbleDetails['Current Goals'].description !== 'string' ? (
                  <>
                    <p className="text-xl text-gray-200 text-center mb-4">{(bubbleDetails['Current Goals'].description as CurrentGoalsDescription).text}</p>
                    <ul className="list-disc list-inside text-lg text-gray-300 pl-4 space-y-1">
                      {(bubbleDetails['Current Goals'].description as CurrentGoalsDescription).goals.map((goal: string, idx: number) => (
                        <li key={idx}>{goal}</li>
                      ))}
                    </ul>
                  </>
                ) : selectedBubble === 'Volunteering' && typeof bubbleDetails.Volunteering.description !== 'string' ? (
                  <>
                    <p className="text-xl text-gray-200 text-center mb-4">{(bubbleDetails.Volunteering.description as VolunteeringDescription).text}</p>
                    <ul className="list-disc list-inside text-lg text-gray-300 pl-4 space-y-1">
                      {(bubbleDetails.Volunteering.description as VolunteeringDescription).positions.map((pos: string, idx: number) => (
                        <li key={idx}>{pos}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-xl text-gray-200 text-center">{bubbleDetails[selectedBubble].description as string}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <PageTransition>
    <main className="min-h-screen bg-black text-white">
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <button
                onClick={handleBackClick}
                className="text-white hover:text-cyan-400 hover:bg-gray-800 transition-colors px-4 py-2 rounded-md"
              >
                <ArrowLeft className="h-4 w-4 mr-2 inline" />
              Back to Home
              </button>
        </div>
      </nav>

      {/* About Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4">
              <div className="text-center mb-32">
            <h1 className="text-5xl font-bold text-white mb-4">About Me</h1>
            <div className="mt-4 h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto"></div>
              </div>

              {/* Animated Conveyor Belt Circles */}
              <div className="relative mb-8 overflow-hidden" style={{ height: '12rem' }}>
                {/* Main horizontal bar */}
                <div className="absolute left-0 right-0 top-2/3 z-0" style={{ transform: 'translateY(-50%)' }}>
                  <div className="w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/25"></div>
                </div>
                {/* Animated circles container */}
                <div className="absolute left-0 right-0 top-2/3 z-10" style={{ transform: 'translateY(-70%)' }}>
                  <div className="flex items-end animate-conveyor-belt min-w-max">
                    {/* First set of circles - repeated 3 times */}
                    <div className="flex items-center gap-16 mx-8">
                      {/* 1st set */}
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Powerlifting')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/powerlifting.jpeg"
                              alt="Powerlifting"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Powerlifting</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Volunteering')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/americanredcross.png1.png"
                              alt="American Red Cross Icon"
                              fill
                              className="object-cover rounded-full border-4 border-cyan-500 shadow-lg bg-white"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">American Red Cross</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Current Goals')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/goals.png"
                              alt="Current Goals"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Current Goals</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Awards')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/award.png"
                              alt="Awards"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Awards</p>
                      </div>
                      {/* 2nd set */}
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Powerlifting')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/powerlifting.jpeg"
                              alt="Powerlifting"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Powerlifting</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Volunteering')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/americanredcross.png1.png"
                              alt="American Red Cross Icon"
                              fill
                              className="object-cover rounded-full border-4 border-cyan-500 shadow-lg bg-white"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">American Red Cross</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Current Goals')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/goals.png"
                              alt="Current Goals"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Current Goals</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Awards')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/award.png"
                              alt="Awards"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Awards</p>
                      </div>
          </div>

                    {/* Duplicate set for seamless loop - also repeated 3 times */}
                    <div className="flex items-center gap-16 mx-8">
                      {/* 1st set */}
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Powerlifting')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/powerlifting.jpeg"
                              alt="Powerlifting"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Powerlifting</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Volunteering')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/americanredcross.png1.png"
                              alt="American Red Cross Icon"
                              fill
                              className="object-cover rounded-full border-4 border-cyan-500 shadow-lg bg-white"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">American Red Cross</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Current Goals')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/goals.png"
                              alt="Current Goals"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Current Goals</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Awards')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/award.png"
                              alt="Awards"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Awards</p>
                      </div>
                      {/* 2nd set */}
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Powerlifting')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/powerlifting.jpeg"
                              alt="Powerlifting"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Powerlifting</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Volunteering')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/americanredcross.png1.png"
                              alt="American Red Cross Icon"
                              fill
                              className="object-cover rounded-full border-4 border-cyan-500 shadow-lg bg-white"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">American Red Cross</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Current Goals')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/goals.png"
                              alt="Current Goals"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Current Goals</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Awards')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/award.png"
                              alt="Awards"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Awards</p>
                      </div>
                      {/* 3rd set */}
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Powerlifting')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/powerlifting.jpeg"
                              alt="Powerlifting"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Powerlifting</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Volunteering')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/americanredcross.png1.png"
                              alt="American Red Cross Icon  "
                              fill
                              className="object-cover rounded-full border-4 border-cyan-500 shadow-lg bg-white"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">American Red Cross</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Current Goals')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/goals.png"
                              alt="Current Goals"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Current Goals</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div onClick={() => setSelectedBubble('Awards')} className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src="/websitepics/award.png"
                              alt="Awards"
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                        <p className="text-center text-cyan-400 font-semibold mt-2 text-sm">Awards</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Info Section */}
            <section className="container mx-auto px-4 mt-0 mb-20">
              <div className="bg-black/60 rounded-3xl border border-cyan-900/30 shadow-2xl p-10 md:p-16 flex flex-col items-center max-w-5xl mx-auto">
                {/* New intro paragraph */}
                <p className="text-2xl text-center text-gray-100 mb-10">
                  Hi! I'm Anish, a Computer Engineering student at Georgia Tech. I aim to combine both software and hardware to create solutions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                  <div className="bg-gray-900/80 rounded-2xl p-8 border border-cyan-900/40 flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-cyan-300 mb-3">Focus</h3>
                    <p className="text-gray-300 text-center">Embedded systems, full-stack development, and problem solving at the intersection of hardware and software.</p>
                  </div>
                  <div className="bg-gray-900/80 rounded-2xl p-8 border border-cyan-900/40 flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-cyan-300 mb-3">Clubs and Activities</h3>
                    <p className="text-gray-300 text-center">GT Barbell, IEEE, HackGT, and volunteering in tech outreach and fitness communities.</p>
                  </div>
                  <div className="bg-gray-900/80 rounded-2xl p-8 border border-cyan-900/40 flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-cyan-300 mb-3">Skills</h3>
                    <p className="text-gray-300 text-center">C/C++, Python, JavaScript, React, Node.js, circuit design, and rapid prototyping.</p>
            </div>
          </div>
        </div>
            </section>
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
      </PageTransition>
    </>
  )
} 