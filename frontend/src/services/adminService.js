import { getEventCertificates, getEventParticipants, getStore, updateStore } from './mockData'

const getEvent = (store, eventId) => store.events.find((event) => event.id === Number(eventId))

const getStats = (store) => ({
  institution: {
    totalEvents: store.events.length,
    totalStudents: store.students.length,
    totalRegistrations: store.registrations.length,
    upcomingEvents: store.events.filter((event) => event.status === 'UPCOMING').length,
  },
})

const adminService = {
  getDashboardStats: async () => getStats(getStore()),
  getEvents: async () => ({ events: getStore().events }),
  getEventById: async (eventId) => ({ event: getEvent(getStore(), eventId) }),
  createEvent: async (eventData) => {
    const event = { ...eventData, id: Date.now(), registeredCount: 0, status: 'UPCOMING', registrationOpen: true }
    updateStore((store) => ({ ...store, events: [...store.events, event] }))
    return { event }
  },
  updateEvent: async (eventId, eventData) => {
    let updated
    updateStore((store) => {
      updated = { ...getEvent(store, eventId), ...eventData, id: Number(eventId) }
      return { ...store, events: store.events.map((event) => event.id === Number(eventId) ? updated : event) }
    })
    return { event: updated }
  },
  deleteEvent: async (eventId) => {
    updateStore((store) => ({ ...store, events: store.events.filter((event) => event.id !== Number(eventId)) }))
    return { message: 'Event deleted' }
  },
  closeEventRegistration: async (eventId) => adminService.updateEvent(eventId, { registrationOpen: false, status: 'CLOSED' }),
  reopenEventRegistration: async (eventId) => adminService.updateEvent(eventId, { registrationOpen: true, status: 'UPCOMING' }),
  getEventParticipants: async (eventId) => ({ participants: getEventParticipants(getStore(), eventId) }),
  getStudents: async () => ({ students: getStore().students }),
  addStudent: async (studentData) => {
    const student = { ...studentData, id: Date.now(), role: 'STUDENT' }
    updateStore((store) => ({ ...store, students: [...store.students, student] }))
    return { student }
  },
  updateStudent: async (studentId, studentData) => {
    updateStore((store) => ({ ...store, students: store.students.map((student) => student.id === Number(studentId) ? { ...student, ...studentData } : student) }))
    return { message: 'Student updated' }
  },
  deleteStudent: async (studentId) => {
    updateStore((store) => ({ ...store, students: store.students.filter((student) => student.id !== Number(studentId)) }))
    return { message: 'Student deleted' }
  },
  getStudentsByBranch: async (branch) => ({ students: getStore().students.filter((student) => student.branch === branch) }),
  getStudentsByYear: async (year) => ({ students: getStore().students.filter((student) => student.year === year) }),
  cancelRegistration: async (registrationId) => {
    updateStore((store) => ({ ...store, registrations: store.registrations.filter((registration) => registration.id !== Number(registrationId)) }))
    return { message: 'Registration cancelled' }
  },
  uploadStudents: async (file) => ({ message: `${file.name} uploaded`, imported: 0, failed: 0 }),
  updateProfile: async (profileData) => {
    const nextProfile = updateStore((store) => {
      const profile = { ...store.profile, ...profileData }
      return {
        ...store,
        profile,
      }
    }).profile
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      localStorage.setItem('user', JSON.stringify({ ...JSON.parse(storedUser), ...profileData }))
    }
    return nextProfile
  },
  getProfile: async () => getStore().profile,
  getBranchWiseReport: async (eventId) => {
    const participants = getEventParticipants(getStore(), eventId)
    const branchWise = participants.reduce((result, participant) => {
      const branch = participant.student?.branch || 'Other'
      result[branch] = (result[branch] || 0) + 1
      return result
    }, {})
    return { branchWise, totalRegistered: participants.length }
  },
  getYearWiseReport: async (eventId) => {
    const participants = getEventParticipants(getStore(), eventId)
    const yearWise = participants.reduce((result, participant) => {
      const year = participant.student?.year || 'Other'
      result[year] = (result[year] || 0) + 1
      return result
    }, {})
    return { yearWise, totalRegistered: participants.length }
  },
  getEventSummary: async (eventId) => {
    const store = getStore()
    const event = getEvent(store, eventId)
    const totalRegistered = getEventParticipants(store, eventId).length
    return {
      event,
      registrationStats: {
        totalRegistered,
        availableSpots: Math.max((event?.capacity || 0) - totalRegistered, 0),
        utilization: event?.capacity ? `${((totalRegistered / event.capacity) * 100).toFixed(1)}%` : '0%',
      },
    }
  },
  getEventCertificates: async (eventId) => ({ certificates: getEventCertificates(getStore(), eventId) }),
  generateCertificate: async (eventId, studentId) => {
    const certificate = { id: Date.now(), eventId: Number(eventId), studentId: Number(studentId), certificateUniqueId: `CERT-${eventId}-${studentId}`, issuedAt: new Date().toISOString() }
    updateStore((store) => ({ ...store, certificates: [...store.certificates.filter((item) => !(item.eventId === certificate.eventId && item.studentId === certificate.studentId)), certificate] }))
    return { certificate }
  },
  generateAllCertificates: async (eventId) => {
    const store = getStore()
    getEventParticipants(store, eventId).forEach((participant) => {
      adminService.generateCertificate(eventId, participant.studentId)
    })
    return { message: 'Certificates generated' }
  },
  markAttendance: async (eventId, studentId, attended, percentage, grade) => {
    updateStore((store) => ({ ...store, registrations: store.registrations.map((registration) => registration.eventId === Number(eventId) && registration.studentId === Number(studentId) ? { ...registration, attended, percentage, grade } : registration) }))
    return { message: 'Attendance updated' }
  },
}

export default adminService
