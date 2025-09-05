"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  BookOpen,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
  UserPlus,
  LinkIcon,
} from "lucide-react"
import toast from "react-hot-toast"

const SidebarAcadexLogo = () => {
  return (
    <div
      style={{
        fontSize: "18px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: "800",
        letterSpacing: "-0.01em",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "0.05em",
        marginBottom: 0,
      }}
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        style={{
          color: "#6366F1",
          position: "relative",
          transition: "all 0.2s ease",
          cursor: "default",
          fontWeight: "800",
        }}
      >
        A
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        whileHover={{ scale: 1.1, rotate: -5 }}
        style={{
          color: "#EF4444",
          position: "relative",
          transition: "all 0.2s ease",
          cursor: "default",
          fontWeight: "800",
        }}
      >
        C
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        style={{
          color: "#F59E0B",
          position: "relative",
          transition: "all 0.2s ease",
          cursor: "default",
          fontWeight: "800",
        }}
      >
        A
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        whileHover={{ scale: 1.1, rotate: -5 }}
        style={{
          color: "#8B5CF6",
          position: "relative",
          transition: "all 0.2s ease",
          cursor: "default",
          fontWeight: "800",
        }}
      >
        D
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        style={{
          color: "#10B981",
          position: "relative",
          transition: "all 0.2s ease",
          cursor: "default",
          fontWeight: "800",
        }}
      >
        E
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        whileHover={{ scale: 1.1, rotate: -5 }}
        style={{
          color: "#F97316",
          position: "relative",
          transition: "all 0.2s ease",
          cursor: "default",
          fontWeight: "800",
        }}
      >
        X
      </motion.span>
    </div>
  )
}

const AnimatedASymbol = () => {
  return (
    <motion.div
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
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
        style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        whileHover={{ scale: 1.2 }}
      >
        A
      </motion.span>
      <motion.div
        style={{ position: "absolute", inset: 0, opacity: 0.3 }}
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
        style={{
          width: "16px",
          height: "16px",
          transition: "color 0.2s",
          flexShrink: 0,
          color: isActive ? (isDarkMode ? "#ffffff" : "#374151") : isDarkMode ? "#9CA3AF" : "#9CA3AF",
        }}
      />
      {!isCollapsed && (
        <span
          style={{
            fontSize: "14px",
            fontWeight: "500",
            flex: 1,
            textAlign: "left",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.name}
        </span>
      )}
    </>
  )

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => onClick(item.name)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: isCollapsed ? "8px" : "10px 12px",
          borderRadius: "8px",
          transition: "all 0.2s",
          background: isActive ? (isDarkMode ? "#111827" : "#F3F4F6") : "transparent",
          color: isActive ? (isDarkMode ? "#ffffff" : "#111827") : isDarkMode ? "#D1D5DB" : "#374151",
          border: isActive ? (isDarkMode ? "1px solid #1F2937" : "1px solid #E5E7EB") : "1px solid transparent",
          justifyContent: isCollapsed ? "center" : "flex-start",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.target.style.background = isDarkMode ? "#111827" : "#FEF2F2"
            e.target.style.color = isDarkMode ? "#FCA5A5" : "#DC2626"
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.target.style.background = "transparent"
            e.target.style.color = isDarkMode ? "#D1D5DB" : "#374151"
          }
        }}
      >
        {content}
      </button>
      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div
          style={{
            position: "absolute",
            left: "100%",
            marginLeft: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            background: isDarkMode ? "#111827" : "#111827",
            color: "#ffffff",
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "4px",
            opacity: 0,
            transition: "opacity 0.2s",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 50,
            border: isDarkMode ? "1px solid #1F2937" : "none",
          }}
          className="tooltip"
        >
          {item.name}
          {item.description && <div style={{ color: "#9CA3AF", fontSize: "10px" }}>{item.description}</div>}
        </div>
      )}
      <style jsx>{`
        .tooltip {
          opacity: 0;
        }
        button:hover + .tooltip {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}

const DEPARTMENT_OPTIONS = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Mathematics",
  "Physics",
  "Chemistry",
]

const SEMESTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"]
const SUBJECT_TYPE_OPTIONS = ["Theory", "Practical", "Project"]

const subjectAPI = {
  getSubjects: async (params) => ({ data: [] }),
  createSubject: async (data) => ({ success: true }),
  updateSubject: async (id, data) => ({ success: true }),
  deleteSubject: async (id) => ({ success: true }),
}

const SubjectManagement = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode")
    return savedTheme !== null ? JSON.parse(savedTheme) : false
  })
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    return savedState !== null ? JSON.parse(savedState) : true
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(() => {
    const savedItem = localStorage.getItem("activeItem")
    return savedItem || "Subject Management"
  })
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser")
    const authToken = localStorage.getItem("authToken")
    if (authToken && !savedUser) {
      const loginUser = localStorage.getItem("loginUserData")
      if (loginUser) {
        const userData = JSON.parse(loginUser)
        return { name: userData.name, email: userData.email }
      }
    }
    return savedUser ? JSON.parse(savedUser) : { name: "Admin User", email: "admin@acadex.com" }
  })
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const sidebarItems = [
    {
      name: "Faculty Creation",
      icon: Users,
      description: "Create new faculty accounts",
    },
    {
      name: "Add Student",
      icon: UserPlus,
      description: "Enroll new students",
    },
    {
      name: "Subject Management",
      icon: BookOpen,
      description: "Manage course subjects",
    },
    {
      name: "Faculty Management",
      icon: LinkIcon,
      description: "Manage faculty records",
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

  const handleLogoutClick = async () => {
    setIsLoggingOut(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      localStorage.removeItem("currentUser")
      localStorage.removeItem("authToken")
      localStorage.removeItem("loginUserData")
      localStorage.removeItem("activeItem")

      setUser({ name: "Guest", email: "guest@acadex.com" })

      window.location.href = "/"

      console.log("User logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const sidebarWidth = "288px" // 18rem equivalent

  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")

  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    department: "",
    semester: "",
    credits: "",
    subjectType: "",
  })

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const response = await subjectAPI.getSubjects({
        search: searchTerm,
        department: departmentFilter,
      })
      setSubjects(response.data || [])
    } catch (error) {
      toast.error("Failed to fetch subjects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [searchTerm, departmentFilter])

  const resetForm = () => {
    setFormData({
      subjectCode: "",
      subjectName: "",
      department: "",
      semester: "",
      credits: "",
      subjectType: "",
    })
    setEditingSubject(null)
  }

  const openEditModal = (subject) => {
    setFormData({
      subjectCode: subject.subjectCode || "",
      subjectName: subject.subjectName || "",
      department: subject.department || "",
      semester: subject.semester || "",
      credits: subject.credits?.toString() || "",
      subjectType: subject.subjectType || "",
    })
    setEditingSubject(subject)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const subjectData = {
        ...formData,
        credits: Number.parseInt(formData.credits),
      }

      if (editingSubject) {
        await subjectAPI.updateSubject(editingSubject._id, subjectData)
        toast.success("Subject updated successfully!")
      } else {
        await subjectAPI.createSubject(subjectData)
        toast.success("Subject created successfully!")
      }

      setShowModal(false)
      resetForm()
      fetchSubjects()
    } catch (error) {
      toast.error(`Failed to ${editingSubject ? "update" : "create"} subject`)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await subjectAPI.deleteSubject(id)
        toast.success("Subject deleted successfully!")
        fetchSubjects()
      } catch (error) {
        toast.error("Failed to delete subject")
      }
    }
  }

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.subjectCode?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !departmentFilter || subject.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: isDarkMode ? "#000000" : "#F9FAFB" }}>
      <motion.div
        initial={false}
        animate={{
          width: isMobileOpen ? sidebarWidth : isCollapsed ? "0px" : sidebarWidth,
          x: isMobileOpen ? "0%" : isCollapsed ? "-100%" : "0%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          zIndex: 50,
          background: isDarkMode ? "#000000" : "#ffffff",
          borderRight: isDarkMode ? "1px solid #111827" : "1px solid #E5E7EB",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: isDarkMode ? "1px solid #111827" : "1px solid #F3F4F6",
            background: isDarkMode ? "#000000" : "#ffffff",
            padding: "16px",
            justifyContent: isCollapsed ? "center" : "space-between",
          }}
        >
          {!isCollapsed ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <AnimatedASymbol />
              <div>
                <SidebarAcadexLogo />
                <p style={{ fontSize: "12px", color: isDarkMode ? "#9CA3AF" : "#6B7280", margin: 0 }}>Pro Plan</p>
              </div>
            </div>
          ) : (
            <AnimatedASymbol />
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              transition: "all 0.2s",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: isDarkMode ? "#9CA3AF" : "#6B7280",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isDarkMode ? "#111827" : "#F3F4F6"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent"
            }}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div
            style={{
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              background: isDarkMode ? "#000000" : "#ffffff",
            }}
          >
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
          <div style={{ margin: "16px", borderTop: isDarkMode ? "1px solid #111827" : "1px solid #E5E7EB" }}></div>
        </div>

        {/* Signout Button */}
        <div style={{ borderTop: isDarkMode ? "1px solid #111827" : "1px solid #F3F4F6", padding: "16px" }}>
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 12px",
              fontSize: "14px",
              fontWeight: "500",
              borderRadius: "8px",
              transition: "all 0.2s",
              color: isDarkMode ? "#F87171" : "#DC2626",
              background: "transparent",
              border: "none",
              cursor: isLoggingOut ? "not-allowed" : "pointer",
              opacity: isLoggingOut ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoggingOut) {
                e.target.style.background = isDarkMode ? "rgba(185, 28, 28, 0.2)" : "#FEF2F2"
                e.target.style.color = isDarkMode ? "#FCA5A5" : "#B91C1C"
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoggingOut) {
                e.target.style.background = "transparent"
                e.target.style.color = isDarkMode ? "#F87171" : "#DC2626"
              }
            }}
          >
            <LogOut size={16} />
            {!isCollapsed && <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.5)", zIndex: 30 }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div style={{ flex: 1, transition: "all 0.3s", marginLeft: isCollapsed ? "0px" : sidebarWidth }}>
        <button
          onClick={() => setIsMobileOpen(true)}
          style={{
            position: "fixed",
            top: "16px",
            left: "16px",
            zIndex: 40,
            padding: "8px",
            borderRadius: "8px",
            background: isDarkMode ? "#000000" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#111827",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            border: "none",
            cursor: "pointer",
            display: window.innerWidth < 1024 ? "block" : "none",
          }}
        >
          <span style={{ fontSize: "20px" }}>☰</span>
        </button>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            position: "fixed",
            top: "16px",
            right: "16px",
            zIndex: 40,
            padding: "8px",
            borderRadius: "8px",
            background: isDarkMode ? "#000000" : "#ffffff",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "20px", color: isDarkMode ? "#ffffff" : "#000000" }}>{isDarkMode ? "☀️" : "🌙"}</span>
        </button>

        <div
          style={{
            minHeight: "100vh",
            background: isDarkMode
              ? "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)"
              : "linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)",
            padding: "32px",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                borderRadius: "24px",
                padding: "40px",
                marginBottom: "32px",
                boxShadow: isDarkMode
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                border: isDarkMode ? "2px solid rgba(255, 255, 255, 0.1)" : "2px solid rgba(0, 0, 0, 0.05)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: isDarkMode
                    ? "radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%)"
                    : "radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.05) 0%, transparent 50%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    style={{
                      fontSize: "42px",
                      fontWeight: "800",
                      color: isDarkMode ? "#ffffff" : "#000000",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      margin: 0,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <div
                      style={{
                        background: isDarkMode
                          ? "linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)"
                          : "linear-gradient(135deg, #000000 0%, #333333 100%)",
                        borderRadius: "16px",
                        padding: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <BookOpen size={32} color={isDarkMode ? "#000000" : "#ffffff"} />
                    </div>
                    Subject Management
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{
                      color: isDarkMode ? "#d1d5db" : "#666666",
                      marginTop: "12px",
                      fontSize: "18px",
                      fontWeight: "500",
                      margin: "12px 0 0 0",
                    }}
                  >
                    Manage academic subjects and their details
                  </motion.p>
                </div>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    y: -4,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
                  }}
                  whileTap={{ scale: 0.95, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={() => setShowModal(true)}
                  style={{
                    background: isDarkMode ? "#ffffff" : "#000000",
                    color: isDarkMode ? "#000000" : "#ffffff",
                    padding: "18px 32px",
                    borderRadius: "16px",
                    border: isDarkMode ? "2px solid #e5e7eb" : "2px solid rgba(255, 255, 255, 0.1)",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
                      transition: "left 0.6s ease",
                    }}
                  />
                  <Plus size={20} />
                  <span style={{ fontWeight: "700", fontSize: "16px" }}>Add Subject</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                borderRadius: "20px",
                padding: "32px",
                marginBottom: "32px",
                boxShadow: isDarkMode ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)" : "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}
              >
                <div style={{ position: "relative" }}>
                  <Search
                    style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: isDarkMode ? "#9ca3af" : "#666666",
                    }}
                    size={20}
                  />
                  <motion.input
                    whileFocus={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    type="text"
                    placeholder="Search subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "16px 20px 16px 48px",
                      borderRadius: "14px",
                      border: isDarkMode ? "2px solid #374151" : "2px solid #e5e7eb",
                      backgroundColor: isDarkMode ? "#111827" : "#ffffff",
                      fontSize: "16px",
                      fontWeight: "500",
                      color: isDarkMode ? "#ffffff" : "#000000",
                      outline: "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: isDarkMode ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDarkMode ? "#ffffff" : "#000000"
                      e.target.style.boxShadow = isDarkMode
                        ? "0 0 0 4px rgba(255, 255, 255, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.3)"
                        : "0 0 0 4px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? "#374151" : "#e5e7eb"
                      e.target.style.boxShadow = isDarkMode
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
                        : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                </div>
                <div style={{ position: "relative" }}>
                  <Filter
                    style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: isDarkMode ? "#9ca3af" : "#666666",
                    }}
                    size={20}
                  />
                  <motion.select
                    whileTap={{ scale: 0.98 }}
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "16px 20px 16px 48px",
                      borderRadius: "14px",
                      border: isDarkMode ? "2px solid #374151" : "2px solid #e5e7eb",
                      backgroundColor: isDarkMode ? "#111827" : "#ffffff",
                      fontSize: "16px",
                      fontWeight: "500",
                      color: isDarkMode ? "#ffffff" : "#000000",
                      outline: "none",
                      cursor: "pointer",
                      appearance: "none",
                      backgroundImage: isDarkMode
                        ? `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`
                        : `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000000' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 16px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "16px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: isDarkMode ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDarkMode ? "#ffffff" : "#000000"
                      e.target.style.boxShadow = isDarkMode
                        ? "0 0 0 4px rgba(255, 255, 255, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.3)"
                        : "0 0 0 4px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? "#374151" : "#e5e7eb"
                      e.target.style.boxShadow = isDarkMode
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
                        : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <option value="">All Departments</option>
                    {DEPARTMENT_OPTIONS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </motion.select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchSubjects}
                  style={{
                    padding: "16px 24px",
                    background: isDarkMode
                      ? "linear-gradient(135deg, #374151 0%, #4b5563 100%)"
                      : "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    borderRadius: "14px",
                    border: isDarkMode ? "2px solid #6b7280" : "2px solid #e5e7eb",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isDarkMode ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Refresh
                </motion.button>
              </div>
            </motion.div>

            {/* Subject List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: isDarkMode ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)" : "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px" }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "4px solid #e5e7eb",
                      borderTop: "4px solid #000000",
                    }}
                  />
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "80px 40px",
                    color: "#666666",
                  }}
                >
                  <BookOpen size={64} style={{ margin: "0 auto 24px", opacity: 0.3 }} />
                  <h3 style={{ fontSize: "24px", fontWeight: "600", margin: "0 0 12px 0", color: "#000000" }}>
                    No Subjects Found
                  </h3>
                  <p style={{ fontSize: "16px", margin: 0 }}>Start by adding your first subject to the system.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)" }}>
                        <th
                          style={{
                            padding: "20px 24px",
                            textAlign: "left",
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#ffffff",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Subject Details
                        </th>
                        <th
                          style={{
                            padding: "20px 24px",
                            textAlign: "left",
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#ffffff",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Department
                        </th>
                        <th
                          style={{
                            padding: "20px 24px",
                            textAlign: "left",
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#ffffff",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Semester
                        </th>
                        <th
                          style={{
                            padding: "20px 24px",
                            textAlign: "left",
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#ffffff",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Credits & Type
                        </th>
                        <th
                          style={{
                            padding: "20px 24px",
                            textAlign: "left",
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#ffffff",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubjects.map((subject, index) => (
                        <motion.tr
                          key={subject._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{
                            borderBottom: "1px solid #e5e7eb",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)"
                            e.currentTarget.style.transform = "translateY(-2px)"
                            e.currentTarget.style.boxShadow = "0 4px 12px -2px rgba(0, 0, 0, 0.1)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent"
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "none"
                          }}
                        >
                          <td style={{ padding: "24px" }}>
                            <div>
                              <div
                                style={{ fontSize: "16px", fontWeight: "700", color: "#000000", marginBottom: "4px" }}
                              >
                                {subject.subjectName}
                              </div>
                              <div style={{ fontSize: "14px", color: "#666666", marginBottom: "4px" }}>
                                Code: {subject.subjectCode}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "24px" }}>
                            <span
                              style={{
                                padding: "8px 16px",
                                borderRadius: "20px",
                                fontSize: "14px",
                                fontWeight: "600",
                                background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
                                color: "#ffffff",
                              }}
                            >
                              {subject.department}
                            </span>
                          </td>
                          <td style={{ padding: "24px" }}>
                            <span
                              style={{
                                padding: "6px 12px",
                                background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                                color: "#000000",
                                fontSize: "14px",
                                fontWeight: "600",
                                borderRadius: "12px",
                                border: "1px solid #e5e7eb",
                              }}
                            >
                              Semester {subject.semester}
                            </span>
                          </td>
                          <td style={{ padding: "24px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span
                                style={{
                                  padding: "4px 8px",
                                  background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
                                  color: "#ffffff",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  borderRadius: "8px",
                                  width: "fit-content",
                                }}
                              >
                                {subject.credits} Credits
                              </span>
                              <span
                                style={{
                                  padding: "4px 8px",
                                  background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                                  color: "#000000",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  borderRadius: "8px",
                                  border: "1px solid #e5e7eb",
                                  width: "fit-content",
                                }}
                              >
                                {subject.subjectType}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <motion.button
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openEditModal(subject)}
                                style={{
                                  padding: "8px",
                                  background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
                                  color: "#ffffff",
                                  borderRadius: "8px",
                                  border: "none",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <Edit3 size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(subject._id)}
                                style={{
                                  padding: "8px",
                                  background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                                  color: "#ffffff",
                                  borderRadius: "8px",
                                  border: "none",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>

          {/* Modal */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0, 0, 0, 0.8)",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 50,
                  padding: "24px",
                }}
                onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: -15 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15, rotateX: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.5 }}
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    borderRadius: "24px",
                    width: "100%",
                    maxWidth: "600px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                    border: "2px solid rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ padding: "40px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "32px",
                      }}
                    >
                      <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#000000", margin: 0 }}>
                        {editingSubject ? "Edit Subject" : "Add New Subject"}
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setShowModal(false)
                          resetForm()
                        }}
                        style={{
                          padding: "12px",
                          background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
                          color: "#ffffff",
                          borderRadius: "12px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <X size={20} />
                      </motion.button>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                          gap: "24px",
                          marginBottom: "40px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "#000000",
                              marginBottom: "8px",
                            }}
                          >
                            Subject Code *
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            type="text"
                            required
                            value={formData.subjectCode}
                            onChange={(e) => setFormData((prev) => ({ ...prev, subjectCode: e.target.value }))}
                            placeholder="e.g., CS101"
                            style={{
                              width: "100%",
                              padding: "16px",
                              borderRadius: "12px",
                              border: "2px solid #e5e7eb",
                              backgroundColor: "#ffffff",
                              fontSize: "16px",
                              fontWeight: "500",
                              color: "#000000",
                              outline: "none",
                              transition: "all 0.3s ease",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#000000"
                              e.target.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.1)"
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "#e5e7eb"
                              e.target.style.boxShadow = "none"
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "#000000",
                              marginBottom: "8px",
                            }}
                          >
                            Subject Name *
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            type="text"
                            required
                            value={formData.subjectName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, subjectName: e.target.value }))}
                            placeholder="Subject Name"
                            style={{
                              width: "100%",
                              padding: "16px",
                              borderRadius: "12px",
                              border: "2px solid #e5e7eb",
                              backgroundColor: "#ffffff",
                              fontSize: "16px",
                              fontWeight: "500",
                              color: "#000000",
                              outline: "none",
                              transition: "all 0.3s ease",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#000000"
                              e.target.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.1)"
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "#e5e7eb"
                              e.target.style.boxShadow = "none"
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "#000000",
                              marginBottom: "8px",
                            }}
                          >
                            Department *
                          </label>
                          <select
                            required
                            value={formData.department}
                            onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                            style={{
                              width: "100%",
                              padding: "16px",
                              borderRadius: "12px",
                              border: "2px solid #e5e7eb",
                              backgroundColor: "#ffffff",
                              fontSize: "16px",
                              fontWeight: "500",
                              color: "#000000",
                              outline: "none",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#000000"
                              e.target.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.1)"
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "#e5e7eb"
                              e.target.style.boxShadow = "none"
                            }}
                          >
                            <option value="">Select Department</option>
                            {DEPARTMENT_OPTIONS.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "#000000",
                              marginBottom: "8px",
                            }}
                          >
                            Semester *
                          </label>
                          <select
                            required
                            value={formData.semester}
                            onChange={(e) => setFormData((prev) => ({ ...prev, semester: e.target.value }))}
                            style={{
                              width: "100%",
                              padding: "16px",
                              borderRadius: "12px",
                              border: "2px solid #e5e7eb",
                              backgroundColor: "#ffffff",
                              fontSize: "16px",
                              fontWeight: "500",
                              color: "#000000",
                              outline: "none",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#000000"
                              e.target.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.1)"
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "#e5e7eb"
                              e.target.style.boxShadow = "none"
                            }}
                          >
                            <option value="">Select Semester</option>
                            {SEMESTER_OPTIONS.map((sem) => (
                              <option key={sem} value={sem}>
                                Semester {sem}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "#000000",
                              marginBottom: "8px",
                            }}
                          >
                            Credits *
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            type="number"
                            required
                            min="1"
                            max="10"
                            value={formData.credits}
                            onChange={(e) => setFormData((prev) => ({ ...prev, credits: e.target.value }))}
                            placeholder="Credits"
                            style={{
                              width: "100%",
                              padding: "16px",
                              borderRadius: "12px",
                              border: "2px solid #e5e7eb",
                              backgroundColor: "#ffffff",
                              fontSize: "16px",
                              fontWeight: "500",
                              color: "#000000",
                              outline: "none",
                              transition: "all 0.3s ease",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#000000"
                              e.target.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.1)"
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "#e5e7eb"
                              e.target.style.boxShadow = "none"
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "#000000",
                              marginBottom: "8px",
                            }}
                          >
                            Subject Type *
                          </label>
                          <select
                            required
                            value={formData.subjectType}
                            onChange={(e) => setFormData((prev) => ({ ...prev, subjectType: e.target.value }))}
                            style={{
                              width: "100%",
                              padding: "16px",
                              borderRadius: "12px",
                              border: "2px solid #e5e7eb",
                              backgroundColor: "#ffffff",
                              fontSize: "16px",
                              fontWeight: "500",
                              color: "#000000",
                              outline: "none",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#000000"
                              e.target.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.1)"
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "#e5e7eb"
                              e.target.style.boxShadow = "none"
                            }}
                          >
                            <option value="">Select Type</option>
                            {SUBJECT_TYPE_OPTIONS.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "16px",
                          paddingTop: "24px",
                          borderTop: "1px solid #e5e7eb",
                        }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => {
                            setShowModal(false)
                            resetForm()
                          }}
                          style={{
                            padding: "16px 32px",
                            background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                            color: "#000000",
                            borderRadius: "12px",
                            border: "2px solid #e5e7eb",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          style={{
                            padding: "16px 32px",
                            background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                            color: "#ffffff",
                            borderRadius: "12px",
                            border: "none",
                            fontSize: "16px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          {editingSubject ? "Update Subject" : "Create Subject"}
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default SubjectManagement




