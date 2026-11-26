import { CELEBRATIONS, EVENT, OCCASIONS, VENUES } from '../data/invite'

function readOccasionParam(name) {
  if (typeof window === 'undefined') return ''
  return (new URLSearchParams(window.location.search).get(name) || '').trim().toLowerCase()
}

const wh = readOccasionParam('wh')
const cel = readOccasionParam('cel')

export const OCCASION =
  Object.hasOwn(OCCASIONS, wh) ? wh :
  Object.hasOwn(OCCASIONS, cel) ? cel :
  null

export const OCCASION_EVENT = OCCASION
  ? { ...EVENT, ...OCCASIONS[OCCASION] }
  : EVENT

export const FILTERED_CELEBRATIONS = OCCASION
  ? CELEBRATIONS.filter((item) => item.name.toLowerCase() === OCCASION)
  : CELEBRATIONS

export const FILTERED_VENUES = OCCASION
  ? VENUES.filter((item) => item.occasion.toLowerCase() === OCCASION)
  : VENUES
