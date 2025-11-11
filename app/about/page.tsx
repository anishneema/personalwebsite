"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Briefcase, Rocket, Lightbulb, Dumbbell, GraduationCap, School } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Squares from "@/components/Squares"
import TargetCursor from "@/components/TargetCursor"
import DomeGallery from "@/components/DomeGallery"
import ChromaGrid from "@/components/ChromaGrid"
import Terminal from "@/components/Terminal"
import "@/components/Terminal.css"

type Section = "menu" | "experience" | "hobbies" | "currently" | "futuregoals"

export default function About() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState<Section>("menu")

  const handleBackClick = () => {
    router.push('/')
  }

  const handleSectionSelect = (section: Section) => {
    setCurrentSection(section)
  }

  const handleBackToMenu = () => {
    setCurrentSection("menu")
  }

  // Experience data for ChromaGrid
  const experienceChromaItems = [
    {
      image: "/websitepics/codeninjas.png",
      title: "Code Ninjas",
      subtitle: "Coding Instructor",
      handle: "Apr 2024 - Sept 2025",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(145deg, #3B82F6, #000)",
      url: undefined
    },
    {
      image: "/websitepics/algoverselogo.png",
      title: "Algoverse",
      subtitle: "Software Developer Intern",
      handle: "Aug 2024 - Mar 2025",
      borderColor: "#8B5CF6",
      gradient: "linear-gradient(180deg, #8B5CF6, #000)",
      url: undefined
    }
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      x: -100,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      x: 100,
      rotateX: 15,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const
      }
    }
  }

  // Main Menu Screen
  const MenuScreen = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center min-h-[80vh] text-center"
    >
      <motion.h1
        variants={itemVariants}
        className="text-6xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
      >
        Who's Anish?
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="text-2xl text-gray-300 mb-12 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
      >
        Choose what you want to explore.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full px-4">
        <motion.button
          variants={itemVariants}
          onClick={() => handleSectionSelect("experience")}
          className="cursor-target group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
        >
          <span className="absolute left-4 top-4 h-4 w-4 rounded-full border border-cyan-400/40 bg-white/5 flex items-center justify-center">
            <span className="text-xs font-bold text-cyan-400">A</span>
          </span>
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-black border border-cyan-500">
            <Briefcase className="w-7 h-7 text-cyan-400" />
                  </div>
          <h2 className="text-3xl font-bold text-cyan-400 mb-2">Experience</h2>
          <ArrowRight className="absolute top-4 right-4 w-6 h-6 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>

        <motion.button
          variants={itemVariants}
          onClick={() => handleSectionSelect("hobbies")}
          className="cursor-target group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
        >
          <span className="absolute left-4 top-4 h-4 w-4 rounded-full border border-cyan-400/40 bg-white/5 flex items-center justify-center">
            <span className="text-xs font-bold text-cyan-400">B</span>
          </span>
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-black border border-cyan-500">
            <Dumbbell className="w-7 h-7 text-cyan-400" />
                      </div>
          <h2 className="text-3xl font-bold text-cyan-400 mb-2">Hobbies</h2>
          <ArrowRight className="absolute top-4 right-4 w-6 h-6 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>

        <motion.button
          variants={itemVariants}
          onClick={() => handleSectionSelect("currently")}
          className="cursor-target group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
        >
          <span className="absolute left-4 top-4 h-4 w-4 rounded-full border border-cyan-400/40 bg-white/5 flex items-center justify-center">
            <span className="text-xs font-bold text-cyan-400">C</span>
          </span>
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-black border border-cyan-500">
            <GraduationCap className="w-7 h-7 text-cyan-400" />
                    </div>
          <h2 className="text-3xl font-bold text-cyan-400 mb-2">Campus Involvement</h2>
          <ArrowRight className="absolute top-4 right-4 w-6 h-6 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>

        <motion.button
          variants={itemVariants}
          onClick={() => handleSectionSelect("futuregoals")}
          className="cursor-target group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
        >
          <span className="absolute left-4 top-4 h-4 w-4 rounded-full border border-cyan-400/40 bg-white/5 flex items-center justify-center">
            <span className="text-xs font-bold text-cyan-400">D</span>
          </span>
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-black border border-cyan-500">
            <Lightbulb className="w-7 h-7 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-cyan-400 mb-2">Goals & Awards</h2>
          <ArrowRight className="absolute top-4 right-4 w-6 h-6 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
        </div>
    </motion.div>
  )

  // Experience Screen with ChromaGrid - Full Page
  const ExperienceScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 w-screen h-screen z-40 bg-black"
    >
      {/* Transparent Back Button - Top Right */}
              <button
        onClick={handleBackToMenu}
        className="cursor-target fixed top-6 right-6 z-[100] px-4 py-2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-lg transition-all duration-300 flex items-center gap-2 border border-white/30 hover:border-white/50 shadow-lg"
            >
        <ArrowLeft className="w-4 h-4" />
        Back
              </button>

      {/* Full Page ChromaGrid */}
      <div className="absolute inset-0 w-full h-full">
        <ChromaGrid
          items={experienceChromaItems}
          radius={400}
          columns={2}
          rows={1}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
        </div>
    </motion.div>
  )

  // Hobbies images data
  const hobbiesImages = [
    {
      src: '/websitepics/citylights.jpg',
      alt: 'City lights',
      caption: 'I love city lights'
    },
    {
      src: '/websitepics/citylights2.jpg',
      alt: 'City lights',
      caption: 'I love city lights'
    },
    {
      src: '/websitepics/sunrise.jpg',
      alt: 'Sunrise',
      caption: 'I love sunrises'
    },
    {
      src: '/websitepics/figurecollection.jpg',
      alt: 'Figure collection',
      caption: 'My figure collection (growing)'
    },
    {
      src: '/websitepics/powerlifting.jpeg',
      alt: 'Powerlifting competition',
      caption: 'Competing at national powerlifting championships'
    },
    {
      src: '/websitepics/wrestling.jpg',
      alt: 'Portrait',
      caption: 'I competed in wrestling for 4 years in high school'
    },
    {
      src: '/websitepics/eating.jpg',
      alt: 'Eating',
      caption: 'I love trying new foods'
    },
    {
      src: '/websitepics/traveling.jpg',
      alt: 'Traveling',
      caption: 'I love traveling and exploring new places'
    }
  ]

  // Hobbies Screen with Dome Gallery - Full Page
  const HobbiesScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 w-screen h-screen z-40 bg-black"
    >
      {/* Transparent Back Button - Top Right */}
            <button
        onClick={handleBackToMenu}
        className="cursor-target fixed top-6 right-6 z-[100] px-4 py-2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-lg transition-all duration-300 flex items-center gap-2 border border-white/30 hover:border-white/50 shadow-lg"
            >
        <ArrowLeft className="w-4 h-4" />
        Back
            </button>

      {/* Full Page Dome Gallery */}
      <div className="absolute inset-0 w-full h-full">
        <DomeGallery
          images={hobbiesImages}
          fit={0.6}
          fitBasis="auto"
          minRadius={600}
          maxRadius={Infinity}
          padFactor={0.1}
          overlayBlurColor="#000000"
          maxVerticalRotationDeg={5}
          dragSensitivity={20}
          enlargeTransitionMs={300}
          segments={35}
          dragDampening={2}
          imageBorderRadius="30px"
          openedImageBorderRadius="30px"
          grayscale={true}
                    />
                  </div>
    </motion.div>
  )

  // Campus Involvement experiences data (LinkedIn-style)
  const campusInvolvementExperiences = [
    {
      id: 1,
      title: "Hive Peer Instructor",
      organization: "Georgia Tech",
      type: "Education",
      date: "Spring 2026",
      image: "/websitepics/hivelogo.png",
      description: "Selected as peer instructor for the largest makerspace on campus. Teaching and mentoring students in computer science and engineering fundamentals. Helping students understand core concepts and develop problem-solving skills by guiding them through personal and classroom projects.",
      location: "Atlanta, GA"
    },
    {
      id: 2,
      title: "AI Makerspace Nexus VIP",
      organization: "Georgia Tech",
      type: "Research",
      date: "Spring 2026",
      image: "/websitepics/VIPLOGO.png",
      description: "Undergraduate research for the AI nexus makerspace. Sponsored by NVIDIA. Contribute to open source software and democratizing accessibility to the space.",
      location: "Atlanta, GA"
    },
    {
      id: 3,
      title: "Big Data Big Impact",
      organization: "Georgia Tech",
      type: "Machine learning Engineer",
      date: "Fall 2025 - Present",
      image: "/websitepics/bdbilogo.png",
      description: "Machine learning engineering for a project subteam for Big Data Big Impact. Developing a product that analyzes oil spills with satellite data in order to create a more sustainable environment.",
      location: "Atlanta, GA"
    }
  ]

  // Courses data
  const currentCourses = [
    {
      code: "",
      name: "Intro to Object Oriented Programming",
      credits: 3,
      semester: "Fall 2025"
    },
    {
      code: "",
      name: "Intro to Discrete Mathematics",
      credits: 3,
      semester: "Fall 2025"
    },
    {
      code: "",
      name: "Physics 2",
      credits: 4,
      semester: "Fall 2025"
    },
    {
      code: "",
      name: "Intro to Digital System Design",
      credits: 3,
      semester: "Fall 2025"
    }
  ]

  // Campus Involvement Screen with LinkedIn-style layout
  const CampusInvolvementScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 w-screen h-screen z-40 bg-black overflow-y-auto"
    >
      {/* Header with Back Button */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Campus Involvement</h1>
          <button
            onClick={handleBackToMenu}
            className="cursor-target px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2 border border-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Experiences Section */}
        <div className="space-y-6 mb-12">
          {campusInvolvementExperiences.map((experience, idx) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-all"
            >
              {/* Experience Content - Image on left, text on right */}
              <div className="p-6">
                <div className="flex items-start gap-6">
                  {/* Left Side - Image/Logo */}
                  {experience.image && (
                    <div className="w-20 h-20 rounded-lg bg-white/5 border border-gray-700 flex-shrink-0 relative overflow-hidden">
                        <Image
                        src={experience.image}
                        alt={experience.title}
                          fill
                        className="object-contain p-2 rounded-lg"
                          unoptimized
                        />
                    </div>
                  )}
                  
                  {/* Right Side - Text Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-white mb-1">{experience.title}</h3>
                    <p className="text-gray-400 font-medium italic mb-2">{experience.organization}</p>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-sm text-cyan-400">{experience.date}</span>
                      {experience.location && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="text-sm text-gray-400">{experience.location}</span>
                        </>
                      )}
                      <span className="text-gray-600">•</span>
                      <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700">{experience.type}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{experience.description}</p>
                </div>
                </div>
                </div>
            </motion.div>
          ))}
        </div>

        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden mb-8"
        >
          <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
            <h2 className="text-2xl font-semibold text-white">Current Courses</h2>
            <p className="text-sm text-gray-400 mt-1">Fall 2025 Semester • Georgia Tech</p>
                      </div>
          <div className="p-6">
            <div className="grid gap-4">
              {currentCourses.map((course, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-5 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      {course.code && (
                        <>
                          <span className="font-bold text-white text-lg">{course.code}</span>
                          <span className="text-gray-600 hidden sm:inline">•</span>
                        </>
                      )}
                      <span className="text-gray-300 font-medium">{course.name}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-gray-400">{course.semester}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-sm text-gray-400">{course.credits} credit{course.credits !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
              </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  // Goals & Awards Terminal commands
  const futureGoalsCommands = [
    {
      name: "career",
      description: "show career goals and aspirations",
      output: [
        "",
        "🎯 Career Goals:",
        "",
        "   • Work at a leading tech company",
        "   • Contribute to open-source projects",
        "   • Build products that impact millions of users",
        "   • Become a technical lead or engineering manager",
        "   • Mentor other developers and give back to the community",
        "",
        "Type 'help' to see more commands."
      ]
    },
    {
      name: "personal",
      description: "show personal development goals",
      output: [
        "",
        "💪 Personal Goals:",
        "",
        "   • Bench 315 lbs",
        "   • Begin Meditating",
        "   • Prioritize my health and well-being",
        "   • Build a drone",
    
      
        "Type 'help' to see more commands."
      ]
    },
    {
      name: "academic",
      description: "show academic and learning goals",
      output: [
        "",
        "📚 Academic Goals:",
        "",
        "   • Continue excelling at Georgia Tech",
        "   • Pursue opportunities for research and innovation",
        "   • Complete internships at top tech companies",
        "   • Graduate with honors",
        "   • Contribute to academic research papers",
        "   • Build a strong portfolio of projects",
        "",
        "Type 'help' to see more commands."
      ]
    },
    {
      name: "awards",
      description: "show awards and achievements",
      output: [
        "",
        "🏆 Awards & Achievements:",
        "",
        "   • AIME Qualfier(Score 9)",
        "   • USPA National Powerlifting Champion",
        "   • United States Presidential Volunteer Service Award",
        "   • Regional Volunteer Service Award(Red Cross)",
        "",
        "Type 'help' to see more commands."
      ]
    }
  ]

  // Goals & Awards Screen with Terminal UI - Full Page
  const FutureGoalsScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 w-screen h-screen z-40 bg-black"
    >
      {/* Transparent Back Button - Top Right */}
            <button
        onClick={handleBackToMenu}
        className="cursor-target fixed top-6 right-6 z-[100] px-4 py-2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-lg transition-all duration-300 flex items-center gap-2 border border-white/30 hover:border-white/50 shadow-lg"
            >
        <ArrowLeft className="w-4 h-4" />
        Back
            </button>

      {/* Full Page Terminal */}
      <div className="absolute inset-0 w-full h-full pt-20 pb-20 px-4">
        <Terminal
          commands={futureGoalsCommands}
          prompt="anish@whoami:~$"
          initialMessage="Type 'help' to see available commands. Press Escape to go back."
          onExit={handleBackToMenu}
        />
      </div>
    </motion.div>
  )

  return (
    <>
      <TargetCursor />
      <main className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10"></div>
        
        {/* Squares Background - Hidden when hobbies, experience, currently, or futuregoals screen is active */}
        {currentSection !== "hobbies" && currentSection !== "experience" && currentSection !== "currently" && currentSection !== "futuregoals" && (
          <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }}>
            <Squares 
              speed={0.5} 
              squareSize={60}
              direction='diagonal'
              borderColor='rgba(255, 255, 255, 0.25)'
              hoverFillColor='rgba(34, 211, 238, 0.7)'
            />
        </div>
      )}

        {/* Navigation - Hidden when hobbies, experience, currently, or futuregoals screen is active */}
        {currentSection !== "hobbies" && currentSection !== "experience" && currentSection !== "currently" && currentSection !== "futuregoals" && (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <button
                onClick={handleBackClick}
                className="cursor-target text-white hover:text-cyan-400 hover:bg-gray-800/50 transition-colors px-4 py-2 rounded-md backdrop-blur-sm"
            >
                <ArrowLeft className="h-4 w-4 mr-2 inline" />
              Back to Home
              </button>
        </div>
      </nav>
        )}

        {/* Main Content - Only Menu */}
        <section className="pt-24 pb-20 relative z-10">
        <div className="container mx-auto px-4">
            <AnimatePresence mode="wait">
              {currentSection === "menu" && <MenuScreen key="menu" />}
            </AnimatePresence>
          </div>
      </section>

        {/* Campus Involvement Screen - Full Page Overlay */}
        <AnimatePresence>
          {currentSection === "currently" && <CampusInvolvementScreen key="currently" />}
        </AnimatePresence>

        {/* Hobbies Screen - Full Page Overlay */}
        <AnimatePresence>
          {currentSection === "hobbies" && <HobbiesScreen key="hobbies" />}
        </AnimatePresence>

        {/* Experience Screen - Full Page Overlay */}
        <AnimatePresence>
          {currentSection === "experience" && <ExperienceScreen key="experience" />}
        </AnimatePresence>

        {/* Goals & Awards Screen - Full Page Overlay */}
        <AnimatePresence>
          {currentSection === "futuregoals" && <FutureGoalsScreen key="futuregoals" />}
        </AnimatePresence>

      {/* Footer - Hidden when hobbies, experience, currently, or futuregoals screen is active */}
      {currentSection !== "hobbies" && currentSection !== "experience" && currentSection !== "currently" && currentSection !== "futuregoals" && (
        <footer className="py-6 bg-black/50 text-white border-t border-gray-800 relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
              <div className="text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Anish. All rights reserved.</p>
          </div>
        </div>
      </footer>
      )}
    </main>

    </>
  )
} 
