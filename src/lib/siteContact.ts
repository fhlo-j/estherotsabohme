/** Official contact & payment details — single source for the site */

export const SITE_PHONE_DISPLAY = '0803 051 9619'

/** E.164 for tel: links */
export const SITE_PHONE_TEL = '+2348030519619'

/** wa.me suffix (country code + NSN without leading 0) */
export const SITE_WHATSAPP_PATH = '2348030519619'

export const SITE_BANK_ACCOUNT_NUMBER_DISPLAY = '00 500 21407'
/** Digits-only for programmatic copy */
export const SITE_BANK_ACCOUNT_NUMBER_RAW = '0050021407'

export const SITE_BANK_NAME = 'Access Bank'
export const SITE_BANK_ACCOUNT_NAME = 'Esther Otsabomhe'

export const SITE_EMAIL_DISPLAY = 'info@godfirstbook.com'

export function telHref(): string {
  return `tel:${SITE_PHONE_TEL}`
}

export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${SITE_WHATSAPP_PATH}`
  if (!message?.trim()) return base
  return `${base}?text=${encodeURIComponent(message)}`
}
