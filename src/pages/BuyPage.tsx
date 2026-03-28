import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { PaymentSection } from '../components/PaymentSection'
import { BookPickupLocations } from '../components/BookPickupLocations'

export function BuyPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  // Animate hero on mount
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
    <div className="relative min-h-screen bg-sky-50">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/sky-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/30 via-transparent to-sky-50/80" />

        {/* Floating Clouds */}
        <div className="floating-cloud-1 absolute top-20 left-10 w-32 h-20 bg-white/40 rounded-full blur-sm" />
        <div className="floating-cloud-2 absolute top-40 right-20 w-40 h-24 bg-white/30 rounded-full blur-sm" />

        {/* Hero Content */}
        <div className="buy-hero-content relative z-10 section-padding w-full max-w-6xl mx-auto text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-8 transition-colors"
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

          {/* Quick Info */}
          <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
            <div className="cloud-card p-6">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-sky-600" />
              </div>
              <p className="font-semibold text-navy mb-1">E-Book</p>
              <p className="text-xs text-gray-500">Instant digital delivery</p>
            </div>

            <div className="cloud-card p-6">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-sky-600" />
              </div>
              <p className="font-semibold text-navy mb-1">Hard Copy</p>
              <p className="text-xs text-gray-500">Physical delivery</p>
            </div>

            <div className="cloud-card p-6">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-sky-600" />
              </div>
              <p className="font-semibold text-navy mb-1">Or Pickup</p>
              <p className="text-xs text-gray-500">From bookshops</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <PaymentSection />

      {/* Pickup Locations */}
      <BookPickupLocations />

      {/* Footer CTA */}
      <div className="relative py-12 overflow-hidden bg-white">
        <div className="section-padding max-w-4xl mx-auto text-center">
          <h2 className="heading-md text-navy mb-4">
            Questions about your order?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team is here to help. Reach out to us via email or phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@godfirstbook.com"
              className="btn-primary gap-2"
            >
              Send Email
            </a>
            <a
              href="tel:+234"
              className="btn-outline gap-2"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>

      {/* Back to Home Footer */}
      <footer className="relative py-8 bg-navy/5 border-t border-gray-200">
        <div className="section-padding max-w-4xl mx-auto text-center">
          <Link
            to="/"
            className="text-sm text-navy hover:text-sky-600 transition-colors"
          >
            ← Return to home page
          </Link>
        </div>
      </footer>
    </div>
  )
}
