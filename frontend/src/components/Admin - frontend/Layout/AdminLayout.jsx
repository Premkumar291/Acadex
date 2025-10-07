import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { checkAuth } from "@/api/auth"
import AdminNavbar from "./AdminNavbar"

const AdminLayout = ({ children }) => {
  const [userLoading, setUserLoading] = useState(true)
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

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
    // Always use dark mode classes
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <AdminNavbar 
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