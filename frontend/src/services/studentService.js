import { getStore, getStudent, updateStore } from './mockData'
import authService from './authService'

const currentStudentId = () => {
  const user = authService.getCurrentUser()
  if (user?.role !== 'STUDENT') {
    throw new Error('Please log in as a student to register for events')
  }
  return getStudent(getStore(), user.id)?.id || 1
}

const studentService = {
  getUpcomingEvents: async () => {
    const store = getStore()
    const studentId = currentStudentId()
    return {
      events: store.events
        .filter((event) => event.status === 'UPCOMING')
        .map((event) => ({
          ...event,
          isRegistered: store.registrations.some((registration) => (
            registration.eventId === event.id && registration.studentId === studentId
          )),
        })),
    }
  },
  getEventDetails: async (eventId) => {
    const store = getStore()
    const event = store.events.find((item) => item.id === Number(eventId))
    const isRegistered = event
      ? store.registrations.some((registration) => (
        registration.eventId === event.id && registration.studentId === currentStudentId()
      ))
      : false
    return { event, isRegistered }
  },
  registerForEvent: async (eventId) => {
    const id = Number(eventId)
    const store = getStore()
    const studentId = currentStudentId()
    const event = store.events.find((item) => item.id === id)
    if (!event) throw new Error('Event not found')
    if (event.status === 'CLOSED') throw new Error('Registration is closed for this event')
    if (event.registeredCount >= event.capacity) throw new Error('This event is full')
    const alreadyRegistered = store.registrations.some((registration) => registration.eventId === id && registration.studentId === studentId)
    if (!alreadyRegistered) {
      updateStore((next) => ({
        ...next,
        registrations: [...next.registrations, { id: Date.now(), eventId: id, studentId, registeredAt: new Date().toISOString(), attended: false }],
        events: next.events.map((event) => event.id === id ? { ...event, registeredCount: event.registeredCount + 1 } : event),
      }))
    }
    return { message: 'Registration successful' }
  },
  getMyEvents: async () => {
    const store = getStore()
    const registrations = store.registrations
      .filter((registration) => registration.studentId === currentStudentId())
      .map((registration) => ({
        ...registration,
        event: store.events.find((event) => event.id === registration.eventId),
      }))
    return { registrations }
  },
  getMyCertificates: async () => {
    const store = getStore()
    const certificates = store.certificates.filter((certificate) => certificate.studentId === currentStudentId())
    return { certificates, totalCertificates: certificates.length }
  },
  updateProfile: async (profileData) => {
    const studentId = currentStudentId()
    const nextStudent = updateStore((store) => ({
      ...store,
      students: store.students.map((student) => (
        student.id === studentId ? { ...student, ...profileData } : student
      )),
    })).students.find((student) => student.id === studentId)
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      localStorage.setItem('user', JSON.stringify({ ...JSON.parse(storedUser), ...profileData }))
    }
    return nextStudent
  },
  downloadCertificate: async (certificateId) => ({
    data: new Blob([`CodeStorm demo certificate ${certificateId}`], { type: 'application/pdf' }),
  }),
}

export default studentService
