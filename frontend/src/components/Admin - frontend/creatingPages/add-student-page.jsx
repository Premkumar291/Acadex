"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, LogOut, Users, UserPlus, BookOpen, LinkIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

const SidebarAcadexLogo = () => {
  return (
    <div className="acadex-logo text-lg">
      <motion.span
        className="acadex-a1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        A
      </motion.span>
      <motion.span
        className="acadex-c"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        whileHover={{ scale: 1.1, rotate: -5 }}
      >
        C
      </motion.span>
      <motion.span
        className="acadex-a2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        A
      </motion.span>
      <motion.span
        className="acadex-d"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        whileHover={{ scale: 1.1, rotate: -5 }}
      >
        D
      </motion.span>
      <motion.span
        className="acadex-e"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        E
      </motion.span>
      <motion.span
        className="acadex-x"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        whileHover={{ scale: 1.1, rotate: -5 }}
      >
        X
      </motion.span>
    </div>
  )
}

const AnimatedASymbol = () => {
  return (
    <motion.div
      className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #6366F1 0%, #EF4444 25%, #F59E0B 50%, #8B5CF6 75%, #10B981 100%)",
      }}
      initial={{ scale: 0.8, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        scale: 1.1,
        rotate: 10,
        boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
      }}
    >
      <motion.span
        className="text-white text-sm font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        whileHover={{ scale: 1.2 }}
      >
        A
      </motion.span>
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #6366F1 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, #EF4444 0%, transparent 50%)",
            "radial-gradient(circle at 50% 20%, #F59E0B 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, #8B5CF6 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, #6366F1 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </motion.div>
  )
}

const NavItem = ({ item, isActive, onClick, isCollapsed, isDarkMode }) => {
  const Icon = item.icon
  const content = (
    <>
      <Icon
        className={`
          w-4 h-4 transition-colors duration-200 flex-shrink-0
          ${
            isActive
              ? isDarkMode
                ? "text-white"
                : "text-gray-700"
              : isDarkMode
                ? "text-gray-500 group-hover:text-white"
                : "text-gray-500 group-hover:text-gray-700"
          }
        `}
      />
      {!isCollapsed && <span className="text-sm font-medium flex-1 text-left truncate">{item.name}</span>}
    </>
  )

  return (
    <div className="relative group">
      <button
        onClick={() => onClick(item.name)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
          ${
            isActive
              ? isDarkMode
                ? "bg-gray-900 text-white shadow-sm border border-gray-800"
                : "bg-gray-100 text-gray-900 shadow-sm"
              : isDarkMode
                ? "text-gray-300 hover:bg-gray-900 hover:text-red-300"
                : "text-gray-700 hover:bg-red-50 hover:text-red-700"
          }
          ${isCollapsed ? "justify-center px-2" : "justify-start"}
        `}
      >
        {content}
      </button>
      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div
          className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 ${
            isDarkMode ? "bg-gray-900 text-white border border-gray-800" : "bg-gray-900 text-white"
          } text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50`}
        >
          {item.name}
          {item.description && <div className="text-gray-400 text-xs">{item.description}</div>}
        </div>
      )}
    </div>
  )
}

const AddStudentPage = () => {
  const navigate = useNavigate()

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Get saved theme from localStorage or default to false (light mode)
    const savedTheme = localStorage.getItem("darkMode")
    return savedTheme !== null ? JSON.parse(savedTheme) : false
  })
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Get saved state from localStorage or default to true (collapsed)
    const savedState = localStorage.getItem("sidebarCollapsed")
    return savedState !== null ? JSON.parse(savedState) : true
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(() => {
    // Get saved active item from localStorage or default to "Add Student"
    const savedItem = localStorage.getItem("activeItem")
    return savedItem || "Add Student"
  })
  const [user, setUser] = useState(() => {
    // Get user info from localStorage or use default
    const savedUser = localStorage.getItem("currentUser")
    const authToken = localStorage.getItem("authToken")

    // If there's an auth token, try to get user from login data
    if (authToken && !savedUser) {
      const loginUser = localStorage.getItem("loginUserData")
      if (loginUser) {
        const userData = JSON.parse(loginUser)
        return { name: userData.name, email: userData.email }
      }
    }

    return savedUser ? JSON.parse(savedUser) : { name: "Admin User", email: "admin@acadex.com" }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const sidebarItems = [
    {
      name: "Faculty Creation",
      icon: Users,
      description: "Create new faculty accounts",
      url: "/admin/createFaculty/create-faculty",
    },
    {
      name: "Add Student",
      icon: UserPlus,
      description: "Enroll new students",
      url: "/admin/createFaculty/add-student",
    },
    {
      name: "Subject Management",
      icon: BookOpen,
      description: "Manage course subjects",
      url: "/admin/createFaculty/subject-management",
    },
    {
      name: "Faculty Management",
      icon: LinkIcon,
      description: "Manage faculty records",
      url: "/admin/createFaculty/faculty-management",
    },
  ]

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode))
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed))
  }, [isCollapsed])

  useEffect(() => {
    localStorage.setItem("activeItem", activeItem)
  }, [activeItem])

  const handleItemClick = (itemName) => {
    setActiveItem(itemName)
  }

  const updateUserInfo = (newUser) => {
    const updatedUser = {
      name: newUser.name || newUser.firstName + " " + newUser.lastName || "User",
      email: newUser.email || "user@acadex.com",
    }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Store auth token if provided (from login component)
    if (newUser.token) {
      localStorage.setItem("authToken", newUser.token)
    }
  }

  const handleLogoutClick = async () => {
    setIsLoggingOut(true)
    try {
      // Simulate logout API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Clear all user-related data
      localStorage.removeItem("currentUser")
      localStorage.removeItem("authToken")
      localStorage.removeItem("loginUserData")
      localStorage.removeItem("activeItem")

      // Reset user state
      setUser({ name: "Guest", email: "guest@acadex.com" })

      // Navigate to login page
      navigate("/")

      if (import.meta.env.DEV) {
        console.log("User logged out successfully");
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Logout error:", error);
      }
    } finally {
      setIsLoggingOut(false)
    }
  }

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "loginUserData" && e.newValue) {
        const userData = JSON.parse(e.newValue)
        updateUserInfo(userData)
      }
      // Also listen for direct user data updates from login
      if (e.key === "currentUser" && e.newValue) {
        const userData = JSON.parse(e.newValue)
        setUser(userData)
      }
    }

    // Listen for storage changes (when user logs in from another tab/window)
    window.addEventListener("storage", handleStorageChange)

    // Check for fresh login data on component mount
    const loginUserData = localStorage.getItem("loginUserData")
    if (loginUserData) {
      const userData = JSON.parse(loginUserData)
      updateUserInfo(userData)
      // Clear the temporary login data after using it
      localStorage.removeItem("loginUserData")
    }

    const authToken = localStorage.getItem("authToken")
    const currentUser = localStorage.getItem("currentUser")
    if (authToken && currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const [formData, setFormData] = useState({
    email: "",
    rollNumber: "",
    firstName: "",
    lastName: "",
    department: "",
    year: "",
    section: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    emergencyContact: "",
    parentName: "",
    parentPhone: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    if (!formData.rollNumber) newErrors.rollNumber = "Roll number is required"
    if (!formData.firstName) newErrors.firstName = "First name is required"
    if (!formData.lastName) newErrors.lastName = "Last name is required"
    if (!formData.department) newErrors.department = "Department is required"
    if (!formData.year) newErrors.year = "Year is required"
    if (!formData.section) newErrors.section = "Section is required"
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required"
    if (!formData.address) newErrors.address = "Address is required"
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.emergencyContact) newErrors.emergencyContact = "Emergency contact is required"
    if (!formData.parentName) newErrors.parentName = "Parent name is required"
    if (!formData.parentPhone) newErrors.parentPhone = "Parent phone is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("Student added successfully!")

      // Reset form
      setFormData({
        email: "",
        rollNumber: "",
        firstName: "",
        lastName: "",
        department: "",
        year: "",
        section: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        gender: "",
        bloodGroup: "",
        emergencyContact: "",
        parentName: "",
        parentPhone: "",
      })
      setErrors({})
    } catch (error) {
      alert("Error adding student. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const sidebarWidth = "18rem" // Corresponds to w-72

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:wght@400;500;600;700;800;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .mono {
          font-family: 'JetBrains Mono', monospace;
        }
        .theme-transition {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* Custom ACADEX Logo Styling */
        .acadex-logo {
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
          font-weight: 800;
          letter-spacing: -0.01em;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.05em;
          margin-bottom: 0;
        }
        .acadex-logo span {
          position: relative;
          transition: all 0.2s ease;
          cursor: default;
          font-weight: 800;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .acadex-logo span:hover {
          transform: translateY(-1px);
        }
        .acadex-a1 { color: #6366F1; }
        .acadex-c { color: #EF4444; }
        .acadex-a2 { color: #F59E0B; }
        .acadex-d { color: #8B5CF6; }
        .acadex-e { color: #10B981; }
        .acadex-x { color: #F97316; }
        /* Dark Theme Background */
        .dark-bg {
          background: linear-gradient(135deg, #000000 0%, #000000 25%, #000000 50%, #000000 75%, #000000 100%);
        }
        /* Raw Black Theme Styles */
        .raw-black-bg {
          background: #000000 !important;
        }
        .raw-black-card {
          background: #000000 !important;
          border-color: #1a1a1a !important;
        }
      `}</style>

      <div className={`flex min-h-screen ${isDarkMode ? "bg-black" : "bg-gray-50"}`}>
        <motion.div
          initial={false}
          animate={{
            width: isMobileOpen ? sidebarWidth : isCollapsed ? "0rem" : sidebarWidth,
            x: isMobileOpen ? "0%" : isCollapsed ? "-100%" : "0%",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`
            fixed top-0 left-0 h-full z-50
            ${isDarkMode ? "bg-black border-gray-900" : "bg-white border-gray-200"}
            border-r shadow-lg
            flex flex-col
          `}
        >
          {/* Sidebar Header */}
          <div
            className={`
              flex items-center ${isDarkMode ? "border-gray-900 bg-black" : "border-gray-100"} border-b p-4
              ${isCollapsed ? "justify-center" : "justify-between"}
            `}
          >
            {!isCollapsed ? (
              <div className="flex items-center gap-3">
                <AnimatedASymbol />
                <div>
                  <SidebarAcadexLogo />
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Pro Plan</p>
                </div>
              </div>
            ) : (
              <AnimatedASymbol />
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                isDarkMode ? "hover:bg-gray-900 text-gray-400" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className={`p-3 space-y-1 ${isDarkMode ? "bg-black" : ""}`}>
              {sidebarItems.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  isActive={activeItem === item.name}
                  onClick={handleItemClick}
                  isCollapsed={isCollapsed}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
            {/* Separator */}
            <div className={`mx-4 my-4 border-t ${isDarkMode ? "border-gray-900" : "border-gray-200"}`}></div>
          </div>

          {/* Signout Button */}
          <div className={`${isDarkMode ? "border-gray-900" : "border-gray-100"} border-t p-4`}>
            <button
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
                  : "text-red-600 hover:bg-red-50 hover:text-red-700"
              } ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>}
            </button>
          </div>
        </motion.div>

        {/* Mobile Menu Overlay */}
        {isMobileOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsMobileOpen(false)} />
        )}

        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "lg:ml-0" : "lg:ml-72"}`}>
          {/* Mobile Menu Button - moved to floating position */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className={`lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg ${isDarkMode ? "bg-black hover:bg-gray-900 text-white" : "bg-white hover:bg-gray-100 text-gray-900"} shadow-lg`}
          >
            <span className="text-xl">☰</span>
          </button>

          {/* Theme Toggle - moved to floating position */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`fixed top-4 right-4 z-40 p-2 rounded-lg ${isDarkMode ? "bg-black hover:bg-gray-900" : "bg-white hover:bg-gray-100"} shadow-lg`}
          >
            <span className="text-xl">{isDarkMode ? "☀️" : "🌙"}</span>
          </button>

          {/* Main Content */}
          <div
            className={`min-h-screen p-8 transition-all duration-300 ${
              isDarkMode ? "bg-black text-white" : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Add New Student
              </h1>
              <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Fill in the student information below
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`max-w-4xl mx-auto rounded-2xl shadow-lg p-8 ${
                isDarkMode ? "bg-black border border-gray-900" : "bg-white border border-gray-200"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      } ${errors.email ? "border-red-500" : ""}`}
                      placeholder="Enter email address"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      } ${errors.rollNumber ? "border-red-500" : ""}`}
                      placeholder="Enter roll number"
                    />
                    {errors.rollNumber && <p className="text-red-500 text-sm mt-1">{errors.rollNumber}</p>}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      } ${errors.firstName ? "border-red-500" : ""}`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      } ${errors.lastName ? "border-red-500" : ""}`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      } ${errors.department ? "border-red-500" : ""}`}
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Electrical">Electrical</option>
                    </select>
                    {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Year *
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      } ${errors.year ? "border-red-500" : ""}`}
                    >
                      <option value="">Select Year</option>
                      <option value="1">First Year</option>
                      <option value="2">Second Year</option>
                      <option value="3">Third Year</option>
                      <option value="4">Fourth Year</option>
                    </select>
                    {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Section *
                    </label>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      } ${errors.section ? "border-red-500" : ""}`}
                      placeholder="Enter section (e.g., A, B, C)"
                    />
                    {errors.section && <p className="text-red-500 text-sm mt-1">{errors.section}</p>}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      } ${errors.phoneNumber ? "border-red-500" : ""}`}
                      placeholder="Enter phone number"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      } ${errors.dateOfBirth ? "border-red-500" : ""}`}
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      } ${errors.gender ? "border-red-500" : ""}`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {/* Address Section */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                      isDarkMode
                        ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } ${errors.address ? "border-red-500" : ""}`}
                    placeholder="Enter full address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                {/* Emergency Contact Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Emergency Contact *
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      } ${errors.emergencyContact ? "border-red-500" : ""}`}
                      placeholder="Enter emergency contact number"
                    />
                    {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Parent/Guardian Name *
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      } ${errors.parentName ? "border-red-500" : ""}`}
                      placeholder="Enter parent/guardian name"
                    />
                    {errors.parentName && <p className="text-red-500 text-sm mt-1">{errors.parentName}</p>}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Parent/Guardian Phone *
                    </label>
                    <input
                      type="tel"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-black border-gray-900 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      } ${errors.parentPhone ? "border-red-500" : ""}`}
                      placeholder="Enter parent/guardian phone"
                    />
                    {errors.parentPhone && <p className="text-red-500 text-sm mt-1">{errors.parentPhone}</p>}
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800 hover:shadow-lg transform hover:scale-105"
                    }`}
                  >
                    {isSubmitting ? "Adding Student..." : "Add Student"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddStudentPage


