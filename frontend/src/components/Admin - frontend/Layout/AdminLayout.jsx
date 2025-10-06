import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { checkAuth } from "@/api/auth"
import AdminNavbar from "./AdminNavbar"

const AdminLayout = ({ children }) => {
  const [userLoading, setUserLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Get saved theme from localStorage or default to false (light mode)
    const savedTheme = localStorage.getItem('darkMode')
    return savedTheme !== null ? JSON.parse(savedTheme) : false
  })

  const navigate = useNavigate()

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    // Save to localStorage
    localStorage.setItem('darkMode', JSON.stringify(newTheme))
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const data = await checkAuth()
        if (!data.user) {
          navigate("/login")
        } else {
          setUser(data.user)
        }
      } catch {
        navigate("/login")
      } finally {
        setUserLoading(false)
      }
    }

    checkAuthentication()
  }, [navigate])

  if (userLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Navbar */}
      <AdminNavbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        user={user} 
      />
      
      {/* Main Content */}
      <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout