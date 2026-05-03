import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  BookOpen,
  Mail,
  Phone,
  MessageCircle,
  ChevronRight,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Landmark,
} from 'lucide-react'
import './App.css'
import { AboutBook } from './components/AboutBook'
import { BookShowcase } from './components/BookShowcase'
import { SiteNav } from './components/SiteNav'
import {
  SITE_BANK_ACCOUNT_NAME,
  SITE_BANK_ACCOUNT_NUMBER_DISPLAY,
  SITE_BANK_NAME,
  SITE_EMAIL_DISPLAY,
  SITE_PHONE_DISPLAY,
  telHref,
  whatsappHref,
} from '@/lib/siteContact'

gsap.registerPlugin(ScrollTrigger)

const AUTHOR_IMAGE_PRIMARY = '/images/AUTHOR IMAGE1.jpg'

function App() {
  const appRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const bookRevealRef = useRef<HTMLDivElement>(null)
  const eventRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroEl = heroRef.current
      if (heroEl) {
        const heroContent = heroEl.querySelector('.hero-content')
        const heroTitleSpans = heroEl.querySelectorAll('.hero-title span')
        const heroSubtitle = heroEl.querySelector('.hero-subtitle')
        const heroButtons = heroEl.querySelector('.hero-buttons')

        if (heroContent) {
          gsap.fromTo(
            heroContent,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: 'power2.out',
              delay: 0.2,
              immediateRender: false,
            },
          )
        }

        if (heroTitleSpans.length > 0) {
          gsap.fromTo(
            heroTitleSpans,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: 'power2.out',
              delay: 0.35,
              immediateRender: false,
            },
          )
        }

        if (heroSubtitle) {
          gsap.fromTo(
            heroSubtitle,
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              delay: 0.65,
              immediateRender: false,
            },
          )
        }

        if (heroButtons) {
          gsap.fromTo(
            heroButtons,
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              delay: 0.8,
              immediateRender: false,
            },
          )
        }

        gsap.to(heroEl.querySelectorAll('.floating-cloud-1'), {
          y: -16,
          rotation: 2,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          force3D: true,
        })

        gsap.to(heroEl.querySelectorAll('.floating-cloud-2'), {
          y: -12,
          rotation: -1.5,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          force3D: true,
        })
      }

      const sections = [
        { ref: eventRef, selector: '.event-content' },
        { ref: contactRef, selector: '.contact-content' },
      ]

      sections.forEach(({ ref, selector }) => {
        const sectionEl = ref.current
        const target = sectionEl?.querySelector(selector)
        if (!sectionEl || !target) {
          return
        }

        gsap.fromTo(
          target,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 82%',
              once: true,
            },
          },
        )
      })
    }, appRef)

    return () => ctx.revert()
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      ref={appRef}
      className="premium-page relative min-h-screen bg-sky-50"
    >
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* SVG Cloud Clip Path */}
      <svg
        width="0"
        height="0"
        className="absolute"
      >
        <defs>
          <clipPath
            id="cloud-clip"
            clipPathUnits="objectBoundingBox"
          >
            <path d="M0.5,0.05 C0.75,0.05 0.9,0.15 0.95,0.3 C1,0.45 0.95,0.6 0.85,0.7 C0.9,0.8 0.85,0.92 0.7,0.95 C0.55,0.98 0.45,0.95 0.3,0.9 C0.15,0.95 0.05,0.85 0.02,0.7 C-0.01,0.55 0.05,0.4 0.15,0.3 C0.1,0.15 0.25,0.05 0.5,0.05 Z" />
          </clipPath>
        </defs>
      </svg>

      <SiteNav
        variant="home"
        onLogoClick={() => scrollToSection(heroRef)}
        onAboutBook={() => scrollToSection(bookRevealRef)}
        onEvent={() => scrollToSection(eventRef)}
        onContact={() => scrollToSection(contactRef)}
      />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Sky */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/sky-bg.jpg)' }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fcf5e6]/45 via-[#f8f1de]/5 to-[#f7f3ea]/90" />

        {/* Floating Clouds */}
        <div className="floating-cloud-1 absolute top-20 left-10 w-32 h-20 bg-white/50 rounded-full blur-sm" />
        <div className="floating-cloud-2 absolute top-40 right-20 w-40 h-24 bg-white/35 rounded-full blur-sm" />
        <div
          className="floating-cloud-1 absolute bottom-40 left-1/4 w-24 h-16 bg-white/40 rounded-full blur-sm"
          style={{ animationDelay: '2s' }}
        />

        {/* Hero Content */}
        <div className="hero-content relative z-10 section-padding w-full max-w-7xl mx-auto pt-28 pb-16 lg:pb-8">
          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
            {/* Left: Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="rounded-[2rem] overflow-hidden shadow-cloud-lg ring-1 ring-[#c5b184]/40">
                  <img
                    src={AUTHOR_IMAGE_PRIMARY}
                    alt="Esther Otsabomhe portrait"
                    className="w-full h-auto object-contain"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#ab8836]/20 rounded-full blur-2xl" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#244e84]/20 rounded-full blur-2xl" />
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <p className="eyebrow mb-5 text-[#6d5d39]">The Official Book Launch</p>

              <h1 className="hero-title heading-xl text-navy mb-5">
                <span className="inline-block">God</span>{' '}
                <span className="inline-block">First</span>
              </h1>

              <p className="heading-md text-[#8b6f47] mb-2">
                Determination & Fulfilment
              </p>

              <p className="hero-subtitle text-lg text-gray-700 mb-2">
                by{' '}
                <span className="font-medium text-navy">Esther Otsabomhe</span>
              </p>

              <p className="body-text text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0">
                A book about determination, faith & fulfilment. Discover the
                path to purposeful living when we place God First.
              </p>

              <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/buy"
                  className="btn-primary gap-2 inline-flex items-center"
                >
                  <BookOpen className="w-5 h-5" />
                  Buy the Book
                </Link>
                <button
                  onClick={() => scrollToSection(bookRevealRef)}
                  className="btn-outline gap-2"
                >
                  <ChevronRight className="w-5 h-5" />
                  About the Book
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-navy/50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-navy/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-navy/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Book Showcase Section - using new component */}
      <BookShowcase
        onSectionRef={(ref) => (bookRevealRef.current = ref.current)}
      />

      {/* Invitation Section */}
      <section
        ref={eventRef}
        className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-b from-[#071a3d] via-[#0b2452] to-[#0e3068] ring-1 ring-[#d4af37]/28 shadow-[inset_0_1px_0_rgba(212,175,55,0.12)]"
      >
        <div className="section-padding max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow text-gold-300 mb-4">You're Invited</p>
            <h2 className="heading-lg text-white mb-4">Triple Celebration</h2>
          </div>

          <div className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.4)] border border-[#d4af37]/40">
            <img
              src="/images/invitation.jpg"
              alt="Triple Celebration Invitation - Chief Mike & Barr. Esther Otsabomhe"
              className="w-full h-auto block max-h-[90vh]"
            />
          </div>

          <div className="mt-12 text-center">
            <p className="text-[#e5d9b1] text-sm leading-relaxed max-w-2xl mx-auto">
              <span className="font-semibold text-white block mb-2">
                Event Details:
              </span>
              Sunday 3rd May 2026 at 2:00 PM Prompt
              <br />
              The Monarch Event Center, 138 Lekki - Epe Expressway, Lekki
              Peninsula II, Lagos
              <br />
              <span className="font-semibold text-gold-300 block mt-4">
                RSVP: Mr Kunle Abiola - 08090564149
              </span>
              <span className="inline-block mt-5 text-[#c8daf5]">
                Book orders & transfers:{' '}
                <a
                  href={telHref()}
                  className="font-semibold text-gold-100 hover:text-white underline underline-offset-2"
                >
                  {SITE_PHONE_DISPLAY}
                </a>{' '}
                ·{' '}
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-200 hover:text-emerald-100 underline underline-offset-2"
                >
                  WhatsApp
                </a>{' '}
                · {SITE_BANK_NAME}{' '}
                <span className="font-mono text-gold-200/95">
                  {SITE_BANK_ACCOUNT_NUMBER_DISPLAY}
                </span>
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* About the Book Section - using new component */}
      <AboutBook />

      {/* Contact Section */}
      <section
        ref={contactRef}
        className="relative py-28 lg:py-36 overflow-hidden"
      >
        <div className="contact-content section-padding max-w-5xl mx-auto animate-fade-rise motion-reduce:animate-none motion-reduce:opacity-100">
          <div className="cloud-card-lg p-8 lg:p-14 transition-shadow duration-500 hover:shadow-[0_32px_80px_rgba(7,26,61,0.18)]">
            <div className="text-center mb-10">
              <p className="eyebrow mb-4 !text-gold-300/95">Get in Touch</p>
              <h2 className="heading-lg text-white mb-4">
                Connect With Our Team
              </h2>
              <p className="body-text text-white/80 max-w-xl mx-auto">
                Have questions about the book, event, or partnership
                opportunities? We'd love to hear from you.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
              {/* Contact Info */}
              <div className="w-full lg:w-2/5 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-[#f9f4e8] rounded-xl border border-[#e4d6b5]">
                  <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href={`mailto:${SITE_EMAIL_DISPLAY}`}
                      className="font-medium text-navy hover:text-[#8b6f47] transition-colors"
                    >
                      {SITE_EMAIL_DISPLAY}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#f9f4e8] rounded-xl border border-[#e4d6b5]">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-[#d4af37]/25">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <a
                      href={whatsappHref()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-navy hover:text-green-700 transition-colors"
                    >
                      {SITE_PHONE_DISPLAY}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#f9f4e8] rounded-xl border border-[#e4d6b5]">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#071b3d] to-sky-700 rounded-full flex items-center justify-center shadow-md ring-2 ring-[#d4af37]/25">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a
                      href={telHref()}
                      className="font-medium text-navy hover:text-sky-600 transition-colors"
                    >
                      {SITE_PHONE_DISPLAY}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#f9f4e8] rounded-xl border border-[#e4d6b5]">
                  <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-[#b8952e] to-[#d4af37] rounded-full flex items-center justify-center shadow-md ring-2 ring-[#071b3d]/15">
                    <Landmark className="w-6 h-6 text-[#082040]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">Bank payment</p>
                    <p className="font-semibold text-navy">{SITE_BANK_NAME}</p>
                    <p className="text-sm font-mono font-medium text-navy mt-1">
                      Acc. name: {SITE_BANK_ACCOUNT_NAME}
                    </p>
                    <p className="text-sm font-mono font-semibold text-navy tracking-wide mt-1">
                      {SITE_BANK_ACCOUNT_NUMBER_DISPLAY}
                    </p>
                    <Link
                      to="/buy"
                      className="text-xs font-semibold text-sky-600 hover:text-sky-800 mt-2 inline-flex items-center gap-1"
                    >
                      Order & receipt → Buy page
                    </Link>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="w-full lg:w-3/5">
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gold-100/95 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-navy placeholder:text-gray-400 focus:border-[#8b6f47] focus:ring-2 focus:ring-[#8b6f47]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gold-100/95 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-navy placeholder:text-gray-400 focus:border-[#8b6f47] focus:ring-2 focus:ring-[#8b6f47]/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gold-100/95 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-navy placeholder:text-gray-400 focus:border-[#8b6f47] focus:ring-2 focus:ring-[#8b6f47]/20 outline-none transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter + Footer */}
      <footer
        ref={footerRef}
        className="relative py-18 lg:py-24 overflow-hidden bg-[#fffaf0] border-t border-[#dac89f]/40"
      >
        <div className="section-padding max-w-6xl mx-auto">
          <div className="max-w-xl mx-auto mb-14 rounded-cloud border border-[#e4cf98]/55 bg-gradient-to-br from-[#fffdf9] via-white to-[#f2f8ff]/90 px-7 py-8 text-center shadow-cloud">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#976f2f] mb-3">
              Official payment & enquiries
            </p>
            <p className="text-[#082040] text-sm sm:text-base">
              <a
                href={telHref()}
                className="font-bold hover:text-sky-600 transition-colors"
              >
                {SITE_PHONE_DISPLAY}
              </a>
              <span className="mx-2 text-[#cbb98f]">·</span>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-800 hover:underline"
              >
                WhatsApp
              </a>
            </p>
            <div className="mt-5 pt-5 border-t border-[#efd9a9]/60 text-sm text-gray-700">
              <p className="font-bold text-navy">{SITE_BANK_NAME}</p>
              <p className="mt-1 font-medium">{SITE_BANK_ACCOUNT_NAME}</p>
              <p className="font-mono font-bold tracking-wide mt-2 text-[#082040]">
                {SITE_BANK_ACCOUNT_NUMBER_DISPLAY}
              </p>
              <p className="mt-3 text-xs text-gray-600">
                Email:{' '}
                <a
                  href={`mailto:${SITE_EMAIL_DISPLAY}`}
                  className="text-sky-700 font-medium hover:underline"
                >
                  {SITE_EMAIL_DISPLAY}
                </a>
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="text-center mb-16">
            <h3 className="heading-md text-navy mb-4">Stay Inspired</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Subscribe to receive updates about the book, events, and
              inspirational content.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full border border-[#cbb98f]/50 bg-white text-navy placeholder:text-gray-500 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/25 outline-none transition-all shadow-sm"
              />
              <button
                type="submit"
                className="btn-primary gap-2"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gray-200 mb-10" />

          {/* Footer Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <button
              onClick={() => scrollToSection(heroRef)}
              className="font-serif text-2xl font-semibold text-navy"
            >
              God First
            </button>

            {/* Navigation */}
            <nav className="flex flex-wrap justify-center gap-6">
              <button
                onClick={() => scrollToSection(heroRef)}
                className="text-sm text-gray-600 hover:text-[#8b6f47] transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection(bookRevealRef)}
                className="text-sm text-gray-600 hover:text-[#8b6f47] transition-colors"
              >
                About the Book
              </button>
              <button
                onClick={() => scrollToSection(eventRef)}
                className="text-sm text-gray-600 hover:text-[#8b6f47] transition-colors"
              >
                Event
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="text-sm text-gray-600 hover:text-[#8b6f47] transition-colors"
              >
                Contact
              </button>
            </nav>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-10">
            <p className="text-sm text-gray-500">
              © 2026 God First. All rights reserved. |{' '}
              <a
                href="#"
                className="hover:text-[#8b6f47] transition-colors"
              >
                Privacy Policy
              </a>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Esther Mike Otsabomhe Foundation
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
