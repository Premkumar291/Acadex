"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { logout, checkAuth } from "@/api/auth"
import PDFProcessingCard from "./PDFProcessingCard"
import { motion } from "framer-motion"
import { LogOut, Bell } from "lucide-react"
import FacultyReportEditor from "./FacultyReportEditor.jsx";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)
  const [userLoading, setUserLoading] = useState(true)
  const [isDarkMode] = useState(true)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const gsapRef = useRef(null)
  const navigate = useNavigate()

  // ColourfulText Component (inline)
  const ColourfulText = ({ text, className = "" }) => {
    return (
      <span
        className={`inline-block ${className}`}
        style={{
          fontFamily: "'Orbitron', 'Exo 2', 'Rajdhani', monospace",
        }}
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            style={{
              display: "inline-block",
              background: "linear-gradient(90deg, #a855f7 0%, #8b5cf6 50%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "0.02em",
              fontWeight: 700,
              margin: char === " " ? "0 0.12em" : "0",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.2,
              transition: { duration: 0.2 },
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    )
  }

  // Check authentication when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await checkAuth()
        setUser(userData)
      } catch (error) {
        navigate("/login")
      } finally {
        setUserLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  const handleConfirmLogout = async () => {
    setIsLoading(true)
    setError("")
    try {
      await logout()
      navigate("/login")
    } catch {
      setError("Logout failed. Please try again.")
    } finally {
      setIsLoading(false)
      setShowLogoutDialog(false)
    }
  }

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  // LogoutDialog Component
  const LogoutDialog = () => {
    if (!showLogoutDialog) return null
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
        <div className="dark-elevated-card p-6 max-w-md w-full mx-auto rounded-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <LogOut className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Confirm Logout</h3>
              <p className="text-sm text-gray-300">
                Are you sure you want to log out? You will need to log in again to access your account.
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleConfirmLogout}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-100 transition-colors"
            >
              {isLoading ? "Logging out..." : "Yes, Log Out"}
            </button>
            <button
              onClick={() => setShowLogoutDialog(false)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-all duration-700 bg-black">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-purple-500 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 border-4 border-purple-400 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-purple-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-6"></div>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">
            Loading...
          </h2>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-600 animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-purple-600 animate-bounce delay-100"></div>
            <div className="w-3 h-3 rounded-full bg-purple-600 animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        .acadex-logo {
          font-family: 'Orbitron', 'Exo 2', 'Rajdhani', sans-serif;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .acadex-a1 { color: #6366F1; }
        .acadex-c { color: #EF4444; }
        .acadex-a2 { color: #F59E0B; }
        .acadex-d { color: #8B5CF6; }
        .acadex-e { color: #10B981; }
        .acadex-x { color: #F97316; }
        .dark-bg {
          background: linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #111111 50%, #0a0a0a 75%, #000000 100%);
        }
        .dark-navbar {
          @apply bg-black border-b border-gray-800 sticky top-0 z-30;
        }
        .dark-text-primary {
          color: #ffffff;
        }
        .dark-text-secondary {
          color: rgba(255, 255, 255, 0.8);
        }
        .dark-text-muted {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
      <div className="min-h-screen dark-bg flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Dynamic Navbar */}
          <header className="animate-header dark-navbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Brand Section */}
                <div className="flex items-center">
                  <div className="acadex-logo text-2xl">
                    <span className="acadex-a1">A</span>
                    <span className="acadex-c">C</span>
                    <span className="acadex-a2">A</span>
                    <span className="acadex-d">D</span>
                    <span className="acadex-e">E</span>
                    <span className="acadex-x">X</span>
                  </div>
                </div>

                {/* Right Section - Controls */}
                <div className="flex items-center space-x-4">
                  {/* User Profile */}
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black text-base">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="status-dot absolute -top-1 -right-1 w-3 h-3 rounded-full"></div>
                    </div>
                    <div className="hidden md:block">
                      <p className="font-semibold text-base text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs mono font-medium text-purple-300">
                        Faculty
                      </p>
                    </div>
                  </div>
                  {/* Logout Button */}
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="relative z-10 flex-1">
            {/* Hero Welcome Section */}
            <div className="animate-section py-20 flex items-center justify-center relative">
              <div className="text-center space-y-6 relative z-20 px-8">
                <motion.h1
                  className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-white font-sans tracking-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Welcome back, <ColourfulText text={user?.name?.split(" ")[0] || "User"} />
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Your advanced document processing environment is ready. Upload, analyze, and extract insights from
                  your documents with AI-powered precision.
                </motion.p>
              </div>
            </div>

            {/* PDF Processing Section */}
            <div className="max-w-7xl mx-auto px-8 pb-12">
              <div className="animate-section mb-12">
                <div className="dark-elevated-card p-6 hover-lift">
                  <div className="flex items-center space-x-4 mb-6">
                    <svg
                      className="w-8 h-8 float-element text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div>
                      <h3 className="text-2xl font-black text-white">
                        Document Processing Engine
                      </h3>
                      <p className="text-base text-gray-300 mt-1">
                        Advanced AI-powered PDF analysis, extraction, and processing capabilities
                      </p>
                    </div>
                  </div>
                  <div className="dark-section-divider mb-6"></div>
                  <PDFProcessingCard />
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Logout Confirmation Dialog */}
        <LogoutDialog />

        {/* Error Notification */}
        {error && (
          <div className="fixed bottom-8 right-8 z-50 dark-elevated-card p-4 max-w-md hover-lift">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">System Error</h4>
                <p className="text-sm text-gray-300">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard