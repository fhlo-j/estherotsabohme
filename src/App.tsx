import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  BookOpen,
  Calendar,
  MapPin,
  Clock,
  Mail,
  Phone,
  MessageCircle,
  ChevronRight,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from 'lucide-react'
import './App.css'
import { AboutBook } from './components/AboutBook'
import { BookShowcase } from './components/BookShowcase'

gsap.registerPlugin(ScrollTrigger)

const AUTHOR_IMAGE_PRIMARY = '/images/AUTHOR IMAGE1.jpg'

function App() {
  const appRef = useRef<HTMLDivElement>(null)
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [navScrolled, setNavScrolled] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const bookRevealRef = useRef<HTMLDivElement>(null)
  const eventRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  // Countdown timer
  useEffect(() => {
    const eventDate = new Date('2026-04-25T16:00:00').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = eventDate - now

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  // Navigation scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

      {/* Navigation */}
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled
            ? 'bg-[#fbf6ec]/88 backdrop-blur-lg shadow-[0_10px_30px_rgba(11,15,25,0.08)] border-b border-[#c7b487]/30'
            : 'bg-transparent'
        }`}
      >
        <div className="section-padding py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button
              onClick={() => scrollToSection(heroRef)}
              className="font-serif text-2xl tracking-wide font-semibold text-navy hover:text-[#705822] transition-colors"
            >
              God First
            </button>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection(bookRevealRef)}
                className="text-sm font-semibold tracking-wide text-navy/70 hover:text-[#705822] transition-colors"
              >
                About the Book
              </button>
              <button
                onClick={() => scrollToSection(eventRef)}
                className="text-sm font-semibold tracking-wide text-navy/70 hover:text-[#705822] transition-colors"
              >
                Event
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="text-sm font-semibold tracking-wide text-navy/70 hover:text-[#705822] transition-colors"
              >
                Contact
              </button>
            </div>

            <Link
              to="/buy"
              className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 bg-navy text-white text-sm font-semibold rounded-full hover:bg-navy/90 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Buy Now
            </Link>
          </div>
        </div>
      </nav>

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
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-cloud-lg ring-1 ring-[#c5b184]/40">
                  <img
                    src={AUTHOR_IMAGE_PRIMARY}
                    alt="Esther Otsabomhe portrait"
                    className="w-full h-full object-cover object-[center_12%]"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#ab8836]/20 rounded-full blur-2xl" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#244e84]/20 rounded-full blur-2xl" />
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <p className="eyebrow mb-5">The Official Book Launch</p>

              <h1 className="hero-title heading-xl text-navy mb-5">
                <span className="inline-block">God</span>{' '}
                <span className="inline-block">First</span>
              </h1>

              <p className="heading-md text-[#705822] mb-2">
                Determination & Fulfilment
              </p>

              <p className="hero-subtitle text-lg text-gray-600 mb-2">
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

      {/* Event Invitation Section */}
      <section
        ref={eventRef}
        className="relative py-28 lg:py-36 overflow-hidden"
      >
        <div className="event-content section-padding max-w-6xl mx-auto">
          <div className="cloud-card-lg p-8 lg:p-14">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              {/* Left: Image */}
              <div className="w-full lg:w-2/5">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img
                    src={AUTHOR_IMAGE_PRIMARY}
                    alt="Esther Otsabomhe at the book launch"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right: Event Details */}
              <div className="w-full lg:w-3/5 flex flex-col justify-center">
                <p className="eyebrow mb-3">You're Invited</p>
                <h2 className="heading-lg text-navy mb-2">
                  to the official book launch of
                </h2>
                <h3 className="heading-md text-[#705822] mb-8">God First</h3>

                {/* Event Info Cards */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-4 p-4 bg-[#f9f4e8] rounded-xl border border-[#e4d6b5]">
                    <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-navy">
                        Saturday 25th April 2026
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-[#f9f4e8] rounded-xl border border-[#e4d6b5]">
                    <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-navy">4:00 PM Prompt</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-[#f9f4e8] rounded-xl sm:col-span-2 border border-[#e4d6b5]">
                    <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-medium text-navy">
                        Church of Assumption, Falomo, Ikoyi
                      </p>
                    </div>
                  </div>
                </div>

                {/* Countdown */}
                <div className="mb-8">
                  <p className="text-sm text-gray-500 mb-3">Event starts in:</p>
                  <div className="flex gap-3">
                    {[
                      { value: countdown.days, label: 'Days' },
                      { value: countdown.hours, label: 'Hours' },
                      { value: countdown.minutes, label: 'Mins' },
                      { value: countdown.seconds, label: 'Secs' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center"
                      >
                        <div className="w-16 h-16 bg-navy rounded-xl flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {String(item.value).padStart(2, '0')}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn-primary w-full sm:w-auto gap-2">
                  <Mail className="w-5 h-5" />
                  RSVP Now
                </button>
              </div>
            </div>
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
        <div className="contact-content section-padding max-w-5xl mx-auto">
          <div className="cloud-card-lg p-8 lg:p-14">
            <div className="text-center mb-10">
              <p className="eyebrow mb-4">Get in Touch</p>
              <h2 className="heading-lg text-navy mb-4">
                Connect With Our Team
              </h2>
              <p className="body-text text-gray-500 max-w-xl mx-auto">
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
                      href="mailto:info@godfirstbook.com"
                      className="font-medium text-navy hover:text-[#705822] transition-colors"
                    >
                      info@godfirstbook.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#f9f4e8] rounded-xl border border-[#e4d6b5]">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <a
                      href="https://wa.me/234"
                      className="font-medium text-navy hover:text-green-500 transition-colors"
                    >
                      +234 XXX XXX XXXX
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#f9f4e8] rounded-xl border border-[#e4d6b5]">
                  <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a
                      href="tel:+234"
                      className="font-medium text-navy hover:text-sky-500 transition-colors"
                    >
                      +234 XXX XXX XXXX
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="w-full lg:w-3/5">
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all resize-none"
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
          {/* Newsletter */}
          <div className="text-center mb-16">
            <h3 className="heading-md text-navy mb-4">Stay Inspired</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Subscribe to receive updates about the book, events, and
              inspirational content.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
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
          <div className="w-full h-px bg-gray-100 mb-10" />

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
                className="text-sm text-gray-600 hover:text-[#705822] transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection(bookRevealRef)}
                className="text-sm text-gray-600 hover:text-[#705822] transition-colors"
              >
                About the Book
              </button>
              <button
                onClick={() => scrollToSection(eventRef)}
                className="text-sm text-gray-600 hover:text-[#705822] transition-colors"
              >
                Event
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="text-sm text-gray-600 hover:text-[#705822] transition-colors"
              >
                Contact
              </button>
            </nav>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-[#f4ecdb] rounded-full flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#f4ecdb] rounded-full flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#f4ecdb] rounded-full flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#f4ecdb] rounded-full flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-10">
            <p className="text-sm text-gray-400">
              © 2026 God First. All rights reserved. |{' '}
              <a
                href="#"
                className="hover:text-[#705822] transition-colors"
              >
                Privacy Policy
              </a>
            </p>
            <p className="text-xs text-gray-300 mt-2">
              Esther Mike Otsabomhe Foundation
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
