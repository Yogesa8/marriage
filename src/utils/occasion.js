import {
  CELEBRATIONS,
  EVENT,
  GROOM_CELEBRATIONS,
  GROOM_CELEBRATION_NOTE,
  GROOM_EVENT_OVERRIDES,
  GROOM_VENUES,
  OCCASIONS,
  VENUES,
} from '../data/invite'
import { VARIANT } from './variant'

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

const IS_GROOM_SIDE = VARIANT === 'groom' || (VARIANT === 'family' && !OCCASION)
const IS_BRIDE_CONTACT = VARIANT === 'bride' || (OCCASION === 'wedding' && VARIANT !== 'groom')
const ACTIVE_PHONE = IS_BRIDE_CONTACT ? EVENT.bridePhone : EVENT.phone

const BASE_EVENT = OCCASION
  ? { ...EVENT, ...OCCASIONS[OCCASION], phone: ACTIVE_PHONE }
  : { ...EVENT, phone: ACTIVE_PHONE }

export const OCCASION_EVENT = IS_GROOM_SIDE
  ? { ...BASE_EVENT, ...(GROOM_EVENT_OVERRIDES[OCCASION || 'default'] || {}), phone: ACTIVE_PHONE }
  : BASE_EVENT

const ACTIVE_CELEBRATIONS = IS_GROOM_SIDE ? GROOM_CELEBRATIONS : CELEBRATIONS
const ACTIVE_VENUES = IS_GROOM_SIDE ? GROOM_VENUES : VENUES

export const FILTERED_CELEBRATIONS = OCCASION
  ? ACTIVE_CELEBRATIONS.filter((item) => (item.occasionKey || item.name).toLowerCase() === OCCASION)
  : ACTIVE_CELEBRATIONS

export const CELEBRATION_NOTE = IS_GROOM_SIDE && !OCCASION ? GROOM_CELEBRATION_NOTE : null

export const FILTERED_VENUES = OCCASION
  ? ACTIVE_VENUES.filter((item) => (item.occasionKey || item.occasion).toLowerCase() === OCCASION)
  : ACTIVE_VENUES
