import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { checkAuth } from "@/api/auth"

const AdminLayout = ({ children }) => {
  const [userLoading, setUserLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const data = await checkAuth()
        if (!data.user) {
          navigate("/login")
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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main Content - Full Width */}
      <div className="flex-1 overflow-x-hidden">
        {/* Content */}
        <main className="h-full">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
