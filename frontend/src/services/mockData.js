const STORAGE_KEY = 'codestorm-demo-store'
const LEGACY_STORAGE_KEY = 'eventelite-demo-store'

const seedStore = {
  events: [
    {
      id: 1,
      title: 'Annual Tech Symposium',
      description: 'A day of talks, workshops, and project showcases for the campus technology community.',
      venue: 'Main Auditorium',
      startDate: '2026-11-15T10:00:00',
      endDate: '2026-11-15T17:00:00',
      capacity: 200,
      registeredCount: 2,
      status: 'UPCOMING',
      registrationOpen: true,
      organizer: 'CodeStorm',
    },
    {
      id: 2,
      title: 'Inter-College Cultural Fest',
      description: 'Celebrate music, art, dance, and theatre with students from across the region.',
      venue: 'College Amphitheatre',
      startDate: '2026-12-05T09:00:00',
      endDate: '2026-12-06T18:00:00',
      capacity: 500,
      registeredCount: 0,
      status: 'UPCOMING',
      registrationOpen: true,
      organizer: 'Student Council',
    },
    {
      id: 3,
      title: 'Innovation & Startup Workshop',
      description: 'Learn how to turn a campus idea into a practical product with guidance from founders.',
      venue: 'Innovation Lab',
      startDate: '2026-10-05T11:00:00',
      endDate: '2026-10-05T16:00:00',
      capacity: 80,
      registeredCount: 3,
      status: 'COMPLETED',
      registrationOpen: false,
      organizer: 'Innovation Cell',
    },
  ],
  students: [
    { id: 1, name: 'Aarav Sharma', email: 'student@college.edu', branch: 'Computer Science Engineering (CSE)', year: '3rd Year', role: 'STUDENT' },
    { id: 2, name: 'Meera Patel', email: 'meera@college.edu', branch: 'Electronics & Communication (ECE)', year: '2nd Year', role: 'STUDENT' },
    { id: 3, name: 'Rohan Singh', email: 'rohan@college.edu', branch: 'Information Technology (IT)', year: '4th Year', role: 'STUDENT' },
  ],
  registrations: [
    { id: 1, eventId: 1, studentId: 1, registeredAt: '2026-10-10T10:00:00', attended: false },
    { id: 2, eventId: 1, studentId: 2, registeredAt: '2026-10-11T10:00:00', attended: false },
  ],
  certificates: [],
  profile: { name: 'CodeStorm Admin', email: 'admin@college.edu', phone: '+91 98765 43210' },
  institutions: [
    { id: 1, name: 'CodeStorm College', emailDomain: 'college.edu', contactEmail: 'admin@college.edu', isActive: true },
  ],
}

const clone = (value) => JSON.parse(JSON.stringify(value))

export const getStore = () => {
  const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStore))
    return clone(seedStore)
  }

  try {
    const store = { ...clone(seedStore), ...JSON.parse(stored) }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    return store
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStore))
    return clone(seedStore)
  }
}

export const saveStore = (store) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  return store
}

export const updateStore = (update) => {
  const store = getStore()
  const nextStore = update(store)
  saveStore(nextStore)
  return nextStore
}

export const getStudent = (store, studentId) => (
  store.students.find((student) => student.id === Number(studentId))
)

export const getEventParticipants = (store, eventId) => store.registrations
  .filter((registration) => registration.eventId === Number(eventId))
  .map((registration) => ({
    ...registration,
    student: getStudent(store, registration.studentId),
  }))

export const getEventCertificates = (store, eventId) => store.certificates
  .filter((certificate) => certificate.eventId === Number(eventId))
  .map((certificate) => ({
    ...certificate,
    student: getStudent(store, certificate.studentId),
  }))

export const resetStore = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStore))
}
