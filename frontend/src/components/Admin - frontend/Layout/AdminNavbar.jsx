import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { 
  Menu, 
  X, 
  LogOut, 
  Users, 
  BookOpen, 
  ShieldCheckIcon
} from "lucide-react"
import { logout } from "@/api/auth"

const AdminNavbar = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(() => {
    const savedItem = localStorage.getItem('activeItem')
    return savedItem || ""
  })
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation items (without Add Student)
  const navItems = [
    {
      name: "User Creation",
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
      name: "user Management",
      icon: ShieldCheckIcon,
      url: "/admin-dashboard/admin-hierarchy",
    },
  ]

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
    
    // Update active item based on current location
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.url === currentPath);
    if (currentItem) {
      setActiveItem(currentItem.name);
      localStorage.setItem('activeItem', currentItem.name);
    } else {
      // If not on a nav item page, clear active item
      setActiveItem("");
      localStorage.removeItem('activeItem');
    }
  }, [location])

  return (
    <>
      {/* Desktop Navbar */}
      <header className="hidden md:flex items-center justify-between h-16 px-4 border-b bg-white border-amber-900 shadow-sm">
        <div className="flex items-center space-x-4">
          {/* Brand - Clicking navigates to dashboard */}
          <Link to="/admin-dashboard" className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">
              ACADEX
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.name && activeItem !== ""
            
            return (
              <Link
                key={item.name}
                to={item.url}
                onClick={() => handleItemClick(item.name)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-100 text-neutral-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-neutral-900"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* User Menu */}
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                <span className="font-medium text-sm text-blue-600">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-neutral-900">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-600">
                  Administrator
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navbar */}
      <header className="md:hidden flex items-center justify-between h-16 px-4 border-b bg-white border-amber-900 shadow-sm">
        <div className="flex items-center space-x-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Brand - Clicking navigates to dashboard */}
          <Link to="/admin-dashboard" className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">
              ACADEX
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
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
          <div className="fixed top-0 left-0 bottom-0 w-64 transform transition-transform duration-300 ease-in-out bg-white">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-amber-900">
              {/* Brand - Clicking navigates to dashboard */}
              <Link to="/admin-dashboard" className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">
                  ACADEX
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Navigation Items */}
            <nav className="mt-4 px-2">
              {navItems.map((item) => {
                const Icon = item.icon
                // Changed to only show active state when item is explicitly selected
                const isActive = activeItem === item.name && activeItem !== ""
                
                return (
                  <Link
                    key={item.name}
                    to={item.url}
                    onClick={() => handleItemClick(item.name)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-100 text-neutral-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-neutral-900"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            
            {/* User Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-amber-900">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
                  <span className="font-medium text-blue-600">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-neutral-900">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs truncate text-gray-600">
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