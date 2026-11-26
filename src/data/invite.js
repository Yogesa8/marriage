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
  bridePhone: '+91 95746 99359',
  /* shown under the names on the intro and used as the calendar location */
  place: 'Shipra Lawn, Gorakhpur',
  /* what Google Maps searches for: the map and "Get directions" */
  map: 'Shipra Lawn, Gorakhpur',
  /* background music: put the file in public/assets/media/ (empty string = no music) */
  music: 'assets/media/music.mp3',
  namesAt: 2.2,
}

export const COUPLE = {
  /* default order (no ?v= in the link) */
  first: 'Aditi',
  second: 'Harsh',
  /* who is who: used by the ?v=bride / ?v=groom variants to put that name first */
  bride: 'Aditi',
  groom: 'Harsh',
  monogram: 'A & H',
  dateDots: '02 02 2027',
  dateLong: 'Tuesday, 2 February 2027',
  dateNote: 'welcome at 7 PM, dinner around 9 PM',
  dateShort: '2 February 2027',
  timeShort: '7 PM',
  venue: 'Shipra Lawn, Gorakhpur',
  address: 'Shipra Lawn, Gorakhpur',
}

/*
 * Link variants: the same page, picked with ?v= in the URL (combine with ?g= for the guest name)
 *   ?v=bride   → bride's side: her name first, text from her family
 *   ?v=groom   → groom's side: his name first, text from his family
 *   ?v=family  → no "moments" photo section (the one with the couple's photos)
 *   (no ?v= or an unknown value) → same as family (FALLBACK in utils/variant.js)
 * lead: whose name comes first (null = the order of COUPLE.first / COUPLE.second)
 * photos: show the scroll-based photo section
 * introFor: line above the names, shown when the link has no ?g= name
 * letter: the text on the letter
 */
export const VARIANTS = {
  bride: {
    lead: 'bride',
    photos: true,
    introFor: 'With the blessings of our family',
    letter: `With the blessings of our family, we would love to have you with us as ${COUPLE.bride} and ${COUPLE.groom} begin their forever.`,
  },
  groom: {
    lead: 'groom',
    photos: true,
    introFor: 'With the blessings of our family',
    letter: `With the blessings of our family, we would love to have you with us as ${COUPLE.groom} and ${COUPLE.bride} begin their forever.`,
  },
  family: {
    lead: null,
    photos: false,
    introFor: 'With the blessings of our families',
    letter: 'Two families, one celebration. We would love to have you with us as we begin our forever.',
  },
}

/* 4 · Celebrations: bride-side default (engagement on the left, wedding on the right) */
export const CELEBRATIONS = [
  {
    occasionKey: 'engagement',
    name: 'Engagement',
    weekday: 'Friday',
    date: '29 · 01 · 2027',
    items: [{ title: 'Ring ceremony', time: '4 PM onwards', text: 'Two rings, one promise' }],
  },
  {
    occasionKey: 'wedding',
    name: 'Wedding',
    weekday: 'Tuesday',
    date: '02 · 02 · 2027',
    items: [
      { title: 'Welcome', time: '7 PM', text: 'Warm hugs and blessings' },
      { title: 'Dinner', time: 'Around 9 PM', text: 'Good food, music and dancing' },
    ],
  },
]

/* Extended wedding functions shown on / (family) and /?v=groom */
export const GROOM_CELEBRATIONS = [
  {
    occasionKey: 'engagement',
    name: 'Engagement & Tilak',
    weekday: 'Friday',
    date: '29 · 01 · 2027',
    items: [
      {
        title: 'Ring Ceremony & Shubh Tilak',
        time: '4 PM onwards',
        text: 'Hotel Bobina, Nepal Road, Jatashankar, Gorakhpur',
      },
    ],
  },
  {
    occasionKey: 'haldi',
    name: 'Shubh Haldi',
    weekday: 'Sunday',
    date: '31 · 01 · 2027',
    items: [
      {
        title: 'Haldi Ceremony',
        time: 'At our residence',
        text: 'Humayunpur North, near Gangesh Hotel & Saraswati Vidya Mandir School, Gorakhpur',
      },
    ],
  },
  {
    occasionKey: 'wedding',
    name: 'Wedding & Preetibhoj',
    weekday: 'Tuesday',
    date: '02 · 02 · 2027',
    items: [
      {
        title: 'Baraat Departure',
        time: '6 PM',
        text: 'Departs from our residence (Humayunpur North) by private conveyance for Shipra Lawn',
      },
      {
        title: 'Welcome',
        time: '7 PM',
        text: 'Warm hugs and blessings at Shipra Lawn, Nepal Road, Gorakhpur',
      },
      {
        title: 'Preetibhoj (Dinner)',
        time: 'Around 9 PM',
        text: 'Good food, music and dancing',
      },
    ],
  },
  {
    occasionKey: 'vidai',
    name: 'Milan & Vidai',
    weekday: 'Wednesday',
    date: '03 · 02 · 2027',
    items: [
      {
        title: 'Blessings & Farewell',
        time: '',
        text: 'A warm send-off and new beginnings',
      },
    ],
  },
]

export const GROOM_CELEBRATION_NOTE = {
  title: 'Baraat Departure',
  text: 'The Baraat will depart at 6:00 PM from our residence at Humayunpur North (near Gangesh Hotel & Saraswati Vidya Mandir School), Gorakhpur by private conveyance for "Shipra Lawn", Nepal Road, Gorakhpur.',
}

export const OCCASIONS = {
  engagement: {
    start: '2027-01-29T16:00:00',
    end: '2027-01-29T22:00:00',
    title: 'Aditi & Harsh · Engagement · 29 January 2027',
    place: 'Hotel Bobina, Gorakhpur',
    map: 'Hotel Bobina, Nepal Road, Jatashankar, Gorakhpur',
    dateDots: '29 01 2027',
    dateLong: 'Friday, 29 January 2027',
    dateNote: 'ring ceremony at 4 PM onwards',
    dateShort: '29 January 2027',
    timeShort: '4 PM',
  },
  wedding: {
    start: '2027-02-02T16:00:00',
    end: '2027-02-02T22:00:00',
    title: 'Aditi & Harsh · Wedding · 2 February 2027',
    place: 'Shipra Lawn, Gorakhpur',
    map: 'Shipra Lawn, Nepal Road, Gorakhpur',
    dateDots: '02 02 2027',
    dateLong: 'Tuesday, 2 February 2027',
    dateNote: 'welcome at 7 PM, dinner around 9 PM',
    dateShort: '2 February 2027',
    timeShort: '7 PM',
  },
}

export const GROOM_EVENT_OVERRIDES = {
  default: {
    dateNote: 'Baraat at 6 PM, welcome at 7 PM, dinner around 9 PM',
  },
  engagement: {
    title: 'Aditi & Harsh · Engagement & Tilak · 29 January 2027',
    place: 'Hotel Bobina, Nepal Road, Jatashankar, Gorakhpur',
    dateNote: 'ring ceremony & Shubh Tilak from 4 PM onwards',
  },
  wedding: {
    place: 'Shipra Lawn, Nepal Road, Gorakhpur',
    dateNote: 'Baraat at 6 PM, welcome at 7 PM, dinner around 9 PM',
  },
}

export const VENUES = [
  {
    occasionKey: 'engagement',
    occasion: 'Engagement',
    name: 'Hotel Bobina, Gorakhpur',
    address: 'Hotel Bobina, Gorakhpur',
    image: 'assets/media/hotel-bobina.jpeg',
  },
  {
    occasionKey: 'wedding',
    occasion: 'Wedding',
    name: COUPLE.venue,
    address: COUPLE.address,
    image: 'assets/media/shipra.jpg',
  },
]

export const GROOM_VENUES = [
  {
    occasionKey: 'engagement',
    occasion: 'Engagement & Tilak',
    name: 'Hotel Bobina',
    detail: 'Nepal Road, Jatashankar, Gorakhpur',
    address: 'Hotel Bobina, Nepal Road, Jatashankar, Gorakhpur',
    image: 'assets/media/hotel-bobina.jpeg',
  },
  {
    occasionKey: 'wedding',
    occasion: 'Wedding & Preetibhoj',
    name: 'Shipra Lawn',
    detail: 'Nepal Road, Gorakhpur',
    address: 'Shipra Lawn, Nepal Road, Gorakhpur',
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
