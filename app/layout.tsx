import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Anish Neema - Software Engineer",
  description: "Computer Engineering student at Georgia Tech passionate about software development and problem-solving.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body 
        className="antialiased bg-black text-white"
        style={{ 
          backgroundColor: 'black',
          margin: 0,
          padding: 0,
          overflowX: 'hidden'
        }}
      >
        <div 
          id="app-root"
          style={{ 
            backgroundColor: 'black',
            minHeight: '100vh',
            width: '100vw'
          }}
        >
           {children}
        </div>
      </body>
    </html>
  )
}
