import { createContext, useState, useContext } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser())
  const loading = false

  const login = async (email, password, roleType) => {
    try {
      if (roleType === 'student') {
        await authService.studentLogin(email, password)
      } else {
        await authService.adminLogin(email, password)
      }
      
      const userData = authService.getCurrentUser()
      console.log('User data after login:', userData)
      setUser(userData)
      return { success: true, role: userData?.role }
    } catch (error) {
      console.log('Login error:', error)
      return { success: false, error: error.response?.data || error.message || 'Login failed' }
    }
  }

  const superAdminLogin = async (secretKey) => {
    try {
      await authService.superAdminLogin(secretKey)
      const userData = authService.getCurrentUser()
      setUser(userData)
      return { success: true, role: 'SUPER_ADMIN' }
    } catch (error) {
      return { success: false, error: error.response?.data || 'Super Admin login failed' }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const registerInstitution = async (data) => {
    try {
      const response = await authService.registerInstitution(data)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.response?.data || 'Registration failed' }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, superAdminLogin, logout, registerInstitution }}>
      {children}
    </AuthContext.Provider>
  )
}