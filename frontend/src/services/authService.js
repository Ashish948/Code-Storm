const createUser = (email, role, name) => ({
  id: role === 'STUDENT' ? 1 : role === 'INSTITUTION_ADMIN' ? 100 : 999,
  name: name || (role === 'SUPER_ADMIN' ? 'Super Admin' : email.split('@')[0]),
  email,
  role,
  institutionId: role === 'SUPER_ADMIN' ? null : 1,
  institutionName: role === 'SUPER_ADMIN' ? null : 'CodeStorm College',
})

const saveUser = (user) => {
  localStorage.setItem('token', `demo-${user.role.toLowerCase()}`)
  localStorage.setItem('user', JSON.stringify(user))
  return { token: localStorage.getItem('token'), userId: user.id, role: user.role, ...user }
}

const authService = {
  studentLogin: async (email, password) => {
    if (!email.trim() || !password.trim()) throw new Error('Email and password are required')
    return saveUser(createUser(email, 'STUDENT'))
  },
  adminLogin: async (email, password) => {
    if (!email.trim() || !password.trim()) throw new Error('Email and password are required')
    return saveUser(createUser(email, 'INSTITUTION_ADMIN'))
  },
  superAdminLogin: async (secretKey) => {
    if (!secretKey.trim()) throw new Error('Secret key is required')
    return saveUser(createUser('superadmin@codestorm.com', 'SUPER_ADMIN', 'Super Admin'))
  },
  registerInstitution: async (data) => {
    localStorage.setItem('codestorm-pending-institution', JSON.stringify(data))
    return { message: 'Institution registered successfully. You can now use the demo admin login.' }
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
  isLoggedIn: () => localStorage.getItem('token') !== null,
}

export default authService
