/* Couple's data: a manager only needs to change this file (same role as `EVENT` in the original page) */

export const INVITE_NAMED_OPENING = false

export const EVENT = {
  /* the wedding day: drives the flip calendar, the countdown and "Add to my calendar" */
  start: '2027-02-02T16:00:00',
  end: '2027-02-02T22:00:00',
  /* times above are Indian time: guests abroad get the right countdown and calendar time */
  utcOffset: '+05:30',
  title: 'Aditi & Harsh · 2 February 2027 ',
  phone: '+91 7906838061 / +91 8004369347',
  /* shown under the names on the intro and used as the calendar location */
  place: 'Shipra Lawn, Gorakhpur',
  /* what Google Maps searches for: the map and "Get directions" */
  map: 'Shipra Lawn, Gorakhpur',
  /* background music: put the file in public/assets/media/ (empty string = no music) */
  music: 'assets/media/music.mp3',
  namesAt: 2.2,
}

export const COUPLE = {
  first: 'Aditi',
  second: 'Harsh',
  monogram: 'A & H',
  dateDots: '02 02 2027',
  dateLong: 'Tuesday, 2 February 2027',
  dateNote: 'welcome at 7 PM, dinner around 9 PM',
  dateShort: '2 February 2027',
  timeShort: '7 PM',
  venue: 'Shipra Lawn, Gorakhpur',
  address: 'Shipra Lawn, Gorakhpur',
}

/* 4 · Celebrations: engagement on the left, the wedding on the right */
export const CELEBRATIONS = [
  {
    name: 'Engagement',
    weekday: 'Friday',
    date: '29 · 01 · 2027',
    items: [{ title: 'Ring ceremony', time: '4 PM onwards', text: 'Two rings, one promise' }],
  },
  {
    name: 'Wedding',
    weekday: 'Tuesday',
    date: '02 · 02 · 2027',
    items: [
      { title: 'Welcome', time: '7 PM', text: 'Warm hugs and blessings' },
      { title: 'Dinner', time: 'Around 9 PM', text: 'Good food, music and dancing' },
    ],
  },
]

export const VENUES = [
  {
    occasion: 'Engagement',
    name: 'Hotel Bobina, Gorakhpur',
    address: 'Hotel Bobina, Gorakhpur',
    image: 'assets/media/hotel-bobina.jpeg',
  },
  {
    occasion: 'Wedding',
    name: COUPLE.venue,
    address: COUPLE.address,
    image: 'assets/media/shipra.jpg',
  },
]

/* 5 · Venue: travel tips (hidden in this demo, as in the original) */
export const VENUE_HOW = [
  { title: 'By car', text: 'Valet parking at the main entrance all evening.' },
  { title: 'Stay', text: 'Rooms are held for our guests at the Hartwell Hotel upstairs.' },
]

/* 7 · A few wishes */
export const WISHES = [
  { title: 'Gifts', text: 'Your presence and blessings are the only gifts we wish for.' },
  { title: 'Children', text: 'Little ones are most welcome to join the celebration.' },
  { title: 'Photos', text: 'Photographs are welcome.' },
  { title: 'Contact', text: 'Your host' },
]
