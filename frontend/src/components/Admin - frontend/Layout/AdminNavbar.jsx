import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { 
  Menu, 
  X, 
  LogOut, 
  Users, 
  BookOpen, 
  ShieldCheckIcon,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react"
import { logout } from "@/api/auth"

const AdminNavbar = ({ isDarkMode, toggleTheme, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed')
    return savedState !== null ? JSON.parse(savedState) : true
  })
  const [activeItem, setActiveItem] = useState(() => {
    const savedItem = localStorage.getItem('activeItem')
    return savedItem || "Faculty Creation"
  })
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation items (without Add Student)
  const navItems = [
    {
      name: "Faculty Creation",
      icon: Users,
      url: "/admin-dashboard/create-faculty",
    },
    {
      name: "Subject Management",
      icon: BookOpen,
      url: "/admin-dashboard/subject-management",
    },
    {
      name: "Faculty Management",
      icon: Users,
      url: "/admin-dashboard/faculty-management",
    },
    {
      name: "Admin Management",
      icon: ShieldCheckIcon,
      url: "/admin-dashboard/admin-hierarchy",
    },
  ]

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed
    setIsSidebarCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
  }

  // Handle navigation item click
  const handleItemClick = (itemName) => {
    setActiveItem(itemName)
    localStorage.setItem('activeItem', itemName)
    setIsMobileMenuOpen(false)
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <>
      {/* Desktop Navbar */}
      <header className={`hidden md:flex items-center justify-between h-16 px-4 border-b ${
        isDarkMode 
          ? "bg-gray-900 border-gray-700" 
          : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg ${
              isDarkMode 
                ? "hover:bg-gray-800 text-gray-300" 
                : "hover:bg-gray-100 text-gray-700"
            } transition-colors`}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
          
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDarkMode 
                ? "bg-gradient-to-r from-purple-600 to-blue-500" 
                : "bg-gradient-to-r from-purple-500 to-blue-400"
            }`}>
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className={`font-bold text-lg ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              ACADEX
            </span>
          </div>
        </div>

        {/* Navigation Links - Only show when sidebar is collapsed */}
        {isSidebarCollapsed && (
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.name
              
              return (
                <Link
                  key={item.name}
                  to={item.url}
                  onClick={() => handleItemClick(item.name)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-900"
                      : isDarkMode
                        ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="hidden xl:inline">{item.name}</span>
                </Link>
              )
            })}
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              isDarkMode 
                ? "hover:bg-gray-800 text-gray-300" 
                : "hover:bg-gray-100 text-gray-700"
            } transition-colors`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          
          {/* User Menu */}
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}>
                <span className={`font-medium text-sm ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div className="hidden lg:block">
                <p className={`text-sm font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  {user?.name || "Admin"}
                </p>
                <p className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  Administrator
                </p>
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? "hover:bg-gray-800 text-gray-300" 
                    : "hover:bg-gray-100 text-gray-700"
                } transition-colors`}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navbar */}
      <header className={`md:hidden flex items-center justify-between h-16 px-4 border-b ${
        isDarkMode 
          ? "bg-gray-900 border-gray-700" 
          : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center space-x-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`p-2 rounded-lg ${
              isDarkMode 
                ? "hover:bg-gray-800 text-gray-300" 
                : "hover:bg-gray-100 text-gray-700"
            } transition-colors`}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDarkMode 
                ? "bg-gradient-to-r from-purple-600 to-blue-500" 
                : "bg-gradient-to-r from-purple-500 to-blue-400"
            }`}>
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className={`font-bold text-lg ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              ACADEX
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              isDarkMode 
                ? "hover:bg-gray-800 text-gray-300" 
                : "hover:bg-gray-100 text-gray-700"
            } transition-colors`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`p-2 rounded-lg ${
              isDarkMode 
                ? "hover:bg-gray-800 text-gray-300" 
                : "hover:bg-gray-100 text-gray-700"
            } transition-colors`}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className={`fixed top-0 left-0 bottom-0 w-64 transform transition-transform duration-300 ease-in-out ${
            isDarkMode ? "bg-gray-900" : "bg-white"
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between h-16 px-4 border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isDarkMode 
                    ? "bg-gradient-to-r from-purple-600 to-blue-500" 
                    : "bg-gradient-to-r from-purple-500 to-blue-400"
                }`}>
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className={`font-bold text-lg ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  ACADEX
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? "hover:bg-gray-800 text-gray-300" 
                    : "hover:bg-gray-100 text-gray-700"
                } transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Navigation Items */}
            <nav className="mt-4 px-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeItem === item.name
                
                return (
                  <Link
                    key={item.name}
                    to={item.url}
                    onClick={() => handleItemClick(item.name)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? isDarkMode
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-900"
                        : isDarkMode
                          ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            
            {/* User Info */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}>
                  <span className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                    {user?.name || "Admin"}
                  </p>
                  <p className={`text-xs truncate ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    Administrator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminNavbar