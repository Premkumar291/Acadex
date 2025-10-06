import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { logout, checkAuth } from "@/api/auth"
import { LogOut, Users, BookOpen, ShieldCheckIcon } from "lucide-react"

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)
  const [userLoading, setUserLoading] = useState(true)
  const [isDarkMode] = useState(() => {
    // Get saved theme from localStorage or default to false (light mode)
    const savedTheme = localStorage.getItem('darkMode')
    return savedTheme !== null ? JSON.parse(savedTheme) : false
  })
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const navigate = useNavigate()

  // Navigation items (without Add Student)
  const navItems = [
    {
      name: "Faculty Creation",
      icon: Users,
      description: "Create faculty & admin accounts",
      url: "/admin-dashboard/create-faculty",
    },
    {
      name: "Subject Management",
      icon: BookOpen,
      description: "Manage academic subjects",
      url: "/admin-dashboard/subject-management",
    },
    {
      name: "Faculty Management",
      icon: Users,
      description: "Manage faculty profiles",
      url: "/admin-dashboard/faculty-management",
    },
    {
      name: "Admin Management",
      icon: ShieldCheckIcon,
      description: "Manage administrators",
      url: "/admin-dashboard/admin-hierarchy",
    },
  ]

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await checkAuth()
        setUser(response.user)
      } catch {
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

  if (userLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className={`absolute inset-0 border-4 ${isDarkMode ? "border-purple-500" : "border-blue-200"} rounded-full animate-ping opacity-20`}></div>
            <div className={`absolute inset-2 border-4 ${isDarkMode ? "border-purple-400" : "border-blue-400"} rounded-full animate-spin`}></div>
            <div className={`absolute inset-4 border-4 ${isDarkMode ? "border-purple-600" : "border-blue-600"} rounded-full animate-pulse`}></div>
            <div className={`absolute inset-6 ${isDarkMode ? "bg-gradient-to-r from-purple-500 to-pink-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"} rounded-full flex items-center justify-center`}>
              <svg className="w-8 h-8 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Initializing ACADEX Portal
          </h2>
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${isDarkMode ? "bg-purple-600" : "bg-blue-600"} animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Welcome back, <span className="text-blue-600">{user?.name?.split(" ")[0] || "Admin"}</span>
          </h1>
          <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}>
            Your administrative dashboard is ready. Manage your institution's faculty, students, and subjects.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {navItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div 
                key={index}
                onClick={() => navigate(item.url)}
                className={`rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? "bg-gray-800 hover:bg-gray-700 border border-gray-700" 
                    : "bg-white hover:bg-gray-50 border border-gray-200 shadow-sm"
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-blue-50"
                  }`}>
                    <Icon className={`w-6 h-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                  </div>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {item.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className={`rounded-xl p-6 ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-sm"}`}>
          <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            System Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-blue-50"}`}>
              <div className="flex items-center">
                <Users className={`w-8 h-8 mr-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Total Faculty</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>24</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-green-50"}`}>
              <div className="flex items-center">
                <BookOpen className={`w-8 h-8 mr-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Total Subjects</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>68</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-purple-50"}`}>
              <div className="flex items-center">
                <ShieldCheckIcon className={`w-8 h-8 mr-3 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Total Admins</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className={`p-6 max-w-md w-full mx-auto rounded-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-sm"}`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Confirm Logout</h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>
                  Are you sure you want to sign out?
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleConfirmLogout}
                disabled={isLoading}
                className={`flex-1 px-4 py-2 ${
                  isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black hover:bg-gray-800 text-white"
                } font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing out...</span>
                  </div>
                ) : (
                  "Yes, Sign Out"
                )}
              </button>
              <button
                onClick={() => setShowLogoutDialog(false)}
                disabled={isLoading}
                className={`flex-1 px-4 py-2 ${
                  isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className={`fixed bottom-8 right-8 z-50 p-4 max-w-md rounded-lg shadow-lg ${isDarkMode ? "bg-red-900 border border-red-700" : "bg-red-50 border border-red-200"}`}>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-red-500 flex items-center justify-center flex-shrink-0 rounded">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>System Error</h4>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className={`${isDarkMode ? "text-gray-300 hover:text-white" : "text-slate-600 hover:text-slate-800"} transition-colors`}
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
  )
}

export default Dashboard