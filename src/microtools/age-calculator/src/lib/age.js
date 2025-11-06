const DAY_MS = 24 * 60 * 60 * 1000
const HOUR_MS = 60 * 60 * 1000
const MIN_MS = 60 * 1000
const SEC_MS = 1000

export function formatDate(d) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDateTime(d) {
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  })
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

function isLeap(y) {
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)
}

function parseBirth(dobStr, tobStr) {
  if (!dobStr) throw new Error('Please select a valid date.')
  const [y, m, d] = dobStr.split('-').map(Number)
  if (!y || !m || !d) throw new Error('Invalid date format.')
  let hh = 0, mm = 0
  if (tobStr && tobStr.includes(':')) {
    const parts = tobStr.split(':').map(Number)
    hh = parts[0] || 0
    mm = parts[1] || 0
  }
  const birth = new Date(y, m - 1, d, hh, mm, 0, 0)
  if (!Number.isFinite(birth.getTime())) throw new Error('Invalid date/time.')
  return birth
}

function clampFeb29(date, targetYear) {
  const wasFeb29 = (date.getMonth() === 1 && date.getDate() === 29)
  if (wasFeb29 && !isLeap(targetYear)) {
    return new Date(targetYear, 1, 28, date.getHours(), date.getMinutes(), date.getSeconds(), 0)
  }
  return new Date(targetYear, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0)
}

export function nextBirthdayInfo(birth, now = new Date()) {
  let next = clampFeb29(birth, now.getFullYear())
  if (next <= now) next = clampFeb29(birth, now.getFullYear() + 1)
  const diff = next - now
  const days = Math.floor(diff / DAY_MS)
  const hours = Math.floor((diff % DAY_MS) / HOUR_MS)
  const minutes = Math.floor((diff % HOUR_MS) / MIN_MS)
  const seconds = Math.floor((diff % MIN_MS) / SEC_MS)
  return {
    date: formatDate(next),
    countdown: `${days}d ${hours}h ${minutes}m ${seconds}s`,
  }
}

export function computeAge(dobStr, tobStr) {
  const birth = parseBirth(dobStr, tobStr)
  const now = new Date()
  if (birth > now) throw new Error('Birth date cannot be in the future.')

  let y = now.getFullYear() - birth.getFullYear()
  let m = now.getMonth() - birth.getMonth()
  let d = now.getDate() - birth.getDate()

  if (d < 0) {
    const prevMonthIdx = (now.getMonth() - 1 + 12) % 12
    const prevMonthYear = prevMonthIdx === 11 ? now.getFullYear() - 1 : now.getFullYear()
    d += daysInMonth(prevMonthYear, prevMonthIdx)
    m -= 1
  }

  if (m < 0) {
    m += 12
    y -= 1
  }

  const diffMs = now - birth
  const totalSeconds = Math.floor(diffMs / SEC_MS)
  const totalMinutes = Math.floor(diffMs / MIN_MS)
  const totalHours = Math.floor(diffMs / HOUR_MS)
  const totalDays = Math.floor(diffMs / DAY_MS)
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths = y * 12 + m

  const remHours = Math.floor((diffMs % DAY_MS) / HOUR_MS)
  const remMinutes = Math.floor((diffMs % HOUR_MS) / MIN_MS)
  const remSeconds = Math.floor((diffMs % MIN_MS) / SEC_MS)

  const weekday = birth.toLocaleDateString('en-IN', { weekday: 'long' })
  const formattedDob = tobStr && tobStr.length
    ? formatDateTime(birth)
    : formatDate(birth)

  const nextB = nextBirthdayInfo(birth, now)

  const summary = `DOB: ${formattedDob} | Age: ${y}y ${m}m ${d}d, ${remHours}h ${remMinutes}m ${remSeconds}s | Next birthday in ${nextB.countdown}`

  return {
    years: y, months: m, days: d,
    hours: remHours, minutes: remMinutes, seconds: remSeconds,
    totals: {
      months: totalMonths,
      weeks: totalWeeks,
      days: totalDays,
      hours: totalHours,
      minutes: totalMinutes,
      seconds: totalSeconds,
    },
    weekday,
    formattedDob,
    nextBirthday: nextB,
    summary,
  }
}
