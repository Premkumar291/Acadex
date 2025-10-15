import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { logout, checkAuth } from "@/api/auth"
import { LogOut, Users, BookOpen, ShieldCheckIcon } from "lucide-react"
import { getAdminStatistics } from "@/api/adminHierarchy"
import { facultyAPI } from "@/api/faculty"
import { subjectAPI } from "@/api/subjects"

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)
  const [userLoading, setUserLoading] = useState(true)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [statistics, setStatistics] = useState({
    totalFaculties: 0,
    totalSubjects: 0,
    totalUsersCreatedByYou: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)
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
      description: "Manage faculties in your college ",
      url: "/admin-dashboard/faculty-management",
    },
    {
      name: "User Management",
      icon: ShieldCheckIcon,
      description: "Manage admins and Faculties accounts",
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

  // Fetch statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      if (!user) return
      
      try {
        setStatsLoading(true)
        
        // Fetch admin statistics (users created by you)
        const adminStatsResponse = await getAdminStatistics()
        const adminStats = adminStatsResponse.data
        
        // Fetch all faculty to get total count
        const facultyResponse = await facultyAPI.getFaculty()
        const totalFaculties = facultyResponse.data ? facultyResponse.data.length : 0
        
        // Fetch all subjects to get total count
        const subjectResponse = await subjectAPI.getSubjects()
        const totalSubjects = subjectResponse.pagination ? subjectResponse.pagination.totalSubjects : 0
        
        setStatistics({
          totalFaculties,
          totalSubjects,
          totalUsersCreatedByYou: adminStats.createdUsers + adminStats.createdAdmins
        })
      } catch (err) {
        console.error("Error fetching statistics:", err)
        setError("Failed to load statistics")
      } finally {
        setStatsLoading(false)
      }
    }
    
    fetchStatistics()
  }, [user])

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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-purple-500 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 border-4 border-purple-400 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-purple-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">
            Initializing ACADEX Portal
          </h2>
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-purple-600 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Welcome back, <span className="text-blue-600">{user?.name?.split(" ")[0] || "Admin"}</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
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
                className="rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 bg-gray-800 hover:bg-gray-700 border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-gray-700">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="rounded-xl p-6 bg-gray-800 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-white">
            System Overview
          </h2>
          {statsLoading ? (
            <div className="flex items-center justify-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-gray-700">
                <div className="flex items-center">
                  <Users className="w-8 h-8 mr-3 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Total Faculties</p>
                    <p className="text-2xl font-bold text-white">{statistics.totalFaculties}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-700">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 mr-3 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Total Subjects</p>
                    <p className="text-2xl font-bold text-white">{statistics.totalSubjects}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-700">
                <div className="flex items-center">
                  <ShieldCheckIcon className="w-8 h-8 mr-3 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Total Users created by you</p>
                    <p className="text-2xl font-bold text-white">{statistics.totalUsersCreatedByYou}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="p-6 max-w-md w-full mx-auto rounded-lg bg-gray-800 border border-gray-700">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Confirm Logout</h3>
                <p className="text-sm text-gray-300">
                  Are you sure you want to sign out?
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleConfirmLogout}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-white text-black hover:bg-gray-100 font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
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
                className="flex-1 px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="fixed bottom-8 right-8 z-50 p-4 max-w-md rounded-lg shadow-lg bg-red-900 border border-red-700">
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
  )
}

export default Dashboard