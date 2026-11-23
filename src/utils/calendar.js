// Downloads a calendar event (.ics) without leaving the invitation page.

function escapeText(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}

// iCalendar lines must be folded at 75 octets.
function fold(line) {
  const encoder = new TextEncoder()
  let result = ''
  let size = 0
  for (const character of line) {
    const bytes = encoder.encode(character).length
    if (size + bytes > 75) {
      result += '\r\n '
      size = 1
    }
    result += character
    size += bytes
  }
  return result
}

/* '2027-02-03T16:00:00' + '+05:30' → '20270203T103000Z' (UTC, so every phone shows the right local time) */
function utcStamp(local, offset) {
  const d = new Date(String(local || '') + (offset || ''))
  if (isNaN(d)) return ''
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

export function downloadInviteCalendar(event) {
  const start = utcStamp(event.start, event.utcOffset)
  const end = utcStamp(event.end, event.utcOffset)
  if (!start || !end) return
  const inviteUrl = window.location.href.split(/[?#]/)[0]
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Invitation//Ruby Hour//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:' + escapeText(inviteUrl),
    'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z'),
    'DTSTART:' + start,
    'DTEND:' + end,
    'SUMMARY:' + escapeText(event.title),
    'LOCATION:' + escapeText(event.map || event.place),
    'DESCRIPTION:' + escapeText(inviteUrl),
    'URL:' + inviteUrl,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  const blob = new Blob([lines.map(fold).join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'invitation.ics'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

/** "Add to my calendar": Apple devices get an .ics file, everyone else Google Calendar */
export function addToCalendar(event) {
  const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)
  if (isApple) {
    downloadInviteCalendar(event)
    return
  }
  const gUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
    encodeURIComponent(event.title) +
    '&dates=' + utcStamp(event.start, event.utcOffset) + '/' + utcStamp(event.end, event.utcOffset) +
    '&location=' + encodeURIComponent(event.map || event.place) +
    '&details=' + encodeURIComponent('Our wedding invitation: ' + window.location.href.split(/[?#]/)[0])
  window.open(gUrl, '_blank', 'noopener')
}
