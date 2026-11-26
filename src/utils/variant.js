/* Link variant: ?v=bride | groom | family (no ?v= or anything else = family). Read once, the URL does not change. */
import { COUPLE, VARIANTS } from '../data/invite'

const FALLBACK = 'family'

function readVariant() {
  if (typeof window === 'undefined') return FALLBACK
  const v = (new URLSearchParams(window.location.search).get('v') || '').trim().toLowerCase()
  return Object.hasOwn(VARIANTS, v) ? v : FALLBACK
}

export const VARIANT = readVariant()
export const VARIANT_CFG = VARIANTS[VARIANT]

/* names in the order of this variant, with a matching monogram ("H & A") */
const [first, second] =
  VARIANT_CFG.lead === 'bride'
    ? [COUPLE.bride, COUPLE.groom]
    : VARIANT_CFG.lead === 'groom'
      ? [COUPLE.groom, COUPLE.bride]
      : [COUPLE.first, COUPLE.second]

export const NAMES = {
  first,
  second,
  monogram: VARIANT_CFG.lead ? `${first[0]} & ${second[0]}` : COUPLE.monogram,
}
