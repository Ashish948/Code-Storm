import { getStore, updateStore } from './mockData'

const getInstitutionStats = (store) => ({
  totalInstitutions: store.institutions.length,
  activeInstitutions: store.institutions.filter((institution) => institution.isActive).length,
  totalUsers: {
    students: store.students.length,
    institutionAdmins: 1,
    superAdmins: 1,
    total: store.students.length + 2,
  },
  totalEvents: store.events.length,
  upcomingEvents: store.events.filter((event) => event.status === 'UPCOMING').length,
})

const api = {
  get: async (path) => {
    const store = getStore()
    if (path === '/super-admin/dashboard') return { data: getInstitutionStats(store) }
    if (path === '/super-admin/institutions') return { data: { institutions: store.institutions } }
    throw new Error(`Unsupported local request: GET ${path}`)
  },
  put: async (path) => {
    const match = path.match(/^\/super-admin\/institutions\/(\d+)\/(enable|disable)$/)
    if (!match) throw new Error(`Unsupported local request: PUT ${path}`)
    const institutionId = Number(match[1])
    const isActive = match[2] === 'enable'
    updateStore((store) => ({
      ...store,
      institutions: store.institutions.map((institution) => (
        institution.id === institutionId ? { ...institution, isActive } : institution
      )),
    }))
    return { data: { success: true } }
  },
}

export default api
