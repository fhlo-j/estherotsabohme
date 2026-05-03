import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { PaymentSection } from '../components/PaymentSection'
import { BookPickupLocations } from '../components/BookPickupLocations'
import { SiteNav } from '../components/SiteNav'
import {
  SITE_BANK_ACCOUNT_NAME,
  SITE_BANK_ACCOUNT_NUMBER_DISPLAY,
  SITE_BANK_NAME,
  SITE_EMAIL_DISPLAY,
  SITE_PHONE_DISPLAY,
  telHref,
  whatsappHref,
} from '@/lib/siteContact'

export function BuyPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.buy-hero-content',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 },
      )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-[#f5f9ff] to-[#eef4fc]">
      <SiteNav variant="buy" />

      <div className="noise-overlay" />

      <section
        ref={heroRef}
        className="relative min-h-[56vh] flex items-center justify-center overflow-hidden pt-[5.5rem] pb-12"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/sky-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/85 via-transparent to-sky-50/92" />

        <div className="floating-cloud-1 absolute top-28 left-8 w-32 h-20 bg-white/35 rounded-full blur-sm animate-float-slow" />
        <div className="floating-cloud-2 absolute top-44 right-10 w-40 h-24 bg-white/28 rounded-full blur-sm animate-float" />

        <div className="buy-hero-content relative z-10 section-padding w-full max-w-6xl mx-auto text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#071b3d] hover:text-sky-600 mb-8 transition-colors font-semibold underline-offset-4 hover:underline decoration-[#d4af37]/60"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="heading-xl text-navy mb-4">Get God First</h1>
          <p className="heading-md text-sky-600 mb-2">
            Determination & Fulfilment
          </p>
          <p className="body-text text-gray-600 max-w-2xl mx-auto mb-4">
            Secure your copy today. Choose between E-Book or Hard Copy for
            instant or physical delivery.
          </p>

          <div className="max-w-xl mx-auto mt-10 mb-2 rounded-cloud border border-[#e4cf98]/60 bg-[#fdfbf9]/95 px-5 py-5 text-center text-sm text-[#082040] shadow-cloud">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#976f2f] mb-2">
              Payments & enquiries
            </p>
            <p>
              Phone / WhatsApp:{' '}
              <a
                href={telHref()}
                className="font-semibold hover:text-sky-600 transition-colors"
              >
                {SITE_PHONE_DISPLAY}
              </a>
              {' · '}
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-700 hover:underline"
              >
                WhatsApp
              </a>
            </p>
            <p className="mt-3 pt-3 border-t border-[#efd9a9]/55">
              <span className="font-semibold">{SITE_BANK_NAME}</span>{' · '}
              <span>{SITE_BANK_ACCOUNT_NAME}</span>
              <span className="block font-mono font-bold tracking-wide mt-1.5 text-navy">
                {SITE_BANK_ACCOUNT_NUMBER_DISPLAY}
              </span>
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-10">
            <div className="cloud-card p-6 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none">
              <div className="w-12 h-12 bg-sky-400/25 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-sky-300" />
              </div>
              <p className="font-semibold text-white mb-1">E-Book</p>
              <p className="text-xs text-[#aec4df]">Instant digital delivery</p>
            </div>

            <div className="cloud-card p-6 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none">
              <div className="w-12 h-12 bg-sky-400/25 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-sky-300" />
              </div>
              <p className="font-semibold text-white mb-1">Hard Copy</p>
              <p className="text-xs text-[#aec4df]">Physical delivery</p>
            </div>

            <div className="cloud-card p-6 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none">
              <div className="w-12 h-12 bg-sky-400/25 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-sky-300" />
              </div>
              <p className="font-semibold text-white mb-1">Or Pickup</p>
              <p className="text-xs text-[#aec4df]">From bookshops</p>
            </div>
          </div>
        </div>
      </section>

      <PaymentSection />

      <BookPickupLocations />

      <div className="relative py-14 overflow-hidden bg-white border-y border-[#e4cf98]/35">
        <div className="section-padding max-w-4xl mx-auto text-center">
          <h2 className="heading-md text-navy mb-4">Questions about your order?</h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Email us, call <strong>{SITE_PHONE_DISPLAY}</strong>, or WhatsApp —
            quote your preferred format (E-book or Hardcopy).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <a
              href={`mailto:${SITE_EMAIL_DISPLAY}`}
              className="btn-primary gap-2"
            >
              Send Email
            </a>
            <a
              href={telHref()}
              className="btn-outline gap-2"
            >
              Call {SITE_PHONE_DISPLAY}
            </a>
          </div>
          <div className="rounded-2xl border border-sky-200/80 bg-sky-50/80 px-6 py-5 text-sm text-[#082040] max-w-lg mx-auto">
            <p className="font-semibold text-navy mb-2">Transfer payments</p>
            <p>
              {SITE_BANK_NAME}: <strong>{SITE_BANK_ACCOUNT_NAME}</strong>
            </p>
            <p className="font-mono font-bold tracking-wide mt-2 text-[#082040]">
              {SITE_BANK_ACCOUNT_NUMBER_DISPLAY}
            </p>
          </div>
        </div>
      </div>

      <footer className="relative py-8 bg-navy/[0.04] border-t border-[#cfd9ea]">
        <div className="section-padding max-w-4xl mx-auto text-center">
          <Link
            to="/"
            className="text-sm font-medium text-[#071b3d] hover:text-sky-600 transition-colors underline-offset-4 hover:underline decoration-[#d4af37]/65"
          >
            ← Return to home page
          </Link>
        </div>
      </footer>
    </div>
  )
}
